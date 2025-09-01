"use client";
import { IconAsterisk } from "@tabler/icons-react";
import Image from "next/image";
import { useMemo } from "react";

import ReviewsComponent from "@/components/about/review-component";
import ContactBox from "@/components/contact-box";
import Container from "@/components/container";
import { Marquee } from "@/components/marquee";
import { URL } from "@/lib/data";

const content = [
  <p key="c1">
    Hey! I'm a self-taught video editor and photographer who helps brands tell
    compelling visual stories. I specialize in creating content that connects
    with audiences—from catchy
    {" "}
    <strong className="font-semibold text-white/90">
      Instagram Reels
    </strong>
    {" "}
    to
    {" "}
    <strong className="font-semibold text-white/90">
      professional promotional videos.
    </strong>
  </p>,
  <p key="c2">
    Over the years, I've partnered with a wide range of clients, including
    {" "}
    <strong className="font-semibold text-white/90">
      dental clinics, skincare brands, real estate agents,
    </strong>
    {" "}
    and
    {" "}
    <strong className="font-semibold text-white/90">
      manufacturing industries.
    </strong>
    {" "}
    I approach every project with creativity, a meticulous attention to detail,
    and a commitment to quality.
  </p>,
  <p key="c3">
    My process is seamless. From concept to final cut, I handle everything,
    ensuring you get a polished, social-media-ready video tailored to your
    brand's unique tone and message.
  </p>,
];

const highlights = [
  {
    key: "1",
    heading: "Years of experience",
    number: "4+",
    text: "🎥 Self-taught Video Editor & Shooter",
  },
  {
    key: "2",
    heading: "Awards Won",
    number: "5+",
    text: "🎯 Specializing in Insta Reels, Podcasts, Product & Model Shoots",
  },
  {
    key: "3",
    heading: "Satisfied Customers",
    number: "200+",
    text: "🤝 We believe in building relationships with our clients.",
  },
  {
    key: "4",
    heading: "Completed Projects",
    number: "200+",
    text: "💡 Turning ideas into visuals that connect & convert",
  },
];

function AboutSection() {
  return (
    <section className="flex flex-col items-center">
      <p className="uppercase text-xl font-medium">About us</p>
      <h2 className="mb-14 mt-4 text-4xl md:text-6xl font-medium text-balance text-center leading-tight">
        We Invent, craft, and fuel content drive experiences that
        <span className="block text-orange-400">achieve more for global brands.</span>
      </h2>
      <Image
        src="https://media.amarjeetmishra.com/images/aboutus2.webp"
        alt="About Us"
        width={2000}
        height={1000}
        className="rounded-2xl"
      />
    </section>
  );
}

function HighlightsSection() {
  return (
    <section className="flex flex-col lg:flex-row gap-8">
      <div className="w-full lg:w-1/2">
        <Image
          src={`${URL}/amar-in-action/hero-17/hd.webp`}
          alt="Amar"
          width={1000}
          height={1000}
          className="rounded-xl"
        />
      </div>
      <div className="w-full flex flex-col lg:w-1/2">
        <h2 className="text-4xl mb-10">Amar Editz</h2>
        {content.map(text => (
          <div className="text-xl mb-4" key={text.key}>{text}</div>
        ))}
        <div>
          <ul className="grid grid-cols-2 gap-8 mt-10">
            {highlights.map(item => (
              <li key={item.key} className="space-y-4">
                <h4 className="text-4xl">{item.number}</h4>
                <p className="text-3xl">{item.heading}</p>
                <p className="text-lg text-neutral-400">{item.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function MovingTextSection() {
  const marqueeContentWithIcon = useMemo(
    () => (
      <div className="flex flex-nowrap items-center gap-10">
        <IconAsterisk className="size-7 shrink-0 rounded-full bg-black p-1 text-sky-400" />
        <h5 className="whitespace-nowrap text-3xl md:text-4xl font-semibold text-black">
          Let's Work Together!
        </h5>
      </div>
    ),
    [], // Empty dependency array: created only once
  );
  return (
    <section className="bg-sky-400 p-10 mx-auto rounded-sm">
      <div className="container mx-auto">
        <Marquee speed={100} gap={30}>
          {marqueeContentWithIcon}
        </Marquee>
      </div>
    </section>
  );
}

const ImagesArray = [
  { index: 1, src: `${URL}/amar-in-action/hero-5/hd.webp` },
  { index: 2, src: `${URL}/amar-in-action/hero-6/hd.webp` },
  { index: 3, src: `${URL}/amar-in-action/hero-12/hd.webp` },
  { index: 4, src: `${URL}/amar-in-action/hero-14/hd.webp` },
  { index: 5, src: `${URL}/amar-in-action/hero-16/hd.webp` },
  { index: 6, src: `${URL}/amar-in-action/hero-17/hd.webp` },
];

function AmarInActionGallery() {
  return (
    <section className="flex flex-col items-center">
      <p className="uppercase text-xl font-medium">About us</p>
      <h2 className="mb-6 md:mb-14 mt-4 text-5xl md:text-6xl font-medium text-balance text-center leading-tight">
        Light, camera
        <span className="block text-orange-400">action.</span>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {ImagesArray.map(image => (
          <Image
            key={image.index}
            src={image.src}
            alt={`Amar in action ${image.index}`}
            width={1000}
            height={1000}
            className="rounded-2xl mb-6 md:mb-8"
            loading="lazy"
            style={{ width: "100%", height: "auto" }}
          />
        ))}
      </div>
    </section>
  );
}

export default function AboutPage() {
  return (
    <>
      <Container className="flex-col gap-16">
        {/* Section1 - PTB */}
        <AboutSection />
        {/* Section2-About */}
        <HighlightsSection />
        {/* Section3- Reviews */}
        <ReviewsComponent />
        {/* Section4- Moving text */}
      </Container>
      <MovingTextSection />
      <Container className="flex-col gap-16 items-center">
        <AmarInActionGallery />
        {/* {Section 5 - video} */}
        {/* {Section 6 - Contact Box} */}
        <ContactBox />
      </Container>
    </>
  );
}
