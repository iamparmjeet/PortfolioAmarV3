import Image from "next/image";
import Video from "next-video/player";

import { cn } from "@/lib/utils";

type VideoProps = {
  href: string;
  thumbnail: string;
  className?: string;
};

export default function NextVideo({ href, thumbnail, className }: VideoProps) {
  return (
    <div
      className={cn(
        "aspect-[9/16] w-full overflow-hidden rounded-xl shadow-lg relative",
        className,
      )}
    >
      <Video
        src={href}
        poster={thumbnail}
        // preload="metadata"
        className="portrait-video-fit absolute inset-0 w-full h-full"
        style={{
          display: "block",
          width: "100%",
          height: "100%",
        }}
        controls={true}
        muted={false}
        autoPlay={false}
      ></Video>
    </div>
  );
}
