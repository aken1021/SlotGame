import {Action, ClientError, HostState, Snapshot, Bet, Command} from './model';
import {EventBus} from './events';
import {CommandClient, HttpError} from './network';
import {decodeEnvelope} from './protocol';
import {AwardController, ReelController} from './presentation';
import {SpecialGameRouter} from './special';
import {validateBet} from './money';

export interface InputState { readonly canSpin: boolean; readonly canChangeBet: boolean; readonly canSpecialAction: boolean }
export interface HostEvents {
  state: HostState;
  input: InputState;
  snapshot: Snapshot;
  settled: Snapshot;
  bet: Bet;
  error: unknown;
}
export class SlotClient {
  readonly events = new EventBus<HostEvents>();
  private currentState: HostState = 'disconnected';
  private current: Snapshot | null = null;
  private lineBet: number | null = null;
  private generation = 0;
  private fast = false;
  private automation: symbol | null = null;
  private quickStopRequested = false;
  constructor(private readonly network: CommandClient, private readonly reels: ReelController,
    private readonly awards: AwardController, private readonly specials = new SpecialGameRouter(),
    private readonly decode: (raw: unknown, requestId: string) => Snapshot = decodeEnvelope) {}
  get state(): HostState { return this.currentState; }
  get snapshot(): Snapshot | null { return this.current; }
  get selectedBet(): Bet | null { return this.current?.bets.find(bet => bet.lineBet === this.lineBet) ?? null; }
  get input(): InputState {
    const bet = this.selectedBet;
    return {canSpin: this.automation === null && this.state === 'ready' && !!bet && !!this.current && bet.totalBet <= this.current.balance,
      canChangeBet: this.automation === null && this.state === 'ready', canSpecialAction: this.automation === null && this.state === 'special'};
  }
  setFastMode(value: boolean): void { this.fast = value; }
  chooseBet(lineBet: number): void {
    if (!this.input.canChangeBet || !this.current) throw new ClientError('Bet controls locked', 'INVALID_STATE');
    // A larger offered bet can be selected even when balance is insufficient; spin remains disabled.
    const bet = this.current.bets.find(item => item.lineBet === lineBet);
    if (!bet) throw new ClientError('Bet not offered', 'INVALID_BET');
    this.lineBet = lineBet; this.events.emit('bet', bet); this.events.emit('input', this.input);
  }
  async connect(): Promise<void> {
    if (!['disconnected', 'faulted', 'ready', 'special'].includes(this.state)) throw new ClientError('Cannot connect now', 'BUSY');
    const generation = ++this.generation;
    const pending = this.network.pending();
    this.setState(pending ? 'recovering' : 'connecting');
    try {
      // Replaying an uncertain debit/selection always keeps its original request ID.
      if (pending) {
        const replay = await this.network.replay();
        this.accept(replay, generation);
      }
      // Replay may be an old cached result. Fetch fresh state before unlocking controls.
      const response = await this.network.execute('START_GAME', {}, this.current?.version ?? 0);
      const snapshot = this.accept(response, generation);
      this.reels.restore(snapshot);
      await this.specials.sync(snapshot);
      this.assertAlive(generation);
      this.ready(snapshot);
    } catch (error) { this.fail(error, generation); throw error; }
  }
  async spin(): Promise<void> {
    if (!this.input.canSpin || !this.current || this.lineBet === null) throw new ClientError('Spin unavailable', 'INVALID_STATE');
    await this.spinInternal();
  }
  acquireAutoSpin(): {canSpin: () => boolean; spin: () => Promise<void>; release: () => void} {
    if (this.automation || !this.input.canSpin) throw new ClientError('Auto spin unavailable', 'INVALID_STATE');
    const owner = Symbol('autospin'); this.automation = owner; this.events.emit('input', this.input);
    const canSpin = () => this.automation === owner && this.state === 'ready' && !!this.selectedBet &&
      !!this.current && this.selectedBet.totalBet <= this.current.balance;
    return {canSpin,
      spin: async () => { if (!canSpin()) throw new ClientError('Auto spin unavailable', 'INVALID_STATE'); await this.spinInternal(); },
      release: () => { if (this.automation === owner) { this.automation = null; this.events.emit('input', this.input); } }};
  }
  private async spinInternal(): Promise<void> {
    if (!this.current || this.lineBet === null) throw new ClientError('Not initialized', 'INVALID_STATE');
    validateBet(this.lineBet, this.current.bets, this.current.balance);
    await this.perform('SPIN', {line_bet: this.lineBet}, true);
  }
  async nextSpecial(data: Readonly<Record<string, unknown>> | null = null): Promise<void> {
    if (!this.input.canSpecialAction || !this.current?.special) throw new ClientError('No active special game', 'INVALID_STATE');
    const special = this.current.special;
    // Counts distinguish a reel-based special from e.g. a pick game. Games can still supply custom presentation.
    await this.perform('NEXT_FEVER', {sg_id: special.id, data}, special.remaining !== null && special.stage !== 'init');
  }
  skip(): void {
    if (this.state === 'requesting') this.quickStopRequested = true;
    if (this.state === 'stopping') this.reels.fastStop();
    if (this.state === 'awarding') this.awards.skip();
  }
  dispose(): void {
    if (this.state === 'disposed') return;
    ++this.generation; this.automation = null; this.network.dispose(); this.reels.dispose(); this.awards.dispose();
    this.specials.dispose(); this.setState('disposed'); this.events.clear();
  }
  private async perform(action: Action, payload: Readonly<Record<string, unknown>>, spinReels: boolean): Promise<void> {
    const generation = this.generation;
    const previous = this.current!;
    this.quickStopRequested = false;
    this.setState('requesting');
    try {
      if (spinReels) this.reels.begin(previous.fakeStrips);
      const result = await this.network.execute(action, payload, previous.version);
      const snapshot = this.accept(result, generation);
      if (spinReels) { this.setState('stopping'); await this.reels.present(snapshot, this.fast || this.quickStopRequested); }
      this.assertAlive(generation);
      this.setState('awarding');
      await this.awards.present(snapshot);
      this.assertAlive(generation);
      await this.specials.sync(snapshot);
      this.assertAlive(generation);
      this.ready(snapshot);
    } catch (error) {
      // Definitive 4xx did not apply. Restore old reels; reconciliation is still required before another action.
      if (error instanceof HttpError && !error.retryable) this.reels.restore(previous);
      this.fail(error, generation); throw error;
    }
  }
  private accept(result: {command: Command; response: unknown}, generation: number): Snapshot {
    this.assertAlive(generation);
    const snapshot = this.decode(result.response, result.command.request_id);
    const mutation = result.command.action === 'SPIN' || result.command.action === 'NEXT_FEVER';
    if (snapshot.version < (this.current?.version ?? 0) ||
        (mutation && snapshot.version <= result.command.expected_version)) throw new ClientError('Stale response', 'STALE_RESPONSE');
    // Store authoritative data first. If acknowledgement fails, fault and replay the SAME request.
    this.current = snapshot; this.lineBet = snapshot.selectedLineBet;
    this.network.acknowledge(result.command.request_id);
    this.events.emit('snapshot', snapshot);
    this.assertAlive(generation);
    return snapshot;
  }
  private ready(snapshot: Snapshot): void {
    this.setState(snapshot.special ? 'special' : 'ready'); this.events.emit('settled', snapshot);
  }
  private setState(state: HostState): void {
    if (this.state === 'disposed' && state !== 'disposed') throw new ClientError('Session disposed', 'DISPOSED');
    this.currentState = state; this.events.emit('state', state); this.events.emit('input', this.input);
  }
  private assertAlive(generation: number): void {
    if (this.state === 'disposed' || generation !== this.generation) throw new ClientError('Session no longer active', 'DISPOSED');
  }
  private fail(error: unknown, generation: number): void {
    if (this.state === 'disposed' || generation !== this.generation) return;
    this.reels.cancel(); this.setState('faulted'); this.events.emit('error', error);
  }
}
