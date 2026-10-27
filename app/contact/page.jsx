import "./design.css";
import PageContent from "../../components/pages/contact/PageContent";
import Interactions from "../../components/Interactions";
import SeoSchema from "../../components/SeoSchema";
import { pageMetadata } from "../../lib/seo.mjs";
export const metadata = pageMetadata("/contact");
export default function Page() {
  return (
    <>
      <SeoSchema path="/contact" />
      <PageContent />
      <Interactions />
    </>
  );
}
