import {test} from 'node:test';
import assert from 'node:assert/strict';
import {CollisionWorld} from '../src/systems/collision';
test('boundary blocks movement at every edge',()=>{const c=new CollisionWorld();for(const [x,z] of [[11,0],[-11,0],[0,9],[0,-9]]){const p={x,z};c.move(p,x*100,z*100);assert.ok(Math.abs(p.x)<=11.06+.001);assert.ok(Math.abs(p.z)<=9.06+.001);}});
test('substeps prevent tunnelling through a thin stove and permit sliding',()=>{const c=new CollisionWorld();c.add(0,0,2,.2);const p={x:0,z:2};c.move(p,0,-8);assert.ok(p.z>=.44-.001);const q={x:0,z:1};c.move(q,3,-2);assert.ok(q.x>2);assert.ok(!c.blocked(q.x,q.z));});
test('garden-to-kitchen central passage remains open',()=>{const c=new CollisionWorld();for(let i=0;i<3;i++)c.add(-8+i*1.5,-4.5,1.05,5);c.add(6.9,-6.2,1.9,1.15);const p={x:-4,z:-1};c.move(p,9,0);assert.ok(Math.abs(p.x-5)<1e-9);assert.equal(p.z,-1);});
