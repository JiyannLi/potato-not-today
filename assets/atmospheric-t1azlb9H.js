import{D as Oe,V as z,M as W,a as y,C as p,G as at,b as ce,S as he,c as J,U as me,d as lt,R as ct,I as ee,Q as de,O as te,B as pe,e as Ae,f as Re,P as fe,g as Ne,h as Q,i as G,F as ie,j as Ie,k as ut,l as Be,s as Ue,m as He,W as ht,H as dt,N as ft,n as gt,o as mt,p as pt,q as wt,L as vt,r as bt,t as xt,A as qe,u as Mt,v as yt,w as St,x as Ct,y as _t,z as Pt,E as At,J as Rt,K as Et,T as Tt,X as Ft,Y as zt,Z as Wt}from"./actor-DiaP1-bp.js";const je=["r","g","b","a"];function we(t){if(t===void 0)return;if(typeof t.map=="string")throw new RangeError("Grass coverage map URLs must be resolved through the Grass facade.");const e=+(t.map!==void 0)+ +(t.attribute!==void 0)+ +(t.sample!==void 0);if(e>1)throw new RangeError("Grass coverage accepts only one source.");if(e===0)throw new RangeError("Grass coverage requires a source.");if(t.attribute!==void 0&&t.attribute.trim().length===0)throw new RangeError("Grass coverage attribute must not be empty.");if(t.channel!==void 0&&!je.includes(t.channel))throw new RangeError("Grass coverage channel must be r, g, b, or a.");if(t.threshold!==void 0&&!Number.isFinite(t.threshold))throw new RangeError("Grass coverage threshold must be finite.");if(t.power!==void 0&&(!Number.isFinite(t.power)||t.power<0))throw new RangeError("Grass coverage power must be finite and nonnegative.");return Object.freeze({map:t.map,attribute:t.attribute,sample:t.sample,channel:t.channel??"r",threshold:t.threshold??0,power:t.power??1})}function Dt(t,e){return t===e||t?.map===e?.map&&t?.attribute===e?.attribute&&t?.sample===e?.sample&&t?.channel===e?.channel&&t?.threshold===e?.threshold&&t?.power===e?.power}function Ve(t){return je.indexOf(t)}function ue(t,e,i){return i===0?t.getX(e):i===1?t.getY(e):i===2?t.getZ(e):t.getW(e)}function Qe(t,e,i){const r=W.clamp(t,0,1);return r<=e||e>=1?0:Math.pow(W.clamp((r-e)/(1-e),0,1),i)}const Ee=new WeakMap;function kt(t){const e=t.image,{data:i,height:r,width:o}=e;if(!i||!o||!r)return;const n=i.length/(o*r);if(Number.isInteger(n))return{data:i,width:o,height:r,channels:n,sourceVersion:t.source.version}}function Gt(t){const e=t.image,i=e,r=i?.naturalWidth??i?.videoWidth??i?.width??0,o=i?.naturalHeight??i?.videoHeight??i?.height??0;if(!e||!r||!o||typeof document>"u")return;const s=document.createElement("canvas");s.width=r,s.height=o;const n=s.getContext("2d",{willReadFrequently:!0});if(!n)throw new RangeError("Grass coverage map could not create a readable canvas.");try{return n.drawImage(e,0,0,r,o),{data:n.getImageData(0,0,r,o).data,width:r,height:o,channels:4,sourceVersion:t.source.version}}catch(a){throw new RangeError(`Grass coverage map pixels could not be read. Ensure its image is loaded and CORS-readable. (${a instanceof Error?a.message:"unknown error"})`)}}function ve(t){if(t instanceof Oe)return kt(t);const e=Ee.get(t);if(e?.sourceVersion===t.source.version)return e;const i=Gt(t);return i&&Ee.set(t,i),i}function Lt(t,e,i){const r=ve(t);if(!r)return 0;const{data:o,height:s,width:n,channels:a}=r;if(i>=a)throw new RangeError("Grass coverage map channel is not available.");const c=Math.min(n-1,Math.max(0,Math.floor(e.x*n))),w=Math.min(s-1,Math.max(0,Math.floor(e.y*s))),f=o[(w*n+c)*a+i];return Xe(o,f)}function Xe(t,e){return t instanceof Uint8Array||t instanceof Uint8ClampedArray?e/255:t instanceof Uint16Array?e/65535:e}function Ot(t){if(!t?.map)return;const e=ve(t.map);if(!e)return;const i=Ve(t.channel);if(i>=e.channels)throw new RangeError("Grass coverage map channel is not available.");const r=e.data,o=e.width*e.height;let s=0;for(let n=0;n<o;n+=1)s+=Qe(Xe(e.data,r[n*e.channels+i]),t.threshold,t.power);return s/o}function be(t,e){if(!e)return;if(!t.geometry.getAttribute("position"))throw new RangeError("Grass coverage surface must have position geometry.");const r=Ve(e.channel),o=t.geometry.getAttribute("uv");if(e.map&&(!o||o.itemSize<2))throw new RangeError("Grass coverage map requires a surface uv attribute.");if(e.map){const a=ve(e.map);if(a&&r>=a.channels)throw new RangeError("Grass coverage map channel is not available.")}const s=e.attribute?t.geometry.getAttribute(e.attribute):void 0;if(e.attribute&&!s)throw new RangeError(`Grass coverage attribute "${e.attribute}" was not found.`);if(s&&r>=s.itemSize)throw new RangeError("Grass coverage attribute channel is not available.");return{evaluate:(a,c,w,m,f)=>{const[M,l,u]=a,[h,v,S]=c;let d,x=null;if(o&&(x=new z(o.getX(M)*h+o.getX(l)*v+o.getX(u)*S,o.getY(M)*h+o.getY(l)*v+o.getY(u)*S)),e.map){if(!x)throw new RangeError("Grass coverage map requires a surface uv attribute.");d=Lt(e.map,e.map.transformUv(x),r)}else if(s)d=ue(s,M,r)*h+ue(s,l,r)*v+ue(s,u,r)*S;else{const b={position:w.clone(),normal:m.clone(),uv:x?.clone()??null,seed:f};if(d=e.sample(b),!Number.isFinite(d))throw new RangeError("Grass coverage callback must return a finite number.")}return Qe(d,e.threshold,e.power)},isCallback:e.sample!==void 0}}function Te(t,e){!t||!e||be(t,e)}function V(t,e){return Object.prototype.hasOwnProperty.call(t,e)}function I(t){return Number.isFinite(t)&&t>0}function D(t){return Number.isFinite(t)&&t>=0}function $e(t){let e=t*1664525+1013904223>>>0;return()=>(e=e*1664525+1013904223>>>0,e/4294967296)}function Nt(t){const e=W.degToRad(t),i=Math.cos(e),r=Math.sin(e);return new z(Math.abs(i)<Number.EPSILON?0:i,Math.abs(r)<Number.EPSILON?0:r)}function Ye(t){t.updateWorldMatrix(!0,!1);const e=t.geometry.getAttribute("position"),i=t.geometry.index,r=[],o=[],s=[],n=[],a=new y,c=new y,w=new y,m=new y,f=new y,M=new y,l=Math.floor((i?.count??e?.count??0)/3);let u=0;if(!e)return{vertices:r,normals:o,cumulativeAreas:s,totalArea:u,triangles:n};for(let h=0;h<l;h+=1){const v=h*3,S=i?i.getX(v):v,d=i?i.getX(v+1):v+1,x=i?i.getX(v+2):v+2;a.fromBufferAttribute(e,S).applyMatrix4(t.matrixWorld),c.fromBufferAttribute(e,d).applyMatrix4(t.matrixWorld),w.fromBufferAttribute(e,x).applyMatrix4(t.matrixWorld);const b=M.crossVectors(m.subVectors(c,a),f.subVectors(w,a)).length();b<1e-8||(u+=b*.5,s.push(u),r.push(a.x,a.y,a.z,c.x,c.y,c.z,w.x,w.y,w.z),o.push(M.x/b,M.y/b,M.z/b),n.push([S,d,x]))}return{vertices:r,normals:o,cumulativeAreas:s,totalArea:u,triangles:n}}function Fe(t,e){const i=e()*t.totalArea;let r=0,o=t.cumulativeAreas.length-1;for(;r<o;){const f=r+o>>1;t.cumulativeAreas[f]<i?r=f+1:o=f}let s=e(),n=e();s+n>1&&(s=1-s,n=1-n);const a=1-s-n,c=r*9,w=new y(t.vertices[c]*a+t.vertices[c+3]*s+t.vertices[c+6]*n,t.vertices[c+1]*a+t.vertices[c+4]*s+t.vertices[c+7]*n,t.vertices[c+2]*a+t.vertices[c+5]*s+t.vertices[c+8]*n),m=new y(t.normals[r*3],t.normals[r*3+1],t.normals[r*3+2]);return{sample:{position:w,normal:m},triangleIndex:r,weights:[a,s,n]}}const Z=16;function It(t){let e=0,i=.5,r=t;for(;r>0;)e+=(r&1)*i,r>>=1,i*=.5;return e}function Bt(t){const e=(t+.5)/Z,i=It(t+1),r=Math.sqrt(e);return[1-r,r*(1-i),r*i]}function Ze(t,e,i){if(!e||!i)return t.totalArea;const r=be(i,e);if(!r)return t.totalArea;let o=0;for(let s=0;s<t.cumulativeAreas.length;s+=1){const n=t.cumulativeAreas[s]-(s===0?0:t.cumulativeAreas[s-1]),a=s*9,c=s*3,w=new y,m=new y(t.normals[c],t.normals[c+1],t.normals[c+2]),f=(l,u)=>(w.set(t.vertices[a]*l[0]+t.vertices[a+3]*l[1]+t.vertices[a+6]*l[2],t.vertices[a+1]*l[0]+t.vertices[a+4]*l[1]+t.vertices[a+7]*l[2],t.vertices[a+2]*l[0]+t.vertices[a+5]*l[1]+t.vertices[a+8]*l[2]),r.evaluate(t.triangles[s],l,w,m,u));let M=0;for(let l=0;l<Z;l+=1)M+=f(Bt(l),s*Z+l);o+=n*(M/Z)}if(o===0){const s=Ot(e);if(s&&s>0)return t.totalArea*s}return o}function Ut(t,e){const i=Ye(t),r=we(e);return{sampler:i,coveredArea:Ze(i,r,t),totalArea:i.totalArea}}function Ht(t,e,i,r,o){const s=Math.floor(e);if(!Number.isFinite(s)||s<=0)return[];const n=o?.sampler??Ye(t);if(n.totalArea===0)return[];const a=$e(i),c=we(r),w=be(t,c),m=[];if(!w){for(let u=0;u<s;u+=1)m.push(Fe(n,a).sample);return m}const f=o?.coveredArea??Ze(n,c,t);if(f===0)return[];const M=f/n.totalArea,l=Math.max(s*64,Math.ceil(s*4/M),256);for(let u=0;u<l&&m.length<s;u+=1){const h=Fe(n,a),v=w.evaluate(n.triangles[h.triangleIndex],h.weights,h.sample.position,h.sample.normal,Math.floor(a()*4294967296));a()<=v&&m.push(h.sample)}return m}const Ke=`
  uniform float uTime;
  uniform float uWindStrength;
  uniform float uWindSpeed;
  uniform float uWindFrequency;
  uniform float uWindTurbulence;
  uniform float uWindLean;
  uniform vec2 uWindDirection;
`,Je=`
  mat3 inverseTransposeMat3(mat3 matrix) {
    vec3 row0 = cross(matrix[1], matrix[2]);
    vec3 row1 = cross(matrix[2], matrix[0]);
    vec3 row2 = cross(matrix[0], matrix[1]);
    float determinant = dot(matrix[0], row0);
    return mat3(row0, row1, row2) / determinant;
  }

  vec3 deformGrassBlade(vec3 transformed) {
    mat4 instanceWorldMatrix = modelMatrix * instanceMatrix;
    vec3 baseWorldPosition = (instanceWorldMatrix * vec4(0.0, 0.0, 0.0, 1.0)).xyz;
    float bladeHeight = uv.y;
    float primaryWave = sin(dot(baseWorldPosition.xz, uWindDirection) * uWindFrequency + uTime * uWindSpeed);
    vec2 perpendicular = vec2(-uWindDirection.y, uWindDirection.x);
    float secondaryWave = sin(dot(baseWorldPosition.xz, perpendicular) * uWindFrequency * 1.7 + uTime * uWindSpeed * 0.73) * uWindTurbulence;
    float tipMask = bladeHeight * bladeHeight;
    vec3 worldWind = vec3(uWindDirection.x, 0.0, uWindDirection.y) * ((primaryWave + secondaryWave) * uWindStrength + uWindLean);

    // The instance matrix contains a random Y rotation and non-uniform scale.
    // Projecting onto its world axes converts the coherent world wind to blade-local space.
    vec3 axisX = vec3(instanceWorldMatrix[0]);
    vec3 axisY = vec3(instanceWorldMatrix[1]);
    vec3 axisZ = vec3(instanceWorldMatrix[2]);
    vec3 localWind = vec3(
      dot(worldWind, axisX) / max(dot(axisX, axisX), 0.00001),
      dot(worldWind, axisY) / max(dot(axisY, axisY), 0.00001),
      dot(worldWind, axisZ) / max(dot(axisZ, axisZ), 0.00001)
    );
    return transformed + localWind * tipMask;
  }
`,qt=`
  #include <common>
  #include <shadowmap_pars_vertex>
  #include <fog_pars_vertex>
  ${Ke}

  varying float vBladeHeight;
  varying vec3 vBladeNormal;
  varying vec3 vWorldPosition;

  ${Je}

  void main() {
    vBladeHeight = uv.y;
    vec3 transformed = deformGrassBlade(position);
    mat4 instanceWorldMatrix = modelMatrix * instanceMatrix;
    vBladeNormal = normalize(inverseTransposeMat3(mat3(instanceWorldMatrix)) * normal);
    vWorldPosition = (instanceWorldMatrix * vec4(transformed, 1.0)).xyz;
    vec4 worldPosition = vec4(vWorldPosition, 1.0);
    #if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
      #pragma unroll_loop_start
      for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
        vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * worldPosition;
      }
      #pragma unroll_loop_end
    #endif
    vec4 mvPosition = viewMatrix * worldPosition;
    #include <fog_vertex>
    gl_Position = projectionMatrix * mvPosition;
  }
`,jt=`
  #include <common>
  #include <packing>
  #include <shadowmap_pars_fragment>
  #include <fog_pars_fragment>
  uniform vec3 uGrassBottom;
  uniform vec3 uGrassTop;
  uniform vec3 uLightDirection;
  uniform vec3 uLightColor;
  uniform float uLightIntensity;
  uniform vec3 uBacklightColor;
  uniform float uBacklightStrength;
  uniform float uBacklightPower;
  uniform float uBacklightTip;
  uniform float uBrightness;

  varying float vBladeHeight;
  varying vec3 vBladeNormal;
  varying vec3 vWorldPosition;

  void main() {
    float gradient = smoothstep(0.08, 1.0, vBladeHeight);
    vec3 grassColor = mix(uGrassBottom, uGrassTop, gradient);
    grassColor *= 0.89 + 0.11 * sin(vWorldPosition.x * 0.9 + sin(vWorldPosition.z * 0.6));

    // Flattening diffuse lighting to the up vector avoids random per-ribbon shimmer.
    float diffuse = 0.35 + 0.65 * max(dot(vec3(0.0, 1.0, 0.0), normalize(uLightDirection)), 0.0);
    // Back-scattering is strongest when the camera looks through a thin blade
    // toward the sun. The terms mirror the stylized-components grass material.
    vec3 lightDirection = normalize(uLightDirection);
    vec3 viewDirection = normalize(cameraPosition - vWorldPosition);
    float viewToSun = pow(max(dot(viewDirection, -lightDirection), 0.0), uBacklightPower);
    float edgeOn = 1.0 - abs(dot(normalize(vBladeNormal), lightDirection));
    float thinTip = mix(1.0, vBladeHeight, uBacklightTip);
    float transmission = viewToSun * edgeOn * thinTip * uBacklightStrength;

    float shadow = 1.0;
    #if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
      DirectionalLightShadow directionalShadow = directionalLightShadows[0];
      shadow = getShadow(
        directionalShadowMap[0],
        directionalShadow.shadowMapSize,
        directionalShadow.shadowIntensity,
        directionalShadow.shadowBias,
        directionalShadow.shadowRadius,
        vDirectionalShadowCoord[0]
      );
    #endif

    // Keep a stylized ambient floor while allowing blade and object shadows to read.
    float shadowLighting = mix(0.58, 1.0, shadow);
    vec3 lit = grassColor * (diffuse * uLightColor * uLightIntensity) * shadowLighting;
    lit += uBacklightColor * uLightColor * uLightIntensity * transmission * shadow;
    gl_FragColor = vec4(lit * uBrightness, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
    #include <fog_fragment>
  }
`,Vt={density:36,seed:1,blade:{minWidth:.035,maxWidth:.065,minHeight:.22,maxHeight:.48,segments:3,lean:.08},wind:{strength:.14,speed:1.3,frequency:.55,turbulence:.2,lean:.04,direction:35},colors:{bottom:new p("#4f7c13"),top:new p("#91b936"),backlight:new p("#c1e54d")},brightness:1,shadow:!0,lighting:{direction:new y(-.4,.85,.3).normalize(),color:new p("#fff7d1"),intensity:1,backlightStrength:2.5,backlightPower:3,backlightTip:.6}};function Qt(t){if(V(t,"width")||V(t,"depth"))throw new RangeError("GrassLayer does not support width or depth; size the sampling surface instead.");const e=t.colors;if(e&&typeof e=="object"&&V(e,"ground"))throw new RangeError("GrassLayer does not support colors.ground.")}function Xt(t){if(!t.surface)throw new RangeError("GrassLayer requires a sampling surface.");if(!I(t.density))throw new RangeError("Grass density must be a finite positive number.");if(!Number.isFinite(t.seed))throw new RangeError("Grass seed must be finite.");const{blade:e}=t;if(!Number.isInteger(e.segments)||e.segments<1)throw new RangeError("Grass blade segments must be a positive integer.");if(!I(e.minWidth)||!I(e.maxWidth))throw new RangeError("Grass blade widths must be finite positive numbers.");if(!I(e.minHeight)||!I(e.maxHeight))throw new RangeError("Grass blade heights must be finite positive numbers.");if(e.minWidth>e.maxWidth||e.minHeight>e.maxHeight)throw new RangeError("Grass blade minimum dimensions cannot exceed maximum dimensions.");if(!Number.isFinite(e.lean))throw new RangeError("Grass blade lean must be finite.");const{wind:i,lighting:r}=t;if(!D(i.strength))throw new RangeError("Grass wind strength must be finite and nonnegative.");if(!D(i.speed))throw new RangeError("Grass wind speed must be finite and nonnegative.");if(!D(i.frequency))throw new RangeError("Grass wind frequency must be finite and nonnegative.");if(!D(i.turbulence))throw new RangeError("Grass wind turbulence must be finite and nonnegative.");if(!Number.isFinite(i.lean))throw new RangeError("Grass wind lean must be finite.");if(!Number.isFinite(i.direction))throw new RangeError("Grass wind direction must be finite.");if(!D(t.brightness))throw new RangeError("Grass brightness must be finite and nonnegative.");if(typeof t.shadow!="boolean")throw new RangeError("Grass shadow must be a boolean.");if(!D(r.intensity))throw new RangeError("Grass light intensity must be finite and nonnegative.");if(!D(r.backlightStrength))throw new RangeError("Grass backlight strength must be finite and nonnegative.");if(!I(r.backlightPower))throw new RangeError("Grass backlight power must be finite and positive.");if(!D(r.backlightTip)||r.backlightTip>1)throw new RangeError("Grass backlight tip must be a finite number from 0 to 1.");if(!Number.isFinite(r.direction.x)||!Number.isFinite(r.direction.y)||!Number.isFinite(r.direction.z))throw new RangeError("Grass light direction components must be finite.")}function $t(t){const e=Object.freeze({bottom:Object.freeze(t.colors.bottom.clone()),top:Object.freeze(t.colors.top.clone()),backlight:Object.freeze(t.colors.backlight.clone())}),i=Object.freeze({direction:Object.freeze(t.lighting.direction.clone()),color:Object.freeze(t.lighting.color.clone()),intensity:t.lighting.intensity,backlightStrength:t.lighting.backlightStrength,backlightPower:t.lighting.backlightPower,backlightTip:t.lighting.backlightTip});return Object.freeze({surface:t.surface,density:t.density,seed:t.seed,coverage:t.coverage&&Object.freeze({...t.coverage}),blade:Object.freeze({...t.blade}),wind:Object.freeze({...t.wind}),colors:e,brightness:t.brightness,shadow:t.shadow,lighting:i})}function ze(t,e){Qt(t);const i=V(t,"surface")?t.surface:e?.surface;if(!i)throw new RangeError("GrassLayer requires a sampling surface.");const r=e??{...Vt},o={...r.wind,...t.wind},s={...r.blade,...t.blade},n={bottom:new p(t.colors?.bottom??r.colors.bottom),top:new p(t.colors?.top??r.colors.top),backlight:new p(t.colors?.backlight??r.colors.backlight)},a={direction:(t.lighting?.direction??r.lighting.direction).clone().normalize(),color:new p(t.lighting?.color??r.lighting.color),intensity:t.lighting?.intensity??r.lighting.intensity,backlightStrength:t.lighting?.backlightStrength??r.lighting.backlightStrength,backlightPower:t.lighting?.backlightPower??r.lighting.backlightPower,backlightTip:t.lighting?.backlightTip??r.lighting.backlightTip},c={surface:i,density:t.density??r.density,seed:t.seed??r.seed,coverage:we(V(t,"coverage")?t.coverage:r.coverage),blade:s,wind:o,colors:n,brightness:t.brightness??r.brightness,shadow:t.shadow??r.shadow,lighting:a};return Xt(c),c}function Yt(t,e){const i=new Float32Array((t*2+1)*3),r=new Float32Array((t*2+1)*2),o=[];for(let a=0;a<t;a+=1){const c=a/t,w=.5*Math.pow(1-c,1.2),m=e*c*c,f=a*2;i.set([-w,c,m,w,c,m],f*3),r.set([0,c,1,c],f*2),a<t-1&&o.push(f,f+2,f+1,f+1,f+2,f+3)}i.set([0,1,e],t*6),r.set([.5,1],t*4);const s=(t-1)*2;o.push(s,t*2,s+1);const n=new pe;return n.setAttribute("position",new Ae(i,3)),n.setAttribute("uv",new Ae(r,2)),n.setIndex(o),n.computeVertexNormals(),n}function Zt(t,e){return t.surface!==e.surface||t.density!==e.density||t.seed!==e.seed||!Dt(t.coverage,e.coverage)||t.blade.minWidth!==e.blade.minWidth||t.blade.maxWidth!==e.blade.maxWidth||t.blade.minHeight!==e.blade.minHeight||t.blade.maxHeight!==e.blade.maxHeight||t.blade.segments!==e.blade.segments||t.blade.lean!==e.blade.lean}class Kt extends at{blades;bladeCount=0;time=0;normalized;uniforms;material;depthMaterial;lastGrassWorldMatrix=new ce;lastExternalSurfaceWorldMatrix;disposed=!1;get options(){return $t(this.normalized)}constructor(e){super(),this.normalized=ze(e),Te(this.normalized.surface,this.normalized.coverage),this.uniforms=this.createUniforms(),this.material=this.createMaterial(),this.depthMaterial=this.createDepthMaterial(),this.rebuild(!0)}setOptions(e){if(this.disposed)return;const i=ze(e,this.normalized);Te(i.surface,i.coverage);const r=Zt(this.normalized,i);if(this.normalized=i,r){this.rebuild();return}this.applyUniforms(),this.applyShadowOptions()}refreshLayout(){this.disposed||this.rebuild()}update(e){if(!Number.isFinite(e))throw new RangeError("Grass update time must be finite.");this.disposed||(this.externalSurfaceTransformChanged()&&this.rebuild(),this.time=e,this.uniforms.uTime.value=e)}syncDirectionalLight(e){if(this.disposed)return;e.updateWorldMatrix(!0,!1),e.target.updateWorldMatrix(!0,!1);const i=e.getWorldPosition(new y),r=e.target.getWorldPosition(new y),o=i.sub(r);o.lengthSq()!==0&&(this.uniforms.uLightDirection.value.copy(o.normalize()),this.uniforms.uLightColor.value.copy(e.color),this.uniforms.uLightIntensity.value=e.intensity)}dispose(){this.disposed||(this.disposed=!0,this.remove(this.blades),this.disposeBladeMesh(this.blades),this.clear(),this.bladeCount=0)}createUniforms(){const e=this.normalized.colors,i=this.normalized.lighting;return{uTime:{value:0},uWindStrength:{value:0},uWindSpeed:{value:0},uWindFrequency:{value:0},uWindTurbulence:{value:0},uWindLean:{value:0},uWindDirection:{value:new z},uGrassBottom:{value:e.bottom.clone()},uGrassTop:{value:e.top.clone()},uLightDirection:{value:i.direction.clone()},uLightColor:{value:i.color.clone()},uLightIntensity:{value:i.intensity},uBacklightColor:{value:e.backlight.clone()},uBacklightStrength:{value:i.backlightStrength},uBacklightPower:{value:i.backlightPower},uBacklightTip:{value:i.backlightTip},uBrightness:{value:this.normalized.brightness}}}createMaterial(){return new he({fog:!0,uniforms:Object.assign(me.merge([Re.lights,Re.fog]),this.uniforms),vertexShader:qt,fragmentShader:jt,side:J,transparent:!1,depthWrite:!0,toneMapped:!0,lights:!0})}createDepthMaterial(){const e=new lt({depthPacking:ct});return e.onBeforeCompile=i=>{Object.assign(i.uniforms,this.uniforms),i.vertexShader=i.vertexShader.replace("#include <common>",`#include <common>
${Ke}`),i.vertexShader=i.vertexShader.replace("void main() {",`${Je}
void main() {`),i.vertexShader=i.vertexShader.replace("#include <begin_vertex>",`#include <begin_vertex>
transformed = deformGrassBlade(transformed);`)},e.customProgramCacheKey=()=>"grass-wind-depth-v1",e}rebuild(e=!1){const i=this.normalized.surface,r=Ut(i,this.normalized.coverage),o=r.coveredArea>0?Math.max(1,Math.floor(r.coveredArea*this.normalized.density)):0,s=Ht(i,o,this.normalized.seed,this.normalized.coverage,r);this.updateWorldMatrix(!0,!1);const n=this.matrixWorld.clone().invert(),a=Yt(this.normalized.blade.segments,this.normalized.blade.lean),c=new ee(a,this.material,s.length);c.frustumCulled=!1,c.castShadow=this.normalized.shadow,c.receiveShadow=this.normalized.shadow,c.customDepthMaterial=this.depthMaterial;const w=$e(this.normalized.seed^2654435769),m=new de,f=new de,M=new y,l=new ce,u=this.normalized.blade;for(let h=0;h<s.length;h+=1){const v=s[h].normal.clone().transformDirection(n);m.setFromUnitVectors(te.DEFAULT_UP,v),f.setFromAxisAngle(te.DEFAULT_UP,w()*Math.PI*2),m.multiply(f),M.set(W.lerp(u.minWidth,u.maxWidth,w()),W.lerp(u.minHeight,u.maxHeight,w()),1),l.compose(s[h].position.clone().applyMatrix4(n),m,M),c.setMatrixAt(h,l)}c.instanceMatrix.needsUpdate=!0,this.bladeCount=s.length,e||(this.remove(this.blades),this.disposeBladeMesh(this.blades)),this.blades=c,this.add(c),this.applyUniforms(),this.applyShadowOptions(),this.cacheWorldMatrices()}applyUniforms(){const{wind:e,colors:i,brightness:r,lighting:o}=this.normalized;this.uniforms.uWindDirection.value.copy(Nt(e.direction)),this.uniforms.uWindStrength.value=e.strength,this.uniforms.uWindSpeed.value=e.speed,this.uniforms.uWindFrequency.value=e.frequency,this.uniforms.uWindTurbulence.value=e.turbulence,this.uniforms.uWindLean.value=e.lean,this.uniforms.uGrassBottom.value.copy(i.bottom),this.uniforms.uGrassTop.value.copy(i.top),this.uniforms.uBacklightColor.value.copy(i.backlight),this.uniforms.uBrightness.value=r,this.uniforms.uLightDirection.value.copy(o.direction),this.uniforms.uLightColor.value.copy(o.color),this.uniforms.uLightIntensity.value=o.intensity,this.uniforms.uBacklightStrength.value=o.backlightStrength,this.uniforms.uBacklightPower.value=o.backlightPower,this.uniforms.uBacklightTip.value=o.backlightTip}applyShadowOptions(){this.blades.castShadow=this.normalized.shadow,this.blades.receiveShadow=this.normalized.shadow}externalSurfaceTransformChanged(){return this.updateWorldMatrix(!0,!1),this.normalized.surface.updateWorldMatrix(!0,!1),!this.lastGrassWorldMatrix.equals(this.matrixWorld)||!this.lastExternalSurfaceWorldMatrix?.equals(this.normalized.surface.matrixWorld)}cacheWorldMatrices(){this.updateWorldMatrix(!0,!1),this.lastGrassWorldMatrix.copy(this.matrixWorld),this.normalized.surface.updateWorldMatrix(!0,!1),this.lastExternalSurfaceWorldMatrix||(this.lastExternalSurfaceWorldMatrix=new ce),this.lastExternalSurfaceWorldMatrix.copy(this.normalized.surface.matrixWorld)}disposeBladeMesh(e){e.dispose(),e.geometry.dispose(),this.disposed&&(e.material.dispose(),this.depthMaterial.dispose())}}function B(t,e){return Math.sin(t*.3)*Math.cos(e*.22)*.16+Math.sin(e*.43)*.05}function et(t){return Math.sin(t*.24)*1.3+.7}function We(t,e){const i=Math.abs(t-et(e)),r=.56+.25*Math.sin(t*.73+e*.21)+.19*Math.cos(e*.8-t*.24);return W.smoothstep(i,.35,1.3)*W.clamp(r,.15,1)}function re(t,e=64){const i=document.createElement("canvas");i.width=i.height=e,t(i.getContext("2d"));const r=new ut(i);return r.colorSpace=Be,r}function Jt(t){const e=Ue(1207),i=new fe(36,44,72,88);i.rotateX(-Math.PI/2);const r=i.attributes.position;for(let d=0;d<r.count;d++)r.setY(d,B(r.getX(d),r.getZ(d)));i.computeVertexNormals();const o=re(d=>{for(let x=0;x<256;x++)for(let b=0;b<256;b++){const C=e(),P=Math.sin(b*.06)*Math.cos(x*.04);d.fillStyle=`rgb(${61+C*15+P*8},${68+C*14+P*7},${42+C*11+P*4})`,d.fillRect(b,x,1,1)}},256);o.wrapS=o.wrapT=Ne,o.repeat.set(5,6);const s=new Q(i,new G({map:o,roughness:1}));s.receiveShadow=!0,t.add(s);const n=[],a=[],c=[];for(let d=0;d<=180;d++){const x=-22+d*44/180;for(const b of[-1,1]){const C=et(x)+b*(.5+.15*Math.sin(x*1.2));a.push(C,B(C,x)+.014,x);const P=new p().setHSL(.11,.13,.2+e()*.025);n.push(P.r,P.g,P.b)}if(d<180){const b=d*2;c.push(b,b+2,b+1,b+1,b+2,b+3)}}const w=new pe;w.setAttribute("position",new ie(a,3)),w.setAttribute("color",new ie(n,3)),w.setIndex(c),w.computeVertexNormals();const m=new Q(w,new G({vertexColors:!0,roughness:1,side:J}));m.receiveShadow=!0,t.add(m);const f=new Kt({surface:s,density:65,seed:1207,coverage:{sample:d=>We(d.position.x,d.position.z)},blade:{minWidth:.035,maxWidth:.075,minHeight:.25,maxHeight:.65,segments:3,lean:.15},wind:{strength:.055,speed:.65,frequency:.42,turbulence:.12,lean:.015},colors:{bottom:"#303e24",top:"#7c8653",backlight:"#8c9766"},lighting:{intensity:1.1,backlightStrength:.12},shadow:!0});t.add(f),f.blades.castShadow=!1;const M=re(d=>{d.fillStyle="#d4d6b5";for(let x=0;x<5;x++){const b=x*Math.PI*2/5;d.beginPath(),d.ellipse(32+Math.cos(b)*13,32+Math.sin(b)*13,10,5,b,0,Math.PI*2),d.fill()}d.fillStyle="#b6ad70",d.fillRect(29,29,6,6)}),l=new ee(new fe(.19,.19),new G({map:M,alphaTest:.5,side:J,roughness:1}),900),u=new ee(new Ie(.008,.013,1,3),new G({color:"#6d7c4e"}),900),h=new te;let v=0;const S=[[-4,3],[-2,-5],[4,1],[5,-7],[-7,-6],[2,6],[7,7],[-5,9],[0,-13]];for(const[d,x]of S)for(let b=0;b<85;b++){const C=e()*Math.PI*2,P=Math.sqrt(e())*1.65,E=d+Math.cos(C)*P,T=x+Math.sin(C)*P;if(We(E,T)<.1)continue;const A=.28+e()*.25,F=B(E,T);h.position.set(E,F+A,T),h.rotation.set(-Math.PI*.34,e()*6,.1),h.scale.setScalar(.8+e()*.5),h.updateMatrix(),l.setMatrixAt(v,h.matrix),h.position.y=F+A/2,h.rotation.set(0,0,0),h.scale.set(1,A,1),h.updateMatrix(),u.setMatrixAt(v,h.matrix),v++}return l.count=u.count=v,l.receiveShadow=!0,t.add(l,u),{grass:f,flowers:v,setDensity:d=>{f.setOptions({density:d}),f.blades.castShadow=!1}}}function ei(t){const e=Ue(208),i=new te,r=re(l=>{const u=["#a5ac87","#819064","#c1c49c","#96a176"];for(let h=0;h<32;h++){const v=e()*60,S=e()*60;l.fillStyle=u[h%4],l.beginPath(),l.ellipse(v,S,3+e()*5,2+e()*3,e()*Math.PI,0,Math.PI*2),l.fill()}}),o=new G({map:r,color:"#e1e3c7",alphaTest:.5,side:J,roughness:1}),s=new ee(new fe(1,1),o,6500);let n=0;const a=re(l=>{l.fillStyle="#95998a",l.fillRect(0,0,64,64);for(let u=0;u<75;u++)l.fillStyle=u%3?"#4b5246":"#bbc0ae",l.fillRect(e()*64,e()*64,2+e()*16,1+e()*2)});a.wrapS=a.wrapT=Ne,a.repeat.set(1,6);const c=new G({map:a,roughness:1}),w=new G({color:"#414b38",roughness:1}),m=[],f=(l,u,h,v)=>{const S=new Ie(v,h,l.distanceTo(u),7,2);S.applyQuaternion(new de().setFromUnitVectors(new y(0,1,0),u.clone().sub(l).normalize())),S.translate((l.x+u.x)/2,(l.y+u.y)/2,(l.z+u.z)/2),m.push(S)},M=[{x:-6,z:1,h:9},{x:5,z:-6,h:10.5},{x:-3,z:-15,h:11}];for(const{x:l,z:u,h}of M){const v=B(l,u),S=new y(l+.4,v+h,u);f(new y(l,v,u),S,.24,.055);for(let d=0;d<8;d++){const x=d*2.399,b=.36+d*.065,C=1.3+e()*1.4,P=new y(l+.4*b,v+h*b,u),E=new y(l+Math.cos(x)*C,v+h*(b+.17),u+Math.sin(x)*C);f(P,E,.065,.017);for(let T=0;T<210;T++){const A=e()*Math.PI*2,F=Math.sqrt(e())*1.75;i.position.set(E.x+Math.cos(A)*F,E.y+(e()-.5)*1.7,E.z+Math.sin(A)*F),i.rotation.set((e()-.5)*2,e()*Math.PI*2,(e()-.5)*1.4),i.scale.setScalar(.6+e()*.6),i.updateMatrix(),s.setMatrixAt(n,i.matrix),s.setColorAt(n,new p().setHSL(.21+e()*.035,.16+e()*.1,.56+e()*.18)),n++}}}for(const[l,u]of[[-7,6],[7,3],[-6,-8],[7,-13],[-8,-14],[6,9]])for(let h=0;h<180;h++){const v=e()*6.28,S=Math.sqrt(e())*1.5;i.position.set(l+Math.cos(v)*S,B(l,u)+.25+e()*.95,u+Math.sin(v)*S),i.rotation.set(e()*2,e()*6,e()),i.scale.setScalar(.55+e()*.4),i.updateMatrix(),s.setMatrixAt(n,i.matrix),s.setColorAt(n,new p("#a6b58a")),n++}return s.count=n,s.castShadow=!0,s.receiveShadow=!0,t.add(s),{branches:m,trunkMat:c,darkBark:w,leafCount:n}}const ti={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform float opacity;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = opacity * texel;


		}`};class X{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}}const ii=new He(-1,1,1,-1,0,1);class ri extends pe{constructor(){super(),this.setAttribute("position",new ie([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new ie([0,2,0,0,2,0],2))}}const si=new ri;class tt{constructor(e){this._mesh=new Q(si,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,ii)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}}class xe extends X{constructor(e,i="tDiffuse"){super(),this.textureID=i,this.uniforms=null,this.material=null,e instanceof he?(this.uniforms=e.uniforms,this.material=e):e&&(this.uniforms=me.clone(e.uniforms),this.material=new he({name:e.name!==void 0?e.name:"unspecified",defines:Object.assign({},e.defines),uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader})),this._fsQuad=new tt(this.material)}render(e,i,r){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=r.texture),this._fsQuad.material=this.material,this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(i),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}}class De extends X{constructor(e,i){super(),this.scene=e,this.camera=i,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(e,i,r){const o=e.getContext(),s=e.state;s.buffers.color.setMask(!1),s.buffers.depth.setMask(!1),s.buffers.color.setLocked(!0),s.buffers.depth.setLocked(!0);let n,a;this.inverse?(n=0,a=1):(n=1,a=0),s.buffers.stencil.setTest(!0),s.buffers.stencil.setOp(o.REPLACE,o.REPLACE,o.REPLACE),s.buffers.stencil.setFunc(o.ALWAYS,n,4294967295),s.buffers.stencil.setClear(a),s.buffers.stencil.setLocked(!0),e.setRenderTarget(r),this.clear&&e.clear(),e.render(this.scene,this.camera),e.setRenderTarget(i),this.clear&&e.clear(),e.render(this.scene,this.camera),s.buffers.color.setLocked(!1),s.buffers.depth.setLocked(!1),s.buffers.color.setMask(!0),s.buffers.depth.setMask(!0),s.buffers.stencil.setLocked(!1),s.buffers.stencil.setFunc(o.EQUAL,1,4294967295),s.buffers.stencil.setOp(o.KEEP,o.KEEP,o.KEEP),s.buffers.stencil.setLocked(!0)}}class oi extends X{constructor(){super(),this.needsSwap=!1}render(e){e.state.buffers.stencil.setLocked(!1),e.state.buffers.stencil.setTest(!1)}}class ni{constructor(e,i){if(this.renderer=e,this._pixelRatio=e.getPixelRatio(),i===void 0){const r=e.getSize(new z);this._width=r.width,this._height=r.height,i=new ht(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:dt}),i.texture.name="EffectComposer.rt1"}else this._width=i.width,this._height=i.height;this.renderTarget1=i,this.renderTarget2=i.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new xe(ti),this.copyPass.material.blending=ft,this.clock=new gt}swapBuffers(){const e=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=e}addPass(e){this.passes.push(e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(e,i){this.passes.splice(i,0,e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(e){const i=this.passes.indexOf(e);i!==-1&&this.passes.splice(i,1)}isLastEnabledPass(e){for(let i=e+1;i<this.passes.length;i++)if(this.passes[i].enabled)return!1;return!0}render(e){e===void 0&&(e=this.clock.getDelta());const i=this.renderer.getRenderTarget();let r=!1;for(let o=0,s=this.passes.length;o<s;o++){const n=this.passes[o];if(n.enabled!==!1){if(n.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(o),n.render(this.renderer,this.writeBuffer,this.readBuffer,e,r),n.needsSwap){if(r){const a=this.renderer.getContext(),c=this.renderer.state.buffers.stencil;c.setFunc(a.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,e),c.setFunc(a.EQUAL,1,4294967295)}this.swapBuffers()}De!==void 0&&(n instanceof De?r=!0:n instanceof oi&&(r=!1))}}this.renderer.setRenderTarget(i)}reset(e){if(e===void 0){const i=this.renderer.getSize(new z);this._pixelRatio=this.renderer.getPixelRatio(),this._width=i.width,this._height=i.height,e=this.renderTarget1.clone(),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=e,this.renderTarget2=e.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(e,i){this._width=e,this._height=i;const r=this._width*this._pixelRatio,o=this._height*this._pixelRatio;this.renderTarget1.setSize(r,o),this.renderTarget2.setSize(r,o);for(let s=0;s<this.passes.length;s++)this.passes[s].setSize(r,o)}setPixelRatio(e){this._pixelRatio=e,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}}class ai extends X{constructor(e,i,r=null,o=null,s=null){super(),this.scene=e,this.camera=i,this.overrideMaterial=r,this.clearColor=o,this.clearAlpha=s,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this._oldClearColor=new p}render(e,i,r){const o=e.autoClear;e.autoClear=!1;let s,n;this.overrideMaterial!==null&&(n=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(e.getClearColor(this._oldClearColor),e.setClearColor(this.clearColor,e.getClearAlpha())),this.clearAlpha!==null&&(s=e.getClearAlpha(),e.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&e.clearDepth(),e.setRenderTarget(this.renderToScreen?null:r),this.clear===!0&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),e.render(this.scene,this.camera),this.clearColor!==null&&e.setClearColor(this._oldClearColor),this.clearAlpha!==null&&e.setClearAlpha(s),this.overrideMaterial!==null&&(this.scene.overrideMaterial=n),e.autoClear=o}}const $={name:"OutputShader",uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
		precision highp float;

		uniform mat4 modelViewMatrix;
		uniform mat4 projectionMatrix;

		attribute vec3 position;
		attribute vec2 uv;

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		precision highp float;

		uniform sampler2D tDiffuse;

		#include <tonemapping_pars_fragment>
		#include <colorspace_pars_fragment>

		varying vec2 vUv;

		void main() {

			gl_FragColor = texture2D( tDiffuse, vUv );

			// tone mapping

			#ifdef LINEAR_TONE_MAPPING

				gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );

			#elif defined( REINHARD_TONE_MAPPING )

				gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );

			#elif defined( CINEON_TONE_MAPPING )

				gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );

			#elif defined( ACES_FILMIC_TONE_MAPPING )

				gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );

			#elif defined( AGX_TONE_MAPPING )

				gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );

			#elif defined( NEUTRAL_TONE_MAPPING )

				gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );

			#elif defined( CUSTOM_TONE_MAPPING )

				gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );

			#endif

			// color space

			#ifdef SRGB_TRANSFER

				gl_FragColor = sRGBTransferOETF( gl_FragColor );

			#endif

		}`};class li extends X{constructor(){super(),this.uniforms=me.clone($.uniforms),this.material=new mt({name:$.name,uniforms:this.uniforms,vertexShader:$.vertexShader,fragmentShader:$.fragmentShader}),this._fsQuad=new tt(this.material),this._outputColorSpace=null,this._toneMapping=null}render(e,i,r){this.uniforms.tDiffuse.value=r.texture,this.uniforms.toneMappingExposure.value=e.toneMappingExposure,(this._outputColorSpace!==e.outputColorSpace||this._toneMapping!==e.toneMapping)&&(this._outputColorSpace=e.outputColorSpace,this._toneMapping=e.toneMapping,this.material.defines={},pt.getTransfer(this._outputColorSpace)===wt&&(this.material.defines.SRGB_TRANSFER=""),this._toneMapping===vt?this.material.defines.LINEAR_TONE_MAPPING="":this._toneMapping===bt?this.material.defines.REINHARD_TONE_MAPPING="":this._toneMapping===xt?this.material.defines.CINEON_TONE_MAPPING="":this._toneMapping===qe?this.material.defines.ACES_FILMIC_TONE_MAPPING="":this._toneMapping===Mt?this.material.defines.AGX_TONE_MAPPING="":this._toneMapping===yt?this.material.defines.NEUTRAL_TONE_MAPPING="":this._toneMapping===St&&(this.material.defines.CUSTOM_TONE_MAPPING=""),this.material.needsUpdate=!0),this.renderToScreen===!0?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(i),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}}function it(t){const e=t.length,i=1,r=new Uint8Array(e*4);for(let s=0;s<t.length;s++){const n=t[s];r[s*4]=Math.floor(n.r*255),r[s*4+1]=Math.floor(n.g*255),r[s*4+2]=Math.floor(n.b*255),r[s*4+3]=255}const o=new Oe(r,e,i,Ct,_t);return o.needsUpdate=!0,o}function ke(t=0,e=!0){const i=Math.min(16,Math.floor(Math.pow(t+1,.3333333333333333))),r=[];let o=i-1;for(let s=0;s<i;s++)for(let n=0;n<i;n++)for(let a=0;a<i;a++)r.push(new p(s/o,n/o,a/o));if(e){const s=r.length;for(o=t-s-1;r.length<t;){const n=(r.length-s)/o;r.push(new p(n,n,n))}}return r}function rt(t){let e=[];switch(!0){case t>16:{e=ke(t);break}case t>8:{e=[new p(0),new p(170),new p(43520),new p(43690),new p(11141120),new p(11141290),new p(11162880),new p(11184810),new p(5592405),new p(5592575),new p(5635925),new p(5636095),new p(16733525),new p(16733695),new p(16777045),new p(16777215)];break}case t>4:{e=ke(t);break}case t>2:{e=[new p(0),new p(5636095),new p(16733695),new p(16777215)];break}case t>=0:{e=[new p(0),new p(16777215)];break}default:throw new Error(`Invalid colorCount: ${t}`)}return e.length!==t&&console.warn(`${t} colour palette not available, returned ${e.length}.`),e}const ci={uniforms:{tDiffuse:{value:null},uResolution:{value:new z(320,200)},uColorCount:{value:16},uColorTexture:{value:it(rt(16))},uDithering:{value:!0},uDitheringOffset:{value:.2},uIsQuantized:{value:!0},uInverted:{value:!1}},vertexShader:`
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,fragmentShader:`
    uniform sampler2D tDiffuse;
    uniform vec2 uResolution;
    uniform int uColorCount;
    uniform sampler2D uColorTexture;
    uniform bool uDithering;
    uniform float uDitheringOffset;
    uniform bool uIsQuantized;
    uniform bool uInverted;

    varying vec2 vUv;

    // Bayer matrix 4x4
    const float bayer4x4[16] = float[16](
      0.0 / 16.0, 8.0 / 16.0, 2.0 / 16.0, 10.0 / 16.0,
      12.0 / 16.0, 4.0 / 16.0, 14.0 / 16.0, 6.0 / 16.0,
      3.0 / 16.0, 11.0 / 16.0, 1.0 / 16.0, 9.0 / 16.0,
      15.0 / 16.0, 7.0 / 16.0, 13.0 / 16.0, 5.0 / 16.0
    );

    // Optimized: Directly quantize to the nearest cube color, no brute-force search
    vec3 quantizeToNearestCubeColor(vec3 c, int colorCount) {
      // Find largest N such that N^3 <= colorCount
      float stepsF = floor(pow(float(colorCount), 1.0/3.0));
      float maxIdx = stepsF - 1.0;

      // Quantize each channel to nearest step
      float r = floor(c.r * maxIdx + 0.5) / maxIdx;
      float g = floor(c.g * maxIdx + 0.5) / maxIdx;
      float b = floor(c.b * maxIdx + 0.5) / maxIdx;

      return vec3(r, g, b);
    }

    void main() {
      // Compute retro UV for pixelation
      vec2 retroUV = (floor(vUv * uResolution) + 0.5) / uResolution;
      vec3 c = texture2D(tDiffuse, retroUV).rgb;

      if (uInverted) {
        c = 1.0 - c;
      }

      // Compute retro pixel coordinates
      vec2 retroCoord = floor(vUv * uResolution);

      if (uDithering) {
        float offset = 0.0;
        // Skip dithering for pure black pixels
        if (!(c.r == 0.0 && c.g == 0.0 && c.b == 0.0)) {
          int ix = int(mod(retroCoord.x, 4.0));
          int iy = int(mod(retroCoord.y, 4.0));
          float bayer = bayer4x4[iy * 4 + ix];
          offset = (bayer - 0.5) * uDitheringOffset;
        }
        c += vec3(offset);
        c = clamp(c, 0.0, 1.0);
      }

      vec3 closestColor = vec3(0.0);

      // By default we use brute-force small palettes, quantize large
      if (uIsQuantized == false || uColorCount < 27) {
        float minDist = 1e6;
        for (int i = 0; i < uColorCount; i++) {
          vec3 paletteColor = texture2D(uColorTexture, vec2((float(i) + 0.5) / float(uColorCount), 0.5)).rgb;
          float dist = distance(c, paletteColor);
          if (dist < minDist) {
            minDist = dist;
            closestColor = paletteColor;
          }
        }
      } else {
        closestColor = quantizeToNearestCubeColor(c, uColorCount);
      }

      gl_FragColor = vec4(closestColor, 1.0);
    }
  `},st=2,ot=4096;Array.from({length:ot-st+1}).map((t,e)=>e+2);function Ge(t){return t===W.clamp(t,st,ot)}var k=function(t,e,i,r){if(i==="a"&&!r)throw new TypeError("Private accessor was defined without a getter");if(typeof e=="function"?t!==e||!r:!e.has(t))throw new TypeError("Cannot read private member from an object whose class did not declare it");return i==="m"?r:i==="a"?r.call(t):r?r.value:e.get(t)},Y=function(t,e,i,r,o){if(r==="m")throw new TypeError("Private method is not writable");if(r==="a"&&!o)throw new TypeError("Private accessor was defined without a setter");if(typeof e=="function"?t!==e||!o:!e.has(t))throw new TypeError("Cannot write private member to an object whose class did not declare it");return r==="a"?o.call(t,i):o?o.value=i:e.set(t,i),i},K,H,q,j;class ui extends xe{constructor({colorCount:e=16,colorPalette:i,dithering:r=!0,ditheringOffset:o=.2,autoDitheringOffset:s=!1,pixelRatio:n=.25,resolution:a=new z(320,200),autoResolution:c=!1}={}){super(ci),Object.defineProperty(this,"size",{enumerable:!0,configurable:!0,writable:!0,value:new z}),K.set(this,void 0),H.set(this,!1),q.set(this,!1),j.set(this,0),this.dithering=r,this.ditheringOffset=o,this.autoDitheringOffset=s,this.pixelRatio=n,this.resolution=a,this.autoResolution=c,i?this.colorPalette=i:this.colorCount=e}get resolution(){return this.uniforms.uResolution.value}set resolution(e){e.equals(this.uniforms.uResolution.value)||this.uniforms.uResolution.value.copy(e)}get autoResolution(){return k(this,q,"f")}set autoResolution(e){k(this,q,"f")!==e&&(Y(this,q,e,"f"),this.updateResolution())}get pixelRatio(){return k(this,j,"f")}set pixelRatio(e){k(this,j,"f")!==e&&(Y(this,j,e,"f"),this.updateResolution())}get colorCount(){return this.uniforms.uColorCount.value}set colorCount(e){if(e!==this.colorCount){if(!Ge(e))throw new Error("Invalid colorPalette, must contain between 2 and 4096 colours");this.uniforms.uIsQuantized.value=!0,this.setColorPalette(rt(e))}}get colorPalette(){return k(this,K,"f")}set colorPalette(e){const i=e?.length;if(!Ge(i))throw new Error("Invalid colorPalette, must contain between 2 and 4096 colours");this.uniforms.uIsQuantized.value=!1,this.setColorPalette(e)}get dithering(){return this.uniforms.uDithering.value}set dithering(e){this.uniforms.uDithering.value=e}get ditheringOffset(){return this.uniforms.uDitheringOffset.value}set ditheringOffset(e){this.uniforms.uDitheringOffset.value=e}get autoDitheringOffset(){return k(this,H,"f")}set autoDitheringOffset(e){k(this,H,"f")!==e&&(Y(this,H,e,"f"),e&&this.updateDitheringOffset())}get inverted(){return this.uniforms.uInverted.value}set inverted(e){this.uniforms.uInverted.value=e}setSize(e,i){this.size.set(e,i),this.updateResolution()}updateResolution(){this.autoResolution&&this.resolution.set(this.size.x*this.pixelRatio,this.size.y*this.pixelRatio)}updateDitheringOffset(){this.autoDitheringOffset&&(this.ditheringOffset=.03+.97/(this.colorCount-1))}setColorPalette(e){const i=e?.length,r=it(e);this.uniforms.uColorCount.value=i,this.uniforms.uColorTexture.value?.dispose(),this.uniforms.uColorTexture.value=r,this.autoDitheringOffset&&this.updateDitheringOffset(),Y(this,K,e.slice(),"f")}}K=new WeakMap,H=new WeakMap,q=new WeakMap,j=new WeakMap;const ge={light:.008,medium:.018,dense:.031},Le={pixelSize:2,renderScale:.75,colors:4096,fog:ge.medium,brightness:1,saturation:.78,density:65,pixelated:!0,animated:!0};class hi{constructor(e,i,r){this.renderer=e,this.composer=new ni(e),this.composer.addPass(new ai(i,r)),this.grade=new xe({uniforms:{tDiffuse:{value:null},saturation:{value:.78}},vertexShader:"varying vec2 vUv; void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}",fragmentShader:"uniform sampler2D tDiffuse; uniform float saturation; varying vec2 vUv;void main(){vec3 c=texture2D(tDiffuse,vUv).rgb;float l=dot(c,vec3(.2126,.7152,.0722));gl_FragColor=vec4(mix(vec3(l),c,saturation),1.);}"}),this.composer.addPass(this.grade),this.composer.addPass(new li),this.retro=new ui({colorCount:4096,dithering:!1,autoResolution:!1,resolution:new z(640,400)}),this.retro.material.toneMapped=!1,this.composer.addPass(this.retro)}renderer;composer;retro;grade;resize(e,i,r){const o=r.pixelated?r.renderScale:1,s=Math.max(1,Math.floor(e*o)),n=Math.max(1,Math.floor(i*o));this.renderer.setSize(s,n,!1),this.composer.setSize(s,n),this.retro.resolution=new z(Math.max(1,Math.floor(s/r.pixelSize)),Math.max(1,Math.floor(n/r.pixelSize))),this.retro.enabled=r.pixelated,this.retro.colorCount!==r.colors&&(this.retro.colorCount=r.colors),this.grade.uniforms.saturation.value=r.saturation}render(){this.composer.render()}dispose(){this.retro.uniforms.uColorTexture.value?.dispose();for(const e of this.composer.passes)e.dispose();this.composer.dispose()}}function di(){const t=new URLSearchParams(location.search);t.has("capture")&&document.body.classList.add("capture");const e={...Le};t.has("still")&&(e.animated=!1);const i=document.querySelector("#forest"),r=new Pt({canvas:i,antialias:!1,powerPreference:"high-performance"});r.setPixelRatio(1),r.shadowMap.enabled=!0,r.shadowMap.type=At,r.outputColorSpace=Be,r.toneMapping=qe,r.toneMappingExposure=1,r.info.autoReset=!1;const o=new Rt;o.background=new p("#79836e");const s=new Et("#79836e",e.fog);o.fog=s;const n=new He(-13,13,9,-9,.1,110),a=new y(0,1,-2),c=new y(10,19,24);n.position.copy(a).add(c),n.lookAt(a);const w=new Tt("#cad1bb","#414b32",1.25);o.add(w);const m=new Ft("#e3d4a6",1.75);m.position.set(-10,20,10),m.castShadow=!0,m.shadow.mapSize.set(1024,1024),Object.assign(m.shadow.camera,{left:-20,right:20,top:20,bottom:-20,far:65}),m.shadow.normalBias=.035,m.shadow.bias=-2e-4,m.shadow.radius=3,o.add(m);const f=Jt(o),M=ei(o),l=new Q(zt(M.branches),M.trunkMat);l.castShadow=!0,l.receiveShadow=!0,o.add(l),M.branches.forEach(g=>g.dispose());const u=new Wt("chef");u.root.position.set(.7,B(.7,2),2),u.root.rotation.y=.3,u.root.traverse(g=>{if(g instanceof Q){const _=g.material.clone();_.flatShading=!1,g.material=_,g.geometry=g.geometry.clone(),g.geometry.computeVertexNormals()}}),o.add(u.root),r.shadowMap.autoUpdate=!1,r.shadowMap.needsUpdate=!0;const h=new hi(r,o,n),v=[["pixelSize","Pixel Size",1,5,1],["renderScale","Render Scale",.5,1,.05],["colors","Color Quantization",64,4096,64],["fog","Fog Density",0,.065,.001],["brightness","Environment Brightness",.5,1.5,.05],["saturation","Color Saturation",0,1.2,.05],["density","Grass Density",15,100,5]],S=document.querySelector("#fields");for(const[g,_,R,le,O]of v){const N=document.createElement("label");N.innerHTML=`<span>${_}</span><output id="${g}-value"></output><input aria-label="${_}" id="${g}" type="range" min="${R}" max="${le}" step="${O}">`,S.append(N);const U=N.querySelector("input");U.addEventListener(g==="density"?"change":"input",()=>C({[g]:Number(U.value)}))}const d=document.querySelector("#pixelated"),x=document.querySelector("#wind");d.addEventListener("change",()=>C({pixelated:d.checked})),x.addEventListener("change",()=>C({animated:x.checked})),document.querySelectorAll("[data-fog]").forEach(g=>g.addEventListener("click",()=>C({fog:ge[g.dataset.fog]}))),document.querySelector("#reset").addEventListener("click",()=>C({...Le}));function b(){const g=innerWidth/innerHeight,_=g<1?14:9;n.left=-_*g,n.right=_*g,n.top=_,n.bottom=-_,n.updateProjectionMatrix(),h.resize(innerWidth,innerHeight,e)}function C(g){const _=e.density;Object.assign(e,g),s.density=e.fog,w.intensity=1.25*e.brightness,m.intensity=1.75*e.brightness,f.grass.setOptions({brightness:e.brightness}),_!==e.density&&f.setDensity(e.density);for(const[R]of v)document.getElementById(R).value=String(e[R]),document.getElementById(R+"-value").textContent=String(e[R]);d.checked=e.pixelated,x.checked=e.animated,document.querySelectorAll("[data-fog]").forEach(R=>R.classList.toggle("active",Math.abs(e.fog-ge[R.dataset.fog])<1e-4)),b()}window.addEventListener("resize",b),C({}),innerWidth<650&&(document.querySelector("#panel").open=!1);let P=null,E=0,T=0;const A=a.clone(),F=a.clone(),Me=a.clone();i.addEventListener("pointerdown",g=>{P=g.pointerId,E=g.clientX,T=g.clientY,i.setPointerCapture(g.pointerId)}),i.addEventListener("pointermove",g=>{P===g.pointerId&&(A.x=W.clamp(A.x-(g.clientX-E)*.015,-3,3),A.z=W.clamp(A.z-(g.clientY-T)*.015,-6,2),E=g.clientX,T=g.clientY)});for(const g of["pointerup","pointercancel","lostpointercapture"])i.addEventListener(g,()=>P=null);const se=new y().setFromMatrixColumn(n.matrixWorld,0),oe=new y().setFromMatrixColumn(n.matrixWorld,1);let ye=performance.now(),ne=0,Se=0,Ce=0,ae=0,_e=!1,L={fps:0,frameMs:0,calls:0,triangles:0};const nt=document.querySelector("#stats");function Pe(g=performance.now()){if(_e)return;requestAnimationFrame(Pe);const _=Math.max(0,(g-ye)/1e3),R=Math.min(_,.1);if(ye=g,ne+=_,e.animated&&(Se+=R,u.update(R,"idle")),f.grass.update(Se),a.lerp(A,1-Math.exp(-5*R)),F.copy(a),e.pixelated){const O=(n.right-n.left)/h.retro.resolution.x,N=a.dot(se)-Me.dot(se),U=a.dot(oe)-Me.dot(oe);F.addScaledVector(se,Math.round(N/O)*O-N).addScaledVector(oe,Math.round(U/O)*O-U)}n.position.copy(F).add(c),n.lookAt(F),r.info.reset();const le=performance.now();h.render(),ae+=performance.now()-le,Ce++,Ce%20===0&&(L={fps:Math.round(20/Math.max(ne,.001)),frameMs:Math.round(ae/20*10)/10,calls:r.info.render.calls,triangles:r.info.render.triangles},ae=0,ne=0,nt.textContent=`${L.fps} FPS · ${L.frameMs} ms CPU提交 · ${L.calls} calls
${f.grass.bladeCount.toLocaleString()} 草叶 · ${L.triangles.toLocaleString()} 三角形`)}i.addEventListener("webglcontextlost",g=>{g.preventDefault(),_e=!0;const _=document.querySelector("#failure");_.hidden=!1,_.textContent="WebGL 画面连接中断，请刷新重试。"}),Object.defineProperty(window,"__artLab",{value:{apply:C,getState:()=>({settings:{...e},metrics:{...L,calls:r.info.render.calls,triangles:r.info.render.triangles},grass:f.grass.bladeCount,leaves:M.leafCount,flowers:f.flowers,camera:n.position.toArray(),resolution:h.retro.resolution.toArray()}),setStill:()=>C({animated:!1}),resetCamera:()=>{A.set(0,1,-2),a.copy(A)}},configurable:!0}),Pe()}try{di()}catch(t){console.error(t);const e=document.querySelector("#failure");e.hidden=!1,e.textContent="森林预览无法启动，请使用支持 WebGL2 的浏览器。"}
