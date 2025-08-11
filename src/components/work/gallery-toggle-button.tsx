import NextImage from "next/image";

import { cn } from "@/lib/utils";

import { Button } from "../ui/button";

type ToggleButtonProps = {
  label: string;
  imageUrl: string;
  isActive: boolean;
  onClick: () => void;
};

export default function GalleryToggleButton({
  label,
  imageUrl,
  isActive,
  onClick,
}: ToggleButtonProps) {
  return (
    <Button
      onClick={onClick}
      className={cn(
        "relative w-[300px] h-[300px] md:w-[600px] md:h-[600px] rounded-2xl overflow-hidden transition-all duration-300 transform hover:scale-105 cursor-pointer",
        isActive ? "ring-4 ring-orange-500 scale-105" : "ring-2 ring-transparent",
      )}
    >
      <NextImage
        src={imageUrl}
        alt={`${label} gallery button`}
        fill
        className="object-cover"
      />
      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
        <span className="text-white text-2xl font-bold">{label}</span>
      </div>
    </Button>
  );
}
