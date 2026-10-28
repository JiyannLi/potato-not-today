import * as T from 'three';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';
/** Bake only the static environment; actor pivot hierarchies remain animated. */
export function batchEnvironment(root:T.Group){
 root.updateMatrixWorld(true);
 const meshes:T.Mesh[]=[],lines:T.LineSegments[]=[];const groups=new Map<T.Material,T.BufferGeometry[]>();
 root.traverse(o=>{if(o instanceof T.Mesh&&!(o instanceof T.InstancedMesh))meshes.push(o);if(o instanceof T.LineSegments)lines.push(o);});
 for(const m of meshes){if(Array.isArray(m.material))continue;const geo=m.geometry.clone().applyMatrix4(m.matrixWorld);const nonIndexed=geo.index?geo.toNonIndexed():geo;const list=groups.get(m.material)||[];list.push(nonIndexed);groups.set(m.material,list);if(nonIndexed!==geo)geo.dispose();}
 const edgeGeos=lines.map(l=>l.geometry.clone().applyMatrix4(l.matrixWorld));
 for(const m of meshes)m.removeFromParent();
 for(const [mat,geos] of groups){const merged=mergeGeometries(geos);if(!merged)throw Error('Static geometry batching failed');const mesh=new T.Mesh(merged,mat);mesh.castShadow=true;mesh.receiveShadow=true;root.add(mesh);geos.forEach(g=>g.dispose());}
 if(edgeGeos.length){const merged=mergeGeometries(edgeGeos)!;root.add(new T.LineSegments(merged,new T.LineBasicMaterial({color:'#554b3b',transparent:true,opacity:.28})));edgeGeos.forEach(g=>g.dispose());}
}
