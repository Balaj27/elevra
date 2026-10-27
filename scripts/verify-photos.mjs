import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {articles} from '../lib/firm-content.js';
import {pexelsPhotos,industryPhotoKeys} from '../lib/photos.mjs';
const browser=await chromium.launch({channel:'chrome',headless:true});
const base=process.env.PREVIEW_URL||'http://localhost:3017';
const manifest=JSON.parse(await fs.readFile('public/assets/manifest.json','utf8'));
const icons=new Set(Object.entries(manifest).filter(([url])=>/7vfoQFq|jy1O3ov|6mcf62Rl|rHh1Wf4/.test(url)).map(([,path])=>path));
const results=[];
try{
 for(const width of [1440,390]){
  const page=await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce'});
  for(const route of ['/','/about','/services','/contact','/insights',...articles.map(a=>'/insights/'+a.slug)]){
   await page.goto(base+route,{waitUntil:'domcontentloaded',timeout:120000});
   await page.locator('html[data-elevra-ready="true"]').waitFor();
   const images=await page.locator('img').evaluateAll(async images=>{
    await Promise.all(images.map(img=>img.decode().catch(()=>{})));
    return images.map(img=>({src:img.getAttribute('src'),set:img.getAttribute('srcset'),loaded:img.complete&&img.naturalWidth>0,alt:img.alt}));
   });
   assert(images.some(i=>i.src.startsWith('/photos/')),route+' has no Pexels photos');
   for(const image of images){
    assert(image.loaded,route+' broken image '+image.src);
    assert(image.src.startsWith('/photos/')||image.src.startsWith('/brand/')||image.src.startsWith('data:image/svg')||icons.has(image.src),route+' old photo '+image.src);
    if(image.src.startsWith('/photos/'))assert(image.alt.length>0,route+' missing photo description');
   }
   assert.equal(await page.locator('video').count(),0);
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
   if(route==='/'){
    const ids=await page.locator('.framer-9bu4wm').first().locator('img[data-pexels-photo]').evaluateAll(images=>images.map(img=>img.dataset.pexelsPhoto));
    assert.deepEqual(ids,industryPhotoKeys.map(key=>String(pexelsPhotos[key].id)));
   }
   results.push({route,width,photos:images.filter(i=>i.src.startsWith('/photos/')).length});
   console.log(width+' '+route+' photos passed');
  }
  await page.close();
 }
}finally{await browser.close();await fs.mkdir('verification/photos',{recursive:true});await fs.writeFile('verification/photos/results.json',JSON.stringify(results,null,2));}
