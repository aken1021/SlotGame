const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const root = path.resolve(__dirname, '..');
const asset = path.join(root, 'assets');
function write(file, data) { fs.mkdirSync(path.dirname(file), {recursive: true}); fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n'); }
function existingUuid(file) { return fs.existsSync(`${file}.meta`) ? JSON.parse(fs.readFileSync(`${file}.meta`, 'utf8')).uuid : crypto.randomUUID(); }
function folder(name) { const file = path.join(asset, name); fs.mkdirSync(file, {recursive: true}); if (!fs.existsSync(`${file}.meta`)) write(`${file}.meta`, {ver:'1.2.0',importer:'directory',imported:true,uuid:crypto.randomUUID(),files:[],subMetas:{},userData:{}}); }
for (const name of ['Game','Game/Art','Game/Art/AI','Game/Scripts','Game/Scenes']) folder(name);
function image(name) {
  const file = path.join(asset,'Game/Art/AI',name); const uuid = existingUuid(file);
  const bytes = fs.readFileSync(file); const width = bytes.readUInt32BE(16), height = bytes.readUInt32BE(20);
  const texture = `${uuid}@6c48a`, frame = `${uuid}@f9941`;
  write(`${file}.meta`, {ver:'1.0.27',importer:'image',imported:true,uuid,files:['.json','.png'],subMetas:{
    '6c48a': {ver:'1.0.22',importer:'texture',imported:true,uuid:texture,displayName:name,id:'6c48a',name:'texture',files:['.json'],subMetas:{},userData:{wrapModeS:'clamp-to-edge',wrapModeT:'clamp-to-edge',minfilter:'linear',magfilter:'linear',mipfilter:'none',premultiplyAlpha:false,anisotropy:0,isUuid:true,imageUuidOrDatabaseUri:uuid,visible:false}},
    'f9941': {ver:'1.0.12',importer:'sprite-frame',imported:true,uuid:frame,displayName:name,id:'f9941',name:'spriteFrame',files:['.json'],subMetas:{},userData:{trimType:'none',trimThreshold:1,rotated:false,offsetX:0,offsetY:0,trimX:0,trimY:0,width,height,rawWidth:width,rawHeight:height,borderTop:0,borderBottom:0,borderLeft:0,borderRight:0,isUuid:true,imageUuidOrDatabaseUri:texture,atlasUuid:'',packable:false,pixelsToUnit:100,pivotX:0.5,pivotY:0.5,meshType:0}}
  },userData:{type:'sprite-frame',redirect:texture,hasAlpha:bytes[25]===6,fixAlphaTransparencyArtifacts:false}});
  return {uuid,frame,width,height,name};
}
const bg = image('goldenhen_background.png');
const board = image('goldenhen_reel_board.png');
const sheet = image('goldenhen_symbol_sheet.png');
function scriptType(relative) {
  const file = path.join(asset, relative); const uuid = existingUuid(file);
  if (!fs.existsSync(`${file}.meta`)) write(`${file}.meta`,{ver:'4.0.24',importer:'typescript',imported:true,uuid,files:[],subMetas:{},userData:{}});
  // Creator registers scripts with the 23-character form (five hex prefix).
  const hex = uuid.replaceAll('-','');
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  let compressed = hex.slice(0,5);
  for (let i=5; i<32; i+=3) {
    const value = parseInt(hex.slice(i,i+3),16);
    compressed += alphabet[value >> 6] + alphabet[value & 63];
  }
  return compressed;
}
const driverType=scriptType('scripts/common/cocos/CocosSlotDriver.ts');
const reelType=scriptType('scripts/common/cocos/CocosReelColumn.ts');
const skinType=scriptType('Game/Scripts/GoldenHenReelSkin.ts');
const panelType=scriptType('scripts/common/cocos/CocosSpecialPanel.ts');
const controlsType=scriptType('Game/Scripts/GoldenHenGameControls.ts');
const sceneFile=path.join(asset,'Game/Scenes/GoldenHenMain.scene'); const sceneUuid=existingUuid(sceneFile);
const a=[]; const ref=i=>({__id__:i}); const put=o=>(a.push(o),a.length-1);
const color=(r,g,b,alpha=255)=>({__type__:'cc.Color',r,g,b,a:alpha});
const vector=(x=0,y=0,z=0)=>({__type__:'cc.Vec3',x,y,z});
const art=u=>({__uuid__:u,__expectedType__:'cc.SpriteFrame'});
const assetId=put({__type__:'cc.SceneAsset',_name:'GoldenHenMain',_objFlags:0,_native:'',scene:ref(1),asyncLoadAssets:false});
const scene=put({__type__:'cc.Scene',_name:'GoldenHenMain',_objFlags:0,_parent:null,_children:[],_active:true,_components:[],_prefab:null,autoReleaseAssets:false,_id:sceneUuid});
function component(type,node,props={}) {
  const id=put({__type__:type,_name:'',_objFlags:0,node:ref(node),_enabled:true,__prefab:null,...props,_id:crypto.randomUUID()});
  a[node]._components.push(ref(id)); return id;
}
function node(name,parent,x,y,w,h,active=true) {
  const id=put({__type__:'cc.Node',_name:name,_objFlags:0,_parent:ref(parent),_children:[],_active:active,_components:[],_prefab:null,_lpos:vector(x,y),_lrot:{__type__:'cc.Quat',x:0,y:0,z:0,w:1},_lscale:vector(1,1,1),_mobility:0,_layer:33554432,_euler:vector(),_id:crypto.randomUUID()});
  a[parent]._children.push(ref(id));
  component('cc.UITransform',id,{_contentSize:{__type__:'cc.Size',width:w,height:h},_anchorPoint:{__type__:'cc.Vec2',x:0.5,y:0.5}});
  return id;
}
function sprite(n,frame,tint=color(255,255,255)) { return component('cc.Sprite',n,{_customMaterial:null,_srcBlendFactor:2,_dstBlendFactor:4,_color:tint,_spriteFrame:art(frame),_type:0,_fillType:0,_sizeMode:0,_trim:false,_useGrayscale:false}); }
function label(n,text,size=24,tint=color(255,226,159)) {return component('cc.Label',n,{_customMaterial:null,_srcBlendFactor:2,_dstBlendFactor:4,_color:tint,_string:text,_horizontalAlign:1,_verticalAlign:1,_actualFontSize:size,_fontSize:size,_fontFamily:'Microsoft JhengHei, Arial',_lineHeight:size+4,_overflow:2,_enableWrapText:false,_font:null,_isSystemFontUsed:true,_isBold:true,_enableOutline:true,_outlineColor:color(55,14,6),_outlineWidth:2,_cacheMode:0});}
const builtinPanel='b730527c-3233-41c2-aaf7-7cdab58f9749@f9941';
function panel(name,parent,x,y,w,h,tint) {const n=node(name,parent,x,y,w,h);sprite(n,builtinPanel,tint);return n;}
const canvas=node('Canvas',scene,640,360,1280,720);
const cameraNode=node('UICamera',canvas,0,0,0,0);a[cameraNode]._lpos.z=1000;
const camera=component('cc.Camera',cameraNode,{_projection:0,_priority:0,_fov:45,_fovAxis:0,_orthoHeight:360,_near:0,_far:2000,_color:color(24,4,3),_depth:1,_stencil:0,_clearFlags:7,_rect:{__type__:'cc.Rect',x:0,y:0,width:1,height:1},_screenScale:1,_visibility:33554432,_targetTexture:null});
component('cc.Canvas',canvas,{_cameraComponent:ref(camera),_alignCanvasWithScreen:true});
const background=node('AI_Background',canvas,0,0,1280,720);sprite(background,bg.frame);
const jackpot=node('JackpotHUD',canvas,0,0,1280,720);
[-440,-250,250,440].forEach((x,i)=>{
 const p=panel(['GRAND','MAJOR','MINOR','MINI'][i],jackpot,x,234,164,62,color(62,12,12,235));
 const title=node('TierLabel',p,0,14,160,24);label(title,['GRAND','MAJOR','MINOR','MINI'][i],18,[color(255,211,97),color(233,235,244),color(244,162,199),color(163,194,251)][i]);
 const value=node('Value',p,0,-13,150,26);label(value,'—',22);
});
// 990×430 is the spec's Board root footprint, including its ornamental frame.
const reelArea=node('ReelArea_990x430',canvas,0,-18,990,430);
const frameNode=node('AI_ReelBoard',reelArea,0,0,990,430);sprite(frameNode,board.frame);
const columns=[];
for(let i=0;i<5;i++){
 const col=node(`Reel_${i}`,reelArea,(i-2)*176.5,0,171,304);
 component('cc.Mask',col,{_type:0,_segments:64,_inverted:false,_alphaThreshold:0.1});
 const labels=[],sprites=[];
 for(let row=0;row<4;row++){
  const cell=node(row===3?'TopBuffer':`Cell_${row}`,col,0,row===3?202:(1-row)*101,150,100,row!==3);
  labels.push(label(cell,'',42));
  const picture=node('Symbol',cell,0,0,100,100);sprites.push(sprite(picture,sheet.frame));
 }
 columns.push(component(reelType,col,{cells:labels.slice(0,3).map(ref),symbolSprites:sprites.slice(0,3).map(ref),symbolIds:[],symbolFrames:[],symbolNames:[],bufferCell:ref(labels[3]),bufferSprite:ref(sprites[3]),speed:900,cellHeight:101,stopDuration:0.1}));
}
const caption=node('ReelCaption',canvas,0,-255,800,28);label(caption,'243 WAYS  ·  金雞報喜',20);
const bar=panel('Controls',canvas,0,-300,1050,62,color(54,9,13,240));
const balanceTitle=node('BalanceTitle',bar,-428,13,120,20);label(balanceTitle,'餘額',14,color(218,170,124));
const balanceNode=node('Balance',bar,-428,-9,130,26);const balanceLabel=label(balanceNode,'—',23);
const winTitle=node('WinTitle',bar,-255,13,110,20);label(winTitle,'本局贏分',14,color(218,170,124));
const winNode=node('Win',bar,-255,-9,130,26);const winLabel=label(winNode,'—',23);
const statusNode=node('Status',canvas,0,-345,1100,24);const statusLabel=label(statusNode,'場景預覽 · 等待遊戲連線',15,color(230,196,158));
function button(name,text,x,width,tint){
 const n=panel(name,bar,x,0,width,44,tint);const l=node('Text',n,0,0,width-10,36);label(l,text,22);
 const c=component('cc.Button',n,{_interactable:true,_transition:1,_normalColor:color(255,255,255),_hoverColor:color(255,237,203),_pressedColor:color(207,177,147),_disabledColor:color(132,123,117),_duration:0.1,_zoomScale:1.05,_target:ref(n),clickEvents:[]});return {node:n,component:c};
}
const connect=button('Connect','連線',-50,110,color(103,35,26));
const skip=button('Skip','快停',100,110,color(103,35,26));
const spin=button('Spin','旋轉',330,230,color(175,39,23));
const features=[];
for(const [id,name]of [[0,'FG_Panel'],[1,'JP_Panel']]){
 const n=node(name,canvas,0,0,990,430,false);features.push(component(panelType,n,{id,counter:null}));
}
component(skinType,canvas,{sheet:art(sheet.frame),columns:columns.map(ref)});
const driver=component(driverType,canvas,{endpoint:'http://127.0.0.1:8080/api/v1/game/command',playerId:'local-player',gameId:'GoldenHen',autoConnect:true,columns:columns.map(ref),specialPanels:features.map(ref),spinButton:ref(spin.component),skipButton:ref(skip.component),balanceLabel:ref(balanceLabel),winLabel:ref(winLabel),statusLabel:ref(statusLabel)});
component(controlsType,canvas);
const connectEvent=put({__type__:'cc.ClickEvent',target:ref(canvas),component:'AISlotDriver',_componentId:driverType,handler:'reconnect',customEventData:''});
a[connect.component].clickEvents=[ref(connectEvent)];
const globals=put({__type__:'cc.SceneGlobals'});a[scene]._globals=ref(globals);
write(sceneFile,a);write(`${sceneFile}.meta`,{ver:'1.1.50',importer:'scene',imported:true,uuid:sceneUuid,files:['.json'],subMetas:{},userData:{}});
write(path.join(root,'tools/goldenhen-scene-manifest.json'),{scene:'assets/Game/Scenes/GoldenHenMain.scene',sceneUuid,resolution:[1280,720],reelArea:[990,430],visibleWell:[171,304],reels:5,rows:3,initialMode:'local-server-auto-connect',images:[bg,board,sheet],symbolSheet:{columns:3,rows:2,ids:[15,16,17,18,14,1]},previewSymbols:[[15,14,17],[16,1,18],[14,15,16],[17,18,14],[1,16,15]],notes:'Scene Board footprint includes frame; each inner well is masked. Initial icons are preview art, not a result.'});
write(path.join(root,'tools/goldenhen-web-build.json'),{name:'GoldenHenPreview',platform:'web-desktop',buildPath:'project://build',outputName:'goldenhen-preview',debug:true,sourceMaps:true,startScene:sceneUuid,scenes:[{url:'db://assets/Game/Scenes/GoldenHenMain.scene',uuid:sceneUuid}],polyfills:{asyncFunctions:true},packages:{'web-desktop':{resolution:{designWidth:1280,designHeight:720},useWebGPU:false}},useSplashScreen:false});
console.log(JSON.stringify({scene:sceneFile,sceneUuid,objects:a.length,art:[bg.name,board.name,sheet.name]}));
