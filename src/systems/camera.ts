import * as T from 'three';

/** Fixed isometric orientation, smooth world tracking, then screen-plane pixel alignment. */
export class FollowCamera {
 readonly target=new T.Vector3();
 private readonly desired=new T.Vector3();
 private readonly snapped=new T.Vector3();
 private readonly offset=new T.Vector3(16,23,24);
 private readonly right=new T.Vector3(24,0,-16).normalize();
 private readonly up=new T.Vector3().crossVectors(this.offset,this.right).normalize();
 constructor(readonly camera:T.OrthographicCamera){}
 resize(width:number,height:number){
  const aspect=width/height,halfHeight=aspect<.85?11.5:9.5;
  this.camera.left=-halfHeight*aspect;this.camera.right=halfHeight*aspect;
  this.camera.top=halfHeight;this.camera.bottom=-halfHeight;
  this.camera.updateProjectionMatrix();
 }
 update(player:T.Vector3,dt:number,gridWidth:number){
  this.desired.set(player.x,.6,player.z-1.2);
  this.target.lerp(this.desired,1-Math.exp(-4*dt));this.snapped.copy(this.target);
  const unit=(this.camera.right-this.camera.left)/Math.max(1,gridWidth);
  const x=this.target.dot(this.right),y=this.target.dot(this.up);
  this.snapped.addScaledVector(this.right,Math.round(x/unit)*unit-x);
  this.snapped.addScaledVector(this.up,Math.round(y/unit)*unit-y);
  this.camera.position.copy(this.snapped).add(this.offset);this.camera.lookAt(this.snapped);
 }
}
