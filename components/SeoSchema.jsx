import {organizationSchema,pageSchema} from '../lib/seo.mjs';
export default function SeoSchema({path,article,organization=false}){
 const value=organization?organizationSchema():pageSchema(path,article);
 if(!value)return null;
 return <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(value).replace(/</g,'\\u003c')}}/>;
}
