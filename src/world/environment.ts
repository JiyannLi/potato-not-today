import * as T from 'three';
import {C,shape,material,seeded} from './model';
import {COURTYARD} from './layout';

/** Yard structures only; the shared atmospheric layer supplies ground and plants. */
export function environment(root:T.Group){
 const random=seeded(76),dummy=new T.Object3D();
 function instances(color:string,transforms:number[][]){
  const mesh=new T.InstancedMesh(new T.BoxGeometry(1,1,1),material(color),transforms.length);
  for(let i=0;i<transforms.length;i++){
   const [x,y,z,sx,sy,sz]=transforms[i];
   dummy.position.set(x,y,z);dummy.scale.set(sx,sy,sz);dummy.updateMatrix();mesh.setMatrixAt(i,dummy.matrix);
  }
  mesh.receiveShadow=true;mesh.castShadow=true;root.add(mesh);
 }
 const posts:number[][]=[],rails:number[][]=[];
 for(let i=0;i<=16;i++){
  const x=-15.5+i*31/16;
  for(const z of [-13,13]){
   if(z>0&&Math.abs(x)<2.5)continue;
   posts.push([x,.65,z,.16,1.3,.18]);
   if(i<16&&!(z>0&&x> -3&&x<2))for(const y of [.4,.95])rails.push([x+31/32,y,z,31/16,.12,.12]);
  }
 }
 for(let i=0;i<=13;i++){
  const z=-13+i*2;
  for(const x of [-15.5,15.5]){
   posts.push([x,.65,z,.18,1.3,.16]);
   if(i<13)for(const y of [.4,.95])rails.push([x,y,z+1,.12,.12,2]);
  }
 }
 instances('#a3a08a',posts);instances('#878f73',rails);
 // Low rear garden fence; the sides facing the central routes remain open.
 const gardenFence=new T.Group();root.add(gardenFence);
 for(const x of [-12.1,-10.2,-8.3,-6.4]){
  shape(gardenFence,'box',C.wood,x,.5,-11,.13,1,.13);
 }
 for(const y of [.35,.8])shape(gardenFence,'box',C.wood,-9.25,y,-11,5.7,.1,.1);
 const gate=new T.Group();gate.position.set(2.5,0,12.9);gate.rotation.y=-.65;root.add(gate);
 for(let i=0;i<5;i++)shape(gate,'box',C.wood,-i*.4,.6,0,.32,1.15,.14);
 shape(gate,'box',C.dark,-.8,.6,.1,2,.13,.1);
 shape(root,'box',C.wood,-2.9,.6,12.6,.14,1.4,.14);
 shape(root,'box','#8b6451',-2.9,1.4,12.6,.65,.55,.55);
 shape(root,'box',C.cream,-2.9,1.4,12.89,.3,.04,.02);
 // Stepping stones branch to both functional areas. Flat stones never block movement.
 for(let i=0;i<15;i++){
  const z=12-i*1.18,x=1+Math.sin(z*.25)*.65;
  const stone=shape(root,'cylinder',i%2?'#969783':'#a7a68d',x,.055,z,.62,.1,.43);
  stone.rotation.y=random()*2;
 }
 for(let i=0;i<13;i++){
  const stone=shape(root,'cylinder',i%2?'#8f9580':'#9da28c',-8.5+i*1.36,.045,-4.2+Math.sin(i)*.14,.51,.08,.37);
  stone.rotation.y=random()*3;
 }
 for(const [x,z,s] of COURTYARD.rocks)shape(root,'ball','#7e8773',x,.27,z,s,s*.7,s*.7);
}
