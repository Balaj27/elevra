import {absoluteUrl,sitemapPaths} from '../lib/seo.mjs';
export default function sitemap(){return sitemapPaths.map(path=>({url:absoluteUrl(path),changeFrequency:path.startsWith('/insights/')?'yearly':'monthly',priority:path==='/'?1:path==='/services'||path==='/contact'?.9:.7}));}
