import * as T from 'three';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';
import {createMeadow,createTrees} from '../art/vegetation';
import {COURTYARD,courtyardCoverage} from './layout';

export const QUALITY={
 light:{density:14,scale:.5,pixels:1,cards:70,segments:2},
 balanced:{density:28,scale:.75,pixels:2,cards:105,segments:2},
 rich:{density:44,scale:1,pixels:2,cards:150,segments:3},
} as const;
export type Quality=keyof typeof QUALITY;

export function courtyardAtmosphere(scene:T.Scene,quality:Quality){
 const q=QUALITY[quality];
 const meadow=createMeadow(scene,{
  width:COURTYARD.width,depth:COURTYARD.depth,flat:true,trail:false,
  density:q.density,segments:q.segments,minHeight:.14,maxHeight:.44,
  coverage:courtyardCoverage,
  clusters:[[-13,7],[-13,-4],[-5,-10],[3,-11],[13,7],[12,0],[-5,9],[6,10],[-4,3]],
 });
 let treesRoot=new T.Group(),leafCount=0;
 function rebuildTrees(next:Quality){
  const geometry=new Set<T.BufferGeometry>(),materials=new Set<T.Material>(),textures=new Set<T.Texture>();
  treesRoot.traverse(o=>{if(o instanceof T.Mesh){geometry.add(o.geometry);for(const m of Array.isArray(o.material)?o.material:[o.material]){materials.add(m);for(const value of Object.values(m))if(value instanceof T.Texture)textures.add(value);}if(o instanceof T.InstancedMesh)o.dispose();}});
  scene.remove(treesRoot);geometry.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());textures.forEach(t=>t.dispose());
  treesRoot=new T.Group();scene.add(treesRoot);
  const trees=createTrees(treesRoot,{trees:COURTYARD.trees,shrubs:COURTYARD.shrubs,flat:true,cardsPerBranch:QUALITY[next].cards,shrubCards:90});
  const trunks=new T.Mesh(mergeGeometries(trees.branches),trees.trunkMat);
  trunks.castShadow=trunks.receiveShadow=true;treesRoot.add(trunks);
  trees.branches.forEach(g=>g.dispose());trees.darkBark.dispose();leafCount=trees.leafCount;
 }
 rebuildTrees(quality);
 // Blend the finite playable yard into a soft forest floor beyond its fence.
 const outerMap=(meadow.ground.material.map as T.Texture).clone();outerMap.repeat.set(18,18);
 const surrounding=new T.Mesh(new T.PlaneGeometry(120,120),new T.MeshStandardMaterial({map:outerMap,color:'#bbc2a3',roughness:1}));
 surrounding.rotation.x=-Math.PI/2;surrounding.position.y=-.04;surrounding.receiveShadow=true;scene.add(surrounding);
 return {meadow,get leafCount(){return leafCount;},setQuality:(next:Quality)=>{
  const value=QUALITY[next];meadow.grass.setOptions({density:value.density,blade:{segments:value.segments}});
  meadow.grass.blades.castShadow=false;rebuildTrees(next);
 },update:(time:number)=>meadow.grass.update(time)};
}

/** Moving contact shadows preserve grounding without rendering the forest shadow map every frame. */
export function contactShadow(scene:T.Scene,radius:number){
 const canvas=document.createElement('canvas');canvas.width=canvas.height=64;
 const ctx=canvas.getContext('2d')!,gradient=ctx.createRadialGradient(32,32,2,32,32,31);
 gradient.addColorStop(0,'rgba(22,30,19,.5)');gradient.addColorStop(1,'rgba(22,30,19,0)');
 ctx.fillStyle=gradient;ctx.fillRect(0,0,64,64);
 const mesh=new T.Mesh(new T.PlaneGeometry(radius*2,radius*2),new T.MeshBasicMaterial({map:new T.CanvasTexture(canvas),transparent:true,depthWrite:false}));
 mesh.rotation.x=-Math.PI/2;mesh.position.y=.02;scene.add(mesh);return mesh;
}
