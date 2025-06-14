"use client";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";

import Container from "@/components/container";
import { OrangeHeading1 } from "@/components/heading";
import { HeroImg } from "@/lib/data";

// By using JSX directly in the array, you gain more control over formatting.
const content = [
  <p key="c1">
    Hey! I'm a self-taught video editor and shooter who helps brands tell
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
  "🎥 Self-taught Video Editor & Shooter",
  "🎯 Specializing in Insta Reels, Podcasts, Product & Model Shoots",
  "🤝 Worked with dentists, skincare brands, real estate & more",
  "💡 Turning ideas into visuals that connect & convert",
];

export default function AboutPage() {
  return (
    <Container className="flex-col">
      {/* 1. More engaging headline */}
      <OrangeHeading1 text="Your Vision, Brought to Life." />

      {/* Main content layout */}
      <div className="flex w-full flex-col gap-10  md:flex-row md:gap-8 lg:gap-12">
        {/* Left Column: Image */}
        <div className="w-full md:w-1/2">
          <div className="h-fit w-full overflow-hidden rounded-lg">
            <Image
              src={HeroImg}
              alt="A portrait of the video editor in front of a screen with a video timeline"
              width={1000}
              height={1000}
              className="h-full w-full object-cover"
              // The -rotate-y-180 is a clever trick to flip the image!
              style={{ transform: "scaleX(-1)" }}
              priority
            />
          </div>
        </div>

        {/* Right Column: Text Content */}
        <div className="flex flex-col md:w-1/2">
          {/* 2. Scannable, client-focused copy */}
          <div className="flex flex-col gap-4 text-base text-neutral-300 md:text-lg">
            {content.map(paragraph => paragraph)}
          </div>

          {/* 3. Semantic list for highlights */}
          <ul className="flex flex-wrap mt-8 text-neutral-200">
            {highlights.map(text => (
              <li key={text} className="flex w-1/2 items-start gap-3">
                {/* This extracts the emoji to style it separately if needed */}
                <span>{text.split(" ")[0]}</span>
                <span>{text.substring(text.indexOf(" ") + 1)}</span>
              </li>
            ))}
          </ul>

          {/* 4. Clear Call-to-Action Button */}
          <div className="mt-10">

            <Link href="/contact" className="inline-block rounded-lg bg-orange-500 px-8 py-4 text-lg font-bold text-white transition-transform duration-300 hover:bg-orange-600 hover:scale-105">
              Let's Create Together
            </Link>
          </div>
        </div>
      </div>

      {/* This component seems separate. Consider giving it a heading like "My Work" or "Inspiration" */}
      <div className="mt-20 w-full">
        <h2 className="text-3xl font-bold text-center text-white mb-4">
          A Glimpse of My Work
        </h2>
        <SkeletonTwo />
      </div>
    </Container>
  );
}

// Note on SkeletonTwo: This is a cool visual component!
// Using Next.js <Image> instead of <img> would provide better optimization (lazy loading, etc.).
// However, for complex animation scenarios with Framer Motion, <img> can sometimes be simpler to implement.
function SkeletonTwo() {
  const images = [
    "https://images.unsplash.com/photo-1517322048670-4fba75cbbb62?q=80&w=3000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1573790387438-4da905039392?q=80&w=3425&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1555400038-63f5ba517a47?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1554931670-4ebfabf6e7a9?q=80&w=3387&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1546484475-7f7bd55792da?q=80&w=2581&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  ];

  const imageVariants = {
    whileHover: {
      scale: 1.1,
      rotate: 0,
      zIndex: 100,
    },
    whileTap: {
      scale: 1.1,
      rotate: 0,
      zIndex: 100,
    },
  };
  return (
    <div className="relative flex h-full flex-col items-center gap-10 overflow-hidden p-8">
      <div className="flex flex-row">
        {images.map((image, idx) => (
          <motion.div
            variants={imageVariants}
            key={`images-first-${idx}`}
            style={{
              rotate: Math.random() * 20 - 10,
            }}
            whileHover="whileHover"
            whileTap="whileTap"
            className="-mr-8 mt-4 shrink-0 overflow-hidden rounded-xl border border-neutral-700 bg-neutral-800 p-1"
          >
            <img
              src={image}
              alt="example of work"
              width="500"
              height="500"
              className="h-20 w-20 shrink-0 rounded-lg object-cover md:h-40 md:w-40"
            />
          </motion.div>
        ))}
      </div>
      <div className="flex flex-row">
        {images.map((image, idx) => (
          <motion.div
            key={`images-second-${idx}`}
            style={{
              rotate: Math.random() * 20 - 10,
            }}
            variants={imageVariants}
            whileHover="whileHover"
            whileTap="whileTap"
            className="-mr-8 mt-4 shrink-0 overflow-hidden rounded-xl border border-neutral-700 bg-neutral-800 p-1"
          >
            <img
              src={image}
              alt="example of work"
              width="500"
              height="500"
              className="h-20 w-20 shrink-0 rounded-lg object-cover md:h-40 md:w-40"
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
