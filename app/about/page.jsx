import "./design.css";
import PageContent from "../../components/pages/about/PageContent";
import Interactions from "../../components/Interactions";
export const metadata = {
  title: "About Elevra | Strategy, Finance & Operations Consultants",
  description:
    "Meet the consultants behind Elevra. With 12+ years of experience advising 40+ companies, we turn complex challenges into clear, measurable growth.",
};
export default function Page() {
  return (
    <>
      <PageContent />
      <Interactions />
    </>
  );
}
