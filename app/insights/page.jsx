import "./design.css";
import PageContent from "../../components/pages/insights/PageContent";
import Interactions from "../../components/Interactions";
import SeoSchema from "../../components/SeoSchema";
import { pageMetadata } from "../../lib/seo.mjs";
export const metadata = pageMetadata("/insights");
export default function Page() {
  return (
    <>
      <SeoSchema path="/insights" />
      <PageContent />
      <Interactions />
    </>
  );
}
