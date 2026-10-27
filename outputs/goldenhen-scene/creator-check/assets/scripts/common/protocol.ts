import {amount, ClientError, deepFreeze, Snapshot, SpecialState, Win} from './model';

function object(value: unknown, label: string): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) fail(label);
  return value as Record<string, unknown>;
}
function fail(label: string): never { throw new ClientError(`Invalid protocol field: ${label}`, 'INVALID_RESPONSE'); }
function integer(value: unknown, label: string, min = 0): number {
  if (typeof value !== 'number' || !Number.isSafeInteger(value) || value < min) fail(label);
  return value;
}
function array(value: unknown, label: string): unknown[] { if (!Array.isArray(value)) fail(label); return value; }
function matrix(value: unknown, columns: number, height: number, label: string): number[][] {
  const reels = array(value, label);
  if (reels.length !== columns) fail(label);
  return reels.map((item, i) => {
    const cells = array(item, `${label}[${i}]`);
    if (cells.length !== height) fail(label);
    return cells.map(cell => integer(cell, label));
  });
}
/** Strict gh-client-v1 codec. Legacy numeric sg_map requires a separate game adapter. */
export function decodeSnapshot(value: unknown): Snapshot {
  const data = object(value, 'snapshot');
  const layout = object(data.layout, 'layout');
  const reels = integer(layout.reels, 'layout.reels', 1);
  const rows = integer(layout.rows, 'layout.rows', 1);
  const bufferTop = integer(layout.bufferTop, 'layout.bufferTop');
  const bufferBottom = integer(layout.bufferBottom, 'layout.bufferBottom');
  if (reels > 32 || rows > 64 || bufferTop > 64 || bufferBottom > 64) fail('layout bounds');
  const bets = array(data.bets, 'bets').map(item => {
    const bet = object(item, 'bet');
    const lineBet = amount(bet.lineBet, 'bet.lineBet'); const totalBet = amount(bet.totalBet, 'bet.totalBet');
    if (lineBet === 0 || totalBet === 0) fail('zero bet');
    return {lineBet, totalBet};
  });
  if (!bets.length || new Set(bets.map(bet => bet.lineBet)).size !== bets.length) fail('bets');
  const selectedLineBet = amount(data.selectedLineBet, 'selectedLineBet');
  if (!bets.some(bet => bet.lineBet === selectedLineBet)) fail('selectedLineBet');
  const fakeStrips = array(data.fakeStrips, 'fakeStrips').map(item => array(item, 'strip').map(cell => integer(cell, 'strip symbol')));
  if (fakeStrips.length !== reels || fakeStrips.some(strip => !strip.length)) fail('fakeStrips');
  const wins: Win[] = array(data.wins, 'wins').map(item => {
    const win = object(item, 'win'); const positions = array(win.positions, 'positions');
    if (positions.length !== reels) fail('positions');
    return {symbolId: integer(win.symbolId, 'symbolId'), amount: amount(win.amount), positions: positions.map(reel => {
      const cells = array(reel, 'positions reel');
      if (cells.length !== rows || cells.some(cell => typeof cell !== 'boolean')) fail('positions cells');
      return [...cells] as boolean[];
    })};
  });
  let special: SpecialState | null = null;
  if (data.special !== null) {
    const sg = object(data.special, 'special');
    if (sg.stage !== 'init' && sg.stage !== 'process' && sg.stage !== 'recovery') fail('special.stage');
    const remaining = sg.remaining === null ? null : integer(sg.remaining, 'remaining');
    const total = sg.total === null ? null : integer(sg.total, 'total');
    if ((remaining === null) !== (total === null) || (remaining !== null && total !== null && remaining > total)) fail('special counts');
    const picks = sg.picks === null ? null : array(sg.picks, 'picks').map(item => integer(item, 'pick', -1));
    special = {id: integer(sg.id, 'special.id'), stage: sg.stage, remaining, total, picks,
      data: JSON.parse(JSON.stringify(object(sg.data, 'special.data'))) as Record<string, unknown>};
  }
  if (data.roundId !== null && (typeof data.roundId !== 'string' || !data.roundId)) fail('roundId');
  return deepFreeze({version: integer(data.version, 'version'), roundId: data.roundId as string | null,
    balance: amount(data.balance, 'balance'), layout: {reels, rows, bufferTop, bufferBottom}, bets, selectedLineBet,
    board: matrix(data.board, reels, bufferTop + rows + bufferBottom, 'board'), fakeStrips, wins,
    lastWin: amount(data.lastWin, 'lastWin'), totalWin: amount(data.totalWin, 'totalWin'),
    winType: integer(data.winType, 'winType'), special});
}
export function decodeEnvelope(value: unknown, requestId: string): Snapshot {
  const envelope = object(value, 'response');
  if (envelope.schema !== 'gh-client-v1' || envelope.request_id !== requestId) fail('response correlation');
  const cmd = object(envelope.cmd_data, 'cmd_data');
  return decodeSnapshot(cmd.data);
}
