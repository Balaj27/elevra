import {pexelsPhotos,industryPhotoKeys,servicePhotoKeys} from '../lib/photos.mjs';
import {services,articles} from '../lib/firm-content.js';

const preserved=/\/brand\/|7vfoQFq|jy1O3ov|6mcf62Rl|rHh1Wf4|data:image\/svg/i;
export function applyPexelsPhotos($,slug){
 const pool=['accounting','tax','analysis','business','planning','calculator'];
 const sourceMap=new Map();
 function set(image,key){
  const photo=pexelsPhotos[key];
  $(image).attr({src:photo.src,srcset:photo.srcSet,alt:photo.alt,'data-pexels-photo':String(photo.id),'data-photo-source':photo.source,decoding:'async'});
  const style=$(image).attr('style')||'';
  $(image).attr('style',style.replace(/object-position:[^;]+;?/g,'')+';object-position:'+photo.position);
 }
 function within(scope,key){$(scope).find('img[data-pexels-photo]').each((_,image)=>set(image,key));}
 // Replace photographs only. Keep brand marks, SVGs, UI icons and grain textures.
 $('img[src]').each((_,image)=>{
  const source=$(image).attr('src');
  if(preserved.test(source))return;
  if(!/framerusercontent\.com\/images\//.test(source)&&!source.startsWith('/photos/'))return;
  const original=source.split('?')[0];
  if(!sourceMap.has(original))sourceMap.set(original,pool[sourceMap.size%pool.length]);
  set(image,sourceMap.get(original));
 });
 // The original nature loops become still Pexels photos in the same media boxes.
 $('video').each((_,video)=>{
  const image=$('<img>').attr({style:$(video).attr('style')||'display:block;width:100%;height:100%;object-fit:cover',width:1600,height:1067,loading:'eager'});
  $(video).replaceWith(image);set(image[0],'office');
 });
 $('[data-framer-name="Hero section"] img[data-pexels-photo]').each((index,image)=>set(image,index%2===0?'accounting':'office'));
 $('.framer-T0Vmd').each((_,card)=>{
  const index=services.findIndex(service=>service.name===$(card).find('h3').first().text());
  if(index>=0)within(card,servicePhotoKeys[index]);
 });
 $('.framer-9bu4wm').each((_,row)=>$(row).children().each((index,card)=>within(card,industryPhotoKeys[index]||'planning')));
 $('[data-process-card]').each((_,card)=>within(card,['planning','tax','accounting','analysis'][Number($(card).attr('data-process-card'))%4]));
 $('[data-framer-name="Case study"]').each((_,section)=>within(section,'business'));
 $('[data-framer-name="Testimonial"]').each((_,section)=>within(section,'analysis'));
 $('a[href^="/insights/"]').each((_,link)=>{
  const article=articles.find(article=>'/insights/'+article.slug===$(link).attr('href'));
  const index=articles.indexOf(article);within(link,servicePhotoKeys[index]||'tax');
 });
 if(slug==='about'){
  $('section').each((_,section)=>{
   const name=($(section).attr('data-framer-name')||'').trim();
   const choices={Hero:'business',Experties:'planning',About:'office',Journey:'tax',Career:'planning',Testimonial:'analysis'};
   if(choices[name])within(section,choices[name]);
  });
  const expertisePhotos={'Accounting Services':'accounting','Tax Services':'tax','Business Services':'business','IRS Representation':'representation','Personal Attention':'consultation','Confidential Service':'review'};
  $('section[data-framer-name="Team"] .framer-1lmS3').each((_,card)=>{
   const heading=$(card).find('h6').first().text().trim();
   if(expertisePhotos[heading])within(card,expertisePhotos[heading]);
  });
 }
 if(slug==='contact'){
  const first=$('main img[data-pexels-photo]').first();
  if(first.length)set(first[0],'accounting');
 }
 $('[style*="background-image"]').each((_,element)=>{
  const style=$(element).attr('style');
  $(element).attr('style',style.replace(/url\((['"]?)(https:\/\/framerusercontent\.com\/images\/[^)'"\s]+)\1\)/g,(match,quote,url)=>preserved.test(url)?match:'url('+pexelsPhotos.office.src+')'));
 });
}
