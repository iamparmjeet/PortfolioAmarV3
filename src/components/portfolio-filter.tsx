"use client";

import { IconPlayCard } from "@tabler/icons-react";
import Image from "next/image";
import { useState } from "react";

import { placeholderImg } from "@/lib/data";
import { cn } from "@/lib/utils";

import { Button } from "./ui/button";

// Portfolio categories
const categories = [
  { id: "all", name: "All Work" },
  { id: "astrology", name: "Astrology" },
  { id: "ayurvedic", name: "Ayurvedic" },
  { id: "fashion", name: "Fashion & Lifestyle" },
  { id: "institute", name: "Institute" },
  { id: "decor", name: "Home Decor" },
  { id: "real-estate", name: "Real Estate" },
  { id: "beauty", name: "Beauty & Salon" },
  { id: "health", name: "Health" },
  { id: "product", name: "Product Catalogs" },
  { id: "podcast", name: "Podcasts" },
];

// Portfolio items
const portfolioItems = [
  {
    id: 1,
    title: "Tile Shop",
    category: "real-estate",
    thumbnail: placeholderImg,
    type: "video",
    client: "Elite Properties",
  },
  {
    id: 2,
    title: "Astrology",
    category: "astrology",
    thumbnail: placeholderImg,
    type: "video",
    client: "Smile Perfect Dental",
  },
  {
    id: 3,
    title: "Astrology Braclets",
    category: "astrology",
    thumbnail: placeholderImg,
    type: "video",
    client: "Glamour Studio",
  },
  {
    id: 4,
    title: "Carry Bag",
    category: "fashion",
    thumbnail: placeholderImg,
    type: "image",
    client: "Carry Your Style",
  },
  {
    id: 5,
    title: "Genius Brain",
    category: "institute",
    thumbnail: placeholderImg,
    type: "image",
    client: "Brain Power",
  },
  {
    id: 6,
    title: "Hair Salon Institute",
    category: "institute",
    thumbnail: placeholderImg,
    type: "video",
    client: "Learn with Us",
  },
  {
    id: 7,
    title: "Home Decor",
    category: "decor",
    thumbnail: placeholderImg,
    type: "image",
    client: "Elegant Accessories",
  },
  {
    id: 8,
    title: "Hospital",
    category: "health",
    thumbnail: placeholderImg,
    type: "video",
    client: "Health First",
  },
  {
    id: 9,
    title: "Health Insurance",
    category: "health",
    thumbnail: placeholderImg,
    type: "video",
    client: "Health First",
  },
  {
    id: 10,
    title: "Interior",
    category: "decor",
    thumbnail: placeholderImg,
    type: "video",
    client: "Beauty Home",
  },
  {
    id: 11,
    title: "Saloon",
    category: "institute",
    thumbnail: placeholderImg,
    type: "video",
    client: "Jeens Salon",
  },
  {
    id: 12,
    title: "Jewellery",
    category: "product",
    thumbnail: placeholderImg,
    type: "video",
    client: "Gold For Life",
  },
  {
    id: 13,
    title: "Kid Toys",
    category: "product",
    thumbnail: placeholderImg,
    type: "video",
    client: "Toy Zone",
  },
  {
    id: 14,
    title: "Mattress",
    category: "product",
    thumbnail: placeholderImg,
    type: "video",
    client: "Sleepy Cat",
  },
  {
    id: 15,
    title: "Miss USA",
    category: "fashion",
    thumbnail: placeholderImg,
    type: "video",
    client: "Beauty Queen",
  },
  {
    id: 16,
    title: "Nutrition USA",
    category: "product",
    thumbnail: placeholderImg,
    type: "video",
    client: "Nutrition USA",
  },
  {
    id: 17,
    title: "Home Maker",
    category: "real-estate",
    thumbnail: placeholderImg,
    type: "video",
    client: "Toy Estate",
  },
  {
    id: 18,
    title: "Skin Care",
    category: "beauty",
    thumbnail: placeholderImg,
    type: "video",
    client: "Glass Skin",
  },
  {
    id: 19,
    title: "Ayurvedic",
    category: "ayurvedic",
    thumbnail: placeholderImg,
    type: "video",
    client: "Glass Skin",
  },
];

export default function PortfolioFilter() {
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredItems
    = activeCategory === "all" ? portfolioItems : portfolioItems.filter(item => item.category === activeCategory);

  return (
    <div className="space-y-8 w-full">
      {/* Filter Buttons */}
      <div className="flex flex-wrap justify-center gap-2 md:gap-4">
        {categories.map(category => (
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

      {/* Portfolio Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map(item => (
          <div key={item.id} className="group relative overflow-hidden rounded-lg">
            <div className="aspect-video relative overflow-hidden">
              <Image
                src={item.thumbnail || "/placeholder.svg"}
                alt={item.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                {item.type === "video"
                  ? (
                      <Button className="w-16 h-16 rounded-full bg-gold-500 flex items-center justify-center">
                        <IconPlayCard className="w-6 h-6 text-black" />
                      </Button>
                    )
                  : (
                      <Button className="px-4 py-2 bg-gold-500 rounded-md text-black font-medium">View Gallery</Button>
                    )}
              </div>
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
    </div>
  );
}
