import { URL } from "@/lib/data";

import Container from "../container";
import { OrangeHeading1 } from "../heading";
import SocialsBox from "../socials";
import NextVideo from "../video/next-video";
import ContactForm from "./form";

export default function ContactSection() {
  return (
    <Container
      id="contact"
      className="flex flex-col p-6 py-12 bg-black text-white mt-6 rounded-2xl"
    >
      <PTB />
      <InfoSecWithForm />
    </Container>
  );
}

function PTB() {
  return (
    <section className="flex flex-col items-center">
      <p className="uppercase text-xl font-medium">Contact us</p>
      <h2 className="mb-4 md:mb-14 mt-4 text-4xl md:text-6xl font-medium text-balance text-center leading-tight">
        Amar Editz
        <span className="block text-orange-400">Let's work together!</span>
      </h2>
    </section>
  );
}

function InfoSecWithForm() {
  const item = `${URL}/assets/Videos/tile/tile-hero-1/master.m3u8`;
  return (
    <section className="flex flex-col md:flex-row gap-8 md:gap-12 items-start">
      {/* Video */}

      <NextVideo className="md:w-1/2 " href={item} thumbnail={item.replace(".m3u8", ".webp")} />

      {/* Text + Form */}
      <div className="flex-1">
        <OrangeHeading1 text="Information" />
        <p className="text-gray-200 text-base md:text-xl text-balance mt-2 mb-8">
          Have a project in mind? Let's discuss how we can bring your ideas to
          life with stunning visuals and engaging content.
        </p>
        <SocialsBox isRow className="mb-6" />
        <ContactForm />
      </div>
    </section>
  );
}
