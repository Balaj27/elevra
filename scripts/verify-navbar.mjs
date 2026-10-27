import {chromium,expect} from '@playwright/test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
const browser=await chromium.launch({channel:'chrome',headless:true});
await fs.mkdir('verification/navbar',{recursive:true});
const results=[];
try{
 for(const width of [390,900,1024,1440]){
  const page=await browser.newPage({viewport:{width,height:793},reducedMotion:'no-preference'});
  for(const route of ['/','/about','/services','/contact','/insights']){
   await page.goto('http://localhost:3017'+route,{waitUntil:'domcontentloaded'});
   await page.locator('html[data-elevra-ready="true"]').waitFor();
   const logo=page.locator('nav a[data-copy-brand]:visible');
   await expect(logo).toBeVisible();
   const state=await logo.evaluate(element=>{
    let visible=true;const hidden=[];
    for(let node=element;node;node=node.parentElement){const s=getComputedStyle(node);if(Number(s.opacity)===0||s.visibility==='hidden'||s.display==='none'){visible=false;hidden.push(node.className);}}
    const r=element.getBoundingClientRect();return{visible,hidden,y:r.y,width:r.width};
   });
   assert(state.visible,JSON.stringify({width,route,...state}));
   assert(state.y>=0&&state.y<100);
   if(width<1200){
    await page.getByRole('button',{name:'Toggle navigation'}).click();
    await expect(page.getByRole('dialog',{name:'Navigation'})).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).toHaveCount(0);
   }
   await page.evaluate(()=>scrollTo({top:1500,behavior:'instant'}));
   assert((await logo.boundingBox()).y<100,'Navbar scrolls out of view');
   if(route==='/'){
    await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));
    await page.screenshot({path:'verification/navbar/'+width+'.png'});
   }
   results.push({width,route,visible:true,sticky:true});
  }
  await page.close();
 }
 console.log(JSON.stringify(results));
}finally{await browser.close();await fs.writeFile('verification/navbar/results.json',JSON.stringify(results,null,2));}
