import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
const browser=await chromium.launch({channel:'chrome'});
await fs.mkdir('verification/expertise',{recursive:true});
try{
 for(const width of [390,810,1024,1440,1854]){
  const page=await browser.newPage({viewport:{width,height:1000},reducedMotion:'reduce'});
  await page.goto('http://localhost:3017/about',{waitUntil:'domcontentloaded'});
  await page.locator('html[data-elevra-ready]').waitFor();
  const cards=page.locator('section[data-framer-name="Team"] .framer-1lmS3:visible');
  const photos=await cards.evaluateAll(async cards=>{
   await Promise.all(cards.flatMap(card=>[...card.querySelectorAll('img[data-pexels-photo]')].map(img=>img.decode())));
   return cards.map(card=>({title:card.querySelector('h6').textContent,src:card.querySelector('img[data-pexels-photo]').getAttribute('src')}));
  });
  assert.equal(photos.length,6);
  assert.equal(new Set(photos.map(p=>p.src)).size,6,'Expertise photos must all differ');
  const rows=page.locator('[data-framer-name="Career"] .framer-PO3ka:visible');
  assert.equal(await rows.count(),5);
  for(const row of await rows.all()){
   const result=await row.evaluate(row=>{
    const bounds=row.getBoundingClientRect();
    const button=row.querySelector('.framer-2oy9yb-container').getBoundingClientRect();
    const tags=row.querySelector('.framer-1mus9a1').getBoundingClientRect();
    const title=row.querySelector('.framer-z1rbfa').getBoundingClientRect();
    const overlaps=(a,b)=>a.left<b.right-1&&a.right>b.left+1&&a.top<b.bottom-1&&a.bottom>b.top+1;
    return {fits:button.right<=bounds.right-8&&button.left>=bounds.left+8&&tags.right<=bounds.right-8,overlap:overlaps(button,tags)||overlaps(title,button)||overlaps(title,tags)};
   });
   assert(result.fits,'Clipped row at '+width);assert(!result.overlap,'Overlapping row at '+width);
  }
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  if(width===1440||width===390){
   await page.locator('section[data-framer-name="Team"]').screenshot({path:'verification/expertise/cards-'+width+'.png'});
   await page.locator('section[data-framer-name="Career"]').screenshot({path:'verification/expertise/rows-'+width+'.png'});
  }
  console.log(width+' passed: six distinct photos, no clipped or overlapping rows');
  await page.close();
 }
}finally{await browser.close();}
