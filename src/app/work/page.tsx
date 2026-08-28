import type { Metadata } from "next";
import { KineticText } from "@/components/motion/KineticText";
import { WorkGrid } from "@/components/work/WorkGrid";
import { allPortfolioItems } from "@/lib/portfolio-data";

export const metadata: Metadata = {
  title: "Work — Amarjeet Mishra",
  description: "Brand films, reels, and visual stories for real clients across India.",
};

export default function WorkPage() {
  const years = "2023–2026";

  return (
    <main className="pb-(--section-pad) pt-36">
      <div className="mx-auto max-w-295 px-8">
        <p className="eyebrow mb-7">
          <span className="eyebrow-dot" />
          {allPortfolioItems.length} projects · {years}
        </p>
        <KineticText
          lines={[{ text: "The work" }, { text: "speaks.", accent: true }]}
          className="mb-14 text-[clamp(52px,9vw,140px)]"
        />
        <WorkGrid />
      </div>
    </main>
  );
}
