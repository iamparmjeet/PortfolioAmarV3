"use client";

import Container from "@/components/container";

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
      <section className="flex flex-col items-center">
        <p className="uppercase">About us</p>
        <h2 className="text-6xl font-medium ">
          We Invent, craft, and fuel content drive experiences that
          <span>achieve more for global brands.</span>
        </h2>
      </section>

    </Container>
  );
}
