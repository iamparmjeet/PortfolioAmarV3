import { create } from "zustand";

interface VideoStore {
  activeVideoId: string | null;
  requestPlay: (id: string) => void;
  stopAll: () => void;
}

/**
 * Single-video-at-a-time playback across the whole site.
 * Any player calls requestPlay(id) when it starts; every other player
 * watches activeVideoId and pauses itself when evicted.
 */
export const useVideoStore = create<VideoStore>((set) => ({
  activeVideoId: null,
  requestPlay: (id) => set({ activeVideoId: id }),
  stopAll: () => set({ activeVideoId: null }),
}));
