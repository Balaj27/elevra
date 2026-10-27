import DesktopNavigation from './sections/DesktopNavigation';
import MobileNavigation from './sections/MobileNavigation';
import DesktopFooter from './sections/DesktopFooter';
import MobileFooter from './sections/MobileFooter';
import Interactions from './Interactions';
export default function RestoredArticle({article}){return <><div id="main" className="restored-article"><div className="restored-article-nav"><div className="restored-desktop"><DesktopNavigation/></div><div className="restored-mobile"><MobileNavigation/></div></div><main className="restored-article-content"><p className="framer-text framer-styles-preset-djpks0">{article.category}</p><h1 className="framer-text framer-styles-preset-1ldlz5z">{article.title}</h1><p className="framer-text framer-styles-preset-djpks0">{article.summary}</p><img src={article.image} alt=""/>{article.paragraphs.map(paragraph=><p key={paragraph} className="framer-text framer-styles-preset-djpks0">{paragraph}</p>)}</main><div className="restored-desktop"><DesktopFooter/></div><div className="restored-mobile"><MobileFooter/></div></div><Interactions/></>;}
