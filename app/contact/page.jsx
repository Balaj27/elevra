import "./design.css";
import PageContent from "../../components/pages/contact/PageContent";
import Interactions from "../../components/Interactions";
export const metadata = {
  title: "Contact Elevra | Talk to a Business Consultant",
  description:
    "Ready to turn complexity into growth? Get in touch with Elevra to discuss your strategy, finance, or operations challenges.",
};
export default function Page() {
  return (
    <>
      <PageContent />
      <Interactions />
    </>
  );
}
