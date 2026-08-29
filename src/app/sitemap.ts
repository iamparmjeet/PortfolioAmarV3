import type { MetadataRoute } from "next";
import { journalPosts } from "@/lib/data";
import { allPortfolioItems } from "@/lib/portfolio-data";

const BASE = "https://amarjeetmishra.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: Array<{
    path: string;
    priority: number;
    changeFrequency: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  }> = [
    { path: "", priority: 1.0, changeFrequency: "weekly" },
    { path: "/work", priority: 0.9, changeFrequency: "weekly" },
    { path: "/learn", priority: 0.85, changeFrequency: "monthly" },
    { path: "/about", priority: 0.8, changeFrequency: "monthly" },
    { path: "/journal", priority: 0.8, changeFrequency: "weekly" },
    { path: "/contact", priority: 0.75, changeFrequency: "yearly" },
  ];

  const staticPages = staticRoutes.map((route) => ({
    url: `${BASE}${route.path}`,
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const caseStudies = allPortfolioItems.map((item) => ({
    url: `${BASE}/work/${item.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: item.results && item.results.length > 0 ? 0.8 : 0.7,
  }));

  const articles = journalPosts.map((post) => ({
    url: `${BASE}/journal/${post.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...caseStudies, ...articles];
}
