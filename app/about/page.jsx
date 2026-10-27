import "./design.css";
import PageContent from "../../components/pages/about/PageContent";
import Interactions from "../../components/Interactions";
import SeoSchema from "../../components/SeoSchema";
import { pageMetadata } from "../../lib/seo.mjs";
export const metadata = pageMetadata("/about");
export default function Page() {
  return (
    <>
      <SeoSchema path="/about" />
      <PageContent />
      <Interactions />
    </>
  );
}
