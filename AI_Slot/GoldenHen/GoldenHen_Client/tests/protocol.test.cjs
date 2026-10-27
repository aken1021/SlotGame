const {test} = require('node:test');
const assert = require('node:assert/strict');
const {core, snapshot} = require('./helpers.cjs');

test('server snapshot is validated, immutable and strips buffer cells from display', () => {
  const input = snapshot(); const state = core.decodeSnapshot(input);
  assert.deepEqual(core.visibleBoard(state)[0], [10, 19, 20]);
  input.board[0][1] = 999; assert.equal(state.board[0][1], 10);
  assert.ok(Object.isFrozen(state.board[0]));
});
test('reject fractional, negative and unsafe amounts', () => {
  for (const balance of [-1, 0.01, Number.MAX_SAFE_INTEGER + 1, NaN]) {
    assert.throws(() => core.decodeSnapshot(snapshot({balance})), {code: 'INVALID_AMOUNT'});
  }
});
test('reject malformed layouts, missing reels and invalid win coordinates', () => {
  assert.throws(() => core.decodeSnapshot(snapshot({board: [[1, 2, 3]]})));
  assert.throws(() => core.decodeSnapshot(snapshot({layout: {reels: 100000, rows: 3, bufferTop: 1, bufferBottom: 1}})));
  assert.throws(() => core.decodeSnapshot(snapshot({wins: [{symbolId: 10, amount: 100, positions: [[true]]}]})));
  assert.throws(() => core.decodeSnapshot(snapshot({bets: [{lineBet: 0, totalBet: 0}]})));
});
test('special counts and pick sentinel are validated', () => {
  const special = {id: 8, stage: 'recovery', remaining: null, total: null, picks: [-1, 0, 2], data: {}};
  assert.deepEqual(core.decodeSnapshot(snapshot({special})).special.picks, [-1, 0, 2]);
  assert.throws(() => core.decodeSnapshot(snapshot({special: {...special, remaining: 5, total: 4}})));
  assert.throws(() => core.decodeSnapshot(snapshot({special: {...special, picks: [-2]}})));
});
test('envelope must correlate to the exact request', () => {
  assert.throws(() => core.decodeEnvelope({schema: 'gh-client-v1', request_id: 'wrong', cmd_data: {data: snapshot()}}, 'actual'));
});
test('money formatting rounds for display with exact integers, including carry', () => {
  assert.equal(core.formatAmount(10000), '1.00');
  assert.equal(core.formatAmount(10049), '1.00');
  assert.equal(core.formatAmount(10050), '1.01');
  assert.equal(core.formatAmount(999950), '100.00');
  assert.equal(core.formatAmount(Number.MAX_SAFE_INTEGER), '900719925474.10');
  assert.equal(core.formatAmount(123, 0, 0), '123');
});
test('observer errors are isolated, once listeners and scopes dispose correctly', () => {
  const bus = new core.EventBus(); let seen = 0;
  const scope = new core.Scope(); scope.add(bus.on('value', () => seen++));
  bus.once('value', () => { seen += 10; }); bus.on('value', () => { throw new Error('observer'); });
  assert.equal(bus.emit('value', 1).length, 1); bus.emit('value', 2); assert.equal(seen, 12);
  scope.dispose(); scope.dispose(); bus.emit('value', 3); assert.equal(seen, 12);
});
test('calling an old unsubscribe twice cannot remove a later subscription', () => {
  const bus = new core.EventBus(); const old = bus.on('value', () => {}); old();
  let seen = 0; bus.on('value', () => seen++); old(); bus.emit('value', 1); assert.equal(seen, 1);
});
