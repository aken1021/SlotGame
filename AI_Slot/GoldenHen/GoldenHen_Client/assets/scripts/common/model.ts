/** Amounts are server minor units; no client-side payout calculation. */
export type Amount = number;
export type Action = 'START_GAME' | 'SPIN' | 'NEXT_FEVER' | 'CHECK_CMD';
export interface Layout {
  readonly reels: number;
  readonly rows: number;
  readonly bufferTop: number;
  readonly bufferBottom: number;
}
export interface Bet { readonly lineBet: Amount; readonly totalBet: Amount }
export interface Win {
  readonly symbolId: number;
  readonly amount: Amount;
  readonly positions: readonly (readonly boolean[])[];
}
export interface SpecialState {
  readonly id: number;
  readonly stage: 'init' | 'process' | 'recovery';
  readonly remaining: number | null;
  readonly total: number | null;
  /** Revealed entries only; -1 is unrevealed. Never expose hidden outcomes. */
  readonly picks: readonly number[] | null;
  readonly data: Readonly<Record<string, unknown>>;
}
/** Every gh-client-v1 response contains an authoritative full snapshot. */
export interface Snapshot {
  readonly version: number;
  readonly roundId: string | null;
  readonly balance: Amount;
  readonly layout: Layout;
  readonly bets: readonly Bet[];
  readonly selectedLineBet: Amount;
  /** By reel, top-to-bottom, including buffers. */
  readonly board: readonly (readonly number[])[];
  readonly fakeStrips: readonly (readonly number[])[];
  readonly wins: readonly Win[];
  readonly lastWin: Amount;
  readonly totalWin: Amount;
  readonly winType: number;
  readonly special: SpecialState | null;
}
export interface Command {
  readonly schema: 'gh-client-v1';
  readonly game_id: string;
  readonly player_id: string;
  readonly request_id: string;
  readonly action: Action;
  readonly expected_version: number;
  readonly payload: Readonly<Record<string, unknown>>;
}
export type HostState = 'disconnected' | 'connecting' | 'ready' | 'requesting' |
  'stopping' | 'awarding' | 'special' | 'recovering' | 'faulted' | 'disposed';
export class ClientError extends Error {
  constructor(message: string, public readonly code: string) { super(message); this.name = 'ClientError'; }
}
export function amount(value: unknown, label = 'amount'): Amount {
  if (typeof value !== 'number' || !Number.isSafeInteger(value) || value < 0) {
    throw new ClientError(`${label} must be a nonnegative safe integer`, 'INVALID_AMOUNT');
  }
  return value;
}
export function deepFreeze<T>(value: T): T {
  if (value && typeof value === 'object' && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const item of Object.values(value)) deepFreeze(item);
  }
  return value;
}
export function visibleBoard(snapshot: Snapshot): readonly (readonly number[])[] {
  return snapshot.board.map(reel => reel.slice(snapshot.layout.bufferTop, snapshot.layout.bufferTop + snapshot.layout.rows));
}
