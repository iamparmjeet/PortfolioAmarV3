import type { PortfolioItem } from "@/lib/portfolio-data";

/** Shape returned by Pipe GET /api/v1/videos (public manifest). Keep minimal for portfolio needs. */
export interface PipePublicVideo {
  id: string;
  title: string;
  slug: string;
  version: number;
  created_at: string;
  duration: string;
  duration_s?: number;
  status: "ready" | "processing" | "failed";
  tags: string[];
  categories: string[];
  platforms: string[];
  cover: { url: string; blur_data_url: string };
  formats: Record<string, unknown>;
}

/** Derive R2 poster/blur URLs from an HLS master URL using the pipeline convention. */
function derivePosterUrls(hlsUrl: string): { posterUrl: string; blurUrl: string } {
  if (!hlsUrl) return { posterUrl: "", blurUrl: "" };
  return {
    posterUrl: hlsUrl.replace("master.m3u8", "master.webp"),
    blurUrl: hlsUrl.replace("master.m3u8", "blur-thumbnail.webp"),
  };
}

/**
 * Adapt a Pipe public manifest into the portfolio's canonical PortfolioItem.
 * Prefers `formats.website.hls` (HLS) else falls back to cover URL.
 * Returns `thumbnail` for legacy v3 compat.
 */
export function toPortfolioItem(pipe: PipePublicVideo): PortfolioItem {
  const formats = pipe.formats as Record<string, { hls?: string; url?: string }>;
  const website = formats?.website as { hls?: string } | undefined;
  const hls = website?.hls ?? "";
  const fallback = pipe.cover?.url ?? "";
  const mediaUrl = hls || fallback;
  const { posterUrl, blurUrl } = derivePosterUrls(mediaUrl);
  // Use cover blur if HLS-derived blur missing.
  const resolvedBlur = blurUrl || pipe.cover?.blur_data_url || "";
  const resolvedPoster = posterUrl || pipe.cover?.url || "";

  const category = pipe.categories?.[0] ?? "product";

  return {
    id: pipe.slug,
    slug: pipe.slug,
    title: pipe.title,
    category,
    mediaUrl,
    thumbnail: mediaUrl,
    posterUrl: resolvedPoster,
    blurUrl: resolvedBlur,
    type: "video",
    client: pipe.slug,
  };
}
