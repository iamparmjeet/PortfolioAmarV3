"use client";

import { useMemo, useState } from "react";

import type { PortfolioItem } from "@/lib/portfolio-data";

import { Button } from "@/components/ui/button";
import NextVideo from "@/components/video/next-video";
import { categories as Categories } from "@/lib/portfolio-data";
import { cn } from "@/lib/utils";

type PortfolioSectionWithFilterProps = {
  Items?: number;
  PortfoliosItems: PortfolioItem[];
  withFilter?: boolean;
};

export default function PortfolioSectionWithFilter({ Items, PortfoliosItems, withFilter = true }: PortfolioSectionWithFilterProps) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = Items || 15;

  const filteredItems = useMemo(() => {
    const filtered = activeCategory === "all"
      ? PortfoliosItems
      : PortfoliosItems.filter(item => item.category === activeCategory);

    // Reset to first page when filter changes
    setCurrentPage(1);
    return filtered;
  }, [activeCategory]);

  const currentItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return (
    <div className="space-y-8 w-full">
      {/* Filter Buttons */}
      { withFilter && (
        <FilterBtnSection
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
        />
      )}

      {/* Portfolio Grid */}
      <PortfolioItemsGrid currentItems={currentItems} />

      {/* Pagination */}
    </div>
  );
}

// *********** Filter Button Section ***********

type FilterBtnSectionProps = {
  setActiveCategory: (category: string) => void;
  activeCategory: string;
};

function FilterBtnSection({ setActiveCategory, activeCategory }: FilterBtnSectionProps) {
  return (
    <div className="flex flex-wrap justify-center gap-2 md:gap-4">
      {Categories.map(category => (
        <Button
          key={category.id}
          onClick={() => setActiveCategory(category.id)}
          className={cn(
            "px-4 py-2 rounded-full transition-colors",
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
};

type PortfolioItemsGridProps = {
  currentItems: PortfolioItem[];
};

function PortfolioItemsGrid({ currentItems }: PortfolioItemsGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {currentItems.map(item => (
        <div key={item.id} className="group relative overflow-hidden rounded-lg">
          <div className="h-[854px] object-fill relative overflow-hidden">
            <NextVideo
              href={item.thumbnail}
              thumbnail={item.thumbnail.replace(".m3u8", ".webp")}
            />

            {/* <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                {item.type === "video"
                  ? (
                      <Button className="w-16 h-16 rounded-full bg-gold-500 flex items-center justify-center">
                        <IconPlayCard className="w-6 h-6 text-black" />
                      </Button>
                    )
                  : (
                      <Button className="px-4 py-2 bg-gold-500 rounded-md text-black font-medium">
                        View Gallery
                      </Button>
                    )}
              </div> */}
          </div>
          <div className="p-4 bg-neutral-900">
            <h3 className="text-lg font-medium text-white">{item.title}</h3>
            <p className="text-gold-400 text-sm">{item.client}</p>
            <div className="mt-2 flex items-center">
              <span className="text-xs uppercase tracking-wider bg-neutral-800 text-gray-300 px-2 py-1 rounded">
                {item.type === "video" ? "Video" : "Photography"}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
