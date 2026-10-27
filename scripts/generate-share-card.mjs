import {chromium} from '@playwright/test';
import fs from 'node:fs/promises';
import {firm,services} from '../lib/firm-content.js';
const logo=await fs.readFile('public'+firm.logo);
const manifest=JSON.parse(await fs.readFile('public/assets/manifest.json','utf8'));
const latinFont=Object.entries(manifest).find(([url])=>url.includes('/bHYNJqz'))?.[1];
const font=latinFont?await fs.readFile('public'+latinFont):null;
await fs.mkdir('public/og',{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true});
try{
 const page=await browser.newPage({viewport:{width:1200,height:630},deviceScaleFactor:1});
 await page.setContent(`<!doctype html><html><head><meta charset="utf-8"><style>
 ${font?`@font-face{font-family:Brand;src:url(data:font/woff2;base64,${font.toString('base64')})}`:''}
 *{box-sizing:border-box}body{margin:0;background:#f2f4f6;font-family:Brand,Arial,sans-serif;color:#212d3d}.card{width:1200px;height:630px;position:relative;overflow:hidden;border-top:8px solid #092a61}.logo{position:absolute;left:52px;top:32px;width:365px;height:auto}.location{position:absolute;right:52px;top:57px;border:1px solid #cdd7e4;border-radius:30px;padding:12px 17px;font-size:12px;font-weight:600;letter-spacing:1.8px;color:#092a61}.title{position:absolute;left:52px;top:197px;font-size:62px;line-height:1.08;letter-spacing:-2.7px;font-weight:500;margin:0}.title span{color:#788696}.intro{position:absolute;left:56px;top:387px;font-size:19px;line-height:1.55;letter-spacing:-.3px;color:#677487;margin:0}.expertise{position:absolute;right:52px;top:178px;width:290px;height:342px;border-radius:22px;padding:27px 26px;background:linear-gradient(135deg,#092a61,#164a74);color:white;box-shadow:0 12px 24px #092a6112}.expertise:after{content:'';position:absolute;width:160px;height:160px;right:-70px;bottom:-75px;border:1px solid #ffffff20;border-radius:50%;box-shadow:0 0 0 22px #ffffff06,0 0 0 45px #ffffff04}.label{color:#b9cee7;font-size:11px;font-weight:600;letter-spacing:2px;margin-bottom:21px}.service{padding:11px 0;border-bottom:1px solid #ffffff20;font-size:16px;letter-spacing:-.2px}.consult{display:inline-block;margin-top:22px;background:white;color:#092a61;border-radius:30px;padding:10px 15px;font-size:13px;font-weight:600}.footer{position:absolute;bottom:33px;left:56px;right:52px;border-top:1px solid #ced7e2;padding-top:18px;display:flex;justify-content:space-between;align-items:center;font-size:13px;color:#68778a}.mark{color:#092a61;font-size:19px;margin-right:8px}.footer strong{font-size:12px;letter-spacing:.7px;color:#092a61;font-weight:500}
 </style></head><body><div class="card"><img class="logo" src="data:image/png;base64,${logo.toString('base64')}" alt="${firm.name}"><div class="location">STAFFORD · AUSTIN</div><h1 class="title">Clear accounting.<br><span>Confident decisions.</span></h1><p class="intro">Professional tax &amp; accounting services<br>for individuals and businesses.</p><div class="expertise"><div class="label">OUR EXPERTISE</div>${services.map(service=>`<div class="service">${service.name}</div>`).join('')}<div class="consult">Free consultation ↗</div></div><div class="footer"><span><span class="mark">✦</span>Greater Houston · Serving clients nationwide</span><strong>PROFESSIONAL. PERSONAL. DEPENDABLE.</strong></div></div></body></html>`,{waitUntil:'load'});
 await page.evaluate(()=>document.fonts.ready);
 await page.screenshot({path:'public/og/s-mago-cpa-share-v2.jpg',type:'jpeg',quality:94});
 await page.screenshot({path:'public/og/s-mago-cpa-share-v2.png'});
 console.log('Saved branded 1200 × 630 JPEG and PNG share cards in public/og/.');
}finally{await browser.close();}
