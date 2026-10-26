import "./design.css";
import PageContent from "../../components/pages/services/PageContent";
import Interactions from "../../components/Interactions";
export const metadata = {
  title: "Business Consulting Services | Elevra",
  description:
    "Explore Elevra's consulting services: strategic planning, financial consulting, and operations management built to help your business grow with confidence.",
};
export default function Page() {
  return (
    <>
      <PageContent />
      <Interactions />
    </>
  );
}
