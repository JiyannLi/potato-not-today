import * as T from 'three';
const materials = new Map<string,T.MeshStandardMaterial>();
export function material(color:string){ let m=materials.get(color); if(!m){m=new T.MeshStandardMaterial({color,roughness:1,flatShading:true});materials.set(color,m);}return m; }
const box=new T.BoxGeometry(1,1,1), sphere=new T.IcosahedronGeometry(1,1), cylinder=new T.CylinderGeometry(1,1,1,8);
export function shape(parent:T.Object3D,type:'box'|'ball'|'cylinder',color:string,x:number,y:number,z:number,sx:number,sy:number,sz:number,outline=false){const mesh=new T.Mesh(type==='box'?box:type==='ball'?sphere:cylinder,material(color));mesh.position.set(x,y,z);mesh.scale.set(sx,sy,sz);mesh.castShadow=true;mesh.receiveShadow=true;parent.add(mesh);if(outline&&type==='box'){const edges=new T.LineSegments(new T.EdgesGeometry(box),new T.LineBasicMaterial({color:'#554b3b',transparent:true,opacity:.28}));mesh.add(edges);}return mesh;}
export function beam(p:T.Object3D,a:T.Vector3,b:T.Vector3,width:number,color:string){const m=shape(p,'cylinder',color,0,0,0,width,a.distanceTo(b),width);m.position.copy(a).add(b).multiplyScalar(.5);m.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),b.clone().sub(a).normalize());return m;}
export function seeded(seed=76){return ()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};}
export const C={wood:'#97704c',dark:'#564434',cream:'#eee0b8',roof:'#b96545',grass:'#94a866',leaf:'#7b934e',soil:'#927255',stone:'#c8bea1'};
