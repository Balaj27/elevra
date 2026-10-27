import "./design.css";
import PageContent from "../../components/pages/services/PageContent";
import Interactions from "../../components/Interactions";
import SeoSchema from "../../components/SeoSchema";
import { pageMetadata } from "../../lib/seo.mjs";
export const metadata = pageMetadata("/services");
export default function Page() {
  return (
    <>
      <SeoSchema path="/services" />
      <PageContent />
      <Interactions />
    </>
  );
}
