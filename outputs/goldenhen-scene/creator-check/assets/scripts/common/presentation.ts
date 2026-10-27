import {ClientError, Layout, Snapshot, visibleBoard} from './model';
import {delay, isAbort, throwIfAborted} from './timing';

export interface ReelView {
  begin(strips: readonly (readonly number[])[]): void;
  stopReel(index: number, visibleSymbols: readonly number[], signal: AbortSignal): Promise<void>;
  snap(board: readonly (readonly number[])[]): void;
  cancel(): void;
}
export interface AwardView {
  show(snapshot: Snapshot, signal: AbortSignal): Promise<void>;
  finish(snapshot: Snapshot): void;
}
export interface ReelTiming { readonly stopGapMs: number; readonly resultDelayMs: number }
export class ReelController {
  private phase: 'idle' | 'spinning' | 'stopping' = 'idle';
  private stop: AbortController | null = null;
  private disposed = false;
  constructor(private readonly view: ReelView, private readonly timing: ReelTiming = {stopGapMs: 400, resultDelayMs: 250}) {
    if (![timing.stopGapMs, timing.resultDelayMs].every(v => Number.isFinite(v) && v >= 0)) throw new RangeError('Invalid reel timing');
  }
  begin(strips: readonly (readonly number[])[]): void {
    if (this.disposed) throw new ClientError('Reels disposed', 'DISPOSED');
    if (this.phase !== 'idle') throw new ClientError('Reels already active', 'BUSY');
    this.phase = 'spinning';
    try { this.view.begin(strips); } catch (error) { this.phase = 'idle'; throw error; }
  }
  async present(snapshot: Snapshot, fast = false): Promise<void> {
    if (this.phase !== 'spinning') throw new ClientError('Reels not spinning', 'INVALID_STATE');
    this.phase = 'stopping'; const stop = new AbortController(); this.stop = stop;
    const board = visibleBoard(snapshot);
    try {
      if (!fast) await delay(this.timing.resultDelayMs, stop.signal);
      for (let index = 0; index < board.length; index++) {
        throwIfAborted(stop.signal);
        if (!fast && index > 0) await delay(this.timing.stopGapMs, stop.signal);
        await this.view.stopReel(index, board[index]!, stop.signal);
      }
    } catch (error) { if (!isAbort(error) || !stop.signal.aborted) throw error; }
    finally {
      this.stop = null; this.phase = 'idle';
      if (!this.disposed) this.view.snap(board);
    }
  }
  fastStop(): void { this.stop?.abort(); }
  restore(snapshot: Snapshot): void { this.cancel(); this.view.snap(visibleBoard(snapshot)); }
  cancel(): void { this.stop?.abort(); this.view.cancel(); if (!this.stop) this.phase = 'idle'; }
  dispose(): void { this.disposed = true; this.cancel(); }
}
export class AwardController {
  private active: AbortController | null = null;
  private disposed = false;
  constructor(private readonly view: AwardView) {}
  async present(snapshot: Snapshot): Promise<void> {
    if (this.disposed) throw new ClientError('Awards disposed', 'DISPOSED');
    if (this.active) throw new ClientError('Award already active', 'BUSY');
    const active = new AbortController(); this.active = active;
    try { if (snapshot.lastWin > 0) await this.view.show(snapshot, active.signal); }
    catch (error) { if (!isAbort(error) || !active.signal.aborted) throw error; }
    finally { this.active = null; if (!this.disposed) this.view.finish(snapshot); }
  }
  skip(): void { this.active?.abort(); }
  dispose(): void { this.disposed = true; this.active?.abort(); }
}
/** Cosmetic deterministic reel loop; never selects a result or award. */
export class ReelMotion {
  private offset = 0;
  private cursor = 0;
  constructor(readonly strip: readonly number[], readonly cellSize: number, public speed = 900) {
    if (!strip.length || !Number.isFinite(cellSize) || cellSize <= 0 || !Number.isFinite(speed) || speed < 0) throw new RangeError('Invalid reel motion');
  }
  tick(dt: number, visibleRows: number): {offset: number; symbols: readonly number[]} {
    if (!Number.isFinite(dt) || dt < 0 || !Number.isSafeInteger(visibleRows) || visibleRows < 1) throw new RangeError('Invalid frame');
    const advance = this.offset + Math.min(dt, 0.1) * this.speed;
    const crossed = Math.floor(advance / this.cellSize);
    this.cursor = (this.cursor + crossed) % this.strip.length;
    this.offset = advance % this.cellSize;
    return {offset: this.offset, symbols: Array.from({length: visibleRows + 1}, (_, i) => this.strip[(this.cursor + i) % this.strip.length]!)};
  }
}
export function assertLayoutMatches(layout: Layout, reelCount: number, rows: number): void {
  if (layout.reels !== reelCount || layout.rows !== rows) throw new ClientError('View layout differs from server', 'LAYOUT_MISMATCH');
}
