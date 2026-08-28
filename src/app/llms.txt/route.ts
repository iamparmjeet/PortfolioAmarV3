import { NextResponse } from "next/server";
import { brand, socials } from "@/lib/data";
import { allPortfolioItems } from "@/lib/portfolio-data";

/**
 * /llms.txt — Machine-readable summary for AI crawlers (ChatGPT, Perplexity, etc.)
 * Format follows the emerging llms.txt convention for AI-readable site context.
 */
export async function GET() {
  const categories = [...new Set(allPortfolioItems.map((p) => p.category))];
  const clients = [...new Set(allPortfolioItems.map((p) => p.client).filter(Boolean))];

  const text = `# ${brand.full} — Portfolio

> Freelance video editor, filmmaker, and educator based in ${brand.location}, India.

## About
${brand.full} (Amar Editz) is a cinematic video editor and filmmaker who creates brand films, Instagram reels, podcasts, and visual stories for businesses across India. He also runs Learnsimm, a video editing and filmmaking education brand based in Ludhiana.

## Services
- Brand Films and Commercial Videos
- Instagram Reels and Social Media Content
- Podcast Production and Editing
- Real Estate Video Tours
- Fashion and Lifestyle Content
- Corporate and Event Videography
- YouTube Channel Management
- Video Editing Education (Learnsimm)

## Portfolio
${allPortfolioItems.length} projects across ${categories.length} categories: ${categories.join(", ")}.

Clients include: ${clients.slice(0, 10).join(", ")}.

Full portfolio: https://amarjeetmishra.com/work

## Education Brand
Learnsimm teaches video editing and filmmaking in Ludhiana, Punjab.
Modules: Creative Software (8 weeks), Camera & Production (10 weeks), Business & AI (6 weeks).
Learn more: https://amarjeetmishra.com/learn

## Contact
- Email: ${brand.email}
- Location: ${brand.location}, India
- Instagram: ${socials.insta}
- YouTube: ${socials.youtube}
- Fiverr: ${socials.fiverr}
- LinkedIn: ${socials.linkedin}
- Contact form: https://amarjeetmishra.com/contact

## Sitemap
- Home: https://amarjeetmishra.com
- Work: https://amarjeetmishra.com/work
- Learn: https://amarjeetmishra.com/learn
- Journal: https://amarjeetmishra.com/journal
- About: https://amarjeetmishra.com/about
- Contact: https://amarjeetmishra.com/contact
`;

  return new NextResponse(text, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
