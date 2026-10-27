import fs from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { load } from 'cheerio';
import { attributesToProps } from 'html-react-parser';
import prettier from 'prettier';
import postcss from 'postcss';
import { resolveHref } from '../lib/routes.mjs';
import { annotateMotion } from './motion-data.mjs';
import { applyFirmCopy } from './firm-copy.mjs';
import { writeGenerated } from './write-generated.mjs';
import {firm} from '../lib/firm-content.js';

const pages = ['about', 'services', 'insights', 'contact'];
const voidTags = new Set(['area','base','br','col','embed','hr','img','input','meta','param','source','track','wbr']);
const assetPattern = /https:\/\/framerusercontent\.com\/(?:images|assets|third-party-assets)\/[^\s"'<>),]+/g;
const manifest = JSON.parse(await fs.readFile('public/assets/manifest.json', 'utf8'));
const report = [];

for (const slug of pages) {
  const supplied = await fs.readFile(`${slug}.html`, 'utf8');
  const capture = load(supplied);
  let source = supplied;
  // Inspect Element removes alternate responsive variants after hydration.
  // Recover those from the public server export, retaining the capture as fallback.
  const referencePath = `reference/${slug}.html`;
  try { source = await fs.readFile(referencePath, 'utf8'); }
  catch {
    try {
      const response = await fetch(`https://elevra.framer.media/${slug}`, {signal:AbortSignal.timeout(30000)});
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const candidate = await response.text();
      if (load(candidate)('h1').first().text() !== capture('h1').first().text()) throw new Error('Reference heading differs from supplied HTML');
      source = candidate;
      await fs.writeFile(referencePath, source);
    } catch (error) { console.warn(`${slug}: using supplied capture (${error.message})`); }
  }
  const $ = load(source);
  const title = firm.name+' | '+slug.charAt(0).toUpperCase()+slug.slice(1);
  const description = firm.description;
  let css = $('style').map((_, e) => $(e).text()).get().join('\n');
  annotateMotion($);
  $('script,link,style,noscript,#__framer-editorbar,#__framer-badge-container').remove();
  $('[data-framer-hydrate-v2]').removeAttr('data-framer-hydrate-v2');
  $('input[name="framer-noscript"],input[aria-hidden="true"]').remove();
  $('form button:not([type])').attr('type','submit');
  $('img').attr('loading', 'eager');
  $('a[href]').each((_,e) => $(e).attr('href', resolveHref($(e).attr('href'))));
  $('nav a[href*="/case-study"]').each((_,link)=>{
    const parent=$(link).parent();
    if(parent.attr('class')?.includes('-container') && parent.children().length===1) parent.remove(); else $(link).remove();
  });
  if(slug==='contact') {
    // Essential contact details should always be visible, even before animations initialize.
    $('.framer-ZcaIH [data-motion-reveal]').removeAttr('data-motion-reveal');
    $('.framer-ZcaIH .framer-111q8pe p').each((_,paragraph)=>{
      const value=$(paragraph).text().trim();
      const href=value.includes('@') ? `mailto:${value}` : /^\+/.test(value) ? `tel:${value.replace(/\s/g,'')}` : null;
      if(href) $(paragraph).empty().append($('<a>').attr({href,style:'color:inherit;text-decoration:none'}).text(value));
    });
  }
  if (slug === 'insights') {
    $('main a[href*="/insights/"]').each((_,card) => $(card).attr('data-insight-category',$(card).find('p').first().text().trim()));
    $('.framer-ltTtx').each((_,tab) => $(tab).attr('data-insight-filter',$(tab).text().trim()));
  }
  $('[style]').each((_,e) => {
    let style = $(e).attr('style');
    if (/will-change:\s*transform/.test(style) || $(e).attr('data-framer-appear-id') || e.tagName === 'ul') {
      style = style.replace(/opacity:\s*0(?:\.001)?(?=;|$)/g,'opacity:1').replace(/transform:\s*translateY\(40px\)/g,'transform:none');
    }
    $(e).attr('style',style);
  });
  $('.framer-fey5X').each((_,card) => {
    const title = $(card).find('h6').text();
    const value = title.includes('Companies') ? '40+' : title.includes('Years') ? '12+' : title.includes('Retention') ? '91%' : '68%';
    $(card).find('.framer-10i4lka-container p').text(value);
  });
  $('.framer-1r667kc-container p').text('62%');
  $('.framer-1abot5y-container p').text('3.3x');
  $('form').each((i,form) => {
    const contact = $(form).find('textarea').length > 0;
    $(form).attr('data-form-kind', contact ? 'contact' : 'newsletter');
    $(form).find('input,textarea,select').each((index,field) => {
      const labelNode = $(field).closest('label').clone();
      labelNode.find('input,select,textarea').remove();
      const label = labelNode.text().trim();
      $(field).attr('aria-label', label || $(field).attr('placeholder') || $(field).attr('name') || 'Email address');
    });
    if (contact) {
      // The original export gives both dropdowns the same field name.
      $(form).find('select').each((index,field) => $(field).attr('name', index === 0 ? 'Service' : 'Annual revenue'));
    }
  });

  applyFirmCopy($,slug);
  const urls = [...new Set([...(css + $.html()).matchAll(assetPattern)].map(m=>m[0].replaceAll('&amp;','&')))];
  const pending = [...urls];
  await Promise.all(Array.from({length:6},async()=>{
    while(pending.length) {
      const url = pending.shift();
      const local = `/assets/${createHash('sha256').update(url).digest('hex').slice(0,18)}.${new URL(url).pathname.split('.').pop()}`;
      try { await fs.access(`public${local}`); }
      catch {
        const response = await fetch(url,{signal:AbortSignal.timeout(45000)});
        if(!response.ok) throw new Error(`Asset ${response.status}: ${url}`);
        await fs.writeFile(`public${local}`,Buffer.from(await response.arrayBuffer()));
      }
      manifest[url] = local;
    }
  }));
  const entries = Object.entries(manifest).sort((a,b)=>b[0].length-a[0].length);
  function localize(value) {
    for(const [remote,local] of entries) value=value.replaceAll(remote,local);
    return value;
  }

  // Next keeps CSS loaded after client navigation. Scope each export to its page.
  const scope = `[data-elevra-page="${slug}"]`;
  const cssTree = postcss.parse(localize(css));
  cssTree.walkRules(rule => {
    let ancestor = rule.parent;
    while (ancestor) {
      if (ancestor.type === 'atrule' && /keyframes$/i.test(ancestor.name)) return;
      ancestor = ancestor.parent;
    }
    rule.selectors = rule.selectors.map(selector => {
      let result = selector.replace(/(?<![\w-])(?:html|body|:root)(?![\w-])/g, scope);
      while (result.includes(`${scope} ${scope}`)) result = result.replaceAll(`${scope} ${scope}`, scope);
      return result.startsWith(scope) ? result : `${scope} ${result}`;
    });
  });
  await fs.mkdir(`app/${slug}`,{recursive:true});
  await fs.mkdir(`components/pages/${slug}`,{recursive:true});
  await writeGenerated(`app/${slug}/design.css`,cssTree.toString());

  const replacements = new Map();
  function jsx(node) {
    if(replacements.has(node)) return `<${replacements.get(node)} />`;
    if(node.type==='text') return node.data ? `{${JSON.stringify(node.data)}}` : '';
    if(node.type!=='tag') return '';
    const props=attributesToProps(node.attribs||{});
    for(const key of Object.keys(props)) {
      if(/^on/i.test(key)) delete props[key];
      else if(typeof props[key]==='string') props[key]=localize(props[key]);
      else if(key==='style') for(const p of Object.keys(props.style)) if(typeof props.style[p]==='string') props.style[p]=localize(props.style[p]);
    }
    if(node.name==='input' && 'value' in props) {props.defaultValue=props.value;delete props.value;}
    if(node.name==='textarea') props.defaultValue=$(node).text();
    if(node.name==='select') {
      props.defaultValue=$(node).find('option[selected]').attr('value') || $(node).find('option').first().attr('value') || '';
    }
    if(node.name==='option') delete props.selected;
    const attrs=Object.keys(props).length ? ` {...${JSON.stringify(props)}}` : '';
    if(voidTags.has(node.name)) return `<${node.name}${attrs}/>`;
    const tag=node.name==='a'&&props.href?.startsWith('/') ? 'Link' : node.name;
    const children=node.name==='textarea' ? '' : (node.children||[]).map(jsx).join('');
    return `<${tag}${tag==='Link'?' prefetch={false}':''}${attrs}>${children}</${tag}>`;
  }
  const imports=[];
  const nodes=[...$('nav').toArray(), ...$('main > section').toArray(), ...$('footer').toArray()];
  for(const [index,node] of nodes.entries()) {
    const label=$(node).attr('data-framer-name') || node.tagName;
    const name=(label.replace(/[^a-zA-Z0-9]+(.)/g,(_,c)=>c.toUpperCase()).replace(/[^a-zA-Z0-9]/g,'') || 'Section').replace(/^./,c=>c.toUpperCase())+index;
    const markup=jsx(node);
    await writeGenerated(`components/pages/${slug}/${name}.jsx`,await prettier.format(`import Link from 'next/link'; export default function ${name}(){return (${markup});}`,{parser:'babel'}));
    replacements.set(node,name);
    imports.push(`import ${name} from './${name}';`);
  }
  const root=$('#main')[0];
  if(!root) throw new Error(`Missing page content in ${slug}`);
  const svg=$('#svg-templates')[0];
  const markup=`<div data-elevra-page="${slug}">${jsx(root)}${svg?jsx(svg):''}</div>`;
  await writeGenerated(`components/pages/${slug}/PageContent.jsx`,await prettier.format(`import Link from 'next/link';${imports.join('\n')} export default function PageContent(){return (${markup});}`,{parser:'babel'}));
  const pageCode=`import './design.css'; import PageContent from '../../components/pages/${slug}/PageContent'; import Interactions from '../../components/Interactions'; import SeoSchema from '../../components/SeoSchema'; import {pageMetadata} from '../../lib/seo.mjs'; export const metadata=pageMetadata('/${slug}'); export default function Page(){return <><SeoSchema path="/${slug}"/><PageContent/><Interactions/></>;}`;
  await writeGenerated(`app/${slug}/page.jsx`,await prettier.format(pageCode,{parser:'babel'}));
  report.push({route:`/${slug}`,title,components:imports.length,assets:urls.length});
  console.log(`Converted /${slug}: ${imports.length} components, ${urls.length} local asset references.`);
}
await writeGenerated('public/assets/manifest.json',JSON.stringify(manifest,null,2));
await writeGenerated('reference/routes.json',JSON.stringify(report,null,2));
