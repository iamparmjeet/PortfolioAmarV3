import { HomeItems } from "@/lib/portfolio-data";

import Container from "./container";
import { OrangeHeading1 } from "./heading";
import LetsTalkButton from "./lets-talk-btn";
import PortfolioSectionWithFilter from "./portfolios-all";

export default function PortfolioSection() {
  return (
    <Container className="flex-col items-center">
      <div className="text-center">
        <OrangeHeading1 text="My Portfolio Works" className="text-3xl md:text-5xl font-extrabold" />
        <p className="text-neutral-300 text-base md:text-xl max-w-xl mx-auto mt-6">
          Explore my work across different industries and project types
        </p>
      </div>
      <PortfolioSectionWithFilter Items={6} PortfoliosItems={HomeItems} />
      <LetsTalkButton href="/works" text="Portfolio" />
    </Container>
  );
}
