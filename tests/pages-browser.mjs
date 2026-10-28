import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
const base=process.env.PAGES_TEST_BASE||'http://127.0.0.1:4180/potato-not-today/';
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
try{
 for(const route of ['', 'atmospheric.html']){
  const page=await browser.newPage({viewport:{width:800,height:600}}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));page.on('console',e=>{if(e.type()==='error')errors.push(e.text());});page.on('response',r=>{if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`);});
  const response=await page.goto(base+route,{timeout:90000});assert.equal(response.status(),200);
  if(route){await page.waitForFunction(()=>window.__artLab);assert.equal(await page.locator('header a').evaluate(a=>a.href),base);}
  else{
   await page.waitForTimeout(300);assert.ok(await page.locator('#error').isHidden());assert.ok((await page.locator('canvas').evaluate(c=>c.toDataURL().length))>4000);
   assert.equal(await page.evaluate(()=>typeof window.__potato),'undefined');assert.equal(await page.evaluate(()=>typeof window.__courtyardTest),'undefined');
   await page.locator('#quality').focus();await page.keyboard.press('ArrowUp');assert.equal(await page.locator('#quality').inputValue(),'light');
   assert.equal(await page.locator('.lab-link').evaluate(a=>a.href),base+'atmospheric.html');
  }
  assert.deepEqual(errors,[]);console.log('PASS production '+base+route);await page.close();
 }
}finally{await browser.close();}
