import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Reveal } from "@/components/motion/Reveal";
import { brand, journalPosts } from "@/lib/data";

export const revalidate = 3600;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return journalPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = journalPosts.find((p) => p.slug === slug);
  if (!post) return { title: "Not found" };
  return {
    title: `${post.title} — Journal`,
    description: post.excerpt,
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
    },
  };
}

export default async function JournalPostPage({ params }: PageProps) {
  const { slug } = await params;
  const index = journalPosts.findIndex((p) => p.slug === slug);
  if (index === -1) notFound();
  const post = journalPosts[index];
  const next = journalPosts[(index + 1) % journalPosts.length];

  return (
    <main className="px-(--pad-x) pb-(--section-pad) pt-36">
      <article className="mx-auto max-w-[760px]">
        <nav className="mb-10 flex items-center gap-3 font-mono text-[11px] tracking-[0.14em] text-mute">
          <Link href="/journal" className="transition-colors hover:text-bone">
            JOURNAL
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-accent">{post.category.toUpperCase()}</span>
        </nav>

        <p className="mb-4 font-mono text-[10px] tracking-[0.12em] text-mute">
          <span className="text-accent">{post.category}</span> · {post.date} · {post.read} read
        </p>

        <h1 className="display mb-10 text-[clamp(34px,5.5vw,68px)]">
          {post.title}
          <em>.</em>
        </h1>

        <div className="flex flex-col gap-6">
          {post.body.map((paragraph, i) => (
            <Reveal key={paragraph.slice(0, 32)} delay={Math.min(i * 0.04, 0.2)}>
              <p
                className={
                  i === 0
                    ? "font-display text-[clamp(19px,2vw,24px)] leading-relaxed text-bone"
                    : "text-[16px] leading-[1.85] text-bone-dim"
                }
              >
                {paragraph}
              </p>
            </Reveal>
          ))}
        </div>

        <footer className="mt-16 border-t border-hairline pt-8">
          <div className="mb-10 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.14em] text-mute">
            <span>— {brand.full}</span>
            <span>{brand.location}</span>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-6">
            <Link
              href="/journal"
              className="rounded-sm border border-hairline px-5 py-2.5 font-mono text-[11px] tracking-[0.14em] text-bone-dim transition-colors hover:border-bone hover:text-bone"
            >
              ← ALL POSTS
            </Link>
            <div className="text-right">
              <p className="mb-1.5 font-mono text-[9px] tracking-[0.14em] text-mute">READ NEXT</p>
              <Link
                href={`/journal/${next.slug}`}
                className="font-display text-xl font-semibold tracking-tight transition-colors hover:text-accent"
              >
                {next.title} →
              </Link>
            </div>
          </div>
        </footer>
      </article>
    </main>
  );
}
