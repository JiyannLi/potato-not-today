import {test} from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import {COURTYARD,createCourtyardCollision,courtyardCoverage} from '../src/world/layout';
import {FollowCamera} from '../src/systems/camera';

test('courtyard expands by 1.8x and constrains all four new edges',()=>{
 assert.equal(COURTYARD.width*COURTYARD.depth/(24*20),1.8);
 const world=createCourtyardCollision();
 assert.ok(!world.blocked(13,8),'new area beyond the former boundary is reachable');
 for(const [x,z,dx,dz] of [[14,8,100,0],[-14,0,-100,0],[0,12,0,100],[0,-12,0,-100]]){
  const p={x,z};world.move(p,dx,dz);
  assert.ok(Math.abs(p.x)<=COURTYARD.bounds.halfWidth-.34+1e-8);
  assert.ok(Math.abs(p.z)<=COURTYARD.bounds.halfDepth-.34+1e-8);
  if(dx)assert.ok(Math.abs(p.x)>=COURTYARD.bounds.halfWidth-.34-.12);
  if(dz)assert.ok(Math.abs(p.z)>=COURTYARD.bounds.halfDepth-.34-.12);
 }
});
test('actual layout allows kitchen, garden and a continuous central running loop',()=>{
 const world=createCourtyardCollision();
 const routes=[
  [[0,11],[0,2],[1,-4.2],[8,-4.2],[8,-5]],
  [[0,2],[-6.7,-4.2],[-6.7,-8]],
  [[-5,-5],[1,-5],[8,-4],[12,1],[10,7],[5,10],[-4,10],[-7,6],[-7,0],[-5,-5]],
 ];
 for(const route of routes){const p={x:route[0][0],z:route[0][1]};assert.ok(!world.blocked(p.x,p.z));for(const [x,z] of route.slice(1)){world.move(p,x-p.x,z-p.z);assert.ok(Math.hypot(p.x-x,p.z-z)<1e-6,`blocked route to ${x}, ${z}`);}}
 for(const bed of COURTYARD.beds)assert.ok(world.blocked(bed.x,bed.z));
 assert.ok(world.blocked(COURTYARD.kitchen.x+1.9,COURTYARD.kitchen.z-.5));
});
test('plant coverage leaves kitchen and beds clear, retaining richer borders',()=>{
 assert.equal(courtyardCoverage(8,-8),0);assert.equal(courtyardCoverage(-11,-8),0);
 assert.ok(courtyardCoverage(14,5)>courtyardCoverage(1+Math.sin(5*.25)*.65,5));
});
test('orthographic follow keeps distant player visible on desktop and portrait, above the roof',()=>{
 for(const [w,h] of [[1440,1000],[390,844]]){
  const camera=new T.OrthographicCamera(-1,1,1,-1,.1,120),follow=new FollowCamera(camera);follow.resize(w,h);
  for(const [x,z] of [[14,11],[-14,-12],[12,-11],[-12,11]]){
   const player=new T.Vector3(x,0,z);follow.update(player,100,Math.floor(w*.75/2));camera.updateMatrixWorld(true);
   const projected=new T.Vector3(x,1.3,z).project(camera);
   assert.ok(Math.abs(projected.x)<.95&&Math.abs(projected.y)<.95);assert.ok(camera.position.y>20);
  }
 }
});
