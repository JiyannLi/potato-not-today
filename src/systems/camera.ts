import * as T from 'three';
export class FollowCamera {
 readonly target=new T.Vector3();private desired=new T.Vector3();
 constructor(readonly camera:T.PerspectiveCamera){camera.position.set(20,24,29);}
 update(player:T.Vector3,dt:number){
 // Limited tracking keeps camera outside roof volumes, always above the tallest object.
 this.desired.set(player.x*.24,0,player.z*.22);this.target.lerp(this.desired,1-Math.exp(-3*dt));
 const portrait=this.camera.aspect<.85, distance=portrait?1.85:1;
 this.camera.position.set(this.target.x+18*distance,23*distance,this.target.z+27*distance);
 this.desired.copy(this.target);this.desired.y=.1;this.camera.lookAt(this.desired);
 }
}
