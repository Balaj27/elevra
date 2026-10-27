const define=(id,page,photographer,alt,position='50% 50%')=>({id,source:'https://www.pexels.com/photo/'+page+'-'+id+'/',photographer,alt,position,src:'/photos/pexels-'+id+'-1600.jpg',srcSet:[480,960,1600].map(width=>'/photos/pexels-'+id+'-'+width+'.jpg '+width+'w').join(', ')});
export const pexelsPhotos={
 consultation:define(7821671,'an-agent-showing-documents-to-his-client','RDNE Stock project','Financial advisor discussing documents with a client in an office'),
 review:define(7658322,'people-working-in-office-with-documents','Pavel Danilyuk','Two professionals reviewing financial documents together'),
 accounting:define(6694492,'an-accountant-s-workspace','Tima Miroshnichenko','Accounting workspace with a laptop, financial reports and a calculator'),
 tax:define(8296970,'a-person-examining-documents','Mikhail Nilov','Financial documents being reviewed with a calculator and pen'),
 analysis:define(33175651,'financial-analysis-with-calculator-and-documents','Bia Limova','Close-up of financial analysis using a calculator and documents'),
 calculator:define(53621,'black-calculator-near-ballpoint-pen-on-white-printed-paper','Pixabay','Calculator and pen on financial reports'),
 business:define(4342129,'business-meeting-in-the-office','Edmond Dantès','Business professionals collaborating in an office meeting'),
 planning:define(7869102,'people-having-a-meeting-at-the-office','Pavel Danilyuk','Professionals discussing plans around an office meeting table'),
 office:define(20843180,'office-building-with-a-glass-facade-against-the-blue-sky','Çağrı KANMAZ','Modern glass office building against a blue sky'),
 healthcare:define(19438560,'doctor','Oys Photography','Healthcare professional wearing a white coat and stethoscope','50% 35%'),
 construction:define(38763816,'construction-site-meeting-with-engineers-in-hard-hats','Envision Bharadwaj & Co LLP','Engineers in hard hats discussing a construction project'),
 realEstate:define(24818960,'view-of-a-house-and-apartment-buildings-in-a-city','UMUT DAĞLI','Residential houses and apartment buildings surrounded by greenery'),
 retail:define(6044231,'interior-of-modern-clothes-shop-with-counter','Skylar Kang','Clothing boutique interior with a counter and retail displays'),
 hospitality:define(12638919,'view-of-a-restaurant-interior','Nicolás Rueda','Restaurant tables and chairs in a contemporary dining room'),
 representation:define(33175673,'close-up-of-finance-document-with-calculator-and-glasses','Bia Limova','Financial paperwork with a calculator, pen and glasses'),
};
export const industryPhotoKeys=['healthcare','construction','realEstate','retail','hospitality','business','planning'];
export const servicePhotoKeys=['accounting','tax','business','representation'];
