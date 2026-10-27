/* Real client core -> HTTP fault proxy -> compiled Go server, including restart. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const http = require('node:http');
const {spawn} = require('node:child_process');
const {once} = require('node:events');
const core = require('../dist/index.js');
const serverRoot = path.resolve(__dirname, '../../GoldenHen_Server');
const binary = process.argv[2] || path.join(serverRoot, 'bin', process.platform === 'win32' ? 'goldenhen.exe' : 'goldenhen');
const temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'goldenhen-go-'));
let child, proxy, backend;
let requests = 0, dropped = false, firstSpin = null, firstResponse = null, totalCredit = 0, totalDebit = 0;
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
async function start() {
  child = spawn(binary, ['-addr','127.0.0.1:0','-config',path.join(serverRoot,'config/development.json'),'-data',path.join(temporary,'wallet.journal'),'-allow-development-math'], {windowsHide:true});
  let log = ''; child.stderr.on('data', b => { log += b; });
  child.on('error', e => { log += e.message; });
  for (let i=0; i<200; i++) {
    const match = /listening on (http:\/\/127\.0\.0\.1:\d+)/.exec(log);
    if (match) { backend = match[1]; return; }
    if (child.exitCode !== null) throw new Error(log);
    await sleep(50);
  }
  throw new Error(`Go server did not start: ${log}`);
}
async function stop() {
  if (child && child.exitCode === null) { const done = once(child, 'exit'); child.kill(); await done; }
}
function makeClient() {
  const router = new core.SpecialGameRouter();
  for(const id of [0,1]) router.register({id, enter:async()=>{},updateState:async()=>{},exit:async()=>{},dispose(){}});
  const network = new core.CommandClient(new core.FetchTransport(`http://127.0.0.1:${proxy.address().port}/api/v1/game/command`), new core.MemoryPendingStore(), {gameId:'GoldenHen',playerId:'integration-player',timeoutMs:3000,maxAttempts:2,retryDelayMs:10});
  return new core.SlotClient(network,
    new core.ReelController({begin(){},stopReel:async()=>{},snap(){},cancel(){}},{stopGapMs:0,resultDelayMs:0}),
    new core.AwardController({show:async()=>{},finish(){}}),router);
}
(async()=>{
  await start();
  proxy = http.createServer(async(req,res)=>{
    try {
      let body='';for await(const chunk of req)body+=chunk;
      const command=JSON.parse(body);requests++;
      const upstream=await fetch(`${backend}/api/v1/game/command`,{method:'POST',headers:{'Content-Type':'application/json'},body});
      const text=await upstream.text();
      if(command.action==='SPIN' && !dropped && upstream.ok) {firstSpin=command;firstResponse=JSON.parse(text);dropped=true;req.socket.destroy();return;}
      res.writeHead(upstream.status,{'Content-Type':'application/json'});res.end(text);
    } catch(e) {res.writeHead(502);res.end(JSON.stringify({error:String(e)}));}
  });
  await new Promise(resolve=>proxy.listen(0,'127.0.0.1',resolve));
  let client=makeClient(); await client.connect(); const initial=client.snapshot.balance;
  client.events.on('settled',state=>{totalCredit+=state.lastWin;});
  for(let i=0;i<50;i++) {
    client.chooseBet(500); const bet=client.selectedBet.totalBet; totalDebit+=bet;
    await client.spin();
    for(let steps=0;client.state==='special';steps++) {
      assert.ok(steps<400,'Special chain failed to terminate');
      const sg=client.snapshot.special;
      await client.nextSpecial(sg.id===1 && sg.stage!=='init'?{'1':sg.picks.indexOf(-1)}:null);
    }
    assert.equal(client.state,'ready');
  }
  assert.ok(dropped);assert.ok(firstSpin);assert.equal(client.snapshot.balance,initial-totalDebit+totalCredit);
  const balance=client.snapshot.balance,version=client.snapshot.version;client.dispose();
  // Restart on the same journal and replay the first debit, not just the latest state.
  await stop();await start();
  const replay=await fetch(`${backend}/api/v1/game/command`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(firstSpin)});
  assert.equal(replay.status,200);assert.deepEqual(await replay.json(),firstResponse);
  client=makeClient();await client.connect();assert.equal(client.snapshot.balance,balance);assert.equal(client.snapshot.version,version);client.dispose();
  console.log(JSON.stringify({passed:true,paidSpins:50,httpRequests:requests,responseLossReplayed:true,restartReplayed:true,balance,version,totalDebit,totalCredit}));
})().catch(e=>{console.error(e);process.exitCode=1;}).finally(async()=>{
  if(proxy){proxy.closeAllConnections();await new Promise(resolve=>proxy.close(resolve));}
  await stop();fs.rmSync(temporary,{recursive:true,force:true});
});
