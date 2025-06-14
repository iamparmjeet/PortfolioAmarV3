import { OrangeHeading1 } from "@/components/heading";
import PortfolioSectionWithFilter from "@/components/portfolios-all";
import { allPortfolioItems } from "@/lib/portfolio-data";

export default function Works() {
  return (
    <section className="bg-black/60 rounded-2xl p-6 mt-8 flex flex-col items-center gap-8">
      <OrangeHeading1 text="My Curated Works" />
      <PortfolioSectionWithFilter Items={30} PortfoliosItems={allPortfolioItems} />
    </section>
  );
}
