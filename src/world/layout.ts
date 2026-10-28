import {CollisionWorld, type Obstacle} from '../systems/collision';

/** Shared by scenery, movement bounds, vegetation masks and route tests. */
export const COURTYARD = {
  width: 32,
  depth: 27,
  bounds: {halfWidth: 15.2, halfDepth: 12.7},
  kitchen: {x: 8, z: -8},
  beds: [-11, -9.5, -8].map(x => ({x, z: -8, w: 1.1, d: 5})),
  bench: {x: -10, z: 7.5},
  trees: [{x: -12.7, z: 2.8, h: 8}, {x: -13, z: -11, h: 9}, {x: 13, z: -11.5, h: 9.5}],
  shrubs: [[-14, 8], [-14, -4], [14, -4], [13.5, 8], [-5, -12], [3, -12]] as [number, number][],
  rocks: [[-13, 10, .65], [-6.6, -10.8, .45], [13.7, 4.2, .55]] as [number, number, number][],
};

export function courtyardObstacles(): Obstacle[] {
  const k = COURTYARD.kitchen;
  const local = [
    [0, -2.35, 7, .3], [3.38, -1, .3, 2.8],
    [-3.25, 2.25, .3, .3], [3.25, 2.25, .3, .3],
    [1.9, -.5, 1.9, 1.15], [-1.6, .5, 2.1, 1.05],
  ];
  return [
    ...local.map(([x,z,w,d]) => ({x:x+k.x,z:z+k.z,w,d})),
    ...COURTYARD.beds.map(b => ({...b})),
    {x:COURTYARD.bench.x,z:COURTYARD.bench.z,w:2.8,d:.8},
    {x:-9.25,z:-11,w:5.7,d:.14},
    {x:-11.75,z:2.8,w:1.5,d:.65},
    ...COURTYARD.trees.map(t => ({x:t.x,z:t.z,w:.65,d:.65})),
    ...COURTYARD.rocks.map(([x,z,s]) => ({x,z,w:s*1.4,d:s*1.1})),
  ];
}

export function createCourtyardCollision() {
  const world = new CollisionWorld(COURTYARD.bounds);
  for (const o of courtyardObstacles()) world.add(o.x,o.z,o.w,o.d);
  return world;
}

/** Keep grass out of kitchen floors, crop beds, stones and the main paths. */
export function courtyardCoverage(x:number,z:number) {
  if (Math.abs(x)>15.25 || Math.abs(z)>12.8) return 0;
  if (x>4.35 && x<11.65 && z< -5.25 && z> -10.85) return 0;
  if (COURTYARD.beds.some(b=>Math.abs(x-b.x)<.85 && Math.abs(z-b.z)<2.8)) return 0;
  const pathX=1+Math.sin(z*.25)*.65;
  const entryPath=z> -4 && Math.abs(x-pathX)<.9;
  const crossPath=z> -4.9 && z< -3.5 && x> -10 && x<9;
  if (entryPath || crossPath) return .015;
  const border=Math.max(Math.abs(x)/15.2,Math.abs(z)/12.7);
  const patch=.65+.2*Math.sin(x*.7+z*.2)+.15*Math.cos(z*.8-x*.3);
  return (border>.7?.95:.48)*patch;
}
