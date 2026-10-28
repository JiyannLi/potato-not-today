import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
const b=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
try{
 const p=await b.newPage({viewport:{width:1440,height:1000}});const errors=[];p.on('pageerror',e=>errors.push(e.message));p.on('console',e=>{if(e.type()==='error')errors.push(e.text());});await p.goto('http://127.0.0.1:5173/atmospheric.html?still');await p.waitForFunction(()=>window.__artLab);
 const a=await p.evaluate(()=>window.__artLab.getState());await p.mouse.move(450,700);await p.mouse.down();await p.mouse.move(540,730);await p.mouse.up();await p.waitForTimeout(500);const moved=await p.evaluate(()=>window.__artLab.getState());assert.notDeepEqual(moved.camera,a.camera);
 await p.evaluate(()=>window.__artLab.resetCamera());await p.locator('[data-fog="dense"]').click();assert.equal((await p.evaluate(()=>window.__artLab.getState())).settings.fog,.031);
 await p.getByLabel('Grass Density',{exact:true}).fill('30');await p.getByLabel('Grass Density',{exact:true}).dispatchEvent('change');assert.ok((await p.evaluate(()=>window.__artLab.getState())).grass<a.grass);await p.locator('#reset').click();await p.locator('#wind').uncheck();
 await p.waitForTimeout(300);await p.screenshot({path:'docs/art-v12/panel.png'});console.log('current scene',await p.evaluate(()=>window.__artLab.getState()));
 await p.close();
 const m=await b.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});m.on('pageerror',e=>errors.push(e.message));await m.goto('http://127.0.0.1:5173/atmospheric.html?still',{timeout:90000});await m.waitForFunction(()=>window.__artLab);assert.equal(await m.locator('#panel').getAttribute('open'),null);await m.screenshot({path:'docs/art-v12/mobile.png'});assert.deepEqual(errors,[]);console.log('Controls, camera drag, density rebuild, mobile collapse, console: PASS');
}finally{await b.close();}
