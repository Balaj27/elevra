import fs from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { load } from 'cheerio';
import { attributesToProps } from 'html-react-parser';
import prettier from 'prettier';
import { resolveHref } from '../lib/routes.mjs';
import { annotateMotion } from './motion-data.mjs';

const source = await fs.readFile('reference/original.html', 'utf8').catch(() => fs.readFile('index.html', 'utf8'));
const $ = load(source);
await fs.mkdir('app', { recursive: true });
await fs.mkdir('components/sections', { recursive: true });
await fs.mkdir('public/assets', { recursive: true });

// Keep the exported design system, including its original responsive rules.
let css = $('style').map((_, e) => $(e).text()).get().join('\n');
annotateMotion($);
$('script, link, style, noscript, #__framer-editorbar, #__framer-badge-container').remove();
$('[data-framer-hydrate-v2]').removeAttr('data-framer-hydrate-v2');
$('input[name="framer-noscript"]').remove();
$('input[aria-hidden="true"]').remove();
$('img').attr('loading', 'eager');
$('input[type="email"]').attr('aria-label', 'Email address');
$('ul[style]').each((_, e) => $(e).attr('style', $(e).attr('style').replace(/opacity:\s*0(?=;|$)/g, 'opacity:1')));
// Counters otherwise remain at the server-rendered zero without the Framer runtime.
$('.framer-w0i3jg-container p').text('42%');
$('.framer-fey5X').each((_, card) => {
 const title = $(card).find('h6').text();
 const value = title.includes('Companies') ? '40+' : title.includes('Years') ? '12+' : title.includes('Retention') ? '91%' : '68%';
 $(card).find('.framer-10i4lka-container p').text(value);
});
$('.framer-1r667kc-container p').text('62%');
$('.framer-1abot5y-container p').text('3.3x');
const processCopy = [
 ['Diagnose','Deep discovery into your market position, funnel economics, team structure, and strategic constraints. We find the real bottleneck, not just the surface symptoms.'],
 ['Strategize','We turn scattered findings into one clear, sequenced plan built around your business, your goals, and the realities of your market.'],
 ['Execute','Plans only matter when they ship. We stay embedded in the work until the changes take hold and start creating momentum.'],
 ['Measure','Every engagement ends with a number you can point to — growth, efficiency, or margin, tracked and reported, not assumed.'],
];
$('.framer-wCdDT').each((_,group) => {
 const cards = $(group).find('.framer-Jc0hb');
 const template = cards.first().html();
 cards.each((i,card) => {
   if (i) $(card).html(template);
   $(card).attr('data-process-card', String(i));
   $(card).find('.framer-3gti21 p').text(`0${i+1}`);
   $(card).find('.framer-18fduq0').find('h1,h2,h3,h4,h5,h6,p').text(processCopy[i][0]);
   $(card).find('.framer-wxa8eh p').text(processCopy[i][1]);
 });
});
$('[style]').each((_, el) => {
 let style = $(el).attr('style');
 if (/will-change:\s*transform/.test(style) || $(el).attr('data-framer-appear-id')) {
   style = style.replace(/opacity:\s*0(?:\.001)?(?=;|$)/g, 'opacity:1').replace(/transform:\s*translateY\(40px\)/g, 'transform:none');
 }
 $(el).attr('style', style);
});
$('a[href]').each((_, e) => $(e).attr('href', resolveHref($(e).attr('href'))));
$('nav a[href*="/case-study"]').each((_,link)=>{
 const parent=$(link).parent();
 if(parent.attr('class')?.includes('-container') && parent.children().length===1) parent.remove(); else $(link).remove();
});

