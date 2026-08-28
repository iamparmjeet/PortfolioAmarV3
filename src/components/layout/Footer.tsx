import Link from "next/link";
import { brand, socialLinks } from "@/lib/data";

const sitemap = [
  { href: "/work", label: "Work" },
  { href: "/learn", label: "Learn" },
  { href: "/journal", label: "Journal" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-(--section-pad) border-t border-hairline px-(--pad-x) pb-6 pt-16">
      <div className="mx-auto max-w-[1680px]">
        <div className="mb-20 grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <h2 className="display mb-5 text-4xl md:text-5xl">
              Got a story
              <br />
              <em>worth telling?</em>
            </h2>
            <p className="mb-7 max-w-[44ch] text-bone-dim">
              Brand films, reels, podcasts, and editorial shoots. Based in {brand.location}, working
              anywhere.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2.5 rounded-sm bg-accent px-6 py-3.5 text-[13px] font-medium text-ink transition-colors hover:bg-accent-dim"
            >
              Start a project <span aria-hidden="true">→</span>
            </Link>
          </div>

          <nav aria-label="Sitemap">
            <h3 className="eyebrow mb-4">Sitemap</h3>
            <ul className="flex flex-col gap-3">
              {sitemap.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[15px] text-bone-dim transition-colors hover:text-bone"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Social links">
            <h3 className="eyebrow mb-4">Elsewhere</h3>
            <ul className="flex flex-col gap-3">
              {socialLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[15px] text-bone-dim transition-colors hover:text-bone"
                  >
                    {link.label} ↗
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h3 className="eyebrow mb-4">Studio</h3>
            <ul className="flex flex-col gap-3 text-[15px] text-bone-dim">
              <li>{brand.location}</li>
              <li>
                <a href={`mailto:${brand.email}`} className="transition-colors hover:text-bone">
                  {brand.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <hr className="border-hairline" />

        <p
          aria-hidden="true"
          className="display select-none py-10 text-center text-[clamp(80px,22vw,360px)] leading-[0.9] tracking-[-0.04em]"
        >
          Amar<em>.</em>
        </p>

        <div className="flex flex-wrap justify-between gap-3.5 border-t border-hairline pt-7 font-mono text-[11px] tracking-[0.08em] text-mute">
          <span>
            © {year} {brand.full}
          </span>
          <span>DELIVERED FROM CLOUDFLARE R2</span>
          <span>v4.0.0</span>
        </div>
      </div>
    </footer>
  );
}
