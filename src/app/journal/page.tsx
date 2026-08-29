import type { Metadata } from "next";
import Link from "next/link";
import { KineticText } from "@/components/motion/KineticText";
import { Reveal } from "@/components/motion/Reveal";
import { journalPosts } from "@/lib/data";

export const metadata: Metadata = {
  title: "Journal — Amarjeet Mishra",
  description: "Notes on editing craft, client work, and the business of filmmaking.",
  alternates: {
    canonical: "/journal",
  },
  openGraph: {
    title: "Journal & Essays — Amarjeet Mishra",
    description:
      "Notes on editing craft, client work, pacing, color grading, and filmmaking business.",
    url: "/journal",
  },
};

export default function JournalPage() {
  return (
    <main className="pb-(--section-pad) pt-36">
      <div className="mx-auto max-w-295 px-8">
        <p className="eyebrow mb-7">
          <span className="eyebrow-dot" />
          Journal · Writing on craft &amp; business
        </p>
        <KineticText
          lines={[{ text: "Notes &" }, { text: "thoughts.", accent: true }]}
          className="mb-14 text-[clamp(48px,8vw,120px)]"
        />

        <ul className="border-t border-hairline">
          {journalPosts.map((post, i) => (
            <Reveal key={post.slug} delay={i * 0.05}>
              <li>
                <Link
                  href={`/journal/${post.slug}`}
                  className="group grid grid-cols-1 gap-3 border-b border-hairline py-9 transition-[padding] duration-500 hover:pl-4 md:grid-cols-[110px_1fr_auto] md:items-center md:gap-8"
                >
                  <p className="font-mono text-[10px] tracking-[0.08em] text-mute">{post.date}</p>
                  <div>
                    <p className="mb-2 font-mono text-[10px] tracking-[0.1em] text-mute">
                      <span className="text-accent">{post.category}</span> · {post.read} read
                    </p>
                    <h2 className="mb-2 font-display text-[clamp(20px,2.4vw,32px)] font-semibold leading-tight tracking-tight transition-colors group-hover:text-accent">
                      {post.title}
                    </h2>
                    <p className="max-w-[56ch] text-sm leading-relaxed text-bone-dim">
                      {post.excerpt}
                    </p>
                  </div>
                  <span
                    aria-hidden="true"
                    className="hidden font-display text-3xl text-accent opacity-0 transition-opacity group-hover:opacity-100 md:block"
                  >
                    →
                  </span>
                </Link>
              </li>
            </Reveal>
          ))}
        </ul>
      </div>
    </main>
  );
}
