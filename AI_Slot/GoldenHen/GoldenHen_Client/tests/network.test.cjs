const {test} = require('node:test');
const assert = require('node:assert/strict');
const {core, snapshot, envelope} = require('./helpers.cjs');
const options = {gameId: 'g', playerId: 'p', timeoutMs: 20, maxAttempts: 2, retryDelayMs: 0, newId: () => 'stable'};

test('retry sends exactly the same ID, version and payload', async () => {
  const seen = []; const store = new core.MemoryPendingStore();
  const client = new core.CommandClient({send: async command => {
    seen.push(command); assert.equal(store.load().request_id, 'stable');
    if (seen.length === 1) throw new Error('connection lost after commit');
    return envelope(command, snapshot());
  }}, store, options);
  const result = await client.execute('SPIN', {line_bet: 100}, 3);
  assert.equal(seen[0], seen[1]); assert.equal(result.command.expected_version, 3);
  assert.equal(store.load().request_id, 'stable'); // Retained until protocol accepted by host.
  client.acknowledge('stable'); assert.equal(store.load(), null);
});
test('timeout retains an uncertain command and forbids a fresh spin', async () => {
  const store = new core.MemoryPendingStore();
  const client = new core.CommandClient({send: () => new Promise(() => {})}, store, {...options, maxAttempts: 1, timeoutMs: 5});
  await assert.rejects(client.execute('SPIN', {line_bet: 100}, 0), {code: 'TIMEOUT'});
  await assert.rejects(client.execute('SPIN', {line_bet: 100}, 0), {code: 'PENDING_REQUEST'});
  assert.equal(store.load().request_id, 'stable');
});
test('recreated client replays persisted command after reload', async () => {
  const data = new Map(); const storage = {getItem: key => data.get(key) ?? null, setItem: (key, value) => data.set(key, value), removeItem: key => data.delete(key)};
  const a = new core.CommandClient({send: async () => { throw new Error('lost'); }}, new core.PersistentPendingStore(storage, 'g:p'), {...options, maxAttempts: 1});
  await assert.rejects(a.execute('NEXT_FEVER', {sg_id: 1, data: {'1': 7}}, 4));
  const b = new core.CommandClient({send: async command => command}, new core.PersistentPendingStore(storage, 'g:p'), options);
  const result = await b.replay(); assert.equal(result.response.request_id, 'stable');
  assert.equal(result.response.payload.data['1'], 7); b.acknowledge('stable'); assert.equal(data.size, 0);
});
test('reject corrupted and cross-player pending state without deleting it', () => {
  const storage = {getItem: () => 'bad json', setItem() {}, removeItem() { throw new Error('must not clear'); }};
  assert.throws(() => new core.CommandClient({}, new core.PersistentPendingStore(storage, 'x'), options), {code: 'CORRUPT_PENDING'});
  const store = new core.MemoryPendingStore();
  store.save({schema: 'gh-client-v1', player_id: 'other', game_id: 'g', action: 'SPIN'});
  assert.throws(() => new core.CommandClient({}, store, options), {code: 'PENDING_OWNER_MISMATCH'});
});
test('cannot send when local persistence fails; no untracked debit', async () => {
  let sent = false;
  const store = {load: () => null, save: () => { throw new Error('storage full'); }, clear() {}};
  const client = new core.CommandClient({send: async () => { sent = true; }}, store, options);
  await assert.rejects(client.execute('SPIN', {}, 0)); assert.equal(sent, false);
});
test('definitive 422 is not retried and clears pending; 503 remains uncertain', async () => {
  let attempts = 0; const store = new core.MemoryPendingStore();
  const a = new core.CommandClient({send: async () => { attempts++; throw new core.HttpError(422, 'bad bet'); }}, store, options);
  await assert.rejects(a.execute('SPIN', {}, 0)); assert.equal(attempts, 1); assert.equal(store.load(), null);
  const b = new core.CommandClient({send: async () => { throw new core.HttpError(503, 'unavailable'); }}, store, {...options, maxAttempts: 1});
  await assert.rejects(b.execute('SPIN', {}, 0)); assert.ok(store.load());
});
test('dispose cancels I/O without erasing a pending command', async () => {
  const store = new core.MemoryPendingStore();
  const client = new core.CommandClient({send: () => new Promise(() => {})}, store, options);
  const waiting = client.execute('SPIN', {}, 0); client.dispose();
  await assert.rejects(waiting); assert.ok(store.load());
  await assert.rejects(client.replay(), {code: 'DISPOSED'});
});
