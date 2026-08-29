import type { Metadata } from "next";
import { ContactForm } from "@/components/contact/ContactForm";
import { KineticText } from "@/components/motion/KineticText";
import { Reveal } from "@/components/motion/Reveal";
import { ReelCard } from "@/components/video/ReelCard";
import { actionReels, brand, socialLinks } from "@/lib/data";

export const metadata: Metadata = {
  title: "Contact — Amarjeet Mishra",
  description: "Start a project — brand films, reels, podcasts, and editorial shoots.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Start a Project — Amarjeet Mishra",
    description: "Commission a brand film, social reel campaign, or podcast production.",
    url: "/contact",
  },
};

export default function ContactPage() {
  return (
    <main className="pb-(--section-pad) pt-36">
      <div className="mx-auto max-w-295 px-8">
        <p className="mb-3 font-mono text-[10px] tracking-[0.18em] text-accent">
          SCENE 01 — A NEW PROJECT BEGINS
        </p>
        <KineticText
          lines={[{ text: "Start a" }, { text: "project.", accent: true }]}
          className="mb-14 text-[clamp(48px,8vw,120px)]"
        />

        <div className="grid grid-cols-1 items-start gap-14 lg:grid-cols-[1.4fr_1fr]">
          <Reveal>
            <ContactForm />

            {/* WhatsApp — secondary CTA; renders once the number is populated */}
            {brand.whatsapp !== "" && (
              <a
                href={`https://wa.me/${brand.whatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="mt-8 inline-flex items-center gap-2.5 rounded-sm border border-hairline-strong px-6 py-3.5 text-[13px] text-bone transition-colors hover:border-accent hover:text-accent"
              >
                Prefer WhatsApp? Message directly ↗
              </a>
            )}
          </Reveal>

          <Reveal delay={0.15}>
            <aside className="flex flex-col gap-7 border-l border-hairline pl-9">
              <div>
                <p className="mb-2.5 font-mono text-[9px] tracking-[0.14em] text-mute">
                  AMAR · IN ACTION
                </p>
                <ReelCard
                  reel={actionReels[0]}
                  label="Amar in action · On set"
                  className="max-w-[280px]"
                />
              </div>
              <div>
                <p className="mb-1.5 font-mono text-[9px] tracking-[0.14em] text-mute">EMAIL</p>
                <a
                  href={`mailto:${brand.email}`}
                  className="font-display text-xl font-semibold text-accent transition-opacity hover:opacity-70"
                >
                  {brand.email}
                </a>
              </div>
              <div>
                <p className="mb-1.5 font-mono text-[9px] tracking-[0.14em] text-mute">LOCATION</p>
                <p className="font-display text-xl font-semibold">{brand.location}</p>
              </div>
              <div>
                <p className="mb-2.5 font-mono text-[9px] tracking-[0.14em] text-mute">ELSEWHERE</p>
                <ul className="flex flex-col gap-2">
                  {socialLinks.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[15px] text-bone-dim transition-colors hover:text-accent"
                      >
                        {link.label} ↗
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="mb-2.5 font-mono text-[9px] tracking-[0.14em] text-mute">
                  BOOK A CALL
                </p>
                <a
                  href="https://cal.com/amarjeetmishra"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-sm border border-hairline-strong px-5 py-2.5 font-mono text-[11px] tracking-[0.1em] text-bone-dim transition-colors hover:border-accent hover:text-accent"
                >
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    aria-hidden="true"
                  >
                    <rect x="3" y="4" width="18" height="18" rx="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  SCHEDULE 30 MIN ↗
                </a>
              </div>
              <div className="border-t border-hairline pt-5">
                <p className="mb-1.5 font-mono text-[9px] tracking-[0.14em] text-mute">RESPONSE</p>
                <p className="text-sm leading-relaxed text-bone-dim">
                  Within 24 hours — every brief gets a real reply.
                </p>
              </div>
            </aside>
          </Reveal>
        </div>
      </div>
    </main>
  );
}
