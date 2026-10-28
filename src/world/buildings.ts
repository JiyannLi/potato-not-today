import * as T from 'three';
import {C,shape,beam} from './model';
import {CollisionWorld} from '../systems/collision';
export function buildings(root:T.Group,collision:CollisionWorld){
 const kitchen=new T.Group();kitchen.position.set(5,0,-5.7);root.add(kitchen);
 shape(kitchen,'box',C.stone,0,.07,0,7,.18,5.4,true);
 shape(kitchen,'box',C.cream,0,1.85,-2.35,7,3.6,.25,true);collision.add(5,-8.05,7,.3);
 shape(kitchen,'box',C.cream,3.38,1.85,-1,.25,3.6,2.8,true);collision.add(8.38,-6.7,.3,2.8);
 for(const x of [-3.25,3.25]){shape(kitchen,'box',C.dark,x,1.7,2.25,.2,3.4,.2,true);collision.add(x+5,-3.45,.3,.3);}
 shape(kitchen,'box',C.wood,0,3.3,2.25,7,.23,.25,true);
 // Open door frame retained for future stretching animation.
 for(const x of [-2.5,-.8]){shape(kitchen,'box',C.wood,x,1.45,-2.12,.16,2.8,.15,true);}
 shape(kitchen,'box',C.wood,-1.65,2.8,-2.12,1.85,.18,.18,true);
 shape(kitchen,'box','#786b4d',-1.65,1.36,-2.19,1.5,2.65,.07);
 shape(kitchen,'box',C.wood,1.35,2.1,-2.15,1.9,1.3,.15,true);
 shape(kitchen,'box','#8aaba1',1.35,2.1,-2.04,1.6,1.08,.04);
 shape(kitchen,'box',C.cream,1.35,2.1,-1.99,.08,1.1,.06);shape(kitchen,'box',C.cream,1.35,2.1,-1.99,1.6,.08,.06);
 // Tiled pitched roof, repeated geometry and material reused.
 for(const side of [-1]){const roof=shape(kitchen,'box',C.roof,0,4.15,side*1.42,7.7,.18,3.15,true);roof.rotation.x=side*.37;
 for(let i=0;i<17;i++)for(let j=0;j<4;j++){const tile=shape(kitchen,'box',j%2?'#bd7151':'#c67b55',-3.65+i*.455,4.69-j*.275,side*(.25+j*.72),.43,.13,.8);tile.rotation.x=side*.37;}}
 shape(kitchen,'box','#bcaa88',2.5,4.65,-1, .65,2,.65,true);shape(kitchen,'box',C.dark,2.5,5.65,-1,.8,.18,.8);
 // Stove and prominent pot face the open yard.
 shape(kitchen,'box','#b8ad90',1.9,.6,-.5,1.9,1.1,1.15,true);collision.add(6.9,-6.2,1.9,1.15);
 shape(kitchen,'box','#4c4d43',1.9,1.19,-.5,2,.14,1.2,true);shape(kitchen,'box','#65543f',1.9,.55,.09,.75,.5,.04,true);
 const pot=shape(kitchen,'cylinder','#303d3a',1.9,1.58,-.5,.64,.7,.64);shape(kitchen,'cylinder','#192b28',1.9,1.94,-.5,.59,.025,.59);
 const rim=new T.Mesh(new T.TorusGeometry(.63,.055,6,16),pot.material);rim.rotation.x=Math.PI/2;rim.position.set(1.9,1.94,-.5);kitchen.add(rim);
 for(const x of [1.06,2.74])shape(kitchen,'box','#303d3a',x,1.72,-.5,.42,.14,.2,true);
 shape(kitchen,'box',C.wood,-1.6,1.05,.5,2.1,.16,1.05,true);collision.add(3.4,-5.2,2.1,1.05);
 for(const x of [-2.4,-.8])for(const z of [.12,.88])shape(kitchen,'box',C.dark,x,.53,z,.13,1,.13);
 shape(kitchen,'cylinder','#e6cf95',-1.65,1.23,.5,.38,.17,.38);for(let i=0;i<3;i++)shape(kitchen,'ball','#d4a052',-1.85+i*.2,1.4,.5,.15,.15,.15);
 for(let i=0;i<3;i++){shape(kitchen,'cylinder',['#c59a6b','#e2c993','#7c987b'][i],-.4+i*.4,2.4,-1.95,.13,.28,.13);}
 // Garden beds, vegetables and potato patch.
 for(let row=0;row<3;row++){const x=-8+row*1.5;shape(root,'box',C.soil,x,.09,-4.5,1.1,.18,5,true);collision.add(x,-4.5,1.05,5);
 for(let i=0;i<6;i++){const z=-6.5+i*.8;if(row===2){shape(root,'ball','#c3a06a',x,.22,z,.25,.18,.22);}else{for(let j=0;j<4;j++){const leaf=shape(root,'ball',j%2?'#657e45':'#8ca660',x+Math.sin(j*1.57)*.15,.3,z+Math.cos(j*1.57)*.15,.21,.33,.16);leaf.rotation.z=Math.sin(j*1.57)*.5;}}}}
 shape(root,'cylinder','#b98a52',-4.4,.28,-6.8,.46,.52,.4);shape(root,'cylinder','#69513c',-4.4,.55,-6.8,.37,.02,.32);
 // Tree and swing, generous open central lawn.
 shape(root,'cylinder',C.wood,-8,1.9,3.4,.38,3.8,.44);collision.add(-8,3.4,.9,.9);
 beam(root,new T.Vector3(-8,2.2,3.4),new T.Vector3(-6.6,4.4,3.4),.18,C.wood);
 for(const [x,y,z,s] of [[-8,4.7,3.4,1.7],[-9,4.1,3,1.4],[-6.8,4.8,3.5,1.35],[-8.4,5.6,3.6,1.2],[-7.3,4.3,4.4,1.2]])shape(root,'ball',x<-8?'#8d9c53':'#a4b368',x,y,z,s,s*.8,s);
 for(const x of [-7.4,-6.3])shape(root,'cylinder','#cbb88d',x,2.35,3.5,.025,2.7,.025);
 shape(root,'box',C.wood,-6.85,1,3.5,1.5,.16,.65,true);
 // Bench.
 shape(root,'box',C.wood,-7, .75,6.3,2.8,.2,.8,true);shape(root,'box',C.wood,-7,1.3,6.65,2.8,.7,.12,true);for(const x of [-8,-6])shape(root,'box',C.dark,x,.36,6.3,.15,.7,.65);collision.add(-7,6.3,2.8,.8);
}
