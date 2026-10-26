import { chromium } from '@playwright/test';
import fs from 'node:fs/promises';

const browser = await chromium.launch({ channel: 'chrome', headless: true });
await fs.mkdir('verification', { recursive: true });
const results = [];
for (const width of [1440, 1024, 390]) {
 const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
 const errors = [];
 page.on('pageerror', error => errors.push(error.message));
 await page.goto(process.env.PREVIEW_URL || 'http://localhost:3000', { waitUntil:'load', timeout:120000 });
 await page.locator('html[data-elevra-ready="true"]').waitFor();
 await page.evaluate(() => document.fonts.ready);
 await page.screenshot({path:`verification/${width}-viewport.png`});
 await page.screenshot({path:`verification/${width}.png`,fullPage:true});
 const info = await page.evaluate(() => ({
   title: document.title,
   headings: [...document.querySelectorAll('h1')].filter(e => e.getBoundingClientRect().height && getComputedStyle(e).visibility !== 'hidden').map(e=>e.textContent),
   sections: document.querySelectorAll('main section').length,
   overflow: document.documentElement.scrollWidth > innerWidth,
   brokenImages: [...document.images].filter(e=>!e.complete || e.naturalWidth===0).map(e=>e.src),
   missingSvgDefinitions: [...document.querySelectorAll('use[href^="#"]')].filter(e=>!document.getElementById(e.getAttribute('href').slice(1))).map(e=>e.getAttribute('href')),
 }));
 const trigger = page.locator('[data-framer-name="Question wrapper"]:visible').nth(1);
 await trigger.click();
 if (await trigger.getAttribute('aria-expanded') !== 'true') throw new Error('FAQ did not open');
 await trigger.press('Enter');
 if (await trigger.getAttribute('aria-expanded') !== 'false') throw new Error('FAQ did not close');
 const processCard = page.locator('[data-process-card="1"]:visible');
 await processCard.click();
 if (await processCard.getAttribute('aria-expanded') !== 'true') throw new Error('Process panel did not open');
 await page.locator('[data-process-card="0"]:visible').click();
 if (width < 1200) {
   await page.getByRole('button', {name:'Toggle navigation'}).click();
   await page.locator('#mobile-navigation').waitFor({state:'visible'});
   await page.keyboard.press('Escape');
   await page.locator('#mobile-navigation').waitFor({state:'detached'});
 }
 results.push({width, ...info, errors});
 await page.close();
}
await browser.close();
await fs.writeFile('verification/results.json',JSON.stringify(results,null,2));
console.log(JSON.stringify(results,null,2));
if (results.some(r=>r.overflow || r.brokenImages.length || r.missingSvgDefinitions.length || r.errors.length || r.sections!==11)) process.exitCode=1;
