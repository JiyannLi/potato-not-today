import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
import {mkdir,writeFile,readFile} from 'node:fs/promises';
const base=process.env.ART_BASE_URL||'http://127.0.0.1:5173';
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const page=await browser.newPage({viewport:{width:1440,height:1000},deviceScaleFactor:1});const errors=[];
page.on('pageerror',e=>errors.push(e.message));page.on('console',e=>{if(e.type()==='error')errors.push(e.text());});
await page.goto(base+'/atmospheric.html?capture&still');await page.waitForFunction(()=>window.__artLab);await page.waitForTimeout(1200);
await mkdir('docs/art-v12',{recursive:true});
const results={renderer:await page.evaluate(()=>{const gl=document.querySelector('canvas').getContext('webgl2');const ext=gl.getExtension('WEBGL_debug_renderer_info');return ext?gl.getParameter(ext.UNMASKED_RENDERER_WEBGL):gl.getParameter(gl.RENDERER);}),viewport:{width:1440,height:1000},presets:{}};
for(const [name,fog] of [['light',.008],['medium',.018],['dense',.031],['unpixelated',.018]]){
 await page.evaluate(({fog,name})=>window.__artLab.apply({fog,pixelated:name!=='unpixelated',animated:false}),{fog,name});await page.waitForTimeout(400);await page.screenshot({path:`docs/art-v12/${name}.png`});results.presets[name]=await page.evaluate(()=>window.__artLab.getState());
}
await page.evaluate(()=>window.__artLab.apply({fog:.018,pixelated:true,animated:false}));await page.waitForTimeout(100);const repeated=await page.screenshot();assert.ok(repeated.equals(await readFile('docs/art-v12/medium.png')),'static pixel frame changed');results.staticFrameIdentical=true;
await page.evaluate(()=>window.__artLab.apply({pixelated:true,animated:true}));
results.frames=await page.evaluate(()=>new Promise(resolve=>{const samples=[];let prev=performance.now();function frame(now){samples.push(now-prev);prev=now;if(samples.length<65)requestAnimationFrame(frame);else{const a=samples.slice(5).sort((a,b)=>a-b);resolve({samples:a.length,medianMs:a[Math.floor(a.length*.5)],p95Ms:a[Math.floor(a.length*.95)],averageFps:1000/(a.reduce((x,y)=>x+y,0)/a.length)});}}requestAnimationFrame(frame);}));
await page.goto(base+'/atmospheric.html?still');await page.waitForFunction(()=>window.__artLab);
await page.locator('[data-fog="dense"]').click();assert.equal((await page.evaluate(()=>window.__artLab.getState())).settings.fog,.031);
await page.getByLabel('Grass Density',{exact:true}).fill('30');await page.getByLabel('Grass Density',{exact:true}).dispatchEvent('change');const low=await page.evaluate(()=>window.__artLab.getState());assert.ok(low.grass<results.presets.medium.grass);
await page.getByLabel('Pixel Size',{exact:true}).fill('4');await page.getByLabel('Render Scale',{exact:true}).fill('0.5');let state=await page.evaluate(()=>window.__artLab.getState());assert.equal(state.resolution[0],180);
await page.locator('#pixelated').uncheck();state=await page.evaluate(()=>window.__artLab.getState());assert.equal(state.settings.pixelated,false);
await page.locator('#reset').click();state=await page.evaluate(()=>window.__artLab.getState());assert.equal(state.settings.pixelSize,2);assert.equal(state.settings.density,65);
await page.screenshot({path:'docs/art-v12/panel.png'});
await page.setViewportSize({width:390,height:844});await page.waitForTimeout(400);await page.screenshot({path:'docs/art-v12/mobile.png'});assert.ok(await page.locator('#failure').isHidden());
results.errors=errors;await writeFile('docs/art-v12/measurements.json',JSON.stringify(results,null,2));console.log(JSON.stringify(results,null,2));await browser.close();assert.deepEqual(errors,[]);
