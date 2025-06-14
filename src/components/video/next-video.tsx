import Video from "next-video/player";
import Image from "next/image";
// import Instaplay from "player.style/instaplay/react";

type VideoProps = {
  href: string;
  thumbnail?: string;
};

export default function NextVideo({ href, thumbnail }: VideoProps) {
  return (
    <Video
      src={href}
      className="w-full h-full object-cover"
      autoPlay={false}
      muted={false}
      controls={true}
      // theme={Instaplay}
    >
      <Image
        slot="poster"
        src={thumbnail || ""}
        placeholder="blur"
        blurDataURL={thumbnail}
        width={480}
        height={855}
        alt="Video thumbnail"
      />
    </Video>
  );
}
