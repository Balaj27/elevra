import "./design.css";
import PageContent from "../../components/pages/insights/PageContent";
import Interactions from "../../components/Interactions";
export const metadata = {
  title: "Insights on Strategy, Finance & Operations | Elevra",
  description:
    "Practical insights from the Elevra team. Explore ideas that challenge assumptions and create better ways forward for your business.",
};
export default function Page() {
  return (
    <>
      <PageContent />
      <Interactions />
    </>
  );
}
