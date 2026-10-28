export interface Obstacle {x:number;z:number;w:number;d:number}
export class CollisionWorld {
 readonly obstacles:Obstacle[]=[];
 constructor(readonly bounds={halfWidth:11.4,halfDepth:9.4}){}
 add(x:number,z:number,w:number,d:number){this.obstacles.push({x,z,w,d});}
 blocked(x:number,z:number,r=.34){return x < -this.bounds.halfWidth+r || x > this.bounds.halfWidth-r || z < -this.bounds.halfDepth+r || z > this.bounds.halfDepth-r || this.obstacles.some(o=>{const dx=x-Math.max(o.x-o.w/2,Math.min(x,o.x+o.w/2));const dz=z-Math.max(o.z-o.d/2,Math.min(z,o.z+o.d/2));return dx*dx+dz*dz<r*r;});}
 move(p:{x:number;z:number},dx:number,dz:number,r=.34){const steps=Math.max(1,Math.ceil(Math.hypot(dx,dz)/.12));for(let i=0;i<steps;i++){if(!this.blocked(p.x+dx/steps,p.z,r))p.x+=dx/steps;if(!this.blocked(p.x,p.z+dz/steps,r))p.z+=dz/steps;}}
}
