export class Input {
 readonly keys=new Set<string>();readonly touch={x:0,y:0,run:false};private pointer:number|null=null;
 constructor(){
 window.addEventListener('keydown',e=>{if(e.target instanceof HTMLInputElement||e.target instanceof HTMLSelectElement||e.target instanceof HTMLTextAreaElement)return;if(['KeyW','KeyA','KeyS','KeyD','ShiftLeft','ShiftRight','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.code)){e.preventDefault();this.keys.add(e.code);}});window.addEventListener('keyup',e=>this.keys.delete(e.code));
 window.addEventListener('blur',()=>this.clear());document.addEventListener('visibilitychange',()=>{if(document.hidden)this.clear();});
 const stick=document.querySelector<HTMLElement>('#joystick')!,knob=stick.firstElementChild as HTMLElement;
 const update=(e:PointerEvent)=>{const r=stick.getBoundingClientRect(),x=e.clientX-r.left-r.width/2,y=e.clientY-r.top-r.height/2,d=Math.max(1,Math.hypot(x,y)/38);this.touch.x=x/d/38;this.touch.y=y/d/38;knob.style.transform=`translate(${x/d}px, ${y/d}px)`;};
 stick.addEventListener('pointerdown',e=>{if(this.pointer!==null)return;this.pointer=e.pointerId;stick.setPointerCapture(e.pointerId);update(e);});stick.addEventListener('pointermove',e=>{if(this.pointer===e.pointerId)update(e);});
 const release=()=>{this.pointer=null;this.touch.x=0;this.touch.y=0;knob.style.transform='';};stick.addEventListener('lostpointercapture',release);stick.addEventListener('pointercancel',release);
 stick.addEventListener('pointerup',release);
 const run=document.querySelector<HTMLElement>('#run')!;run.addEventListener('pointerdown',e=>{run.setPointerCapture(e.pointerId);this.touch.run=true;});for(const event of ['pointerup','pointercancel','lostpointercapture'])run.addEventListener(event,()=>this.touch.run=false);
 }
 clear(){this.keys.clear();this.touch.x=this.touch.y=0;this.touch.run=false;}
 get x(){return Number(this.keys.has('KeyD')||this.keys.has('ArrowRight'))-Number(this.keys.has('KeyA')||this.keys.has('ArrowLeft'))+this.touch.x;}
 get y(){return Number(this.keys.has('KeyS')||this.keys.has('ArrowDown'))-Number(this.keys.has('KeyW')||this.keys.has('ArrowUp'))+this.touch.y;}
 get running(){return this.keys.has('ShiftLeft')||this.keys.has('ShiftRight')||this.touch.run;}
}
