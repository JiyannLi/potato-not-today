import * as T from 'three';
const materials = new Map<string,T.MeshStandardMaterial>();
export function material(color:string){ let m=materials.get(color); if(!m){m=new T.MeshStandardMaterial({color,roughness:1,flatShading:false});materials.set(color,m);}return m; }
const box=new T.BoxGeometry(1,1,1), sphere=new T.SphereGeometry(1,12,8), cylinder=new T.CylinderGeometry(1,1,1,8);
export function shape(parent:T.Object3D,type:'box'|'ball'|'cylinder',color:string,x:number,y:number,z:number,sx:number,sy:number,sz:number,_outline=false){const mesh=new T.Mesh(type==='box'?box:type==='ball'?sphere:cylinder,material(color));mesh.position.set(x,y,z);mesh.scale.set(sx,sy,sz);mesh.castShadow=true;mesh.receiveShadow=true;parent.add(mesh);return mesh;}
export function beam(p:T.Object3D,a:T.Vector3,b:T.Vector3,width:number,color:string){const m=shape(p,'cylinder',color,0,0,0,width,a.distanceTo(b),width);m.position.copy(a).add(b).multiplyScalar(.5);m.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),b.clone().sub(a).normalize());return m;}
export function seeded(seed=76){return ()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};}
export const C={wood:'#7c7259',dark:'#414b3c',cream:'#b9b49a',roof:'#8f624a',grass:'#5d6d43',leaf:'#667846',soil:'#5f5540',stone:'#989986'};
