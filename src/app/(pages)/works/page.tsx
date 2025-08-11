import Image from "next/image";

import ContactBox from "@/components/contact-box";
import Container from "@/components/container";
import PortfolioSectionWithFilter from "@/components/portfolios-all";
import { allPortfolioItems } from "@/lib/portfolio-data";

export default function Works() {
  return (
    <Container className="bg-black/60 rounded-2xl p-6 mt-8 flex flex-col items-center gap-8">
      <PTB />
      <AboutSection />
      <PortfolioSectionWithFilter Items={30} PortfoliosItems={allPortfolioItems} />
      <ContactBox />
    </Container>
  );
}

function PTB() {
  return (
    <section className="flex flex-col items-center">
      <p className="uppercase text-xl font-medium">SERVICES</p>
      <h2 className="mb-4 md:mb-14 mt-4 text-4xl md:text-6xl font-medium text-balance text-center leading-tight">
        We provide amazing
        <span className="block text-orange-400">outreach solutions</span>
      </h2>
    </section>
  );
}

function AboutSection() {
  return (
    <section className="flex flex-col items-center">
      <Image
        src="https://media.amarjeetmishra.com/images/aboutus2.webp"
        alt="About Us"
        width={2000}
        height={1000}
        className="rounded-2xl"
      />
      <div className="flex my-10 items-start">
        <h2 className="w-1/2 text-2xl md:text-4xl font-semibold text-balance">
          We help companies find their way to greatness.
        </h2>
        <div className="w-1/2 text-xl space-y-4">
          <p>
            We are in the thick of the digital age, and video has become one of the most powerful storytelling and brand communication tools. But did you know that behind every captivating video lies a creative team skilled in the art of professional video production?
          </p>
          <p>
            At Amar Editz, we're at the forefront of this art. We bring individuals' and organizations' visions to life through high-quality, professional video production that shakes things up.
          </p>
        </div>
      </div>
    </section>
  );
}
