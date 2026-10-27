import ElevraPage from '../components/ElevraPage';
import Interactions from '../components/Interactions';
import SeoSchema from '../components/SeoSchema';
import {pageMetadata} from '../lib/seo.mjs';
export const metadata=pageMetadata('/');
export default function Home(){return <><SeoSchema path="/"/><ElevraPage/><Interactions/></>;}
