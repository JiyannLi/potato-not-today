import * as T from 'three';
import {EffectComposer} from 'three/addons/postprocessing/EffectComposer.js';
import {RenderPass} from 'three/addons/postprocessing/RenderPass.js';
import {OutputPass} from 'three/addons/postprocessing/OutputPass.js';
import {ShaderPass} from 'three/addons/postprocessing/ShaderPass.js';
import {RetroPass} from '@mesmotronic/three-retropass';
export const FOG={light:.008,medium:.018,dense:.031} as const;
export const DEFAULTS={pixelSize:2,renderScale:.75,colors:4096,fog:FOG.medium,brightness:1,saturation:.78,density:65,pixelated:true,animated:true};
export type Settings={pixelSize:number;renderScale:number;colors:number;fog:number;brightness:number;saturation:number;density:number;pixelated:boolean;animated:boolean};
export class PixelPipeline {
 readonly composer:EffectComposer;readonly retro:RetroPass;private grade:ShaderPass;
 constructor(readonly renderer:T.WebGLRenderer,scene:T.Scene,camera:T.Camera){
 this.composer=new EffectComposer(renderer);this.composer.addPass(new RenderPass(scene,camera));
 this.grade=new ShaderPass({uniforms:{tDiffuse:{value:null},saturation:{value:.78}},vertexShader:'varying vec2 vUv; void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',fragmentShader:'uniform sampler2D tDiffuse; uniform float saturation; varying vec2 vUv;void main(){vec3 c=texture2D(tDiffuse,vUv).rgb;float l=dot(c,vec3(.2126,.7152,.0722));gl_FragColor=vec4(mix(vec3(l),c,saturation),1.);}'});
 this.composer.addPass(this.grade);this.composer.addPass(new OutputPass());
 // Quantize display-referred color, after tone mapping/sRGB conversion, without double conversion.
 this.retro=new RetroPass({colorCount:4096,dithering:false,autoResolution:false,resolution:new T.Vector2(640,400)});this.retro.material.toneMapped=false;this.composer.addPass(this.retro);
 }
 resize(w:number,h:number,s:Settings){
 const scale=s.pixelated?s.renderScale:1;
 const width=Math.max(1,Math.floor(w*scale)),height=Math.max(1,Math.floor(h*scale));
 this.renderer.setSize(width,height,false);this.composer.setSize(width,height);
 this.retro.resolution=new T.Vector2(Math.max(1,Math.floor(width/s.pixelSize)),Math.max(1,Math.floor(height/s.pixelSize)));
 this.retro.enabled=s.pixelated;if(this.retro.colorCount!==s.colors)this.retro.colorCount=s.colors;
 this.grade.uniforms.saturation.value=s.saturation;
 }
 render(){this.composer.render();}
 dispose(){this.retro.uniforms.uColorTexture.value?.dispose();for(const p of this.composer.passes)p.dispose();this.composer.dispose();}
}
