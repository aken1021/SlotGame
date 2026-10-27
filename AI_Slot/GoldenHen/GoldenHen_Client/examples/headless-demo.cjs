const {snapshot, envelope, rig} = require('../tests/helpers.cjs');
// Scripted test transport, not a mathematical game server.
let version = 0; let balance = 10000000;
const r = rig({send: async command => {
  if (command.action === 'SPIN') { version++; balance -= 5000; }
  return envelope(command, snapshot({version, balance}));
}});
r.host.events.on('state', state => console.log('state:', state));
r.host.events.on('settled', state => console.log('server balance:', state.balance, 'round version:', state.version));
(async () => { await r.host.connect(); await r.host.spin(); r.host.dispose(); })().catch(error => { console.error(error); process.exitCode = 1; });
