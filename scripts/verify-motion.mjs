import {chromium,expect} from '@playwright/test';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';

const base=process.env.PREVIEW_URL || 'http://localhost:3017';
const browser=await chromium.launch({channel:'chrome',headless:true});
await fs.mkdir('verification/motion',{recursive:true});
const results={};
const context=await browser.newContext({viewport:{width:1440,height:900},reducedMotion:'no-preference',recordVideo:{dir:'verification/motion',size:{width:1440,height:900}}});
const page=await context.newPage();
const errors=[];
page.on('pageerror',error=>errors.push(error.message));
const settle=ms=>page.evaluate(ms=>new Promise(resolve=>{
  const start=performance.now();
  const tick=now=>now-start>=ms?resolve():requestAnimationFrame(tick);
  requestAnimationFrame(tick);
}),ms);
try {
 await page.goto(base,{waitUntil:'load',timeout:120000});
 await page.locator('html[data-elevra-ready="true"]').waitFor();
 const heading=page.locator('main h1:visible').first();
 await expect(heading.locator('xpath=..')).toHaveAttribute('data-motion-revealed','true',{timeout:10000});
 const counter=page.locator('.framer-w0i3jg-container p[data-motion-counter]:visible').first();
 await expect(counter).toHaveText('42%',{timeout:10000});
 results.reveals=await page.locator('[data-motion-reveal]').count();
 assert(results.reveals>20);
 await page.screenshot({path:'verification/motion/hero.png'});
 const logos=page.locator('.framer-sY8Rs > ul');
 await logos.scrollIntoViewIfNeeded();
 await settle(350);
 assert(await logos.locator('[data-motion-clone]').count()>0);
 const first=await logos.evaluate(e=>getComputedStyle(e).transform);
 await settle(350);
 const second=await logos.evaluate(e=>getComputedStyle(e).transform);
 assert.notEqual(first,second,'Logo ticker is not moving');
 await logos.locator('..').hover();
 const paused=await logos.evaluate(e=>e.getAnimations()[0]?.playState);
 assert.equal(paused,'paused');
 results.ticker={moves:true,pausesOnHover:true};
 await page.mouse.move(0,0);
 const process=page.locator('[data-process-card="2"]:visible');
 await process.scrollIntoViewIfNeeded();
 const before=await process.evaluate(e=>e.parentElement.getBoundingClientRect().width);
 await process.hover();
 await expect(process).toHaveAttribute('aria-expanded','true');
 await settle(850);
 const after=await process.evaluate(e=>e.parentElement.getBoundingClientRect().width);
 assert(after>before+100,'Process panel did not expand smoothly');
 await page.screenshot({path:'verification/motion/process.png'});
 results.process={before,after};
 const industries=page.locator('.framer-xtuulm > ul');
 await industries.scrollIntoViewIfNeeded();
 await page.mouse.move(0,0);
 await settle(350);
 const industryFirst=await industries.evaluate(e=>getComputedStyle(e).transform);
 await settle(350);
 assert.notEqual(await industries.evaluate(e=>getComputedStyle(e).transform),industryFirst,'Industry ticker is not moving');
 await page.screenshot({path:'verification/motion/industries.png'});
 const faq=page.locator('[data-framer-name="Question wrapper"]:visible').nth(1);
 await faq.scrollIntoViewIfNeeded();
 await settle(600);
 await faq.click();
 await settle(450);
 const answer=page.locator(`#${await faq.getAttribute('aria-controls')}`);
 assert(await answer.evaluate(e=>e.getBoundingClientRect().height)>10,'FAQ answer did not expand');
 await faq.click();
 await settle(450);
 await expect(answer).toBeHidden();
 results.faq=true;
 await page.emulateMedia({reducedMotion:'reduce'});
 await expect(page.locator('[data-motion-clone]')).toHaveCount(0);
 await expect.poll(()=>page.evaluate(()=>document.getAnimations().filter(a=>a.playState==='running'&&a.effect?.getTiming().iterations===Infinity).length)).toBe(0);
 results.reducedMotion=true;
 await page.emulateMedia({reducedMotion:'no-preference'});
 for(const route of ['/about','/services','/insights','/contact','/']) {
   await page.locator(`nav:visible a[href="${route}"]`).first().click();
   await page.waitForURL(base+route);
   await page.locator('html[data-elevra-ready="true"]').waitFor();
   await settle(1600);
   const title=page.locator('main h1:visible').first();
   await expect(title).toBeVisible();
   const opacity=await title.evaluate(e=>{
     const parent=e.closest('[data-motion-reveal]');
     return parent ? getComputedStyle(parent).opacity : '1';
   });
   assert.equal(Number(opacity),1,`${route}: heading remains hidden after navigation`);
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,`${route}: overflow`);
   assert.equal(await page.locator('nav a[href*="/case-study"]').count(),0,`${route}: Case Studies remains in navbar`);
 }
 results.navigation=true;
 await page.setViewportSize({width:390,height:900});
 await page.getByRole('button',{name:'Toggle navigation'}).click();
 assert.equal(await page.locator('#mobile-navigation a[href*="/case-study"]').count(),0);
 await page.locator('#mobile-navigation a[href="/contact"]').click();
 await page.waitForURL(base+'/contact');
 await page.locator('html[data-elevra-ready="true"]').waitFor();
 const details=page.locator('.framer-ZcaIH:visible');
 assert.equal(await details.count(),3);
 await details.last().scrollIntoViewIfNeeded();
 await settle(1000);
 const values=await details.locator('.framer-111q8pe').evaluateAll(elements=>elements.map(element=>({
   text:element.textContent.trim(),
   opacity:getComputedStyle(element).opacity,
   reveal:element.hasAttribute('data-motion-reveal'),
 })));
 assert.deepEqual(values.map(v=>v.text),['Aspen, Colorado, USA','hello@elevra.com','+1 234 567 89 10']);
 assert(values.every(value=>Number(value.opacity)===1&&!value.reveal));
 await expect(details.locator('a[href="mailto:hello@elevra.com"]')).toBeVisible();
 await expect(details.locator('a[href="tel:+12345678910"]')).toBeVisible();
 await page.screenshot({path:'verification/motion/contact-details.png'});
 results.contactDetails=values;
 assert.deepEqual(errors,[]);
 results.errors=errors;
 console.log(JSON.stringify(results,null,2));
} finally {
 await context.close();
 await page.video().saveAs('verification/motion/preview.webm');
 await fs.unlink(await page.video().path());
 await browser.close();
 await fs.writeFile('verification/motion/results.json',JSON.stringify(results,null,2));
}
