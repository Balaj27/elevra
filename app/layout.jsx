import './design.css';
import './globals.css';
import './motion.css';
import './mobile-navigation.css';
import './copy-only.css';
import {rootMetadata} from '../lib/seo.mjs';
import SeoSchema from '../components/SeoSchema';

export const metadata = rootMetadata;

export default function RootLayout({ children }) {
  return <html lang="en" data-scroll-behavior="smooth"><body><SeoSchema organization/>{children}</body></html>;
}
