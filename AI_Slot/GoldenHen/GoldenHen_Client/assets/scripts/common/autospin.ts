import {ClientError} from './model';
import {SlotClient} from './host';
import {throwIfAborted} from './timing';

/** Never automatically retries an uncertain spin or advances an unknown special game. */
export class AutoSpinController {
  private active = false;
  private stopped = false;
  constructor(private readonly client: SlotClient) {}
  stop(): void { this.stopped = true; }
  async run(count: number, signal?: AbortSignal): Promise<number> {
    if (this.active) throw new ClientError('Auto spin already active', 'BUSY');
    if (!Number.isSafeInteger(count) || count < 1 || count > 10000) throw new RangeError('Invalid auto spin count');
    const lease = this.client.acquireAutoSpin();
    this.active = true; this.stopped = false; let completed = 0;
    try {
      while (completed < count && !this.stopped) {
        throwIfAborted(signal);
        if (!lease.canSpin()) break;
        await lease.spin(); completed++;
        if (this.client.state !== 'ready') break;
      }
      return completed;
    } finally { this.active = false; lease.release(); }
  }
}
