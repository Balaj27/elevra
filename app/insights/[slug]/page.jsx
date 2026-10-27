import { notFound } from "next/navigation";
import { articles } from "../../../lib/firm-content";
import RestoredArticle from '../../../components/RestoredArticle';
import SeoSchema from '../../../components/SeoSchema';
import {pageMetadata} from '../../../lib/seo.mjs';
export const dynamicParams = false;
export function generateStaticParams() {
  return articles.map(({ slug }) => ({ slug }));
}
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const article = articles.find((a) => a.slug === slug);
  if(!article)return {title:'Insight not found',robots:{index:false,follow:false}};
  return pageMetadata('/insights/'+slug,{title:article.title+' | S MAGO CPA, PC',description:article.summary,article:true});
}
export default async function Insight({ params }) {
  const { slug } = await params;
  const article = articles.find((a) => a.slug === slug);
  if (!article) notFound();
  return <><SeoSchema path={'/insights/'+slug} article={article}/><RestoredArticle article={article}/></>;
}