const urls = new Set();
const assetPattern = /https:\/\/framerusercontent\.com\/(?:images|assets|third-party-assets)\/[^\s"'<>),]+/g;
for (const match of (css + $.html()).matchAll(assetPattern)) urls.add(match[0].replaceAll('&amp;', '&'));
let manifest = {};
try { manifest = JSON.parse(await fs.readFile('public/assets/manifest.json', 'utf8')); } catch {}
let completed = 0;
const pending = [...urls];
await Promise.all(Array.from({length: 6}, async () => {
 while (pending.length) {
   const url = pending.shift();
   const ext = new URL(url).pathname.split('.').pop();
   const local = `/assets/${createHash('sha256').update(url).digest('hex').slice(0, 18)}.${ext}`;
   try {
     await fs.access(`public${local}`);
   } catch {
     let error;
     for (let attempt = 0; attempt < 3; attempt++) {
       try {
         const response = await fetch(url, { signal: AbortSignal.timeout(45000) });
         if (!response.ok) throw new Error(`${response.status} ${url}`);
         await fs.writeFile(`public${local}`, Buffer.from(await response.arrayBuffer()));
         error = null; break;
       } catch (e) { error = e; }
     }
     if (error) throw error;
   }
   manifest[url] = local;
   completed++;
 }
}));
console.log(`Saved ${completed} image and font assets.`);
await fs.writeFile('public/assets/manifest.json', JSON.stringify(manifest, null, 2));
function localize(value) {
 for (const [remote, local] of Object.entries(manifest).sort((a,b) => b[0].length-a[0].length)) value = value.replaceAll(remote, local);
 return value;
}
css = localize(css);
await fs.writeFile('app/design.css', css);
const replacements = new Map();
const voidTags = new Set(['area','base','br','col','embed','hr','img','input','meta','param','source','track','wbr']);
function jsx(node) {
 if (replacements.has(node)) return `<${replacements.get(node)} />`;
 if (node.type === 'text') return node.data ? `{${JSON.stringify(node.data)}}` : '';
 if (node.type !== 'tag') return '';
 const props = attributesToProps(node.attribs || {});
 for (const key of Object.keys(props)) {
   if (/^on/i.test(key)) delete props[key];
   else if (typeof props[key] === 'string') props[key] = localize(props[key]);
   else if (key === 'style') for (const p of Object.keys(props.style)) if (typeof props.style[p] === 'string') props.style[p] = localize(props.style[p]);
 }
 if (node.name === 'input' && 'value' in props) { props.defaultValue = props.value; delete props.value; }
 const attributes = Object.keys(props).length ? ` {...${JSON.stringify(props)}}` : '';
 if (voidTags.has(node.name)) return `<${node.name}${attributes} />`;
 const tag = node.name === 'a' && props.href?.startsWith('/') ? 'Link' : node.name;
 return `<${tag}${tag === 'Link' ? ' prefetch={false}' : ''}${attributes}>${(node.children || []).map(jsx).join('')}</${tag}>`;
}
async function saveComponent(name, node) {
 const code = `import Link from 'next/link';\nexport default function ${name}() { return (${jsx(node)}); }`;
 await fs.writeFile(`components/sections/${name}.jsx`, await prettier.format(code, { parser: 'babel' }));
 replacements.set(node, name);
}
const names = {'Hero section':'Hero','Who we are':'About','Brands':'Brands','Service':'Services','Why us':'WhyUs','Process':'Process','Industries':'Industries','Case study':'CaseStudy','Testimonial':'Testimonials','FAQ':'Faq','Insights':'Insights'};
const imports = [];
for (const [i, node] of $('nav').toArray().entries()) {
 const name = i === 0 ? 'DesktopNavigation' : 'MobileNavigation';
 await saveComponent(name, node);
 imports.push(`import ${name} from './sections/${name}';`);
}
for (const [i, node] of $('main > section').toArray().entries()) {
 const name = names[$(node).attr('data-framer-name')?.trim()] || `Section${i}`;
 await saveComponent(name, node);
 imports.push(`import ${name} from './sections/${name}';`);
}
// Footer variants share their parent wrapper, keeping their original breakpoint selection.
for (const [i, node] of $('footer').toArray().entries()) {
 const name = ['DesktopFooter','MobileFooter','TabletFooter'][i] || `Footer${i}`;
 await saveComponent(name, node); imports.push(`import ${name} from './sections/${name}';`);
}
const main = $('#main')[0];
const svgDefinitions = $('#svg-templates')[0];
if (svgDefinitions) {
 await saveComponent('SvgDefinitions', svgDefinitions);
 imports.push("import SvgDefinitions from './sections/SvgDefinitions';");
}
const pageCode = `import Link from 'next/link';\n${imports.join('\n')}\nexport default function ElevraPage() { return (<>${jsx(main)}${svgDefinitions ? '<SvgDefinitions />' : ''}</>); }`;
await fs.writeFile('components/ElevraPage.jsx', await prettier.format(pageCode, { parser:'babel' }));
console.log(`Generated ${imports.length} React section components.`);
