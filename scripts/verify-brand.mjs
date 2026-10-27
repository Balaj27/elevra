import {chromium,expect} from '@playwright/test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {services,industries,articles,firm} from '../lib/firm-content.js';
const base=process.env.PREVIEW_URL||'http://localhost:3017';
const browser=await chromium.launch({channel:'chrome',headless:true});
await fs.mkdir('verification/firm',{recursive:true});
const results=[];
try{
 for(const width of [1440,390]){
  const page=await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce'});
  for(const route of ['/','/about','/services','/industries','/insights','/contact',...articles.map(a=>'/insights/'+a.slug)]){
   const errors=[];const handler=e=>errors.push(e.message);page.on('pageerror',handler);
   const response=await page.goto(base+route,{waitUntil:'domcontentloaded',timeout:120000});
   assert.equal(response.status(),200);
   await page.locator('html[data-elevra-ready="true"]').waitFor();
   await page.evaluate(()=>document.fonts.ready);
   await expect.poll(()=>page.evaluate(()=>[...document.images].every(i=>i.complete&&i.naturalWidth>0))).toBe(true);
   const text=await page.locator('body').innerText();
   assert(!/Elevra|Aspen|hello@elevra|\+1 234|Northfield|Arbi Khan|40\+|42%/.test(text),'Old template content remains on '+route);
   assert((await page.title()).includes(firm.name));
   assert.equal(await page.locator('.firm-header img').getAttribute('src'),firm.logo);
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,'Overflow '+route+' '+width);
   const internal=await page.locator('a[href]').evaluateAll(a=>a.map(e=>e.getAttribute('href')).filter(h=>h.includes('framer.media')));
   assert.deepEqual(internal,[]);
   if(route==='/'||route==='/services')for(const service of services)await expect(page.locator('main').getByRole('heading',{name:service.name,exact:true})).toBeVisible();
   if(route==='/industries')for(const industry of industries)await expect(page.getByRole('heading',{name:industry.name,exact:true})).toBeVisible();
   if(route==='/about'){assert(text.includes('Austin'));assert(text.includes('confidentiality'));}
   if(route==='/contact'){
    assert(text.includes(firm.street)&&text.includes(firm.city)&&text.includes(firm.hours));
    const form=page.locator('form[data-form-kind="contact"]');
    await form.getByRole('textbox',{name:/Full name/}).fill('Preview Test');
    await form.getByRole('textbox',{name:/Email address/}).fill('preview@example.com');
    await form.getByRole('textbox',{name:/How can we help/}).fill('Local website preview check.');
    await form.getByRole('button').click();
    await expect(page.getByRole('status')).toContainText('has not been sent');
   }
   if(!route.startsWith('/insights/'))await page.screenshot({path:'verification/firm/'+(route==='/'?'home':route.slice(1))+'-'+width+'.png',fullPage:true});
   assert.deepEqual(errors,[]);
   results.push({route,width,status:200,brand:true,overflow:false,errors});
   console.log(width+' '+route+' passed');page.off('pageerror',handler);
  }
  if(width===390){
   await page.goto(base+'/contact',{waitUntil:'domcontentloaded'});
   await page.locator('html[data-elevra-ready="true"]').waitFor();
   await page.getByRole('button',{name:'Toggle navigation'}).click();
   const menu=page.getByRole('dialog',{name:'Navigation'});
   await expect(menu).toBeVisible();
   await expect(menu.getByAltText(firm.name)).toBeVisible();
   await expect(menu).toContainText(firm.street);
   assert(!(await menu.innerText()).includes('Elevra'));
   await page.screenshot({path:'verification/firm/mobile-menu.png'});
   await menu.locator('nav a[href="/industries"]').click();
   await page.waitForURL(base+'/industries');
   await expect(menu).toHaveCount(0);
   await expect(page.locator('main h1')).toBeVisible();
  }
  await page.close();
 }
}finally{await browser.close();await fs.writeFile('verification/firm/results.json',JSON.stringify(results,null,2));}
console.log('All branded routes and mobile navigation passed.');
