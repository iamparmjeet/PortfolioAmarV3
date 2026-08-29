"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { brand, socialLinks } from "@/lib/data";
import { imagesGallery } from "@/lib/portfolio-data";

const sitemap = [
  { href: "/work", label: "Work" },
  { href: "/learn", label: "Learn" },
  { href: "/journal", label: "Journal" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

const disciplines = [
  "Commercial Editing",
  "Brand Films",
  "Short-Form & Reels",
  "Color Grading",
  "Sound Design",
  "Cinematography",
];

// Pool of editorial gallery items
const galleryPool = imagesGallery.slice(0, 16);

interface TrailImage {
  id: number;
  src: string;
  title: string;
  x: number;
  y: number;
  rotate: number;
}

export function Footer() {
  const year = new Date().getFullYear();
  const [currentTime, setCurrentTime] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [interactiveTrailEnabled, setInteractiveTrailEnabled] = useState(true);

  // Dynamic interactive cursor trail state
  const [trail, setTrail] = useState<TrailImage[]>([]);
  const lastPos = useRef({ x: 0, y: 0 });
  const countRef = useRef(0);
  const titleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateTime = () => {
      const options: Intl.DateTimeFormatOptions = {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      };
      setCurrentTime(new Intl.DateTimeFormat("en-US", options).format(new Date()));
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(brand.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback if clipboard api is blocked
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactiveTrailEnabled || !titleRef.current) return;
    const rect = titleRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const dx = x - lastPos.current.x;
    const dy = y - lastPos.current.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    // Spawn a new dropping thumbnail whenever mouse moves 55px across the title
    if (dist > 55 || trail.length === 0) {
      lastPos.current = { x, y };
      const currentIdx = countRef.current % (galleryPool.length || 1);
      const chosen = galleryPool[currentIdx];
      countRef.current += 1;

      const newImage: TrailImage = {
        id: Date.now() + Math.random(),
        src: chosen?.src || "/images/placeholder.svg",
        title: chosen?.title || "Editorial Still",
        x,
        y,
        rotate: (Math.random() - 0.5) * 24, // -12deg to +12deg random rotation
      };

      setTrail((prev) => [...prev.slice(-5), newImage]); // Keep up to 6 images on screen
    }
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactiveTrailEnabled) return;
    setIsHovered(true);
    if (titleRef.current) {
      const rect = titleRef.current.getBoundingClientRect();
      lastPos.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTrail([]);
  };

  return (
    <footer className="mt-(--section-pad) border-t border-hairline bg-surface/30 pb-10 pt-16">
      <div className="mx-auto max-w-295 px-8">
        {/* Top Header Row: Slate Meta & Back to Top */}
        <div className="mb-14 flex flex-wrap items-center justify-between gap-6 border-b border-hairline pb-8">
          <div className="flex flex-wrap items-center gap-6 font-mono text-[11px] tracking-[0.14em] text-mute uppercase">
            <span className="flex items-center gap-2">
              <span className="inline-block size-1.5 rounded-full bg-accent" />
              Ludhiana, IN {currentTime ? `· ${currentTime} IST` : "· 30.9010° N, 75.8573° E"}
            </span>
            <span className="hidden text-hairline sm:inline">|</span>
            <span className="hidden text-bone-dim sm:inline">Production & Editorial Suite</span>
          </div>

          <button
            type="button"
            onClick={scrollToTop}
            className="group inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-bone-dim transition-colors hover:text-accent"
            aria-label="Back to top of page"
          >
            <span>Back to top</span>
            <span className="inline-block transition-transform duration-300 group-hover:-translate-y-0.5">
              ↑
            </span>
          </button>
        </div>

        {/* Main Editorial Grid */}
        <div className="mb-16 grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          {/* Identity & Direct Contact (Col 1-4) */}
          <div className="lg:col-span-4 flex flex-col justify-between">
            <div>
              <Link href="/" className="mb-6 inline-flex items-center gap-3.5 group">
                <Image
                  src="/amar-logo-white.png"
                  alt={`${brand.full} logo`}
                  width={48}
                  height={48}
                  className="size-11 sm:size-12 object-contain drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)] transition-transform duration-300 group-hover:scale-105"
                />
                <div>
                  <p className="font-display text-[26px] sm:text-[30px] tracking-tight text-bone leading-none">
                    Amar<em className="not-italic text-accent">.</em>
                  </p>
                  <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute mt-1">
                    Editorial Archive
                  </p>
                </div>
              </Link>
              <p className="mb-6 max-w-[34ch] text-sm leading-relaxed text-bone-dim">
                Independent filmmaker, video editor, and educator crafting high-retention
                commercials, music videos, and brand identities.
              </p>
            </div>

            <div className="mt-6 flex flex-wrap gap-2.5">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-sm bg-accent px-5 py-2.5 text-[12px] font-medium text-ink transition-colors hover:bg-accent-dim"
              >
                Start a Project <span>→</span>
              </Link>
              <button
                type="button"
                onClick={copyEmail}
                className="inline-flex items-center gap-2 rounded-sm border border-hairline-strong px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.1em] text-bone-dim transition-colors hover:border-accent hover:text-accent"
              >
                {copied ? "Copied!" : "Copy Email"}
              </button>
            </div>
          </div>

          {/* Navigation Sitemap (Col 5-6) */}
          <div className="lg:col-span-2 lg:pl-4">
            <h3 className="eyebrow mb-4">Index</h3>
            <ul className="flex flex-col gap-2.5">
              {sitemap.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-2 text-[14px] text-bone-dim transition-colors hover:text-bone"
                  >
                    <span className="font-mono text-[10px] text-mute opacity-60 transition-opacity group-hover:opacity-100">
                      /
                    </span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Disciplines & Focus (Col 7-9) */}
          <div className="lg:col-span-3">
            <h3 className="eyebrow mb-4">Disciplines</h3>
            <ul className="flex flex-col gap-2.5">
              {disciplines.map((item) => (
                <li
                  key={item}
                  className="font-mono text-[12px] tracking-[0.04em] text-bone-dim/90 flex items-center gap-2"
                >
                  <span className="size-1 rounded-full bg-accent/60" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Elsewhere & Channels (Col 10-12) */}
          <div className="lg:col-span-3">
            <h3 className="eyebrow mb-4">Network & Socials</h3>
            <ul className="flex flex-col gap-2.5">
              {socialLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-between gap-2 text-[14px] text-bone-dim transition-colors hover:text-bone w-full max-w-[180px]"
                  >
                    <span>{link.label}</span>
                    <span className="font-mono text-[11px] text-mute">↗</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Big Interactive "Amar." Title Section */}
        <div className="relative border-t border-hairline py-10 text-center select-none md:py-16">
          {/* Giant Title Typography with Self-Contained Interactive Hover Trigger */}
          <div className="relative inline-block">
            {/* Dynamic Mouse-Following Stills Container — Scoped to Title Anchor */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-20 overflow-visible"
            >
              <AnimatePresence>
                {isHovered &&
                  trail.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{
                        opacity: 0,
                        scale: 0.5,
                        y: item.y - 80,
                        x: item.x - 70,
                        rotate: item.rotate * 1.5,
                      }}
                      animate={{
                        opacity: 1,
                        scale: 1,
                        y: item.y - 60,
                        x: item.x - 70,
                        rotate: item.rotate,
                      }}
                      exit={{
                        opacity: 0,
                        scale: 0.7,
                        y: item.y + 30,
                        rotate: item.rotate * 1.2,
                        transition: { duration: 0.4, ease: "easeOut" },
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 350,
                        damping: 22,
                        mass: 0.6,
                      }}
                      className="absolute aspect-[4/5] w-28 sm:w-36 md:w-44 overflow-hidden rounded-lg border border-accent/40 bg-surface shadow-[0_20px_45px_rgba(0,0,0,0.85)]"
                    >
                      <Image
                        src={item.src}
                        alt={item.title}
                        fill
                        sizes="176px"
                        className="film-grade object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-transparent to-transparent" />
                      <span className="absolute bottom-2 left-2 right-2 truncate font-mono text-[8px] sm:text-[9px] uppercase tracking-[0.14em] text-bone-dim">
                        {item.title}
                      </span>
                    </motion.div>
                  ))}
              </AnimatePresence>
            </div>

            {/* biome-ignore lint/a11y/noStaticElementInteractions: mouse movement interactive showcase strictly on title */}
            <div
              ref={titleRef}
              onMouseEnter={handleMouseEnter}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="group relative inline-block cursor-pointer"
            >
              <p className="display text-[clamp(80px,22vw,360px)] leading-[0.85] tracking-[-0.04em] text-bone transition-all duration-700 group-hover:scale-[1.01] group-hover:text-accent">
                Amar<em className="transition-colors duration-500 group-hover:text-bone">.</em>
              </p>
            </div>
          </div>

          <div className="mt-8 md:mt-12 flex flex-wrap items-center justify-center gap-3">
            <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-mute opacity-60">
              {interactiveTrailEnabled
                ? "Move cursor over title to reveal stills"
                : "Archive preview disabled"}
            </span>
            <span className="text-hairline opacity-40">•</span>
            <button
              type="button"
              onClick={() => {
                setInteractiveTrailEnabled((prev) => {
                  if (prev) setTrail([]);
                  return !prev;
                });
              }}
              className="inline-flex items-center gap-1.5 rounded-full border border-hairline bg-surface/80 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.14em] text-bone-dim transition-colors hover:border-accent hover:text-accent"
              aria-label={
                interactiveTrailEnabled
                  ? "Disable interactive hover effect"
                  : "Enable interactive hover effect"
              }
            >
              <span
                className={`size-1.5 rounded-full ${interactiveTrailEnabled ? "bg-accent" : "bg-mute"}`}
              />
              <span>{interactiveTrailEnabled ? "Effect: ON" : "Effect: OFF"}</span>
            </button>
          </div>
        </div>

        {/* Bottom Slate Spec Bar */}
        <div className="border-t border-hairline pt-7">
          <div className="flex flex-col gap-4 text-mute font-mono text-[11px] tracking-[0.08em] sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
              <span>
                © {year} {brand.full}
              </span>
              <span className="opacity-30">•</span>
              <span>All rights reserved</span>
            </div>

            <div className="flex items-center gap-4">
              <span>
                Crafted with care by{" "}
                <a
                  href="https://parmjeetmishra.com"
                  target="_blank"
                  rel="noreferrer"
                  className="underline decoration-mute underline-offset-4 transition-colors hover:text-bone hover:decoration-bone"
                >
                  Parm
                </a>
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
