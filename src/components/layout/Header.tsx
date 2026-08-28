"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { brand } from "@/lib/data";
import { cn } from "@/lib/utils";
import { ThemeSwitcher } from "./ThemeSwitcher";

interface NavLink {
  href: string;
  label: string;
}

const navLinks: NavLink[] = [
  { href: "/work", label: "Work" },
  { href: "/learn", label: "Learn" },
  { href: "/journal", label: "Journal" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: close the mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 border-b border-transparent transition-all duration-300",
        scrolled && "border-hairline bg-ink/70 backdrop-blur-xl",
      )}
    >
      <div className="mx-auto flex w-full max-w-295 items-center justify-between gap-6 px-8 py-4">
        <Link href="/" className="flex items-center gap-2.5" aria-label={`${brand.full} — home`}>
          {/* White logo for dark header — 400×400 square, trimmed 269×276 */}
          <Image
            src="/amar-logo-white.png"
            alt={`${brand.full} logo`}
            width={40}
            height={40}
            priority
            className="h-9 w-9 object-contain drop-shadow-[0_1px_4px_rgba(0,0,0,0.6)] md:h-10 md:w-10"
          />
          <span className="hidden font-display text-[22px] tracking-tight md:inline">
            Amar<em className="not-italic text-accent">.</em>
          </span>
        </Link>

        <nav className="hidden gap-9 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "relative py-1.5 font-mono text-[11px] uppercase tracking-[0.18em] transition-colors",
                pathname.startsWith(link.href)
                  ? "text-bone before:absolute before:-left-3.5 before:top-1/2 before:h-1.5 before:w-1.5 before:-translate-y-1/2 before:rounded-full before:bg-accent"
                  : "text-bone-dim hover:text-bone",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 font-mono text-[11px] tracking-[0.08em] text-mute md:flex">
          <Link
            href="/contact"
            className="rounded-sm border border-accent-line px-3.5 py-2 text-[11px] tracking-[0.1em] text-accent transition-colors hover:bg-accent hover:text-ink"
          >
            LET'S TALK
          </Link>
          <ThemeSwitcher />
        </div>

        <div className="flex items-center gap-3 md:hidden">
          <ThemeSwitcher />
          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
            className="flex flex-col gap-1.5 p-1"
          >
            <span className="block h-px w-6 bg-bone" />
            <span className="block h-px w-6 bg-bone" />
            <span className="block h-px w-4 bg-bone" />
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="fixed inset-0 top-[57px] z-30 flex flex-col bg-ink px-6 pt-10 md:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="display border-b border-hairline py-5 text-4xl text-bone"
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-auto pb-10 font-mono text-[10px] tracking-[0.14em] text-mute">
            {brand.email}
          </div>
        </div>
      )}
    </header>
  );
}
