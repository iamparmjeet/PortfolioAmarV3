import { ContactCTA } from "@/components/home/ContactCTA";
import { FeaturedWork } from "@/components/home/FeaturedWork";
import { GalleryStrip } from "@/components/home/GalleryStrip";
import { Hero } from "@/components/home/Hero";
import { ServicesList } from "@/components/home/ServicesList";
import { StatsStrip } from "@/components/home/StatsStrip";
import { Ticker } from "@/components/home/Ticker";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <Ticker />
      <StatsStrip />
      <FeaturedWork />
      <ServicesList />
      <GalleryStrip />
      {/* Testimonials: no real testimonials exist in the data layer yet,
          so per the no-fake-testimonials rule nothing renders here. */}
      <ContactCTA />
    </main>
  );
}
