import Video from "next-video/player";
import Image from "next/image";

import { cn } from "@/lib/utils";

type VideoProps = {
  href: string;
  thumbnail: string; // main thumbnail.webp
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
        "aspect-[9/16] w-full max-w-xs md:max-w-xl overflow-hidden rounded-xl shadow-lg relative",
        className,
      )}
    >
      <Video
        src={href}
        className="w-full h-full object-cover"
        autoPlay={false}
        muted={false}
        controls={true}
      >
        <Image
          slot="poster"
          src={thumbnail}
          placeholder="blur"
          blurDataURL={thumbnail.replace("thumbnail.webp", "blur-thumbnail.webp")}
          width={480}
          height={855}
          alt="Video thumbnail"
        />
      </Video>
    </div>
  );
}
