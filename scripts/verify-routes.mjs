import { chromium } from '@playwright/test';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';

const base = process.env.PREVIEW_URL || 'http://localhost:3017';
const routes = ['/', '/about', '/services', '/insights', '/contact'];
const browser = await chromium.launch({channel:'chrome',headless:true});
await fs.mkdir('verification/pages',{recursive:true});
const results = [];
try {
  for (const width of [1440,1024,390]) {
    const page = await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce'});
    for (const route of routes) {
      const errors = [];
      const errorHandler = error => errors.push(error.message);
      page.on('pageerror',errorHandler);
      const response = await page.goto(base+route,{waitUntil:'load',timeout:120000});
      assert.equal(response.status(),200,`${route} did not return 200`);
      await page.locator('html[data-elevra-ready="true"]').waitFor();
      await page.evaluate(()=>document.fonts.ready);
      const info = await page.evaluate(() => ({
        title:document.title,
        heading:[...document.querySelectorAll('h1')].find(e=>e.getBoundingClientRect().height>0)?.textContent,
        overflow:document.documentElement.scrollWidth>innerWidth,
        brokenImages:[...document.images].filter(e=>!e.complete||!e.naturalWidth).map(e=>e.src),
        missingSvg:[...document.querySelectorAll('use[href^="#"]')].filter(e=>!document.getElementById(e.getAttribute('href').slice(1))).map(e=>e.getAttribute('href')),
        externalKnownRoutes:[...document.querySelectorAll('a[href]')].map(e=>e.href).filter(h=>/^https:\/\/elevra\.framer\.media\/(?:about|services|insights|contact)?(?:[#?].*)?$/.test(h)),
        heroWidth:document.querySelector('h1')?.getBoundingClientRect().width,
      }));
      const name=route==='/'?'home':route.slice(1);
      await page.screenshot({path:`verification/pages/${name}-${width}.png`,fullPage:true});
      await page.screenshot({path:`verification/pages/${name}-${width}-viewport.png`});
      const faqs=page.locator('[data-framer-name="Question wrapper"]:visible');
      if(await faqs.count()>1) {
        const trigger=faqs.nth(1);
        await trigger.click();
        assert.equal(await trigger.getAttribute('aria-expanded'),'true',`${route}: FAQ did not open`);
        await trigger.press('Enter');
        assert.equal(await trigger.getAttribute('aria-expanded'),'false');
      }
      if(width<1200) {
        await page.getByRole('button',{name:'Toggle navigation'}).click();
        await page.locator('#mobile-navigation').waitFor({state:'visible'});
        assert.equal(await page.locator('#mobile-navigation a[href="/about"]').count(),1);
        await page.keyboard.press('Escape');
        await page.locator('#mobile-navigation').waitFor({state:'detached'});
      }
      if(route==='/insights') {
        const filter=page.locator('[data-insight-filter="Business"]');
        await filter.click();
        assert.equal(await filter.getAttribute('aria-pressed'),'true');
        const categories=await page.locator('[data-insight-category]:visible').evaluateAll(cards=>cards.map(e=>e.dataset.insightCategory));
        assert(categories.length>0 && categories.every(value=>value==='Business'),'Insights filtering failed');
        await page.locator('[data-insight-filter="All"]').click();
      }
      if(route==='/contact' && width===1440) {
        const form=page.locator('form[data-form-kind="contact"]:visible');
        await form.locator('input[name="Name"]').fill('Preview Test');
        await form.locator('input[name="Your company name"]').fill('Preview Company');
        await form.locator('input[type="email"]').fill('preview@example.com');
        await form.locator('input[type="tel"]').fill('+12345678900');
        await form.locator('textarea').fill('Local form validation check.');
        await form.locator('button[type="submit"]').click();
        await page.getByRole('status').filter({hasText:'Message delivery is not connected'}).waitFor();
        assert.equal(new URL(page.url()).pathname,'/contact');
      }
      results.push({route,width,...info,errors});
      console.log(`${route} at ${width}px: ${info.heading}`);
      page.off('pageerror',errorHandler);
    }
    // Traverse through Link components; the browser document must stay alive.
    await page.goto(base,{waitUntil:'load'});
    await page.locator('html[data-elevra-ready="true"]').waitFor();
    await page.evaluate(()=>window.__navigationMarker='same-document');
    for(const route of ['/about','/services','/insights','/contact','/']) {
      if(width<1200) {
        await page.getByRole('button',{name:'Toggle navigation'}).click();
        await page.locator(`#mobile-navigation a[href="${route}"]`).click();
      } else {
        await page.locator(`nav:visible a[href="${route}"]`).first().click();
      }
      await page.waitForURL(base+route);
      await page.locator('html[data-elevra-ready="true"]').waitFor();
      assert.equal(await page.evaluate(()=>window.__navigationMarker),'same-document','Navigation reloaded the document');
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,'CSS overflow after navigation');
      await page.goBack();
      await page.goForward();
      await page.locator('html[data-elevra-ready="true"]').waitFor();
    }
    await page.close();
  }
} finally {
  await browser.close();
  await fs.writeFile('verification/pages/results.json',JSON.stringify(results,null,2));
}
assert(results.every(r=>!r.overflow&&!r.brokenImages.length&&!r.missingSvg.length&&!r.errors.length&&!r.externalKnownRoutes.length),'A layout, asset, JavaScript, or routing check failed; see verification/pages/results.json');
console.log('All 15 responsive route checks and client-navigation checks passed.');
