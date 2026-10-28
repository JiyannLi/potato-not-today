import * as T from 'three';
import {GrassLayer} from './vendor/grass/GrassLayer';
import {seeded} from '../world/model';

export function groundHeight(x:number,z:number){return Math.sin(x*.3)*Math.cos(z*.22)*.16+Math.sin(z*.43)*.05;}
export function trailX(z:number){return Math.sin(z*.24)*1.3+.7;}
export function coverage(x:number,z:number){
 const path=Math.abs(x-trailX(z));
 const patches=.56+.25*Math.sin(x*.73+z*.21)+.19*Math.cos(z*.8-x*.24);
 return T.MathUtils.smoothstep(path,.35,1.3)*T.MathUtils.clamp(patches,.15,1);
}
function texture(draw:(ctx:CanvasRenderingContext2D)=>void,size=64){const c=document.createElement('canvas');c.width=c.height=size;draw(c.getContext('2d')!);const t=new T.CanvasTexture(c);t.colorSpace=T.SRGBColorSpace;return t;}
export interface MeadowOptions {
 width?:number; depth?:number; density?:number; flat?:boolean; trail?:boolean;
 coverage?:(x:number,z:number)=>number; clusters?:number[][];
 minHeight?:number; maxHeight?:number; segments?:number;
}
export function createMeadow(scene:T.Object3D, options:MeadowOptions={}){
 const width=options.width??36,depth=options.depth??44;
 const height=options.flat?()=>0:groundHeight;
 const cover=options.coverage??coverage;
 const rand=seeded(1207), groundGeo=new T.PlaneGeometry(width,depth,options.flat?32:72,options.flat?28:88);groundGeo.rotateX(-Math.PI/2);const pos=groundGeo.attributes.position;
 for(let i=0;i<pos.count;i++)pos.setY(i,height(pos.getX(i),pos.getZ(i)));groundGeo.computeVertexNormals();
 const map=texture(ctx=>{for(let y=0;y<256;y++)for(let x=0;x<256;x++){const n=rand(),patch=Math.sin(x*.06)*Math.cos(y*.04);ctx.fillStyle=`rgb(${61+n*15+patch*8},${68+n*14+patch*7},${42+n*11+patch*4})`;ctx.fillRect(x,y,1,1);}},256);map.wrapS=map.wrapT=T.RepeatWrapping;map.repeat.set(5,6);
 const ground=new T.Mesh(groundGeo,new T.MeshStandardMaterial({map,roughness:1}));ground.receiveShadow=true;scene.add(ground);
 // Narrow, irregular earthy trace with the same height function. Vertex colors avoid a uniform stripe.
 const colors:number[]=[],verts:number[]=[],indices:number[]=[];
 for(let i=0;i<=180;i++){const z=-depth/2+i*depth/180;for(const side of [-1,1]){const x=trailX(z)+side*(.5+.15*Math.sin(z*1.2));verts.push(x,height(x,z)+.014,z);const color=new T.Color().setHSL(.11,.13,.2+rand()*.025);colors.push(color.r,color.g,color.b);}if(i<180){const j=i*2;indices.push(j,j+2,j+1,j+1,j+2,j+3);}}
 const pathGeo=new T.BufferGeometry();pathGeo.setAttribute('position',new T.Float32BufferAttribute(verts,3));pathGeo.setAttribute('color',new T.Float32BufferAttribute(colors,3));pathGeo.setIndex(indices);pathGeo.computeVertexNormals();const path=new T.Mesh(pathGeo,new T.MeshStandardMaterial({vertexColors:true,roughness:1,side:T.DoubleSide}));path.receiveShadow=true;if(options.trail!==false)scene.add(path);else{pathGeo.dispose();(path.material as T.Material).dispose();}
 const grass=new GrassLayer({surface:ground,density:options.density??65,seed:1207,coverage:{sample:p=>cover(p.position.x,p.position.z)},blade:{minWidth:.035,maxWidth:.075,minHeight:options.minHeight??.25,maxHeight:options.maxHeight??.65,segments:options.segments??3,lean:.15},wind:{strength:.055,speed:.65,frequency:.42,turbulence:.12,lean:.015},colors:{bottom:'#303e24',top:'#7c8653',backlight:'#8c9766'},lighting:{intensity:1.1,backlightStrength:.12},shadow:true});scene.add(grass);grass.blades.castShadow=false;
 const flowerMap=texture(ctx=>{ctx.fillStyle='#d4d6b5';for(let i=0;i<5;i++){const a=i*Math.PI*2/5;ctx.beginPath();ctx.ellipse(32+Math.cos(a)*13,32+Math.sin(a)*13,10,5,a,0,Math.PI*2);ctx.fill();}ctx.fillStyle='#b6ad70';ctx.fillRect(29,29,6,6);});
 const blooms=new T.InstancedMesh(new T.PlaneGeometry(.19,.19),new T.MeshStandardMaterial({map:flowerMap,alphaTest:.5,side:T.DoubleSide,roughness:1}),900);
 const stems=new T.InstancedMesh(new T.CylinderGeometry(.008,.013,1,3),new T.MeshStandardMaterial({color:'#6d7c4e'}),900);const d=new T.Object3D();let count=0;
 const clusters=options.clusters??[[-4,3],[-2,-5],[4,1],[5,-7],[-7,-6],[2,6],[7,7],[-5,9],[0,-13]];
 for(const [cx,cz] of clusters)for(let i=0;i<85;i++){const a=rand()*Math.PI*2,r=Math.sqrt(rand())*1.65,x=cx+Math.cos(a)*r,z=cz+Math.sin(a)*r;if(cover(x,z)<.1)continue;const h=.28+rand()*.25,y=height(x,z);d.position.set(x,y+h,z);d.rotation.set(-Math.PI*.34,rand()*6,.1);d.scale.setScalar(.8+rand()*.5);d.updateMatrix();blooms.setMatrixAt(count,d.matrix);d.position.y=y+h/2;d.rotation.set(0,0,0);d.scale.set(1,h,1);d.updateMatrix();stems.setMatrixAt(count,d.matrix);count++;}
 blooms.count=stems.count=count;blooms.receiveShadow=true;scene.add(blooms,stems);
 return {ground,grass,flowers:count,setDensity:(v:number)=>{grass.setOptions({density:v});grass.blades.castShadow=false;}};
}
export interface TreeOptions {
 trees?:{x:number;z:number;h:number}[]; shrubs?:[number,number][];
 flat?:boolean; cardsPerBranch?:number; shrubCards?:number;
}
export function createTrees(scene:T.Object3D,options:TreeOptions={}){
 const height=options.flat?()=>0:groundHeight;
 const cards=options.cardsPerBranch??210,shrubCards=options.shrubCards??180;
 const trees=options.trees??[{x:-6,z:1,h:9},{x:5,z:-6,h:10.5},{x:-3,z:-15,h:11}];
 const shrubs=options.shrubs??[[-7,6],[7,3],[-6,-8],[7,-13],[-8,-14],[6,9]];
 const rand=seeded(208),d=new T.Object3D();
 const leafMap=texture(ctx=>{const shades=['#a5ac87','#819064','#c1c49c','#96a176'];for(let i=0;i<32;i++){const x=rand()*60,y=rand()*60;ctx.fillStyle=shades[i%4];ctx.beginPath();ctx.ellipse(x,y,3+rand()*5,2+rand()*3,rand()*Math.PI,0,Math.PI*2);ctx.fill();}});
 const leafMat=new T.MeshStandardMaterial({map:leafMap,color:'#e1e3c7',alphaTest:.5,side:T.DoubleSide,roughness:1});
 const leaves=new T.InstancedMesh(new T.PlaneGeometry(1,1),leafMat,trees.length*8*cards+shrubs.length*shrubCards);let leafCount=0;
 const bark=texture(ctx=>{ctx.fillStyle='#95998a';ctx.fillRect(0,0,64,64);for(let i=0;i<75;i++){ctx.fillStyle=i%3?'#4b5246':'#bbc0ae';ctx.fillRect(rand()*64,rand()*64,2+rand()*16,1+rand()*2);}});bark.wrapS=bark.wrapT=T.RepeatWrapping;bark.repeat.set(1,6);
 const trunkMat=new T.MeshStandardMaterial({map:bark,roughness:1});const darkBark=new T.MeshStandardMaterial({color:'#414b38',roughness:1});
 const branches:T.BufferGeometry[]=[];const twig=(a:T.Vector3,b:T.Vector3,r1:number,r2:number)=>{const g=new T.CylinderGeometry(r2,r1,a.distanceTo(b),7,2);g.applyQuaternion(new T.Quaternion().setFromUnitVectors(new T.Vector3(0,1,0),b.clone().sub(a).normalize()));g.translate((a.x+b.x)/2,(a.y+b.y)/2,(a.z+b.z)/2);branches.push(g);};

 for(const {x,z,h} of trees){const base=height(x,z);const top=new T.Vector3(x+.4,base+h,z);twig(new T.Vector3(x,base,z),top,.24,.055);
 for(let i=0;i<8;i++){const a=i*2.399,level=.36+i*.065,len=1.3+rand()*1.4;const start=new T.Vector3(x+.4*level,base+h*level,z),end=new T.Vector3(x+Math.cos(a)*len,base+h*(level+.17),z+Math.sin(a)*len);twig(start,end,.065,.017);
 for(let j=0;j<cards;j++){const angle=rand()*Math.PI*2,r=Math.sqrt(rand())*1.75;d.position.set(end.x+Math.cos(angle)*r,end.y+(rand()-.5)*1.7,end.z+Math.sin(angle)*r);d.rotation.set((rand()-.5)*2,rand()*Math.PI*2,(rand()-.5)*1.4);d.scale.setScalar(.6+rand()*.6);d.updateMatrix();leaves.setMatrixAt(leafCount,d.matrix);leaves.setColorAt(leafCount,new T.Color().setHSL(.21+rand()*.035,.16+rand()*.1,.56+rand()*.18));leafCount++;}}
 }
 // Dark lower shrubs made from the same leaf cards, no sphere crowns.
 for(const [x,z] of shrubs)for(let j=0;j<shrubCards;j++){const a=rand()*6.28,r=Math.sqrt(rand())*1.5;d.position.set(x+Math.cos(a)*r,height(x,z)+.25+rand()*.95,z+Math.sin(a)*r);d.rotation.set(rand()*2,rand()*6,rand());d.scale.setScalar(.55+rand()*.4);d.updateMatrix();leaves.setMatrixAt(leafCount,d.matrix);leaves.setColorAt(leafCount,new T.Color('#a6b58a'));leafCount++;}
 leaves.count=leafCount;leaves.castShadow=true;leaves.receiveShadow=true;scene.add(leaves);
 return {branches,trunkMat,darkBark,leafCount};
}
