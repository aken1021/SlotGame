const {test} = require('node:test');
const assert = require('node:assert/strict');
const {core, snapshot, envelope, rig} = require('./helpers.cjs');

test('start -> spin -> five reels -> award -> ready uses only server money', async () => {
  const sent = []; const r = rig({send: async command => {
    sent.push(command);
    return envelope(command, snapshot(command.action === 'SPIN' ? {version: 1, roundId: 'round1', balance: 9995234, lastWin: 234, totalWin: 234, winType: 1} : {}));
  }});
  const phases = []; r.host.events.on('state', state => phases.push(state));
  await r.host.connect(); await r.host.spin();
  assert.equal(r.host.snapshot.balance, 9995234);
  assert.equal(r.host.state, 'ready'); assert.equal(r.store.load(), null);
  assert.deepEqual(phases, ['connecting', 'ready', 'requesting', 'stopping', 'awarding', 'ready']);
  assert.deepEqual(r.calls.filter(c => c[0] === 'stop').map(c => c[1]), [0, 1, 2, 3, 4]);
  assert.equal(sent[1].payload.line_bet, 100); assert.equal(sent[1].expected_version, 0);
});
test('double click is rejected while one spin is in flight', async () => {
  let resolveSpin; let spins = 0;
  const r = rig({send: async command => {
    if (command.action === 'SPIN') { spins++; return new Promise(resolve => { resolveSpin = () => resolve(envelope(command, snapshot({version: 1}))); }); }
    return envelope(command, snapshot());
  }});
  await r.host.connect(); const first = r.host.spin();
  await assert.rejects(r.host.spin(), {code: 'INVALID_STATE'});
  assert.equal(r.host.input.canChangeBet, false); assert.throws(() => r.host.chooseBet(1000));
  resolveSpin(); await first; assert.equal(spins, 1);
});
test('malformed response faults and retains command; reconnect replays same ID then refreshes state', async () => {
  let malformed = true; const ids = [];
  const r = rig({send: async command => {
    if (command.action === 'SPIN') { ids.push(command.request_id); if (malformed) return {}; return envelope(command, snapshot({version: 1})); }
    return envelope(command, snapshot({version: ids.length ? 1 : 0}));
  }});
  await r.host.connect(); await assert.rejects(r.host.spin(), {code: 'INVALID_RESPONSE'});
  assert.equal(r.host.state, 'faulted'); assert.ok(r.store.load());
  malformed = false; await r.host.connect();
  assert.equal(ids[0], ids[1]); assert.equal(r.host.state, 'ready'); assert.equal(r.store.load(), null);
});
test('stale mutation response cannot unlock another spin', async () => {
  const r = rig({send: async command => envelope(command, snapshot())});
  await r.host.connect(); await assert.rejects(r.host.spin(), {code: 'STALE_RESPONSE'});
  assert.equal(r.host.input.canSpin, false); assert.ok(r.store.load());
});
test('special router handles nested transition and recovery without hardcoded game IDs', async () => {
  const history = []; const router = new core.SpecialGameRouter();
  for (const id of [41, 72]) router.register({id, enter: async s => history.push(`enter${id}:${s.stage}`),
    updateState: async () => history.push(`update${id}`), exit: async () => history.push(`exit${id}`), dispose() {}});
  const sg = (id, remaining, stage = 'process') => ({id, stage, remaining, total: remaining === null ? null : 4, picks: null, data: {}});
  let step = 0;
  const states = [snapshot(), snapshot({version: 1, special: sg(41, 3, 'init')}),
    snapshot({version: 2, special: sg(72, null, 'init')}), snapshot({version: 3, special: sg(41, 2, 'recovery')}),
    snapshot({version: 4})];
  const r = rig({send: async command => envelope(command, states[step++])}, {router});
  await r.host.connect(); await r.host.spin(); assert.equal(r.host.state, 'special');
  assert.throws(() => r.host.chooseBet(1000));
  await r.host.nextSpecial(); await r.host.nextSpecial({'1': 3}); await r.host.nextSpecial();
  assert.deepEqual(history, ['enter41:init', 'exit41', 'enter72:init', 'exit72', 'enter41:recovery', 'exit41']);
  assert.equal(r.host.state, 'ready');
});
test('unsupported special blocks input until a handler is registered and state reconciled', async () => {
  const special = {id: 999, stage: 'init', remaining: null, total: null, picks: null, data: {}};
  const r = rig({send: async command => envelope(command, snapshot({special}))});
  await assert.rejects(r.host.connect(), {code: 'UNSUPPORTED_SPECIAL'});
  assert.equal(r.host.state, 'faulted'); assert.equal(r.host.input.canSpin, false);
});
test('disposal during request prevents late response from changing state or clearing uncertain debit', async () => {
  let resolveSpin;
  const r = rig({send: async command => {
    if (command.action === 'SPIN') return new Promise(resolve => { resolveSpin = () => resolve(envelope(command, snapshot({version: 1}))); });
    return envelope(command, snapshot());
  }});
  await r.host.connect(); const spin = r.host.spin(); r.host.dispose();
  await assert.rejects(spin); resolveSpin(); await Promise.resolve();
  assert.equal(r.host.state, 'disposed'); assert.ok(r.store.load());
});
test('transport rejection restores server balance and requires reconciliation', async () => {
  const r = rig({send: async command => {
    if (command.action === 'SPIN') throw new core.HttpError(422, 'insufficient');
    return envelope(command, snapshot());
  }});
  await r.host.connect(); await assert.rejects(r.host.spin());
  assert.equal(r.host.snapshot.balance, 10000000); assert.equal(r.store.load(), null); assert.equal(r.host.state, 'faulted');
});
test('auto spin stops at a special game and never automatically picks a bonus action', async () => {
  let spins = 0;
  const router = new core.SpecialGameRouter(); router.register({id: 20, enter: async () => {}, updateState: async () => {}, exit: async () => {}, dispose() {}});
  const r = rig({send: async command => {
    if (command.action === 'SPIN') spins++;
    return envelope(command, snapshot({version: spins, special: spins === 2 ? {id: 20, stage: 'init', remaining: 4, total: 4, picks: null, data: {}} : null}));
  }}, {router});
  await r.host.connect(); const auto = new core.AutoSpinController(r.host);
  assert.equal(await auto.run(10), 2); assert.equal(spins, 2); assert.equal(r.host.state, 'special');
});

