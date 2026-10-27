import {chromium,expect} from '@playwright/test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {industries,services,firm} from '../lib/firm-content.js';
const base=process.env.PREVIEW_URL||'http://localhost:3017';
await fs.mkdir('verification/restored',{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true});
const results=[];
try{
 for(const width of [1440,390]){
  const page=await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce'});
  for(const route of ['/','/about','/services','/contact','/insights']){
   const errors=[];const listener=e=>errors.push(e.message);page.on('pageerror',listener);
   const response=await page.goto(base+route,{waitUntil:'domcontentloaded',timeout:120000});
   assert.equal(response.status(),200);
   await page.locator('html[data-elevra-ready="true"]').waitFor();
   await page.evaluate(()=>document.fonts.ready);
   assert.equal(await page.locator('main.firm-page').count(),0,'Redesigned page still active');
   assert.equal(await page.locator('.firm-header,.firm-footer').count(),0,'New header/footer still active');
   const text=await page.locator('body').innerText();
   assert(!/Elevra|Aspen|hello@elevra|Northfield|Arbi Khan/.test(text),'Old template copy on '+route);
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,route+' overflows');
   await expect(page.locator('nav a[data-copy-brand]:visible img')).toHaveAttribute('src',firm.logo);
   if(route==='/'){
    assert.equal(await page.locator('main section').count(),11);
    assert.equal(await page.locator('.framer-p5yxs8').count(),1,'Original hero missing');
    const labels=await page.locator('.framer-9bu4wm').first().locator('[data-framer-name="Filled"] p').allTextContents();
    assert.deepEqual(labels,industries.map(i=>i.name));
   }
   if(route==='/'||route==='/services')for(const service of services)await expect(page.locator('h3:visible').filter({hasText:service.name}).first()).toBeVisible();
   if(route==='/contact'){
    const details=page.locator('.framer-ZcaIH:visible');
    await expect(details.first()).toContainText(firm.address);
    await expect(details.nth(1)).toContainText(firm.hours);
    await expect(details.nth(2)).toContainText(firm.days);
   }
   await page.screenshot({path:'verification/restored/'+(route==='/'?'home':route.slice(1))+'-'+width+'.png',fullPage:true});
   if(route==='/')await page.screenshot({path:'verification/restored/home-'+width+'-viewport.png'});
   assert.deepEqual(errors,[]);
   results.push({route,width,originalDesign:true,brand:true,overflow:false,errors});
   console.log(width+' '+route+' passed');page.off('pageerror',listener);
  }
  if(width===390){await page.getByRole('button',{name:'Toggle navigation'}).click();const menu=page.getByRole('dialog');await expect(menu).toBeVisible();assert.equal(await menu.locator('a[href*="case-study"]').count(),0);await page.screenshot({path:'verification/restored/mobile-menu.png'});await page.keyboard.press('Escape');await expect(menu).toHaveCount(0);}
  await page.close();
 }
}finally{await browser.close();await fs.writeFile('verification/restored/results.json',JSON.stringify(results,null,2));}
console.log('Original layouts and updated copy verified.');
