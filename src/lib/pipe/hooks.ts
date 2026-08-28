"use client";

import { useQuery } from "@tanstack/react-query";
import type { PortfolioItem } from "@/lib/portfolio-data";
import { qk } from "./queryKeys";
import { pipeFetch } from "./client";
import type { PipePublicVideo } from "./mappers";
import { toPortfolioItem } from "./mappers";

// Client-side TanStack hooks over the Pipe Next proxy (/api/pipe). Server ISR is primary for SEO;
// these hooks power interactive islands (filters, live polling) without exposing the API key.

export function usePipeVideos() {
  return useQuery({
    queryKey: qk.pipeVideos,
    queryFn: async () => {
      const data = await pipeFetch<{ videos: PipePublicVideo[] }>("/videos?limit=100&status=ready");
      return (data.videos ?? []).map(toPortfolioItem) as PortfolioItem[];
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}

export function usePipeVideo(slug: string | null) {
  return useQuery({
    queryKey: slug ? qk.pipeVideo(slug) : ["pipe", "video", "none"],
    enabled: Boolean(slug),
    queryFn: async () => {
      const data = await pipeFetch<{ videos: PipePublicVideo[] }>(
        `/videos?slug=${encodeURIComponent(slug as string)}&limit=1`,
      );
      const first = data.videos?.[0];
      if (!first) throw new Error("Video not found");
      return toPortfolioItem(first) as PortfolioItem;
    },
    staleTime: 5 * 60 * 1000,
  });
}
