import * as T from 'three';
import './style.css';
import {batchEnvironment} from './world/optimize';
import {environment} from './world/environment';
import {buildings} from './world/buildings';
import {courtyardAtmosphere,contactShadow,QUALITY,type Quality} from './world/atmosphere';
import {COURTYARD,createCourtyardCollision} from './world/layout';
import {Actor} from './characters/actor';
import {Input} from './systems/input';
import {FollowCamera} from './systems/camera';
import {GameState} from './systems/state';
import {DEFAULTS,PixelPipeline,type Settings} from './art/pipeline';

function boot(){
 const params=new URLSearchParams(location.search);
 if(params.has('capture'))document.body.classList.add('capture');
 const canvas=document.querySelector<HTMLCanvasElement>('#world')!;
 const renderer=new T.WebGLRenderer({canvas,antialias:false,powerPreference:'high-performance'});
 renderer.setPixelRatio(1);renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;
 renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1;
 renderer.info.autoReset=false;
 const scene=new T.Scene();scene.background=new T.Color('#79836e');scene.fog=new T.FogExp2('#79836e',.018);
 const camera=new T.OrthographicCamera(-14,14,9.5,-9.5,.1,120),follow=new FollowCamera(camera);
 scene.add(new T.HemisphereLight('#cad1bb','#414b32',1.25));
 const sun=new T.DirectionalLight('#e3d4a6',1.75);sun.position.set(-10,24,12);sun.castShadow=true;
 sun.shadow.mapSize.set(1024,1024);Object.assign(sun.shadow.camera,{left:-24,right:24,top:24,bottom:-24,far:75});
 sun.shadow.normalBias=.035;sun.shadow.bias=-.0002;sun.shadow.radius=3;scene.add(sun);
 const root=new T.Group();scene.add(root);const collision=createCourtyardCollision();
 environment(root);buildings(root);batchEnvironment(root);
 const initialQuality:Quality=matchMedia('(pointer:coarse)').matches?'light':'balanced';
 const select=document.querySelector<HTMLSelectElement>('#quality')!;select.value=initialQuality;
 let quality:Quality=initialQuality;const plants=courtyardAtmosphere(scene,quality);
 const chef=new Actor('chef');chef.root.position.set(-.5,-.14,2);chef.root.rotation.y=.35;root.add(chef.root);
 const potato=new Actor('potato');potato.root.position.set(2.8,-.14,1.1);potato.root.rotation.y=.3;root.add(potato.root);
 // Static scenery shadows are cached; moving actors get a lightweight ground contact shadow instead.
 for(const actor of [chef,potato])actor.root.traverse(o=>{if(o instanceof T.Mesh)o.castShadow=false;});
 const chefShadow=contactShadow(scene,.55),potatoShadow=contactShadow(scene,.48);
 renderer.shadowMap.autoUpdate=false;renderer.shadowMap.needsUpdate=true;
 const settings:Settings={...DEFAULTS,renderScale:QUALITY[quality].scale,pixelSize:QUALITY[quality].pixels};
 const pipeline=new PixelPipeline(renderer,scene,camera);
 const input=new Input(),state=new GameState();
 const dialog=document.querySelector<HTMLDialogElement>('#instructions')!;
 document.querySelector('#help')!.addEventListener('click',()=>{input.clear();state.paused=true;dialog.showModal();});
 document.querySelector('#close-help')!.addEventListener('click',()=>dialog.close());
 dialog.addEventListener('close',()=>{state.paused=false;input.clear();});
 const label=document.querySelector<HTMLElement>('#potato-label')!,projected=new T.Vector3();
 const resize=()=>{follow.resize(innerWidth,innerHeight);pipeline.resize(innerWidth,innerHeight,settings);};
 window.addEventListener('resize',resize);resize();follow.target.set(chef.root.position.x,.6,chef.root.position.z-1.2);
 // Changing density reuses the deterministic layout and shared plant material; no scene reload.
 select.addEventListener('focus',()=>input.clear());
 select.addEventListener('change',()=>{
  const next=select.value as Quality;if(!(next in QUALITY))return;quality=next;
  const q=QUALITY[quality];plants.setQuality(quality);renderer.shadowMap.needsUpdate=true;settings.renderScale=q.scale;settings.pixelSize=q.pixels;resize();input.clear();
 });
 let disposed=false,lastTimestamp=performance.now(),frames=0,wallSeconds=0,fps=0,shadowPending=true;
 const still=params.has('still');
 canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();disposed=true;const error=document.querySelector<HTMLElement>('#error')!;error.hidden=false;error.textContent='画面连接中断，请刷新页面继续散步。';});
 function frame(now=performance.now()){
  if(disposed)return;requestAnimationFrame(frame);
  const rawDt=Math.max(0,(now-lastTimestamp)/1000),dt=Math.min(rawDt,.1);lastTimestamp=now;wallSeconds+=rawDt;frames++;
  if(frames%30===0){fps=Math.round(30/Math.max(wallSeconds,.001));wallSeconds=0;}
  state.update(dt);
  if(!state.paused&&!still){
   let x=input.x,y=input.y;const length=Math.hypot(x,y);
   if(length>.08){
    x/=Math.max(1,length);y/=Math.max(1,length);const speed=input.running?4.8:2.7;
    const dx=(x*.832+y*.555)*speed*dt,dz=(-x*.555+y*.832)*speed*dt;
    const px=chef.root.position.x,pz=chef.root.position.z;collision.move(chef.root.position,dx,dz);
    const moved=Math.hypot(chef.root.position.x-px,chef.root.position.z-pz)>.0001;
    const angle=Math.atan2(dx,dz);
    chef.root.rotation.y+=Math.atan2(Math.sin(angle-chef.root.rotation.y),Math.cos(angle-chef.root.rotation.y))*(1-Math.exp(-14*dt));
    chef.update(dt,moved?(input.running?'run':'walk'):'idle');
   }else chef.update(dt,'idle');
   potato.update(dt,'idle');
  }
  plants.update(still?0:state.elapsed);follow.update(chef.root.position,dt,pipeline.retro.resolution.x);
  chefShadow.position.set(chef.root.position.x,.02,chef.root.position.z);potatoShadow.position.set(potato.root.position.x,.02,potato.root.position.z);
  renderer.info.reset();pipeline.render();shadowPending=false;
  projected.copy(potato.root.position);projected.y=2.65;projected.project(camera);
  label.style.left=`${(projected.x*.5+.5)*innerWidth}px`;label.style.top=`${(-projected.y*.5+.5)*innerHeight}px`;
  label.hidden=projected.z>1||Math.abs(projected.x)>1||Math.abs(projected.y)>1;
 }
 const snapshot=()=>({player:{x:chef.root.position.x,z:chef.root.position.z},motion:chef.motion,potato:potato.motion,
  drawCalls:renderer.info.render.calls,triangles:renderer.info.render.triangles,obstacles:collision.obstacles.length,
  quality,grass:plants.meadow.grass.bladeCount,leaves:plants.leafCount,fps,area:{width:COURTYARD.width,depth:COURTYARD.depth},camera:camera.position.toArray(),shadowPending});
 if(import.meta.env.DEV){
  Object.defineProperty(window,'__potato',{value:snapshot,configurable:true});
  // Development-only navigation hook validates far-away collisions without waiting minutes in a software renderer.
  Object.defineProperty(window,'__courtyardTest',{value:{teleport:(x:number,z:number)=>{
   if(collision.blocked(x,z))throw new Error('Cannot place character inside an obstacle');chef.root.position.set(x,-.14,z);follow.target.set(x,.6,z-1.2);
  },blocked:(x:number,z:number)=>collision.blocked(x,z)},configurable:true});
 }
 frame();
}
try{boot();}catch(error){console.error(error);const el=document.querySelector<HTMLElement>('#error')!;el.hidden=false;el.textContent='小院暂时无法打开，请使用支持 WebGL2 的浏览器并开启硬件加速。';}
