import fs from 'node:fs/promises';
import prettier from 'prettier';
const pages={
'app/page.jsx': `
import Link from 'next/link';
import {Reveal,Eyebrow,SectionHeading,ServiceCards,IndustryCards,Faq,InsightCards,Button,ConsultationCta} from '../components/firm/Sections';
import {whyChoose,values} from '../lib/firm-content';
export default function Home(){return <main className="firm-page">
<section className="firm-home-hero"><div className="firm-hero-heading"><Reveal><h1>Clearer numbers.<br/><span>Stronger foundations.</span></h1></Reveal><Reveal className="firm-hero-intro"><p>A full-service tax and accounting firm in Greater Houston. Personal attention for your finances, professional support for your next step.</p><div className="firm-button-row"><Button>Get a Free Consultation</Button><Link className="firm-button firm-button-light" href="/services">View Services</Link></div></Reveal></div><div className="firm-hero-cards"><Reveal className="firm-hero-photo"><img src="/assets/88062feb6ab4b2af81.png" alt="Building a strong business foundation"/></Reveal><Reveal className="firm-hero-fact"><span>One firm. A broader perspective.</span><strong>4</strong><h2>Core service areas</h2><p>Accounting Services. Tax Services. Business Services. IRS Representation.</p><Link href="/services">Explore Our Expertise ↗</Link></Reveal><Reveal className="firm-hero-feature"><Eyebrow>S MAGO CPA, PC</Eyebrow><h2>Local relationships.<br/>Nationwide service.</h2><p>From our Sugar Land and Austin offices to clients across the United States.</p><Button light>Let’s Talk</Button></Reveal></div></section>
<section className="firm-section firm-about-preview"><Reveal><Eyebrow>Who we are</Eyebrow><h2>Professional service.<br/><span>A personal relationship.</span></h2><Button href="/about">Know Our Firm</Button></Reveal><Reveal><p>Established to provide professional services at an affordable cost, S MAGO CPA, PC works closely with individuals and businesses to bring clarity and confidence to their financial operations.</p><div className="firm-values-mini">{values.map(value=><div key={value.name}><span>✦</span><h3>{value.name}</h3></div>)}</div></Reveal></section>
<section className="firm-section"><SectionHeading label="Our Services" title="The right support" muted="for your financial world." description="Four connected service areas, shaped around your needs."/><ServiceCards/></section>
<section className="firm-section"><SectionHeading label="Why choose us" title="Your business matters." muted="Whatever its size."/><Reveal className="firm-why-grid"><p>{whyChoose}</p><div><h3>Built around your needs</h3><ul><li>Customized accounting and tax services</li><li>Personalized financial and business guidance</li><li>Affordable, turnkey support for small businesses</li><li>Dependable service with confidentiality as a priority</li></ul></div></Reveal></section>
<section className="firm-section" id="industries"><SectionHeading label="Industries we serve" title="Industry understanding." muted="Individual attention." description="We work with businesses throughout Greater Houston and beyond."/><IndustryCards compact/></section><ConsultationCta/><Faq/>
<section className="firm-section"><SectionHeading label="Firm Insights" title="A closer look at" muted="how we can help." description="Learn more about our approach to accounting, tax, and business services."/><InsightCards limit={3}/></section></main>;}
`,
'app/about/page.jsx': `
import {PageHero,Reveal,Eyebrow,ConsultationCta,Faq} from '../../components/firm/Sections';
import {aboutParagraphs,values} from '../../lib/firm-content';
export const metadata={title:'About Us | S MAGO CPA, PC',description:'Professional, responsive accounting and tax services from Sugar Land and Austin, serving clients nationwide.'};
export default function About(){return <main className="firm-page"><PageHero label="About our firm" title="Built on professionalism." muted="Focused on you." description="Close relationships, transparent communication, and quality service at an affordable cost."/><Reveal className="firm-about-banner"><img src="/assets/0c0d2c04be2bcabe40.png" alt="Business professionals collaborating"/></Reveal><section className="firm-section firm-two-column"><Reveal><Eyebrow>Who we are and what we do</Eyebrow><h2>A closely held firm.<br/><span>A broad commitment.</span></h2></Reveal><Reveal className="firm-prose">{aboutParagraphs.map(text=><p key={text}>{text}</p>)}</Reveal></section><section className="firm-section"><div className="firm-values-grid">{values.map((value,index)=><Reveal as="article" key={value.name}><span className="firm-index">0{index+1}</span><h3>{value.name}</h3><p>{value.text}</p></Reveal>)}</div></section><ConsultationCta/><Faq/></main>;}
`,
'app/services/page.jsx': `
import {PageHero,ServiceCards,ConsultationCta,Faq} from '../../components/firm/Sections';
export const metadata={title:'Accounting, Tax & Business Services | S MAGO CPA, PC',description:'Accounting Services, Tax Services, Business Services, and IRS Representation in Greater Houston and nationwide.'};
export default function Services(){return <main className="firm-page"><PageHero label="Our Services" title="Professional support" muted="for what comes next." description="Accounting Services, Tax Services, Business Services, and IRS Representation, with personalized attention throughout."/><section className="firm-section firm-services-page"><ServiceCards detailed/></section><ConsultationCta/><Faq/></main>;}
`,
'app/industries/page.jsx': `
import {PageHero,IndustryCards,ConsultationCta} from '../../components/firm/Sections';
export const metadata={title:'Industries We Serve | S MAGO CPA, PC',description:'Serving hospitality, healthcare, construction, real estate, retail and wholesale, professional services, and other industries.'};
export default function Industries(){return <main className="firm-page"><PageHero label="Industries we serve" title="Your industry has context." muted="So should your accounting." description="We serve business owners across Greater Houston and nationwide, with services shaped around the way their organizations work."/><section className="firm-section firm-industries-page"><IndustryCards/></section><ConsultationCta/></main>;}
`,
'app/contact/page.jsx': `
import {PageHero,Reveal,Eyebrow,OfficeInfo,Faq} from '../../components/firm/Sections';
import ContactForm from '../../components/firm/ContactForm';
import {whyChoose,firm} from '../../lib/firm-content';
export const metadata={title:'Contact Us | S MAGO CPA, PC',description:'Request a free consultation. 12808 W Airport Blvd Ste 310, Sugar Land, TX 77478. Monday–Friday, 9 AM–5 PM.'};
export default function Contact(){return <main className="firm-page"><PageHero label="Get in touch" title="Let’s talk about" muted="your next step." description="Request a free consultation to discuss accounting, tax, business services, or IRS representation."/><section className="firm-contact-layout"><Reveal className="firm-contact-aside"><div><Eyebrow>Why choose us</Eyebrow><h2>Personal attention.<br/><span>Practical support.</span></h2><p>{whyChoose}</p></div><OfficeInfo/></Reveal><Reveal className="firm-form-card"><ContactForm/></Reveal></section><section className="firm-section firm-location-section"><Reveal className="firm-location-card"><Eyebrow>Our Sugar Land office</Eyebrow><h2>Meet us in<br/><span>Sugar Land, Texas.</span></h2><p>{firm.street}<br/>{firm.city}</p><a className="firm-button" href={'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(firm.address)} target="_blank" rel="noreferrer">Get Directions ↗</a><p className="firm-location-hours">{firm.days}<br/>{firm.hours}</p></Reveal><iframe className="firm-map" title="S MAGO CPA, PC Sugar Land office location" src={'https://www.google.com/maps?q='+encodeURIComponent(firm.address)+'&output=embed'} loading="lazy" referrerPolicy="no-referrer-when-downgrade"/></section><Faq/></main>;}
`,
'app/insights/page.jsx': `
import {PageHero,InsightCards,ConsultationCta} from '../../components/firm/Sections';
export const metadata={title:'Firm Insights | S MAGO CPA, PC',description:'Explore our approach to accounting, tax, business services, and IRS representation.'};
export default function Insights(){return <main className="firm-page"><PageHero label="Firm Insights" title="A little more clarity." muted="A useful place to start." description="Learn about our services and the personal approach we bring to each client relationship."/><section className="firm-section"><InsightCards/></section><ConsultationCta/></main>;}
`,
'app/insights/[slug]/page.jsx': `
import {notFound} from 'next/navigation';
import {articles} from '../../../lib/firm-content';
import {PageHero,Reveal,ConsultationCta} from '../../../components/firm/Sections';
export const dynamicParams=false;
export function generateStaticParams(){return articles.map(({slug})=>({slug}));}
export async function generateMetadata({params}){const{slug}=await params;const article=articles.find(a=>a.slug===slug);return{title:article?article.title+' | S MAGO CPA, PC':'Insight not found',description:article?.summary};}
export default async function Insight({params}){const{slug}=await params;const article=articles.find(a=>a.slug===slug);if(!article)notFound();return <main className="firm-page"><PageHero label={article.category} title={article.title} description={article.summary}/><Reveal className="firm-article"><img src={article.image} alt=""/>{article.paragraphs.map(paragraph=><p key={paragraph}>{paragraph}</p>)}</Reveal><ConsultationCta/></main>;}
`,
};
for(const[file,source]of Object.entries(pages)){await fs.mkdir(file.slice(0,file.lastIndexOf('/')),{recursive:true});await fs.writeFile(file,await prettier.format(source,{parser:'babel'}));console.log(file);}
