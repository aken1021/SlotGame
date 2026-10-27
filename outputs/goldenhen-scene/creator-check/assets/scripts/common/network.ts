import {Action, ClientError, Command, deepFreeze} from './model';
import {PendingStore} from './storage';
import {delay, throwIfAborted} from './timing';

export interface Transport { send(command: Command, signal: AbortSignal): Promise<unknown> }
export class HttpError extends ClientError {
  constructor(public readonly status: number, message: string, code = 'HTTP_ERROR') { super(message, code); }
  get retryable(): boolean { return this.status === 408 || this.status === 429 || this.status >= 500; }
}
export class FetchTransport implements Transport {
  constructor(private readonly endpoint: string, private readonly fetcher: typeof fetch = globalThis.fetch.bind(globalThis)) {}
  async send(command: Command, signal: AbortSignal): Promise<unknown> {
    const response = await this.fetcher(this.endpoint, {method: 'POST', headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(command), signal});
    if (!response.ok) {
      let message = `Command failed (${response.status})`, code = 'HTTP_ERROR';
      try {
        const body = await response.json() as {error?: {code?: unknown; message?: unknown}};
        if (typeof body.error?.code === 'string') code = body.error.code;
        if (typeof body.error?.message === 'string') message = body.error.message;
      } catch { /* HTTP status still determines whether the outcome is uncertain. */ }
      throw new HttpError(response.status, message, code);
    }
    return response.json() as Promise<unknown>;
  }
}
export interface RequestOptions {
  readonly playerId: string;
  readonly gameId: string;
  readonly timeoutMs?: number;
  readonly maxAttempts?: number;
  readonly retryDelayMs?: number;
  readonly newId?: () => string;
}
export class CommandClient {
  private readonly timeout: number;
  private readonly attempts: number;
  private readonly retryDelay: number;
  private readonly newId: () => string;
  private active: AbortController | null = null;
  private disposed = false;
  constructor(private readonly transport: Transport, private readonly store: PendingStore, private readonly options: RequestOptions) {
    this.timeout = options.timeoutMs ?? 10000;
    this.attempts = options.maxAttempts ?? 2;
    this.retryDelay = options.retryDelayMs ?? 250;
    this.newId = options.newId ?? (() => globalThis.crypto.randomUUID());
    if (!options.gameId || !options.playerId || !Number.isInteger(this.attempts) || this.attempts < 1 ||
        !Number.isFinite(this.timeout) || this.timeout <= 0 || !Number.isFinite(this.retryDelay) || this.retryDelay < 0) {
      throw new ClientError('Invalid request options', 'INVALID_OPTIONS');
    }
    this.pending(); // Refuse to silently discard a different player's unfinished command.
  }
  pending(): Command | null {
    const value = this.store.load();
    if (value && (value.game_id !== this.options.gameId || value.player_id !== this.options.playerId)) {
      throw new ClientError('Pending request belongs to a different session', 'PENDING_OWNER_MISMATCH');
    }
    return value;
  }
  async execute(action: Action, payload: Readonly<Record<string, unknown>>, version: number): Promise<{command: Command; response: unknown}> {
    this.assertAvailable();
    if (this.pending()) throw new ClientError('Reconcile pending command first', 'PENDING_REQUEST');
    if (!Number.isSafeInteger(version) || version < 0) throw new ClientError('Invalid version', 'INVALID_VERSION');
    const command: Command = deepFreeze({schema: 'gh-client-v1', game_id: this.options.gameId, player_id: this.options.playerId,
      request_id: this.newId(), action, expected_version: version, payload: JSON.parse(JSON.stringify(payload)) as Record<string, unknown>});
    if (!command.request_id) throw new ClientError('Request ID is empty', 'INVALID_ID');
    // Persist BEFORE any I/O. Failure to persist means nothing is sent.
    this.store.save(command);
    return this.send(command);
  }
  async replay(): Promise<{command: Command; response: unknown}> {
    this.assertAvailable();
    const command = this.pending();
    if (!command) throw new ClientError('No pending request', 'NO_PENDING');
    return this.send(command);
  }
  acknowledge(requestId: string): void {
    if (this.pending()?.request_id !== requestId) throw new ClientError('Wrong acknowledgement', 'INVALID_ACK');
    this.store.clear();
  }
  dispose(): void { this.disposed = true; this.active?.abort(); }
  private assertAvailable(): void {
    if (this.disposed) throw new ClientError('Client disposed', 'DISPOSED');
    if (this.active) throw new ClientError('Request already in flight', 'BUSY');
  }
  private async send(command: Command): Promise<{command: Command; response: unknown}> {
    const lifetime = new AbortController(); this.active = lifetime;
    try {
      for (let attempt = 0; attempt < this.attempts; attempt++) {
        throwIfAborted(lifetime.signal);
        const controller = new AbortController();
        const cancel = () => controller.abort();
        lifetime.signal.addEventListener('abort', cancel, {once: true});
        let timer: ReturnType<typeof setTimeout> | undefined;
        try {
          // Promise race enforces timeout even for custom transports ignoring AbortSignal.
          const timeout = new Promise<never>((_, reject) => {
            timer = setTimeout(() => { reject(new ClientError('Request timed out; outcome is unknown', 'TIMEOUT')); controller.abort(); }, this.timeout);
          });
          const cancelled = new Promise<never>((_, reject) => {
            controller.signal.addEventListener('abort', () => reject(new ClientError('Request cancelled; reconcile on resume', 'CANCELLED')), {once: true});
          });
          const response = await Promise.race([this.transport.send(command, controller.signal), timeout, cancelled]);
          return {command, response};
        } catch (error) {
          if (error instanceof HttpError && !error.retryable) {
            // API contract: definitive 4xx means transaction was not applied.
            this.acknowledge(command.request_id);
            throw error;
          }
          if (attempt + 1 === this.attempts || lifetime.signal.aborted) throw error;
        } finally {
          if (timer !== undefined) clearTimeout(timer);
          lifetime.signal.removeEventListener('abort', cancel);
        }
        await delay(this.retryDelay, lifetime.signal);
      }
      throw new ClientError('No request attempt', 'INVALID_OPTIONS');
    } finally { this.active = null; }
  }
}
