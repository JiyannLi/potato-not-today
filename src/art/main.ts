import * as T from 'three';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';
import {Actor} from '../characters/actor';
import {createMeadow,createTrees,groundHeight} from './vegetation';
import {DEFAULTS,FOG,PixelPipeline,type Settings} from './pipeline';
import './style.css';
function boot(){
 const query=new URLSearchParams(location.search);if(query.has('capture'))document.body.classList.add('capture');
 const settings:Settings={...DEFAULTS};if(query.has('still'))settings.animated=false;
 const canvas=document.querySelector<HTMLCanvasElement>('#forest')!,renderer=new T.WebGLRenderer({canvas,antialias:false,powerPreference:'high-performance'});
 renderer.setPixelRatio(1);renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1;
 renderer.info.autoReset=false;
 const scene=new T.Scene();scene.background=new T.Color('#79836e');const fog=new T.FogExp2('#79836e',settings.fog);scene.fog=fog;
 const camera=new T.OrthographicCamera(-13,13,9,-9,.1,110);const target=new T.Vector3(0,1,-2),offset=new T.Vector3(10,19,24);camera.position.copy(target).add(offset);camera.lookAt(target);
 const hemi=new T.HemisphereLight('#cad1bb','#414b32',1.25);scene.add(hemi);const sun=new T.DirectionalLight('#e3d4a6',1.75);sun.position.set(-10,20,10);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);Object.assign(sun.shadow.camera,{left:-20,right:20,top:20,bottom:-20,far:65});sun.shadow.normalBias=.035;sun.shadow.bias=-.0002;sun.shadow.radius=3;scene.add(sun);
 const meadow=createMeadow(scene),trees=createTrees(scene);const trunk=new T.Mesh(mergeGeometries(trees.branches),trees.trunkMat);trunk.castShadow=true;trunk.receiveShadow=true;scene.add(trunk);trees.branches.forEach(g=>g.dispose());
 // Same chef and animation code, with cloned preview-only smooth materials. Original game assets stay unchanged.
 const chef=new Actor('chef');chef.root.position.set(.7,groundHeight(.7,2),2);chef.root.rotation.y=.3;chef.root.traverse(o=>{if(o instanceof T.Mesh){const mat=(o.material as T.MeshStandardMaterial).clone();mat.flatShading=false;o.material=mat;o.geometry=o.geometry.clone();o.geometry.computeVertexNormals();}});scene.add(chef.root);
 renderer.shadowMap.autoUpdate=false;renderer.shadowMap.needsUpdate=true;
 const pipeline=new PixelPipeline(renderer,scene,camera);
 const controls=[['pixelSize','Pixel Size',1,5,1],['renderScale','Render Scale',.5,1,.05],['colors','Color Quantization',64,4096,64],['fog','Fog Density',0,.065,.001],['brightness','Environment Brightness',.5,1.5,.05],['saturation','Color Saturation',0,1.2,.05],['density','Grass Density',15,100,5]] as const;
 const fields=document.querySelector('#fields')!;
 for(const [key,label,min,max,step] of controls){const el=document.createElement('label');el.innerHTML=`<span>${label}</span><output id="${key}-value"></output><input aria-label="${label}" id="${key}" type="range" min="${min}" max="${max}" step="${step}">`;fields.append(el);const input=el.querySelector('input')!;input.addEventListener(key==='density'?'change':'input',()=>apply({[key]:Number(input.value)}));}
 const pixelated=document.querySelector<HTMLInputElement>('#pixelated')!,wind=document.querySelector<HTMLInputElement>('#wind')!;
 pixelated.addEventListener('change',()=>apply({pixelated:pixelated.checked}));wind.addEventListener('change',()=>apply({animated:wind.checked}));
 document.querySelectorAll<HTMLButtonElement>('[data-fog]').forEach(b=>b.addEventListener('click',()=>apply({fog:FOG[b.dataset.fog as keyof typeof FOG]})));document.querySelector('#reset')!.addEventListener('click',()=>apply({...DEFAULTS}));
 function resize(){const aspect=innerWidth/innerHeight;const halfHeight=aspect<1?14:9;camera.left=-halfHeight*aspect;camera.right=halfHeight*aspect;camera.top=halfHeight;camera.bottom=-halfHeight;camera.updateProjectionMatrix();pipeline.resize(innerWidth,innerHeight,settings);}
 function apply(patch:Partial<Settings>){const oldDensity=settings.density;Object.assign(settings,patch);fog.density=settings.fog;hemi.intensity=1.25*settings.brightness;sun.intensity=1.75*settings.brightness;meadow.grass.setOptions({brightness:settings.brightness});if(oldDensity!==settings.density)meadow.setDensity(settings.density);
 for(const [key] of controls){(document.getElementById(key) as HTMLInputElement).value=String(settings[key]);document.getElementById(key+'-value')!.textContent=String(settings[key]);}
 pixelated.checked=settings.pixelated;wind.checked=settings.animated;document.querySelectorAll<HTMLButtonElement>('[data-fog]').forEach(b=>b.classList.toggle('active',Math.abs(settings.fog-FOG[b.dataset.fog as keyof typeof FOG])<.0001));resize();}
 window.addEventListener('resize',resize);apply({});if(innerWidth<650)(document.querySelector('#panel') as HTMLDetailsElement).open=false;
 // Quantize orthographic camera translation to world-units-per-render-pixel; no subpixel follow drift.
 let pointer:number|null=null,lastX=0,lastY=0;const desired=target.clone(),snapped=target.clone(),origin=target.clone();
 canvas.addEventListener('pointerdown',e=>{pointer=e.pointerId;lastX=e.clientX;lastY=e.clientY;canvas.setPointerCapture(e.pointerId);});canvas.addEventListener('pointermove',e=>{if(pointer!==e.pointerId)return;desired.x=T.MathUtils.clamp(desired.x-(e.clientX-lastX)*.015,-3,3);desired.z=T.MathUtils.clamp(desired.z-(e.clientY-lastY)*.015,-6,2);lastX=e.clientX;lastY=e.clientY;});for(const event of ['pointerup','pointercancel','lostpointercapture'])canvas.addEventListener(event,()=>pointer=null);
 const right=new T.Vector3().setFromMatrixColumn(camera.matrixWorld,0),up=new T.Vector3().setFromMatrixColumn(camera.matrixWorld,1);let lastTimestamp=performance.now(),wallSeconds=0;let elapsed=0,frames=0,sumMs=0,disposed=false;let metrics={fps:0,frameMs:0,calls:0,triangles:0};const stats=document.querySelector('#stats')!;
 function render(now=performance.now()){if(disposed)return;requestAnimationFrame(render);const rawDt=Math.max(0,(now-lastTimestamp)/1000),dt=Math.min(rawDt,.1);lastTimestamp=now;wallSeconds+=rawDt;if(settings.animated){elapsed+=dt;chef.update(dt,'idle');}meadow.grass.update(elapsed);
 target.lerp(desired,1-Math.exp(-5*dt));snapped.copy(target);if(settings.pixelated){const unit=(camera.right-camera.left)/pipeline.retro.resolution.x;const r=target.dot(right)-origin.dot(right),u=target.dot(up)-origin.dot(up);snapped.addScaledVector(right,Math.round(r/unit)*unit-r).addScaledVector(up,Math.round(u/unit)*unit-u);}
 camera.position.copy(snapped).add(offset);camera.lookAt(snapped);renderer.info.reset();const start=performance.now();pipeline.render();sumMs+=performance.now()-start;frames++;
 if(frames%20===0){metrics={fps:Math.round(20/Math.max(wallSeconds,.001)),frameMs:Math.round(sumMs/20*10)/10,calls:renderer.info.render.calls,triangles:renderer.info.render.triangles};sumMs=0;wallSeconds=0;stats.textContent=`${metrics.fps} FPS · ${metrics.frameMs} ms CPU提交 · ${metrics.calls} calls\n${meadow.grass.bladeCount.toLocaleString()} 草叶 · ${metrics.triangles.toLocaleString()} 三角形`;}}
 canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();disposed=true;const f=document.querySelector<HTMLElement>('#failure')!;f.hidden=false;f.textContent='WebGL 画面连接中断，请刷新重试。';});
 // Explicit lab API for repeatable screenshots/measurements; no game state mutation.
 Object.defineProperty(window,'__artLab',{value:{apply,getState:()=>({settings:{...settings},metrics:{...metrics,calls:renderer.info.render.calls,triangles:renderer.info.render.triangles},grass:meadow.grass.bladeCount,leaves:trees.leafCount,flowers:meadow.flowers,camera:camera.position.toArray(),resolution:pipeline.retro.resolution.toArray()}),setStill:()=>apply({animated:false}),resetCamera:()=>{desired.set(0,1,-2);target.copy(desired);}},configurable:true});
 render();
}
try{boot();}catch(error){console.error(error);const f=document.querySelector<HTMLElement>('#failure')!;f.hidden=false;f.textContent='森林预览无法启动，请使用支持 WebGL2 的浏览器。';}
