import {ClientError, Snapshot, SpecialState} from './model';

export interface SpecialGame {
  readonly id: number;
  enter(state: SpecialState, snapshot: Snapshot): Promise<void>;
  updateState(state: SpecialState, snapshot: Snapshot): Promise<void>;
  exit(): Promise<void>;
  dispose(): void;
}
/** IDs and feature-specific sg_map semantics belong to the game, not the common layer. */
export class SpecialGameRouter {
  private readonly games = new Map<number, SpecialGame>();
  private active: SpecialGame | null = null;
  private disposed = false;
  register(game: SpecialGame): () => void {
    if (this.disposed) throw new ClientError('Router disposed', 'DISPOSED');
    if (!Number.isSafeInteger(game.id) || game.id < 0 || this.games.has(game.id)) throw new ClientError('Duplicate/invalid special game', 'INVALID_SPECIAL');
    this.games.set(game.id, game);
    return () => {
      if (this.active === game) throw new ClientError('Cannot unregister active special game', 'INVALID_STATE');
      if (this.games.get(game.id) === game) this.games.delete(game.id);
    };
  }
  async sync(snapshot: Snapshot): Promise<void> {
    if (this.disposed) throw new ClientError('Router disposed', 'DISPOSED');
    const next = snapshot.special ? this.games.get(snapshot.special.id) : null;
    if (snapshot.special && !next) throw new ClientError(`No handler for special game ${snapshot.special.id}`, 'UNSUPPORTED_SPECIAL');
    if (next !== this.active) {
      const old = this.active; this.active = null;
      if (old) await old.exit();
      if (this.disposed) throw new ClientError('Router disposed', 'DISPOSED');
      if (next && snapshot.special) { this.active = next; await next.enter(snapshot.special, snapshot); }
    } else if (next && snapshot.special) await next.updateState(snapshot.special, snapshot);
  }
  dispose(): void {
    if (this.disposed) return;
    this.disposed = true;
    for (const game of this.games.values()) { try { game.dispose(); } catch { /* Complete cleanup of remaining panels. */ } }
    this.active = null; this.games.clear();
  }
}
