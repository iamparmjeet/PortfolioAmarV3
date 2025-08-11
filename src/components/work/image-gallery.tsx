"use client";
import NextImage from "next/image";
import { useMemo, useState } from "react";

import type { ImagesGalleryTypes } from "@/lib/portfolio-data";

import { imageCategories, ImagesGallery } from "@/lib/portfolio-data";
import { cn } from "@/lib/utils";

import { Button } from "../ui/button";

export default function FilterableImageGallery() {
  const [activeCategory, setActiveCategory] = useState("all");

  // useMemo is a performance hook. It only re-filters the images when
  // the activeCategory changes, not on every render.
  const filteredImages = useMemo(() => {
    if (activeCategory === "all") {
      return ImagesGallery;
    }
    return ImagesGallery.filter(
      image => image.category === activeCategory,
    );
  }, [activeCategory]); // Dependency array: re-run when this value changes

  return (
    <div className="space-y-8 w-full">
      {/* Filter Buttons */}
      <FilterButtons
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
      />

      {/* The Grid of Filtered Images */}
      <ImageGrid images={filteredImages} />
    </div>
  );
}

// --- Sub-component for Filter Buttons ---
type FilterButtonsProps = {
  activeCategory: string;
  setActiveCategory: (id: string) => void;
};

function FilterButtons({
  activeCategory,
  setActiveCategory,
}: FilterButtonsProps) {
  return (
    <div className="flex flex-wrap justify-center gap-2 md:gap-4">
      {imageCategories.map(category => (
        <Button
          key={category.id}
          onClick={() => setActiveCategory(category.id)}
          className={cn(
            "px-4 py-2 rounded-full transition-colors cursor-pointer",
            activeCategory === category.id
              ? "bg-orange-500 text-neutral-200"
              : "bg-neutral-900 text-white hover:bg-orange-500",
          )}
        >
          {category.name}
        </Button>
      ))}
    </div>
  );
}

// --- Sub-component for the Image Grid ---
type ImageGridProps = {
  images: ImagesGalleryTypes[];
};

function ImageGrid({ images }: ImageGridProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
      {images.map(image => (
        <div
          key={image.id}
          className="group relative aspect-[4/5] overflow-hidden rounded-lg"
        >
          <NextImage
            src={image.thumbnail}
            alt={image.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        </div>
      ))}
    </div>
  );
}
