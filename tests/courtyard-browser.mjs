import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const errors=[],results={viewport:{width:1440,height:1000},qualities:{}};
try{
 const page=await browser.newPage({viewport:results.viewport});page.setDefaultNavigationTimeout(90000);
 page.on('pageerror',e=>errors.push(e.message));page.on('console',e=>{if(e.type()==='error')errors.push(e.text());});
 await mkdir('docs/courtyard-v13',{recursive:true});
 await page.goto('http://127.0.0.1:5173/?capture&still');await page.waitForFunction(()=>window.__potato);await page.screenshot({path:'docs/courtyard-v13/overview.png'});
 for(const quality of ['balanced','light','rich']){
  await page.selectOption('#quality',quality,{force:true});await page.waitForTimeout(200);results.qualities[quality]=await page.evaluate(()=>window.__potato());
 }
 assert.ok(results.qualities.light.grass<results.qualities.balanced.grass);
 assert.ok(results.qualities.rich.grass>results.qualities.balanced.grass);
 assert.ok(results.qualities.rich.leaves>results.qualities.balanced.leaves);
 await page.selectOption('#quality','balanced',{force:true});
 for(const [name,x,z] of [['kitchen',8,-5],['garden',-6.7,-6]]){
  await page.evaluate(([x,z])=>window.__courtyardTest.teleport(x,z),[x,z]);await page.waitForTimeout(300);await page.screenshot({path:`docs/courtyard-v13/${name}.png`});
 }
 await page.close();
 const moving=await browser.newPage({viewport:results.viewport});moving.setDefaultNavigationTimeout(90000);moving.on('pageerror',e=>errors.push(e.message));moving.on('console',e=>{if(e.type()==='error')errors.push(e.text());});
 await moving.goto('http://127.0.0.1:5173/');await moving.waitForFunction(()=>window.__potato);
 await moving.evaluate(()=>window.__courtyardTest.teleport(14.5,10));await moving.keyboard.down('KeyD');
 await moving.waitForFunction(()=>window.__potato().player.x>=14.73,{},{timeout:90000});await moving.waitForTimeout(400);await moving.keyboard.up('KeyD');
 const boundary=await moving.evaluate(()=>window.__potato());assert.ok(boundary.player.x>=14.73&&boundary.player.x<=14.861);results.boundary=boundary;
 await moving.evaluate(()=>window.__courtyardTest.teleport(-.5,2));await moving.waitForTimeout(300);
 results.performancePosition=await moving.evaluate(()=>window.__potato().player);
 // Sequential browser sampling, with no other rendering tab active.
 results.renderer=await moving.evaluate(()=>{const gl=document.querySelector('canvas').getContext('webgl2'),ext=gl.getExtension('WEBGL_debug_renderer_info');return ext?gl.getParameter(ext.UNMASKED_RENDERER_WEBGL):gl.getParameter(gl.RENDERER);});
 results.frames=await moving.evaluate(()=>new Promise(resolve=>{const samples=[];let prev=0;function frame(t){if(prev)samples.push(t-prev);prev=t;if(samples.length<35)requestAnimationFrame(frame);else{const sorted=samples.slice(5).sort((a,b)=>a-b);resolve({samples:sorted.length,medianMs:sorted[Math.floor(sorted.length*.5)],p95Ms:sorted[Math.floor(sorted.length*.95)],averageFps:1000/(sorted.reduce((a,b)=>a+b,0)/sorted.length)});}}requestAnimationFrame(frame);}));
 await moving.evaluate(()=>window.__courtyardTest.teleport(-.5,2));await moving.waitForTimeout(300);await moving.screenshot({path:'docs/courtyard-v13/hud.png'});await moving.close();
 const mobile=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});mobile.setDefaultNavigationTimeout(90000);mobile.on('pageerror',e=>errors.push(e.message));mobile.on('console',e=>{if(e.type()==='error')errors.push(e.text());});
 await mobile.goto('http://127.0.0.1:5173/');await mobile.waitForFunction(()=>window.__potato);assert.equal((await mobile.evaluate(()=>window.__potato())).quality,'light');await mobile.screenshot({path:'docs/courtyard-v13/mobile.png'});await mobile.close();
 results.errors=errors;assert.deepEqual(errors,[]);await writeFile('docs/courtyard-v13/measurements.json',JSON.stringify(results,null,2));console.log(JSON.stringify(results,null,2));
}finally{await browser.close();}
