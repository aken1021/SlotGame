import {Action, ClientError, Command, deepFreeze} from './model';

export interface PendingStore {
  load(): Command | null;
  save(command: Command): void;
  clear(): void;
}
export class MemoryPendingStore implements PendingStore {
  private value: Command | null = null;
  load(): Command | null { return this.value; }
  save(value: Command): void { this.value = value; }
  clear(): void { this.value = null; }
}
export interface StringStorage { getItem(key: string): string | null; setItem(key: string, value: string): void; removeItem(key: string): void }
/** Storage key must be scoped by game AND player. No balances are trusted from storage. */
export class PersistentPendingStore implements PendingStore {
  constructor(private readonly storage: StringStorage, private readonly key: string) {}
  load(): Command | null {
    const value = this.storage.getItem(this.key);
    if (value === null) return null;
    try {
      const parsed: unknown = JSON.parse(value);
      if (!parsed || typeof parsed !== 'object') throw new Error('not object');
      const v = parsed as Command;
      const actions: readonly Action[] = ['START_GAME', 'SPIN', 'NEXT_FEVER', 'CHECK_CMD'];
      if (v.schema !== 'gh-client-v1' || !actions.includes(v.action) ||
          typeof v.game_id !== 'string' || !v.game_id || typeof v.player_id !== 'string' || !v.player_id ||
          typeof v.request_id !== 'string' || !v.request_id ||
          !Number.isSafeInteger(v.expected_version) || v.expected_version < 0 ||
          !v.payload || typeof v.payload !== 'object' || Array.isArray(v.payload)) throw new Error('invalid command');
      return deepFreeze(v);
    } catch {
      throw new ClientError('Pending request is corrupt; reconcile with server before clearing it', 'CORRUPT_PENDING');
    }
  }
  save(value: Command): void { this.storage.setItem(this.key, JSON.stringify(value)); }
  clear(): void { this.storage.removeItem(this.key); }
}
