import {chromium,expect} from '@playwright/test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';

const base=process.env.PREVIEW_URL || 'http://localhost:3017';
await fs.mkdir('verification/mobile-menu',{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true});
const results=[];
try {
 for(const width of [322,390,768]) {
  const page=await browser.newPage({viewport:{width,height:718},reducedMotion:'no-preference'});
  const errors=[];page.on('pageerror',error=>errors.push(error.message));
  await page.goto(base+'/contact',{waitUntil:'load',timeout:120000});
  await page.locator('html[data-elevra-ready="true"]').waitFor();
  await page.getByRole('button',{name:'Toggle navigation'}).click();
  const menu=page.getByRole('dialog',{name:'Navigation'});
  await expect(menu).toBeVisible();
  await expect(page.getByRole('button',{name:'Close navigation'})).toBeFocused();
  await expect(menu.locator('.mobile-menu-links a')).toHaveCount(5);
  assert.equal(await menu.locator('a[href*="case-study"]').count(),0);
  await expect(menu.getByText('Response Time',{exact:true})).toBeVisible();
  await expect(menu.locator('a[href="mailto:hello@elevra.com"]')).toBeVisible();
  assert.equal(await page.evaluate(()=>document.body.style.overflow),'hidden');
  assert.equal(await page.locator('#main').evaluate(e=>e.inert),true);
  const box=await menu.boundingBox();
  assert.equal(Math.round(box.width),width);
  assert.equal(Math.round(box.height),718);
  await expect.poll(()=>menu.evaluate(e=>getComputedStyle(e).opacity)).toBe('1');
  await page.screenshot({path:`verification/mobile-menu/${width}-open.png`});
  // Focus stays within the modal when tabbing in either direction.
  await menu.locator('.mobile-menu-brand').focus();
  await page.keyboard.press('Shift+Tab');
  await expect(menu.locator('a[href="tel:+12345678910"]')).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(menu.locator('.mobile-menu-brand')).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(menu).toHaveCount(0);
  assert.equal(await page.evaluate(()=>document.body.style.overflow),'');
  assert.equal(await page.locator('#main').evaluate(e=>e.inert),false);
  await page.getByRole('button',{name:'Toggle navigation'}).click();
  await menu.locator('.mobile-menu-links a[href="/about"]').click();
  await page.waitForURL(base+'/about');
  await expect(menu).toHaveCount(0);
  await page.getByRole('button',{name:'Toggle navigation'}).click();
  await menu.getByRole('button',{name:'Close navigation'}).click();
  await expect(menu).toHaveCount(0);
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.getByRole('button',{name:'Toggle navigation'}).click();
  assert.equal(await menu.evaluate(e=>getComputedStyle(e).animationName),'none');
  await page.setViewportSize({width:1440,height:900});
  await expect(menu).toHaveCount(0);
  assert.equal(await page.evaluate(()=>document.body.style.overflow),'');
  assert.deepEqual(errors,[]);
  results.push({width,fullscreen:true,keyboard:true,navigation:true,scrollRestored:true,reducedMotion:true,errors});
  await page.close();
 }
 console.log(JSON.stringify(results,null,2));
}finally{await browser.close();await fs.writeFile('verification/mobile-menu/results.json',JSON.stringify(results,null,2));}
