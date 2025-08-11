import Video from "next-video/player";
import Image from "next/image";

import { cn } from "@/lib/utils";

type VideoProps = {
  href: string;
  thumbnail: string;
  className?: string;
};

export default function NextVideo({
  href,
  thumbnail,
  className,
}: VideoProps) {
  return (
    <div
      className={cn(
        "aspect-[9/16] w-full overflow-hidden rounded-xl shadow-lg relative",
        className,
      )}
    >
      <Video
        src={href}
        className="w-full h-full portrait-video-fit"
        autoPlay={false}
        muted={false}
        controls={true}
      >
        <Image
          slot="poster"
          src={thumbnail}
          placeholder="blur"
          blurDataURL={thumbnail.replace("thumbnail.webp", "blur-thumbnail.webp")}
          width={720}
          height={1280}
          alt="Video thumbnail"
          priority
        />
      </Video>
    </div>
  );
}
