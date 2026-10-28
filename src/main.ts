import * as T from 'three';
import './style.css';
import {batchEnvironment} from './world/optimize';
import {environment} from './world/environment';
import {buildings} from './world/buildings';
import {Actor} from './characters/actor';
import {CollisionWorld} from './systems/collision';
import {Input} from './systems/input';
import {FollowCamera} from './systems/camera';
import {GameState} from './systems/state';
function boot(){
 const canvas=document.querySelector<HTMLCanvasElement>('#world')!;
 const renderer=new T.WebGLRenderer({canvas,antialias:true,powerPreference:'high-performance'});renderer.setPixelRatio(Math.min(devicePixelRatio,1.75));renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.22;
 const scene=new T.Scene();scene.background=new T.Color('#e8eddd');scene.fog=new T.Fog('#e8eddd',52,100);
 const camera=new T.PerspectiveCamera(39,innerWidth/innerHeight,.1,140),follow=new FollowCamera(camera);
 scene.add(new T.HemisphereLight('#fff5db','#a1ab80',2.1));const sun=new T.DirectionalLight('#fff0cf',3.2);sun.position.set(-12,22,10);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);sun.shadow.camera.left=-19;sun.shadow.camera.right=19;sun.shadow.camera.top=18;sun.shadow.camera.bottom=-18;sun.shadow.normalBias=.035;sun.shadow.bias=-.00015;sun.shadow.camera.far=65;sun.shadow.radius=3;scene.add(sun);
 const root=new T.Group();scene.add(root);const collision=new CollisionWorld();environment(root,collision);buildings(root,collision);batchEnvironment(root);
 const chef=new Actor('chef');chef.root.position.set(-.5,.12,2);chef.root.rotation.y=.35;root.add(chef.root);
 const potato=new Actor('potato');potato.root.position.set(2.8,.12,1.1);potato.root.rotation.y=.3;root.add(potato.root);
 const input=new Input(),state=new GameState(),clock=new T.Clock();
 const dialog=document.querySelector<HTMLDialogElement>('#instructions')!;document.querySelector('#help')!.addEventListener('click',()=>{input.clear();state.paused=true;dialog.showModal();});document.querySelector('#close-help')!.addEventListener('click',()=>dialog.close());dialog.addEventListener('close',()=>{state.paused=false;input.clear();});
 const label=document.querySelector<HTMLElement>('#potato-label')!,projected=new T.Vector3();
 const resize=()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);};window.addEventListener('resize',resize);resize();
 let disposed=false;
 canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();disposed=true;const error=document.querySelector<HTMLElement>('#error')!;error.hidden=false;error.textContent='画面连接中断，请刷新页面继续散步。';});
 function frame(){if(disposed)return;requestAnimationFrame(frame);const dt=Math.min(clock.getDelta(),.05);state.update(dt);
 if(!state.paused){let x=input.x,y=input.y;const length=Math.hypot(x,y);if(length>.08){x/=Math.max(1,length);y/=Math.max(1,length);const speed=input.running?4.8:2.7;
 // Camera-relative movement: D points screen-right and W points into the scene.
 const dx=(x*.832+y*.555)*speed*dt,dz=(-x*.555+y*.832)*speed*dt;const px=chef.root.position.x,pz=chef.root.position.z;collision.move(chef.root.position,dx,dz);const moved=Math.hypot(chef.root.position.x-px,chef.root.position.z-pz)>.0001;
 const angle=Math.atan2(dx,dz);chef.root.rotation.y+=Math.atan2(Math.sin(angle-chef.root.rotation.y),Math.cos(angle-chef.root.rotation.y))*(1-Math.exp(-14*dt));chef.update(dt,moved?(input.running?'run':'walk'):'idle');
 }else chef.update(dt,'idle');potato.update(dt,'idle');}
 follow.update(chef.root.position,dt);renderer.render(scene,camera);
 projected.copy(potato.root.position);projected.y=2.65;projected.project(camera);label.style.left=`${(projected.x*.5+.5)*innerWidth}px`;label.style.top=`${(-projected.y*.5+.5)*innerHeight}px`;label.hidden=projected.z>1;
 }
 frame();
 // Read-only development snapshot for smoke tests and performance inspection.
 if(import.meta.env.DEV)Object.defineProperty(window,'__potato',{value:()=>({player:{x:chef.root.position.x,z:chef.root.position.z},motion:chef.motion,potato:potato.motion,drawCalls:renderer.info.render.calls,triangles:renderer.info.render.triangles,obstacles:collision.obstacles.length}),configurable:true});
}
try{boot();}catch(error){console.error(error);const el=document.querySelector<HTMLElement>('#error')!;el.hidden=false;el.textContent='小院暂时无法打开，请使用支持 WebGL 的浏览器并开启硬件加速。';}
