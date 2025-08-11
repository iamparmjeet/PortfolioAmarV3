"use client";
import Image from "next/image";
import { useState } from "react";

import ContactBox from "@/components/contact-box";
import Container from "@/components/container";
import PortfolioSectionWithFilter from "@/components/portfolios-all";
import GalleryToggleButton from "@/components/work/gallery-toggle-button";
import FilterableImageGallery from "@/components/work/image-gallery";
import { URL } from "@/lib/data";
import { allPortfolioItems } from "@/lib/portfolio-data";

export default function Works() {
  return (
    <Container className="bg-black/60 rounded-2xl p-6 mt-8 flex flex-col items-center gap-8">
      <PTB />
      <AboutSection />
      <GallerySection />
      <ContactBox />
    </Container>
  );
}

function PTB() {
  return (
    <section className="flex flex-col items-center">
      <p className="uppercase text-xl font-medium">SERVICES</p>
      <h2 className="mb-4 md:mb-14 mt-4 text-3xl md:text-6xl font-medium text-balance text-center leading-tight">
        We provide amazing
        <span className="block text-orange-400">outreach solutions</span>
      </h2>
    </section>
  );
}

function AboutSection() {
  return (
    <section className="flex flex-col items-center w-full">
      <Image
        src="https://media.amarjeetmishra.com/images/aboutus2.webp"
        alt="A team working on video production"
        width={2000}
        height={1000}
        className="rounded-2xl"
      />
      <div className="flex flex-col md:flex-row my-10 items-start gap-8 md:gap-12">
        <h2 className="w-full md:w-1/2 text-2xl md:text-4xl font-semibold text-balance">
          We help companies find their way to greatness.
        </h2>
        <div className="w-full md:w-1/2 text-lg md:text-xl space-y-4 text-neutral-300">
          <p>
            In the thick of the digital age, video has become one of the most
            powerful storytelling and brand communication tools. Behind every
            captivating video lies a creative team skilled in the art of
            professional video production.
          </p>
          <p>
            At Amar Editz, we're at the forefront of this art. We bring visions
            to life through high-quality, professional video production that
            shakes things up.
          </p>
        </div>
      </div>
    </section>
  );
}

function GallerySection() {
  const [activeView, setActiveView] = useState<"videos" | "images">("images");

  return (
    <div className="space-y-8 w-full">
      {/* View Toggle Buttons */}
      <div className="w-full flex flex-col sm:flex-row justify-center items-center gap-10 pb-12">
        <GalleryToggleButton
          label="Videos"
          imageUrl={`${URL}/assets/images/kosmic-karma/1.webp`}
          isActive={activeView === "videos"}
          onClick={() => setActiveView("videos")}
        />
        <GalleryToggleButton
          label="Images"
          imageUrl={`${URL}/assets/images/Jewellery/1.webp`}
          isActive={activeView === "images"}
          onClick={() => setActiveView("images")}
        />
      </div>

      {/* Content Area */}
      <div>
        {activeView === "videos" && (
          <PortfolioSectionWithFilter Items={30} PortfoliosItems={allPortfolioItems} />
          // <p>video</p>
        )}

        {/* 2. This is how you use the new ImagesGallery array */}
        {activeView === "images" && (
          <FilterableImageGallery />
          // <p>image</p>
        )}
      </div>
    </div>
  );
}
