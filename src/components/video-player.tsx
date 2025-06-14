"use client";
import Hls from "hls.js";
import { useEffect, useRef } from "react";

export function VideoPlayer({ src }: { src: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video)
      return;

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      // Native HLS support (Safari/iOS)
      video.src = src;
    }
    else if (Hls.isSupported()) {
      // HLS.js for other browsers
      const hls = new Hls();
      hls.loadSource(src);
      hls.attachMedia(video);
    }
  }, [src]);

  return <video ref={videoRef} preload="auto" controls />;
}

// Usage: <VideoPlayer src="https://r2.yourdomain.com/videos/my-video/playlist.m3u8" />
