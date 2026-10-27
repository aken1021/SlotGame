const {test} = require('node:test');
const assert = require('node:assert/strict');
const {core, snapshot} = require('./helpers.cjs');

test('fast stop cancels wait and snaps every reel to authoritative visible symbols', async () => {
  const snapped = []; let stopped = 0;
  const reels = new core.ReelController({begin() {}, stopReel: async () => stopped++, snap: b => snapped.push(b), cancel() {}}, {resultDelayMs: 10000, stopGapMs: 400});
  reels.begin(snapshot().fakeStrips); const pending = reels.present(core.decodeSnapshot(snapshot()));
  reels.fastStop(); await pending;
  assert.equal(stopped, 0); assert.deepEqual(snapped[0][0], [10, 19, 20]);
});
test('skip award retains server final award, no local settlement', async () => {
  let final;
  const awards = new core.AwardController({show: async (_s, signal) => core.delay(10000, signal), finish: s => { final = s.lastWin; }});
  const pending = awards.present(snapshot({lastWin: 12345})); awards.skip(); await pending; assert.equal(final, 12345);
});
test('real presentation failure is not silently treated as skip', async () => {
  const awards = new core.AwardController({show: async () => { throw new Error('missing asset'); }, finish() {}});
  await assert.rejects(awards.present(snapshot({lastWin: 10})), /missing asset/);
});
test('cosmetic reel motion supports recycled cells and bounded large frames', () => {
  const motion = new core.ReelMotion([10, 11, 12], 100, 1000);
  const frame = motion.tick(5, 3);
  assert.equal(frame.offset, 0); assert.deepEqual(frame.symbols, [11, 12, 10, 11]);
  assert.throws(() => motion.tick(-1, 3));
});
test('resource loads deduplicate, failures can retry, late assets are released', async () => {
  let calls = 0; let resolveLoad; const released = [];
  const cache = new core.ResourceCache(async () => { calls++; return new Promise(resolve => { resolveLoad = resolve; }); }, v => released.push(v));
  const a = cache.get('symbol'); const b = cache.get('symbol'); await Promise.resolve(); assert.equal(calls, 1);
  cache.dispose(); resolveLoad('loaded'); await assert.rejects(a, {code: 'DISPOSED'}); await assert.rejects(b);
  await Promise.resolve(); assert.deepEqual(released, ['loaded']);
  let retry = 0;
  const flaky = new core.ResourceCache(async () => { if (retry++ === 0) throw new Error('load'); return 'ok'; }, () => {});
  await assert.rejects(flaky.get('x')); assert.equal(await flaky.get('x'), 'ok'); flaky.dispose();
});
test('audio music is not restarted on repeated mode notification; mute persists', () => {
  const calls = []; const audio = new core.AudioController({music: key => calls.push(key), effect: key => calls.push(key), stopMusic: () => calls.push('stop'), setMuted() {}});
  audio.playMusic('main'); audio.playMusic('main'); audio.setMuted(true); audio.playEffect('coin'); audio.dispose();
  assert.deepEqual(calls, ['main', 'stop']);
});
