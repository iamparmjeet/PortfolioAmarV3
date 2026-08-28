// Central TanStack Query keys for Pipe data. Use factory to keep keys stable and typed.
export const qk = {
  pipeVideos: ["pipe", "videos"] as const,
  pipeVideo: (slugOrId: string) => ["pipe", "video", slugOrId] as const,
  pipeCategories: ["pipe", "categories"] as const,
  pipeTags: ["pipe", "tags"] as const,
};
