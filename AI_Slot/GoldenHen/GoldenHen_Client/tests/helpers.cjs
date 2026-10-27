const core = require('../dist/index.js');
function snapshot(overrides = {}) {
  return {
    version: 0, roundId: null, balance: 10000000,
    layout: {reels: 5, rows: 3, bufferTop: 1, bufferBottom: 1},
    bets: [{lineBet: 1000, totalBet: 50000}, {lineBet: 100, totalBet: 5000}], selectedLineBet: 100,
    board: Array.from({length: 5}, (_, i) => [24, 10 + i, 19, 20, 24]),
    fakeStrips: Array.from({length: 5}, () => [10, 14, 19, 20, 21, 24]),
    wins: [], lastWin: 0, totalWin: 0, winType: 0, special: null, ...overrides,
  };
}
function envelope(command, state) { return {schema: 'gh-client-v1', request_id: command.request_id, cmd_data: {data: state}}; }
function rig(transport, options = {}) {
  const calls = []; let id = 0;
  const store = options.store ?? new core.MemoryPendingStore();
  const network = new core.CommandClient(transport, store, {gameId: 'test', playerId: 'p1',
    maxAttempts: 1, timeoutMs: 100, retryDelayMs: 0, newId: () => `r${++id}`, ...options.network});
  const reelView = {begin: strips => calls.push(['begin', strips]),
    stopReel: async (index, symbols, signal) => { core.throwIfAborted(signal); calls.push(['stop', index, symbols]); },
    snap: board => calls.push(['snap', board]), cancel: () => calls.push(['cancel'])};
  const awardView = {show: async (state, signal) => { core.throwIfAborted(signal); calls.push(['award', state.lastWin]); },
    finish: state => calls.push(['finish', state.lastWin])};
  const reels = new core.ReelController(options.reelView ?? reelView, {stopGapMs: 0, resultDelayMs: 0});
  const awards = new core.AwardController(options.awardView ?? awardView);
  const router = options.router ?? new core.SpecialGameRouter();
  const host = new core.SlotClient(network, reels, awards, router);
  return {host, network, store, calls, reels, awards, router};
}
module.exports = {core, snapshot, envelope, rig};
