import {firm,services,industries,values,faqs,articles} from '../lib/firm-content.js';

// Change content in the captured DOM without replacing its elements, classes,
// inline styles, image assets, or responsive variants.
function textNodes(node,out=[]){for(const child of node.children||[]){if(child.type==='text')out.push(child);else textNodes(child,out);}return out;}
function copy($,element,value){
 const nodes=textNodes(element);if(!nodes.length)return;
 const original=nodes.map(node=>node.data).join('');
 let consumed=0,position=0;
 nodes.forEach((node,index)=>{
   consumed+=node.data.length;
   let end=index===nodes.length-1?value.length:Math.round(value.length*consumed/Math.max(original.length,1));
   if(end>position&&end<value.length){const next=value.indexOf(' ',end);if(next!==-1)end=next+1;}
   end=Math.max(position,Math.min(value.length,end));
   node.data=value.slice(position,end);position=end;
 });
}

export function applyFirmCopy($,slug='home'){
 const map=new Map(Object.entries({
 'Turn complexity into decisive growth.':'Clear accounting for confident decisions.',
 'We help ambitious businesses find clarity, build smarter strategies, and turn complex challenges into sustainable growth.':'Personalized accounting, tax, business services, and IRS representation for individuals and businesses in Greater Houston and nationwide.',
 'Start a conversation':'Get a free consultation','Average Growth':'Core Services',
 'Sustained growth through strategic planning, operational improvements, and better decisions':'Accounting Services, Tax Services, Business Services, and IRS Representation, shaped around your needs.',
 'Elevra Expertise':'Our Expertise','From strategy to execution, we bring the clarity and expertise businesses need to grow with confidence.':'Professional accounting and tax support, with close relationships and personal attention at every step.',
 'Explore Case Studies':'Explore Our Services','About Elevra':'About Our Firm',
 'From financial modeling to technology strategy.':'From accounting clarity to business confidence.',
 'Companies Advised':'Core Service Areas','From ambitious startups to growing enterprises.':'Accounting, tax, business services, and IRS representation.',
 'Years of Experience':'Texas Offices','Across strategy, operations, and business transformation.':'Based in Sugar Land and Austin, serving clients nationwide.',
 'Measured improvement after refining strategy and execution.':'Personal attention for individuals and businesses of every size.',
 'Client Retention':'Client Focus','Long-term partnerships built on measurable impact and trust.':'Close relationships, transparent communication, and confidentiality.',
 'TRUSTED BY 1,00,000+ CUSTOMERS AROUND WORLDS':'SERVING GREATER HOUSTON AND CLIENTS ACROSS THE UNITED STATES',
 'Tailored Solutions for Business Growth':'Personalized Services for Your Financial Needs',
 'Turning complex business challenges into clear growth opportunities.':'Customized accounting and tax services, with practical business guidance.',
 'The only Consult built for scale':'Professional Support Built Around You',
 'Within six months of working with Elevra, clients experienced an average 48% increase in annual revenue based on pre and post-engagement performance.':'Four connected service areas support individuals and business owners: accounting, tax, business services, and IRS representation.',
 'Traditional Consulting / Legacy approach':'Accounting & Tax Services','Elevra Growth Framework':'Business Services & IRS Representation','18%':'02','42%':'04','avg. efficiency gain':'connected service areas','Operational Efficiency Gain (%)':'A connected approach to your financial needs',
 'A Structured Approach to Business Growth':'A Personal Approach to Working Together',
 'A structured approach that turns complexity into clear, actionable direction.':'Professionalism, responsiveness, and quality, from the first conversation onward.',
 'Diagnose':'Understand','Strategize':'Organize','Execute':'Support','Measure':'Review',
 'Deep discovery into your market position, funnel economics, team structure, and strategic constraints. We find the real bottleneck, not just the surface symptoms.':'We begin by understanding your situation, your business, and the accounting or tax services you would like to discuss.',
 'We turn scattered findings into one clear, sequenced plan built around your business, your goals, and the realities of your market.':'We discuss the scope of work, clarify the information involved, and establish a practical approach to your needs.',
 'Plans only matter when they ship. We stay embedded in the work until the changes take hold and start creating momentum.':'We bring professional attention to your accounting, tax, business, or IRS representation needs, with clear communication throughout.',
 'Every engagement ends with a number you can point to — growth, efficiency, or margin, tracked and reported, not assumed.':'We stay responsive to questions and discuss the next steps that fit your circumstances and priorities.',
 'Deep Industry Insight Behind Every Strategy':'Industry Understanding Behind Every Service',
 'Bringing industry context to every strategy, decision, and solution.':'Serving healthcare, construction, real estate, retail, hospitality, professional services, and other industries.',
 'Case Study':'How We Help','What Better Strategy Looks Like in Practice':'A Clearer Financial Picture for Your Business',
 'A closer look at the challenges we solved and the results we delivered.':'Accounting and business support focused on organization, clarity, and confidence.',
 'How Northfield cut client onboarding time by 62% in four months':'Professional accounting support for your next business chapter',
 'Fragmented handoffs and duplicate documentation were bleeding time out of every engagement.':'We help business owners understand their numbers and build a dependable financial foundation.',
 'Fragmented handoffs between sales and delivery teams':'Financial information that needs greater structure',
 'Unified onboarding playbook with automated triggers':'Personalized accounting and business support',
 'View Case Study':'Discuss Your Needs','4-month engagement':'Personal attention','- Case study':'S MAGO CPA, PC',
 'Down from 47 days to 18 per account.':'Four core service areas, one professional relationship.',
 'Day-30 survey scores after go-live.':'Offices in Sugar Land and Austin, Texas.',
 '200 Employees':'Nationwide Service','400 employees':'Nationwide Service',
 'Testimonial':'Our Commitment','Real Perspectives From Our Clients':'Professional Values That Guide Our Work',
 'Real experiences from businesses that trusted us with their challenges.':'Professionalism, responsiveness, and quality are at the heart of our client relationships.',
 'Daniel Carter':'Professionalism','Founder, Northfield':'Our commitment','Sophia Bennett':'Responsiveness','CEO, Ashgrove Group':'Our approach','Marcus Reed':'Quality','COO, Halden Co.':'Our priority',
 '“Elevra gave us the clarity we needed to make better decisions and move forward with confidence.”':values[0].text,
 '“They helped us turn a complex growth problem into a clear, practical strategy our team could actually execute.”':values[1].text,
 '“From strategy to execution, Elevra brought structure to our operations and helped us build a stronger business.”':values[2].text,
 '4.9':'4','/5':'areas','50+ projects helping companies make smarter decisions, improve operations, and build sustainable growth.':'Four core service areas for individuals and businesses: accounting, tax, business services, and IRS representation.',
 'Trusted by ambitious teams worldwide':'Personal attention. Professional service.','Work With Elevra':'Work With Our Firm',
 'What can Elevra help my business with?':'What services can you help me with?',
 'Our consulting services focus on three areas: Strategy, Finance, and Operations, tailored around your business goals and challenges.':faqs[3][1],
 'We work with businesses looking to improve their strategy, financial clarity, operations, or prepare for their next stage of growth.':faqs[0][1],
 'How do I know if my business needs consulting?':'Do you work with clients outside Texas?',
 'If growth feels difficult to manage, decisions lack clarity, or your current systems are holding you back, an outside perspective can help identify what needs to change.':faqs[2][1],
 'What does the consulting process look like?':'How do I get started?',
 'We start by understanding your business and its challenges, then identify priorities, develop a practical strategy, and turn it into clear, measurable actions.':faqs[4][1],
 'How long does a typical consulting engagement take?':'What are your office hours?',
 'Every engagement is different. The timeline depends on the scope, complexity, and goals of the project, from focused strategic work to ongoing support.':faqs[5][1],
 'How much does consulting with Elevra cost?':'How is the scope of work determined?',
 'Pricing depends on the scope and complexity of the engagement. After understanding your needs, we can recommend an approach that fits the work required.':'We discuss your needs and recommend a scope of work suited to your circumstances. Our firm was established to offer professional services at an affordable cost.',
 'Elevra Insights':'Firm Insights','Elevra Insight':'Firm Insights','Elevra Services':'Our Services',
 'Insights Built Around Real Business Challenges':'Insights for Your Financial World',
 'Explore ideas that challenge assumptions and create better ways forward.':'Explore our approach to accounting, tax, business support, and professional service.',
 'Where clear thinking creates momentum.':'Where personal service creates confidence.',
 'We help businesses turn complex challenges into clear, actionable opportunities.':'Professional accounting and tax support from Sugar Land and Austin, Texas, serving clients across the United States.',
 'We combine strategic thinking with practical action to help businesses move forward with confidence.':'We provide professional services at an affordable cost, with close, transparent relationships and confidentiality as a priority.',
 'Clear Direction':'Professionalism','Built to Scale':'Responsiveness','Measurable Progress':'Quality',
 'Turning complex challenges into focused priorities and clear decisions that move your business forward.':values[0].text,
 'Creating smarter ways of working that improve efficiency and support sustainable business growth.':values[1].text,
 'Focusing on improvements that strengthen performance and create lasting business value.':values[2].text,
 'Driven by Purpose, Focused on Results':'Professional Service, Focused on You',
 'Smarter Growth, Everywhere':'Personal Relationships, Nationwide',
 'We’re on a mission to help businesses around the world make better decisions, solve complex challenges, and build stronger foundations for sustainable growth.':'Our Sugar Land and Austin offices serve individuals and business owners throughout the United States. Our locations do not limit our commitment to you.',
 'We help businesses worldwide navigate complexity, unlock opportunities, and grow with greater clarity and confidence.':'We work to provide dependable, efficient, and affordable professional services, supported by personal attention.',
 'We envision a world where businesses can think bigger, adapt faster, and build lasting success with confidence.':'We aim to be a financial foundation that supports our clients, their businesses, and their next steps.',
 'Elevra Journey':'Our Approach','Experience That Moves Business Forward':'A Relationship Built Around Your Needs',
 'A look at the milestones that shaped Elevra and continue to move us forward.':'From understanding your needs to providing responsive professional support.',
 '2018':'01','2020':'02','2022':'03','2024':'04','2026':'05',
 ' The Beginning':'The Conversation','Building Expertise':'Understanding Your Needs','Growing Our Impact':'Organizing the Work','Going Further':'Professional Support','A Global Ambition':'A Continuing Relationship',
 'Elevra begins with a simple goal: help businesses make smarter, more confident decisions.':'We begin with a conversation about your situation and the services you would like to discuss.',
 'We expand our expertise across strategy, operations, and business transformation.':'We take time to understand your circumstances, business operations, and priorities.',
 'More businesses turn to Elevra to solve complex challenges and unlock new opportunities.':'We discuss a scope of work and the information involved in moving forward.',
 'We deepen our approach, combining strategic insight with practical solutions built for lasting growth.':'We bring professional attention to the accounting, tax, business, or IRS matters within your engagement.',
 'Elevra continues helping businesses worldwide navigate change, grow stronger, and build what comes next.':'We stay responsive to questions and value close, transparent client relationships.',
 'Our Team':'Our Expertise','Meet The Minds Behind Elevra':'Professional Support Across Your Financial Needs',
 'A team of thinkers, strategists, and problem-solvers focused on creating meaningful business impact.':'A closely held firm bringing personal attention to accounting, tax, business services, and IRS representation.',
 'Daniel Reyes':'Accounting Services','Mei Lin Zhao':'Tax Services','Arjun Mehta':'Business Services','Sofia Marchetti':'IRS Representation','Kwame Boateng':'Personal Attention','Hannah Lindqvist':'Confidential Service',
 'Managing Partner':'Financial clarity','Head of Strategy':'Tax preparation & planning','Finance Lead':'Business guidance','Director of Operations':'Professional representation','Senior Strategist':'Close relationships','Senior Analyst':'Quality service',
 'Join Elevra':'Work With Us','Be part of our mission':'Let’s Discuss Your Next Step','Bring your ideas to work that creates real impact.':'Individual needs. Business priorities. One professional conversation.',
 'Senior Strategy Consultant':'Accounting Services','Finance & Valuation Analyst':'Tax Services','Operations Excellence Manager':'Business Services','\tEngagement Manager':'IRS Representation','Business Analyst (Graduate)':'Initial Consultation',
 'Full Time':'Personalized','Contract':'Professional',' New York':'Sugar Land','London':'Austin','Remote':'Nationwide','Apply Now':'Get in Touch',
 'Expert advice for business growth.':'Professional support for financial clarity.',
 'Focused expertise to help you plan, execute, and grow with confidence.':'Accounting, tax, business services, and IRS representation with individual attention.',
 'Ideas that move business forward.':'Ideas for a clearer financial picture.',
 'Practical perspectives on strategy, finance, operations, and sustainable growth.':'Explore our services and our personal approach to working with individuals and businesses.',
 "Let's Discuss Your Next Move.":'Let’s Discuss Your Financial Needs.',
 "Bring us your challenge, and we'll help turn it into a clear plan of action.":'Request a free consultation to discuss accounting, tax, business services, or IRS representation.',
 'From the Founder':'Our Commitment','“Tell us where you’re stuck. We’ll help you find clarity, build a focused strategy, and move forward with confidence.”':'Professionalism, responsiveness, and quality. We take time to understand your needs and build a close, transparent relationship.',
 'Biggest growth challenge?':'How can we help?','Aspen, Colorado, USA':firm.address,
 'hello@elevra.com':firm.hours,'+1 234 567 89 10':firm.days,
 'Ready to Strategize Your Next Move?':'Ready to Discuss Your Next Step?',
 'Join our newsletter to stay updated on strategy, finance, and operations insights.':'Stay connected with our firm and learn about accounting, tax, and business services.',
 'Strategy':'Accounting','Finance':'Tax','Operations':'Business','Careers':'Our Approach',
 }));

 // Service cards retain every original responsive component and its imagery.
 $('.framer-T0Vmd').each((_,card)=>{
  const title=$(card).find('h3').first().text();
  const index=['Strategic Planning','Financial Consulting','Operations Management'].indexOf(title);
  if(index<0)return;const service=services[index];
  const set=(selector,value)=>$(card).find(selector).each((_,e)=>copy($,e,value));
  const heading=$(card).find('h3').first();copy($,heading[0],service.name);
  $(card).find('p').each((_,e)=>{
   const text=$(e).text();
   if(/Define your direction|Build financial clarity|Build stronger systems/.test(text))copy($,e,service.summary);
   if(/Review$/.test(text))copy($,e,service.name);
   if(/Elevra gave|Our numbers|Elevra helped/.test(text))copy($,e,service.short);
   if(['James Mitchell','Sarah Morgan','Daniel Brooks'].includes(text))copy($,e,'S MAGO CPA, PC');
   if(['Founder','CFO','COO'].includes(text))copy($,e,'Personalized service');
  });
  $(card).find('a[href]').attr('href','/contact');
  $(card).find('a p').each((_,e)=>copy($,e,'Discuss Your Needs'));
  const chips=$(card).find('[data-framer-name="Default"]').filter((_,e)=>$(e).find('p').length===1 && $(e).text().length<35);
  // Match the existing six chip labels without altering their wrappers.
  const old=[['Growth Strategy\t','Market Positioning','Business Models','Strategic Roadmaps','Market Research','Go-To-Market'],['Financial Modeling','Cash Flow Planning','Revenue Forecasting','Funding Strategy','Investor Readiness','Scenario Planning'],['Process Design','Team Structure','Systems Planning','Workflow Optimization','Growth Operations','Performance Tracking']][index];
  $(card).find('p').each((_,e)=>{const i=old.indexOf($(e).text());if(i>=0)copy($,e,service.items[i]);});
 });
 // Add the fourth offering with the existing third-card component, not a new design.
 const third=$('.framer-T0Vmd').filter((_,e)=>$(e).find('h3').text()===services[2].name).first();
 if(third.length){
  const group=third.parent().parent().parent();
  const clone=group.clone();
  clone.find('.framer-T0Vmd').each((_,card)=>{
   $(card).find('h3').each((_,e)=>copy($,e,services[3].name));
   $(card).find('p').each((_,e)=>{let t=$(e).text();if(t===services[2].name)copy($,e,services[3].name);else if(t===services[2].summary)copy($,e,services[3].summary);else if(t===services[2].short)copy($,e,services[3].short);else if(t==='03')copy($,e,'04');else {const i=services[2].items.indexOf(t);if(i>=0)copy($,e,services[3].items[i]);}});
  });
  group.after(clone);
 }

 // Preserve the same carousel cards and images; change only the seven labels.
 $('[data-framer-name="Industries"]').attr('id','industries');
 $('.framer-9bu4wm').each((_,row)=>{
   const cards=$(row).children();
   cards.each((i,card)=>{if(i>=industries.length){$(card).remove();return;}$(card).find('[data-framer-name="Filled"] p').each((_,p)=>copy($,p,industries[i].name));});
 });

 $('h1,h2,h3,h4,h5,h6,p').each((_,element)=>{const value=map.get($(element).text());if(value!==undefined)copy($,element,value);});
 $('.framer-p5yxs8 h1').each((_,heading)=>{
   const accent=$(heading).children('span').first();
   if(accent.length){$(heading).contents().filter((_,node)=>node.type==='text').each((index,node)=>{node.data=index===0?'Clear accounting for ':'';});accent.text('confident decisions.');}
 });
 // Template numeric slots become factual service/location counts rather than claims.
 $('.framer-w0i3jg-container p').text('4');
 $('.framer-fey5X').each((_,card)=>{
  const label=$(card).find('h6').text();
  $(card).find('.framer-10i4lka-container p').text(label==='Texas Offices'?'2':label==='Client Focus'?'1':'4');
 });
 $('.framer-1r667kc-container p').text('4');$('.framer-1abot5y-container p').text('2');

 // Fill the existing FAQ rows with firm copy, retaining their exact markup.
 $('.framer-u5gfX').each((index,card)=>{
   const faq=faqs[index%7]||['How is the scope of work determined?','We discuss your needs and an appropriate scope of work during your initial consultation.'];
   $(card).find('h6').each((_,e)=>copy($,e,faq[0]));
   $(card).find('[data-framer-name="Answer"] p').each((_,e)=>copy($,e,faq[1]));
 });
 const insightLinks=$('a[href*="/insights/"]');
 insightLinks.each((index,link)=>{
   const article=articles[index%articles.length];$(link).attr('href','/insights/'+article.slug);
   $(link).find('h1,h2,h3,h4,h5,h6').each((_,e)=>copy($,e,article.title));
   $(link).find('p').each((_,e)=>{const t=$(e).text();if(/^[A-Z][a-z]{2} \d/.test(t))copy($,e,'Firm Insight');else if(t.length>35)copy($,e,article.title);});
 });
 // Contact fields use all four offerings; the three original information cards stay put.
 $('form').filter((_,form)=>$(form).find('textarea').length>0).each((_,form)=>$(form).find('select').first().empty().append(services.map(s=>$('<option>').attr('value',s.name).text(s.name))));
 if(slug==='contact'){
  $('.framer-ZcaIH').each((index,card)=>{
   const label=['Location','Office Hours','Weekdays'][index%3];
   $(card).find('.framer-1gf8lh1 p').each((_,e)=>copy($,e,label));
  });
 }
 // Existing wordmark slots retain their placement and contain the supplied logo.
 $('a.framer-dA0di').empty().attr({'aria-label':firm.name+' home','data-copy-brand':''}).append($('<img>').attr({src:firm.logo,alt:firm.name,width:606,height:158}));
 $('[data-framer-name="Case study"] .framer-r2y92o img').attr({src:firm.logo,width:606,height:158,alt:firm.name}).removeAttr('srcset');
 $('footer [data-framer-name="Logo"]').empty().attr('data-copy-footer-logo','').append($('<img>').attr({src:firm.logo,alt:firm.name,width:606,height:158}));
 $('nav a[href="/insights"]').attr('href','/#industries').find('p').each((_,e)=>copy($,e,'Industries'));
 $('a[href*="elevra.framer.media/"]').each((_,link)=>{
  const href=$(link).attr('href');
  $(link).attr('href',href.includes('services')?'/services':href.includes('about')?'/about':href.includes('insights')?'/insights':'/contact');
 });
 $('a[href^="mailto:"],a[href^="tel:"]').removeAttr('href');
 $('a[href*="framer.com"],a[href*="ArbiDesign"]').attr('href','/contact').each((_,a)=>{if($(a).text().includes('Arbi'))copy($,a,'S MAGO CPA, PC');});
 // Final brand substitution also covers metadata labels and footer text nodes.
 function walk(node){for(const child of node.children||[]){if(child.type==='text')child.data=child.data.replaceAll('Elevra',firm.name).replaceAll('Designed in Framer By','Professional services by');else if(child.type==='tag')walk(child);}}
 walk($('body')[0]);
 $('title').text(firm.name+' | '+({home:'Tax & Accounting in Greater Houston',about:'About Our Firm',services:'Our Services',insights:'Firm Insights',contact:'Contact Us'}[slug]||'Professional Services'));
}
