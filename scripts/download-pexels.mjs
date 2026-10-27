import fs from 'node:fs/promises';
import {pexelsPhotos} from '../lib/photos.mjs';
await fs.mkdir('public/photos',{recursive:true});
const tasks=Object.values(pexelsPhotos).flatMap(photo=>[480,960,1600].map(width=>({photo,width})));
let downloaded=0;
await Promise.all(Array.from({length:5},async()=>{
 while(tasks.length){
  const {photo,width}=tasks.shift();
  const path='public/photos/pexels-'+photo.id+'-'+width+'.jpg';
  try{const current=await fs.readFile(path);if(current.length>1000&&current[0]===255&&current[1]===216)continue;}catch{}
  const filename=photo.id===53621?'calculator-calculation-insurance-finance-53621':'pexels-photo-'+photo.id;
  const url='https://images.pexels.com/photos/'+photo.id+'/'+filename+'.jpeg?auto=compress&cs=tinysrgb&w='+width+'&q=82';
  let lastError;
  for(let attempt=0;attempt<3;attempt++){
   try{
    const response=await fetch(url,{signal:AbortSignal.timeout(45000)});
    if(!response.ok)throw new Error('Pexels '+photo.id+': '+response.status);
    const bytes=Buffer.from(await response.arrayBuffer());
    if(bytes[0]!==255||bytes[1]!==216)throw new Error('Expected a JPEG for '+photo.id);
    await fs.writeFile(path,bytes);downloaded++;lastError=null;break;
   }catch(error){lastError=error;}
  }
  if(lastError)throw lastError;
 }
}));
await fs.writeFile('public/photos/sources.json',JSON.stringify({provider:'Pexels',license:'https://www.pexels.com/license/',photos:Object.values(pexelsPhotos)},null,2));
const lines=['# Photo sources','','These stock photos illustrate the service areas and industries. They are not presented as photographs of the firm’s actual staff, clients, or office.','','Provider: [Pexels](https://www.pexels.com/). License reference: [Pexels License](https://www.pexels.com/license/).','','| Photo | Photographer | Source |','| --- | --- | --- |',...Object.values(pexelsPhotos).map(photo=>'| '+photo.alt+' | '+photo.photographer+' | [Pexels '+photo.id+']('+photo.source+') |'),'','Local copies are stored in `public/photos/` at 480, 960 and 1600 pixels wide. The original layout, logo, icons and decorative textures are preserved.',''];
await fs.writeFile('PHOTO_CREDITS.md',lines.join('\n'));
console.log('Downloaded '+downloaded+' optimized images. '+Object.keys(pexelsPhotos).length+' Pexels originals recorded in PHOTO_CREDITS.md.');
