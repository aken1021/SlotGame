const {test} = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const {core, snapshot, envelope, rig} = require('./helpers.cjs');

test('real HTTP transport round trip, timeout after commit, same-ID replay and refresh', async t => {
  let version = 0; let balance = 10000000; let commits = 0; let drop = true;
  const cache = new Map(); const spinIds = [];
  const server = http.createServer(async (req, res) => {
    let body = ''; for await (const chunk of req) body += chunk;
    const command = JSON.parse(body);
    if (command.action === 'SPIN') spinIds.push(command.request_id);
    let result = cache.get(command.request_id);
    if (!result) {
      if (command.action === 'SPIN') { version++; balance = balance - 5000 + 100; commits++; }
      result = envelope(command, snapshot({version, balance, lastWin: command.action === 'SPIN' ? 100 : 0}));
      cache.set(command.request_id, result);
    }
    if (command.action === 'SPIN' && drop) { drop = false; req.socket.destroy(); return; }
    res.setHeader('Content-Type', 'application/json'); res.end(JSON.stringify(result));
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  t.after(() => { server.closeAllConnections(); return new Promise(resolve => server.close(resolve)); });
  const transport = new core.FetchTransport(`http://127.0.0.1:${server.address().port}/api/v1/game/command`);
  const r = rig(transport, {network: {timeoutMs: 2000, maxAttempts: 2}});
  await r.host.connect(); await r.host.spin();
  assert.equal(commits, 1); assert.equal(r.host.snapshot.balance, 9995100); assert.equal(spinIds.length, 2);
  assert.equal(spinIds[0], spinIds[1]); assert.equal(r.host.state, 'ready'); r.host.dispose();
});
