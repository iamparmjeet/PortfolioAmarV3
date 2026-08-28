import Image from "next/image";
import { type GalleryImage, imageCategories } from "@/lib/portfolio-data";

interface StillTileProps {
  image: GalleryImage;
  onClick?: () => void;
}

/** Editorial still in the same 4:5 card language as the video tiles. */
export function StillTile({ image, onClick }: StillTileProps) {
  const label = imageCategories.find((c) => c.id === image.category)?.name ?? image.title;

  return (
    <figure
      className="group relative aspect-[4/5] cursor-zoom-in overflow-hidden rounded-xl border border-hairline bg-surface-elevated transition-colors duration-500 hover:border-accent-line"
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      aria-label={onClick ? `View ${image.title} full screen` : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") onClick();
            }
          : undefined
      }
    >
      <Image
        src={image.src}
        alt={image.title}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 25vw"
        className="film-grade object-cover"
      />
      {/* Always visible on touch screens; hover-revealed where hover exists */}
      <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/85 via-ink/25 to-transparent px-4 pb-3.5 pt-12 transition-opacity duration-300 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:opacity-100">
        <p className="font-display text-lg leading-tight text-bone">{image.title}</p>
        <p className="mt-0.5 font-mono text-[9px] uppercase tracking-[0.12em] text-bone-dim">
          {label}
        </p>
      </figcaption>
    </figure>
  );
}
