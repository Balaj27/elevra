import {chromium,expect} from '@playwright/test';
const browser=await chromium.launch({channel:'chrome',headless:true});
try{
 const page=await browser.newPage({viewport:{width:1440,height:900},reducedMotion:'no-preference'});
 await page.goto('http://localhost:3017/',{waitUntil:'domcontentloaded'});
 await page.locator('html[data-elevra-ready="true"]').waitFor();
 await expect.poll(()=>page.locator('main h1').evaluate(e=>getComputedStyle(e.closest('[data-motion-reveal]')).opacity)).toBe('1');
 await page.evaluate(()=>document.fonts.ready);
 await page.screenshot({path:'verification/firm/home-desktop-viewport.png'});
 await page.setViewportSize({width:390,height:844});
 await page.screenshot({path:'verification/firm/home-mobile-viewport.png'});
 await page.getByRole('button',{name:'Toggle navigation'}).click();
 await expect.poll(()=>page.getByRole('dialog').evaluate(e=>getComputedStyle(e).opacity)).toBe('1');
 await page.screenshot({path:'verification/firm/mobile-menu.png'});
 console.log('Normal-motion homepage and menu previews saved.');
}finally{await browser.close();}
