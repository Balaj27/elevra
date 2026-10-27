import {firm,services,articles} from './firm-content.js';

const configuredUrl=process.env.NEXT_PUBLIC_SITE_URL || 'https://elevra-h2gy.vercel.app';
const parsedUrl=new URL(configuredUrl);
if(!['http:','https:'].includes(parsedUrl.protocol))throw new Error('NEXT_PUBLIC_SITE_URL must use http or https');
export const siteUrl=parsedUrl.origin;
export const absoluteUrl=path=>new URL(path,siteUrl+'/').toString();
export const shareImagePath='/og/s-mago-cpa-share-v2.jpg';
export const shareImage={url:absoluteUrl(shareImagePath),width:1200,height:630,type:'image/jpeg',alt:'S MAGO CPA, PC — Accounting Services, Tax Services, Business Services and IRS Representation. Stafford and Austin, Texas.'};

export const seoPages={
 '/':{title:'S MAGO CPA, PC | Stafford CPA & Tax Services',description:'Accounting, tax, business services and IRS representation in Stafford and Greater Houston. S MAGO CPA, PC serves individuals and businesses nationwide.',name:'Home'},
 '/about':{title:'About Our CPA Firm | S MAGO CPA, PC',description:'Meet S MAGO CPA, PC, with offices in Stafford and Austin, Texas. Professional, responsive accounting and tax support for individuals and businesses nationwide.',name:'About Us'},
 '/services':{title:'Accounting, Tax & Business Services | S MAGO CPA, PC',description:'Explore accounting services, tax preparation and planning, business support and IRS representation from S MAGO CPA, PC. Request a free consultation.',name:'Services'},
 '/contact':{title:'Contact a Stafford CPA | S MAGO CPA, PC',description:'Request a free consultation with S MAGO CPA, PC. Visit 12603 Southwest Fwy Ste 695, Stafford, TX 77477. Open Monday–Friday, 9 AM–5 PM.',name:'Contact Us'},
 '/insights':{title:'Accounting & Tax Insights | S MAGO CPA, PC',description:'Explore the S MAGO CPA, PC approach to accounting, tax services, business support and IRS representation for individuals and businesses.',name:'Insights'},
};

export function pageMetadata(path,override={}){
 const content={...(seoPages[path]||{}),...override};
 const url=absoluteUrl(path);
 return {
  title:{absolute:content.title},description:content.description,
  alternates:{canonical:url},
  openGraph:{type:override.article?'article':'website',locale:'en_US',siteName:firm.name,title:content.title,description:content.description,url,images:[shareImage]},
  twitter:{card:'summary_large_image',title:content.title,description:content.description,images:[{url:shareImage.url,alt:shareImage.alt}]},
 };
}

export const rootMetadata={
 metadataBase:new URL(siteUrl),
 ...pageMetadata('/'),
 applicationName:firm.name,creator:firm.name,publisher:firm.name,
 authors:[{name:firm.name,url:siteUrl}],
 category:'Accounting and Tax Services',
 robots:{index:true,follow:true,googleBot:{index:true,follow:true,'max-image-preview':'large','max-snippet':-1,'max-video-preview':-1}},
 icons:{icon:'/brand/s-mago-logo.png'},
};

export function organizationSchema(){return {
 '@context':'https://schema.org',
 '@graph':[
  {'@type':'WebSite','@id':absoluteUrl('/#website'),url:absoluteUrl('/'),name:firm.name,inLanguage:'en-US',publisher:{'@id':absoluteUrl('/#business')}},
  {'@type':'AccountingService','@id':absoluteUrl('/#business'),name:firm.name,legalName:firm.name,url:absoluteUrl('/'),description:firm.description,
   logo:{'@type':'ImageObject',url:absoluteUrl(firm.logo),width:606,height:158},image:shareImage.url,
   address:{'@type':'PostalAddress',streetAddress:firm.street,addressLocality:'Stafford',addressRegion:'TX',postalCode:'77477',addressCountry:'US'},
   openingHoursSpecification:[{'@type':'OpeningHoursSpecification',dayOfWeek:['Monday','Tuesday','Wednesday','Thursday','Friday'],opens:'09:00',closes:'17:00'}],
   areaServed:[{'@type':'Place',name:'Greater Houston'},{'@type':'City',name:'Stafford'},{'@type':'City',name:'Austin'},{'@type':'Country',name:'United States'}],
   hasOfferCatalog:{'@type':'OfferCatalog',name:'Accounting, Tax and Business Services',itemListElement:services.map(service=>({'@type':'Offer',itemOffered:{'@type':'Service',name:service.name,description:service.summary,provider:{'@id':absoluteUrl('/#business')},url:absoluteUrl('/services#'+service.id)}}))},
  },
 ],
};}

export function pageSchema(path,article){
 const definition=article?{title:article.title,description:article.summary,name:article.title}:seoPages[path];
 if(!definition)return null;
 const entries=[{name:'Home',item:absoluteUrl('/')}];
 if(article)entries.push({name:'Insights',item:absoluteUrl('/insights')});
 if(path!=='/')entries.push({name:definition.name,item:absoluteUrl(path)});
 const breadcrumb={'@type':'BreadcrumbList','@id':absoluteUrl(path+'#breadcrumb'),itemListElement:entries.map((item,index)=>({'@type':'ListItem',position:index+1,...item}))};
 return {'@context':'https://schema.org','@graph':[
  {'@type':article?'Article':'WebPage','@id':absoluteUrl(path+'#page'),url:absoluteUrl(path),name:definition.title,description:definition.description,inLanguage:'en-US',
   isPartOf:{'@id':absoluteUrl('/#website')},about:{'@id':absoluteUrl('/#business')},breadcrumb:{'@id':breadcrumb['@id']},
   ...(article?{headline:article.title,image:shareImage.url,author:{'@type':'Organization',name:firm.name,url:absoluteUrl('/')},publisher:{'@id':absoluteUrl('/#business')},mainEntityOfPage:absoluteUrl(path)}:{}),
  },breadcrumb,
 ]};
}
export const sitemapPaths=[...Object.keys(seoPages),...articles.map(article=>'/insights/'+article.slug)];