test('auto spin lease locks manual bet and spin controls and releases on exit', async () => {
  const r = rig({send: async command => envelope(command, snapshot())});
  await r.host.connect(); const lease = r.host.acquireAutoSpin();
  assert.equal(r.host.input.canSpin, false); assert.equal(r.host.input.canChangeBet, false);
  assert.throws(() => r.host.chooseBet(1000)); await assert.rejects(r.host.spin());
  lease.release(); assert.equal(r.host.input.canSpin, true); r.host.chooseBet(1000);
  assert.equal(r.host.selectedBet.lineBet, 1000);
});

test('disposing from snapshot observer cannot resurrect a ready client', async () => {
  const r = rig({send: async command => envelope(command, snapshot())});
  r.host.events.on('snapshot', () => r.host.dispose());
  await assert.rejects(r.host.connect(), {code: 'DISPOSED'}); assert.equal(r.host.state, 'disposed');
});

test('quick-stop requested before response is retained until results arrive', async () => {
  let finish; const calls = [];
  const reelView = {begin() {}, stopReel: async index => calls.push(index), snap() {}, cancel() {}};
  const r = rig({send: async command => {
    if (command.action === 'SPIN') return new Promise(resolve => { finish = () => resolve(envelope(command, snapshot({version: 1}))); });
    return envelope(command, snapshot());
  }}, {reelView});
  await r.host.connect(); const spin = r.host.spin(); r.host.skip(); finish(); await spin;
  assert.deepEqual(calls, [0, 1, 2, 3, 4]); assert.equal(r.host.state, 'ready');
});

test('auto spin releases its ownership if network outcome is uncertain', async () => {
  let spins = 0;
  const r = rig({send: async command => {
    if (command.action === 'SPIN') { spins++; throw new Error('lost response'); }
    return envelope(command, snapshot());
  }});
  await r.host.connect(); const auto = new core.AutoSpinController(r.host);
  await assert.rejects(auto.run(3)); assert.equal(spins, 1); assert.equal(r.host.state, 'faulted');
  assert.equal(r.host.input.canSpin, false); assert.ok(r.store.load());
});
