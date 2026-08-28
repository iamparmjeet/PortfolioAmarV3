import type { MetadataRoute } from "next";
import { journalPosts } from "@/lib/data";
import { allPortfolioItems } from "@/lib/portfolio-data";

const BASE = "https://amarjeetmishra.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = ["", "/work", "/about", "/contact", "/learn", "/journal"].map((path) => ({
    url: `${BASE}${path}`,
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.8,
  }));

  const caseStudies = allPortfolioItems.map((item) => ({
    url: `${BASE}/work/${item.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const articles = journalPosts.map((post) => ({
    url: `${BASE}/journal/${post.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...caseStudies, ...articles];
}
