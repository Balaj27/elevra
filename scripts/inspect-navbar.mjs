import {chromium} from '@playwright/test';
const browser=await chromium.launch({channel:'chrome',headless:true});
try{
 const page=await browser.newPage({viewport:{width:900,height:793},reducedMotion:'no-preference'});
 await page.goto('http://localhost:3017/',{waitUntil:'domcontentloaded'});
 await page.locator('html[data-elevra-ready="true"]').waitFor();
 await page.evaluate(()=>new Promise(resolve=>setTimeout(resolve,2000)));
 console.log(JSON.stringify(await page.locator('nav').evaluateAll(elements=>elements.map(element=>{
  const chain=[];for(let e=element;e&&chain.length<5;e=e.parentElement){const r=e.getBoundingClientRect();const s=getComputedStyle(e);chain.push({class:e.className,opacity:s.opacity,visibility:s.visibility,display:s.display,rect:{x:r.x,y:r.y,w:r.width,h:r.height},animations:e.getAnimations().map(a=>({state:a.playState,time:a.currentTime}))});}return chain;
 })),null,2));
 await page.screenshot({path:'verification/navbar-before.png'});
}finally{await browser.close();}
