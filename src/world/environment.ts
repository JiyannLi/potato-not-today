import * as T from 'three';
import {C,shape,material,seeded} from './model';
import {CollisionWorld} from '../systems/collision';
export function environment(root:T.Group,collision:CollisionWorld){
 shape(root,'box','#b5a181',0,-.46,0,24, .9,20,true);shape(root,'box',C.grass,0,.015,0,23.9,.12,19.9);
 const random=seeded(),dummy=new T.Object3D();
 function instances(geo:T.BufferGeometry,color:string,transforms:number[][]){const mesh=new T.InstancedMesh(geo,material(color),transforms.length);for(let i=0;i<transforms.length;i++){const [x,y,z,sx,sy,sz,ry]=transforms[i];dummy.position.set(x,y,z);dummy.scale.set(sx,sy,sz);dummy.rotation.set(0,ry||0,0);dummy.updateMatrix();mesh.setMatrixAt(i,dummy.matrix);}mesh.receiveShadow=true;mesh.castShadow=true;root.add(mesh);}
 const grass:number[][]=[],flowers:number[][]=[],centers:number[][]=[];
 for(let i=0;i<650;i++){const x=(random()-.5)*22.7,z=(random()-.5)*18.8;if((x>-.8&&x<3&&z>0)||(x>1&&z< -2)||(x< -4&&z< -1.4))continue;const border=Math.abs(x)>8.8||Math.abs(z)>7.7;if(!border&&random()>.19)continue;const s=.08+random()*.11;grass.push([x,.13,z,s,.15+random()*.2,s,random()*6]);if(i%4===0){flowers.push([x,.28,z,.11,.045,.11,0]);centers.push([x,.32,z,.04,.04,.04,0]);}}
 instances(new T.ConeGeometry(1,1,3), '#789353',grass);instances(new T.IcosahedronGeometry(1,0),'#f2e9bd',flowers);instances(new T.IcosahedronGeometry(1,0),'#d5b456',centers);
 const posts:number[][]=[],rails:number[][]=[];
 for(let i=0;i<13;i++){const x=-11.5+i*1.92;for(const z of [-9.6,9.6]){if(z>0&&Math.abs(x)<2.5)continue;posts.push([x,.65,z,.16,1.3,.18,0]);if(i<12&&!(z>0&&Math.abs(x)<3.7))for(const y of [.4,.95])rails.push([x+.96,y,z,1.92,.12,.12,0]);}}
 for(let i=0;i<10;i++){const z=-9.6+i*1.92;for(const x of [-11.5,11.5]){posts.push([x,.65,z,.18,1.3,.16,0]);if(i<9)for(const y of [.4,.95])rails.push([x,y,z+.96,.12,.12,1.92,0]);}}
 instances(new T.BoxGeometry(1,1,1),'#d4bd8e',posts);instances(new T.BoxGeometry(1,1,1),'#c5ad7c',rails);
 // Open entrance gate set at an angle, with a mailbox.
 const gate=new T.Group();gate.position.set(2.5,0,9.5);gate.rotation.y=-.65;root.add(gate);for(let i=0;i<5;i++)shape(gate,'box',C.wood,-i*.4,.6,0,.32,1.15,.14,true);shape(gate,'box',C.dark,-.8,.6,.1,2,.13,.1);
 shape(root,'box',C.wood,-2.9,.6,9.2,.14,1.4,.14);shape(root,'box','#ac644c',-2.9,1.4,9.2,.65,.55,.55,true);shape(root,'box',C.cream,-2.9,1.4,9.49,.3,.04,.02);
 for(let i=0;i<10;i++){const z=8.8-i*1.28,x=1+Math.sin(i*.64)*.65;const m=shape(root,'cylinder',i%2?'#c5bca0':'#d4c8aa',x,.105,z,.69,.11,.47,true);m.rotation.y=random()*2;}
 for(const [x,z,s] of [[-9,7, .7],[-4.4,-1.7,.48],[9,4,.6],[-9,-8,.6],[9,-8,.8]]){shape(root,'ball','#a9aa91',x,.3,z,s,s*.7,s*.7);collision.add(x,z,s*1.4,s*1.1);}

}
