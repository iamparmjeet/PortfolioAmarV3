import { allPortfolioItems, getItemBySlug, type PortfolioItem } from "@/lib/portfolio-data";
import { getPipeConfig } from "./config";
import { type PipePublicVideo, toPortfolioItem } from "./mappers";

// Server-only fetch helpers for ISR/SSG. Fall back to static data when Pipe is not configured or errors.
// Uses Next's fetch with revalidate for ISR caching (video bytes never proxied — only JSON manifests).
export async function getPortfolioItems(): Promise<PortfolioItem[]> {
  const { url, key, isConfigured } = getPipeConfig();
  if (!isConfigured || !url || !key) return allPortfolioItems;

  try {
    const res = await fetch(`${url}/api/v1/videos?limit=100&status=ready`, {
      headers: { Authorization: `Bearer ${key}` },
      next: { revalidate: 3600 },
    });
    if (!res.ok) return allPortfolioItems;
    const data = (await res.json()) as { videos?: PipePublicVideo[] };
    const videos = data.videos ?? [];
    if (!videos.length) return allPortfolioItems;
    return videos.map(toPortfolioItem);
  } catch {
    return allPortfolioItems;
  }
}

export async function getPortfolioItemBySlug(slug: string): Promise<PortfolioItem | undefined> {
  const { url, key, isConfigured } = getPipeConfig();
  if (!isConfigured || !url || !key) return getItemBySlug(slug);

  try {
    // Try slug-scoped latest endpoint first; fallback to global list filter.
    const res = await fetch(`${url}/api/v1/videos?slug=${encodeURIComponent(slug)}&limit=1`, {
      headers: { Authorization: `Bearer ${key}` },
      next: { revalidate: 3600 },
    });
    if (res.ok) {
      const data = (await res.json()) as { videos?: PipePublicVideo[] };
      const first = data.videos?.[0];
      if (first) return toPortfolioItem(first);
    }
  } catch {
    // ignore and fallback
  }
  return getItemBySlug(slug);
}
