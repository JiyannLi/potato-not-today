import * as T from 'three';
import {shape} from '../world/model';
export type Motion='idle'|'walk'|'run';
export class Actor {
 readonly root=new T.Group();readonly body=new T.Group();readonly arms:T.Group[]=[];readonly legs:T.Group[]=[];
 readonly accessories=new T.Group();readonly face=new T.Group();readonly eyes:T.Mesh[]=[];
 motion:Motion='idle';private time=0;
 constructor(readonly kind:'chef'|'potato'){
 this.root.add(this.body);this.body.add(this.face,this.accessories);
 if(kind==='chef')this.chef();else this.potato();
 }
 private limb(list:T.Group[],x:number,y:number,color:string,length:number,width:number,z=0){const pivot=new T.Group();pivot.position.set(x,y,z);this.body.add(pivot);shape(pivot,'cylinder',color,0,-length/2,0,width,length,width);list.push(pivot);return pivot;}
 private chef(){
 shape(this.body,'cylinder','#f5ecd6',0,1.12,0,.3,.7,.25);
 shape(this.body,'cylinder','#947254',0,.8,0,.34,.48,.29);
 shape(this.body,'box','#a87c55',0,1.04,.245,.43,.57,.045,true);
 for(const x of [-.19,.19]){this.limb(this.legs,x,.64,'#f3dfbe',.35,.095);shape(this.legs.at(-1)!,'box','#4d483e',0,-.38,.07,.22,.19,.36,true);}
 for(const x of [-.39,.39]){const arm=this.limb(this.arms,x,1.4,'#f4ead7',.36,.12);shape(arm,'ball','#e6b68e',0,-.39,0,.13,.14,.12);}
 shape(this.body,'ball','#e8bf99',0,1.84,0,.36,.4,.32);
 shape(this.body,'ball','#604735',0,2,-.085,.37,.32,.3);
 shape(this.body,'ball','#604735',0,1.69,-.34,.25,.24,.2);
 shape(this.body,'ball','#e8bf99',0,1.85,.12,.3,.31,.26);
 for(const x of [-.12,.12]){this.eyes.push(shape(this.face,'ball','#3d3d32',x,1.88,.365,.035,.06,.025));shape(this.face,'ball','#d69b7d',x*1.65,1.77,.33,.06,.025,.02);}
 shape(this.face,'ball','#9c6651',0,1.74,.385,.035,.02,.015);
 const fringe=shape(this.body,'ball','#604735',-.13,2.09,.23,.24,.14,.12);fringe.rotation.z=.35;
 shape(this.body,'cylinder','#fff6df',0,2.23,0,.37,.26,.34);
 for(const [x,y,z,s] of [[-.23,2.4,0,.25],[.2,2.43,0,.27],[0,2.51,0,.29],[0,2.42,-.18,.25]])shape(this.body,'ball','#fff8e7',x,y,z,s,s*.9,s);
 shape(this.body,'ball','#b86549',0,1.46,.28,.09,.08,.05);for(const x of [-.09,.09]){const tie=shape(this.body,'box','#bc7150',x,1.37,.29,.12,.22,.05);tie.rotation.z=x>0?.3:-.3;}
 }
 private potato(){
 const geo=new T.IcosahedronGeometry(1,2),p=geo.attributes.position;
 for(let i=0;i<p.count;i++){const x=p.getX(i),y=p.getY(i),z=p.getZ(i);const n=1+.045*Math.sin(x*9+y*4)*Math.cos(z*7);p.setXYZ(i,x*n*.57,y*n*.68,z*n*.49);}geo.computeVertexNormals();
 const mesh=new T.Mesh(geo,new T.MeshStandardMaterial({color:'#d1aa66',roughness:1,flatShading:true}));mesh.position.y=1.05;mesh.castShadow=true;this.body.add(mesh);
 for(const x of [-.22,.22]){const leg=this.limb(this.legs,x,.54,'#95704a',.32,.055);shape(leg,'ball','#94704b',0,-.32,.07,.13,.075,.18);}
 for(const x of [-.54,.54]){const arm=this.limb(this.arms,x,1.15,'#aa7d4f',.35,.045);arm.rotation.z=x>0?.45:-.45;shape(arm,'ball','#aa7d4f',0,-.37,0,.09,.09,.08);}
 for(const x of [-.2,.2]){const eye=shape(this.face,'ball','#fff5dc',x,1.22,.437,.16,.19,.07);this.eyes.push(eye);shape(eye,'ball','#303b2c',.08,0,.84,.38,.5,.38);}
 shape(this.face,'ball','#674d37',0,.98,.49,.07,.09,.018);
 for(let i=0;i<20;i++){const a=i*2.399,y=.62+(i%6)*.16,r=Math.sqrt(Math.max(.1,1-((y-1.05)/.7)**2));shape(this.body,'ball','#b28d52',Math.sin(a)*.56*r,y,Math.cos(a)*.49*r,.025,.034,.015);}
 shape(this.accessories,'cylinder','#708345',0,1.81,0,.025,.28,.025);for(const x of [-.14,.14]){const leaf=shape(this.accessories,'ball',x>0?'#94a854':'#778c43',x,1.94,0,.2,.065,.1);leaf.rotation.z=x>0?.4:-.4;}
 }
 update(dt:number,motion:Motion=this.motion){this.motion=motion;this.time+=dt;const t=this.time;const moving=motion!=='idle',run=motion==='run',phase=t*(run?15:9),amp=moving?(run?.8:.48):.025;for(let i=0;i<2;i++){this.legs[i].rotation.x=Math.sin(phase+i*Math.PI)*amp;this.arms[i].rotation.x=Math.sin(phase+(1-i)*Math.PI)*amp*.8;}
 this.body.position.y=moving?Math.abs(Math.sin(phase))*(run?.11:.05):Math.sin(t*2)*.025;this.body.rotation.z=this.kind==='potato'?Math.sin(t*(moving?9:2))*(moving?.09:.045):Math.sin(t*2)*.012;this.body.rotation.x=run?.1:0;
 const blink=t%4.7>4.52?.09:1;for(const e of this.eyes)e.scale.y=(this.kind==='potato'?.19:.06)*blink;
 }
}
