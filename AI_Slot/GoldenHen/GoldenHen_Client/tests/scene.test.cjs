const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const scene=JSON.parse(fs.readFileSync(path.join(root,'assets/Game/Scenes/GoldenHenMain.scene'),'utf8'));
const manifest=JSON.parse(fs.readFileSync(path.join(root,'tools/goldenhen-scene-manifest.json'),'utf8'));
test('GoldenHen scene has valid object links, 5 masked reels and a 990x430 Board',()=>{
 function walk(o){if(!o||typeof o!=='object')return;if('__id__'in o)assert.ok(Number.isInteger(o.__id__)&&o.__id__>=0&&o.__id__<scene.length);for(const v of Object.values(o))walk(v);}
 scene.forEach(walk);
 const board=scene.find(n=>n._name==='ReelArea_990x430');assert.ok(board);
 const transform=board._components.map(r=>scene[r.__id__]).find(c=>c.__type__==='cc.UITransform');
 assert.deepEqual(transform._contentSize,{__type__:'cc.Size',width:990,height:430});
 const reels=scene.filter(n=>/^Reel_[0-4]$/.test(n._name));assert.equal(reels.length,5);
 for(const reel of reels){
  const components=reel._components.map(r=>scene[r.__id__]);assert.ok(components.some(c=>c.__type__==='cc.Mask'));
  const controller=components.find(c=>Array.isArray(c.cells));assert.equal(controller.cells.length,3);assert.equal(controller.symbolSprites.length,3);assert.ok(controller.bufferCell);
 }
 assert.equal(manifest.reels,5);assert.equal(manifest.rows,3);
});
test('scene connects to local Go server and binds real client components',()=>{
 const driver=scene.find(o=>o.gameId==='GoldenHen'&&'autoConnect'in o);assert.ok(driver);
 assert.equal(driver.autoConnect,true);assert.equal(driver.columns.length,5);
 assert.ok(driver.spinButton);assert.ok(driver.balanceLabel);assert.ok(driver.statusLabel);
 const skin=scene.find(o=>o.sheet&&o.columns&&!('autoConnect'in o));assert.ok(skin);assert.equal(skin.columns.length,5);
 // Creator's registered script class IDs retain five hex digits, then base64 pairs.
 const alphabet='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
 for(const relative of ['scripts/common/cocos/CocosSlotDriver.ts','scripts/common/cocos/CocosReelColumn.ts','scripts/common/cocos/CocosSpecialPanel.ts','Game/Scripts/GoldenHenReelSkin.ts','Game/Scripts/GoldenHenGameControls.ts']){
  const uuid=JSON.parse(fs.readFileSync(path.join(root,'assets',`${relative}.meta`),'utf8')).uuid.replaceAll('-','');
  const candidate=scene.find(o=>typeof o.__type__==='string'&&o.__type__.length===23&&o.__type__.startsWith(uuid.slice(0,5)));
  assert.ok(candidate,`Missing registered script ID for ${relative}`);
  let decoded=candidate.__type__.slice(0,5);
  for(let i=5;i<23;i+=2)decoded+=((alphabet.indexOf(candidate.__type__[i])<<6)|alphabet.indexOf(candidate.__type__[i+1])).toString(16).padStart(3,'0');
  assert.equal(decoded,uuid);
 }
});
test('AI art is local PNG with Cocos texture/sprite-frame metadata',()=>{
 for(const image of manifest.images){
  const file=path.join(root,'assets/Game/Art/AI',image.name);const b=fs.readFileSync(file);
  assert.equal(b.subarray(1,4).toString(),'PNG');assert.equal(b.readUInt32BE(16),image.width);assert.equal(b.readUInt32BE(20),image.height);
  const meta=JSON.parse(fs.readFileSync(`${file}.meta`,'utf8'));
  assert.equal(meta.uuid,image.uuid);assert.equal(meta.subMetas.f9941.uuid,image.frame);assert.equal(meta.subMetas.f9941.userData.trimType,'none');
 }
 const sheet=manifest.images.find(i=>i.name==='goldenhen_symbol_sheet.png');assert.equal(sheet.width%3,0);assert.equal(sheet.height%2,0);
});
