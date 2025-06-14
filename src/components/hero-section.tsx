import Image from "next/image";

import { HeroImg, HeroImgBlur } from "@/lib/data";

import Container from "./container";
import LetsTalkButton from "./lets-talk-btn";
import { ContainerTextFlip } from "./ui/container-text-flip";

export default function HeroSection() {
  return (
    <Container className="flex-col md:flex-row items-center">
      <div className="md:w-1/2 h-fit">

        <Image
          src={HeroImg}
          alt="Hero Image"
          width={1000}
          height={1000}
          priority
          className="rounded -rotate-y-180 object-cover"
          placeholder="blur"
          blurDataURL={HeroImgBlur}
        />
      </div>
      <div className="flex flex-col items-start md:w-1/2 gap-6 mx-auto ">
        <h1 className="text-3xl md:text-6xl font-extrabold leading-tight tracking-tight ">
          <span>
            Unlock The Power of
          </span>
          <ContainerTextFlip
            animationDuration={1000}
            words={["Video Campaigns", "Insta Campaigns", "Youtube Videos", "Podcasts"]}
          />
        </h1>
        <h2 className="text-xl md:text-3xl font-medium text-neutral-300">Launch your video compaign in hours, not days</h2>
        <p className="text-neutral-300 text-base md:text-xl md:text-balance">
          Transforming ideas into compelling visual narratives for property dealers, beauty professionals, and
          businesses across industries.
        </p>
        <LetsTalkButton href="/contact" text="Lets Talk" />
      </div>
    </Container>
  );
}
