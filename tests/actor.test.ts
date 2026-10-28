import {test} from 'node:test';
import assert from 'node:assert/strict';
import {Actor} from '../src/characters/actor';
test('both actors animate all base motions with reusable limb and attachment pivots',()=>{for(const kind of ['chef','potato'] as const){const actor=new Actor(kind);assert.equal(actor.legs.length,2);assert.equal(actor.arms.length,2);actor.update(.3,'idle');const idle=actor.legs[0].rotation.x;actor.update(.3,'walk');assert.notEqual(actor.legs[0].rotation.x,idle);actor.update(.1,'run');assert.equal(actor.motion,'run');assert.ok(actor.accessories.parent===actor.body);assert.ok(actor.face.parent===actor.body);}});
test('potato blinks and restores eyes without replacing its mesh',()=>{const actor=new Actor('potato'),eye=actor.eyes[0];actor.update(4.6);assert.ok(eye.scale.y<.05);actor.update(.2);assert.equal(eye.scale.y,.19);assert.equal(actor.eyes[0],eye);});
