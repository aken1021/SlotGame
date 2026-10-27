/** Offline scene-layout proof, not a Creator runtime screenshot or a new art asset. */
const fs=require('node:fs');const path=require('node:path');const {createRequire}=require('node:module');
const runtime=process.env.SLOT_SHARP_ROOT ? createRequire(path.resolve(process.env.SLOT_SHARP_ROOT,'package.json')) : require;
const sharp=runtime('sharp');
const root=path.resolve(__dirname,'..');const out=path.resolve(root,'../../outputs/goldenhen-scene');
const scene=JSON.parse(fs.readFileSync(path.join(root,'assets/Game/Scenes/GoldenHenMain.scene'),'utf8'));
const manifest=JSON.parse(fs.readFileSync(path.join(root,'tools/goldenhen-scene-manifest.json'),'utf8'));
const images=new Map(manifest.images.map(i=>[i.frame,`data:image/png;base64,${fs.readFileSync(path.join(root,'assets/Game/Art/AI',i.name)).toString('base64')}`]));
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
const rgb=c=>`rgb(${c.r},${c.g},${c.b})`;
const defs=[],body=[];
function visit(index,parentX=0,parentY=0){
 const n=scene[index];if(!n._active)return;
 const x=parentX+(n._lpos?.x??0),y=parentY+(n._lpos?.y??0);
 const cs=n._components.map(r=>scene[r.__id__]);const ui=cs.find(c=>c.__type__==='cc.UITransform');
 const w=ui?._contentSize.width??0,h=ui?._contentSize.height??0;
 const sprite=cs.find(c=>c.__type__==='cc.Sprite'),label=cs.find(c=>c.__type__==='cc.Label');
 const mask=cs.some(c=>c.__type__==='cc.Mask');
 if(mask){defs.push(`<clipPath id="m${index}"><rect x="${x-w/2}" y="${720-y-h/2}" width="${w}" height="${h}"/></clipPath>`);body.push(`<g clip-path="url(#m${index})">`);}
 if(sprite){
  const url=images.get(sprite._spriteFrame.__uuid__);
  if(url){
   if(n._name==='Symbol'){
    const cell=scene[n._parent.__id__],reel=scene[cell._parent.__id__];const col=Number(reel._name.split('_')[1]),row=Number(cell._name.split('_')[1]);
    const id=manifest.previewSymbols[col]?.[row];const tile=manifest.symbolSheet.ids.indexOf(id);
    if(tile>=0)body.push(`<svg x="${x-w/2}" y="${720-y-h/2}" width="${w}" height="${h}" viewBox="${(tile%3)*512+32} ${Math.floor(tile/3)*512+32} 448 448"><image href="${url}" width="1536" height="1024"/></svg>`);
   }else body.push(`<image href="${url}" x="${x-w/2}" y="${720-y-h/2}" width="${w}" height="${h}" preserveAspectRatio="none"/>`);
  } else body.push(`<rect x="${x-w/2}" y="${720-y-h/2}" width="${w}" height="${h}" rx="8" fill="${rgb(sprite._color)}" fill-opacity="${sprite._color.a/255}"/>`);
 }
 if(label&&label._string)body.push(`<text x="${x}" y="${720-y}" text-anchor="middle" dominant-baseline="central" font-family="Microsoft JhengHei,Arial,sans-serif" font-size="${label._fontSize}" font-weight="700" fill="${rgb(label._color)}">${esc(label._string)}</text>`);
 for(const child of n._children)visit(child.__id__,x,y);
 if(mask)body.push('</g>');
}
const canvas=scene.findIndex(n=>n._name==='Canvas');visit(canvas);
const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720"><defs>${defs.join('')}</defs>${body.join('')}</svg>`;
fs.mkdirSync(out,{recursive:true});
sharp(Buffer.from(svg)).png().toFile(path.join(out,'GoldenHen_layout_preview.png')).then(()=>console.log('Saved offline layout preview; not an engine screenshot.'));
