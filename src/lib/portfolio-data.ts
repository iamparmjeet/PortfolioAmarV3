// lib/portfolio-data.ts
import { URL } from "@/lib/data";

export type PortfolioItem = {
  id: number;
  title: string;
  category: string;
  thumbnail: string;
  type: "video" | "image";
  client: string;
};

export type Categoriestype = {
  id: string;
  name: string;
};

// Portfolio categories
export const categories: Categoriestype[] = [
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

export const batch1: PortfolioItem[] = [
  {
    id: 1,
    title: "Tile Shop",
    category: "real-estate",
    thumbnail: `${URL}/assets/Videos/aggarwal-tile/1/master.m3u8`,
    type: "video",
    client: "Elite Properties",
  },
  {
    id: 2,
    title: "Astrology",
    category: "astrology",
    thumbnail: `${URL}/assets/Videos/astro-talk/3/master.m3u8`,
    type: "video",
    client: "Change Your Stars",
  },
  {
    id: 3,
    title: "Astrology Braclets",
    category: "astrology",
    thumbnail: `${URL}/assets/Videos/braclet/1/master.m3u8`,
    type: "video",
    client: "Glamour Studio",
  },
  {
    id: 4,
    title: "Carry Bag",
    category: "fashion",
    thumbnail: `${URL}/assets/Videos/carry-bag/1/master.m3u8`,
    type: "image",
    client: "Carry Your Style",
  },
  {
    id: 5,
    title: "Genius Brain",
    category: "institute",
    thumbnail: `${URL}/assets/Videos/genius-brain-done/1/master.m3u8`,
    type: "image",
    client: "Brain Power",
  },
  {
    id: 6,
    title: "Hair Salon Institute",
    category: "institute",
    thumbnail: `${URL}/assets/Videos/hair-turner-academic-saloon/1/master.m3u8`,
    type: "video",
    client: "Learn with Us",
  },
  {
    id: 7,
    title: "Home Decor",
    category: "decor",
    thumbnail: `${URL}/assets/Videos/home-decor/1/master.m3u8`,
    type: "image",
    client: "Elegant Accessories",
  },
  {
    id: 8,
    title: "Hospital",
    category: "health",
    thumbnail: `${URL}/assets/Videos/hospital/1/master.m3u8`,
    type: "video",
    client: "Health First",
  },
  {
    id: 9,
    title: "Health Insurance",
    category: "health",
    thumbnail: `${URL}/assets/Videos/insurance/1/master.m3u8`,
    type: "video",
    client: "Health First",
  },
  {
    id: 10,
    title: "Interior",
    category: "decor",
    thumbnail: `${URL}/assets/Videos/interior/1/master.m3u8`,
    type: "video",
    client: "Beauty Home",
  },
  {
    id: 11,
    title: "Saloon",
    category: "institute",
    thumbnail: `${URL}/assets/Videos/jeens-saloon/1/master.m3u8`,
    type: "video",
    client: "Jeens Salon",
  },
  {
    id: 12,
    title: "Jewellery",
    category: "product",
    thumbnail: `${URL}/assets/Videos/jewellers/2/master.m3u8`,
    type: "video",
    client: "Gold For Life",
  },
  // {
  //   id: 13,
  //   title: "Kid Toys",
  //   category: "product",
  //   thumbnail: `${URL}/assets/Videos/kid-toy/1/master.m3u8`,
  //   type: "video",
  //   client: "Toy Zone",
  // },
  {
    id: 14,
    title: "Mattress",
    category: "product",
    thumbnail: `${URL}/assets/Videos/mattres/1/master.m3u8`,
    type: "video",
    client: "Sleepy Cat",
  },
  {
    id: 15,
    title: "Miss USA",
    category: "fashion",
    thumbnail: `${URL}/assets/Videos/miss-usa/1/master.m3u8`,
    type: "video",
    client: "Beauty Queen",
  },
  {
    id: 16,
    title: "Nutrition USA",
    category: "product",
    thumbnail: `${URL}/assets/Videos/nutrition-usa/1/master.m3u8`,
    type: "video",
    client: "Nutrition USA",
  },
  {
    id: 17,
    title: "Home Maker",
    category: "real-estate",
    thumbnail: `${URL}/assets/Videos/real-estate/1/master.m3u8`,
    type: "video",
    client: "Toy Estate",
  },
  {
    id: 18,
    title: "Skin Care",
    category: "beauty",
    thumbnail: `${URL}/assets/Videos/skin-treatment/1/master.m3u8`,
    type: "video",
    client: "Glass Skin",
  },
  {
    id: 19,
    title: "Ayurvedic",
    category: "ayurvedic",
    thumbnail: `${URL}/assets/Videos/ayurvedic/1/master.m3u8`,
    type: "video",
    client: "Glass Skin",
  },
];

export const HomeItems: PortfolioItem[] = [
  {
    id: 1,
    title: "Astrology",
    category: "astrology",
    thumbnail: `${URL}/assets/Videos/astro-talk/3/master.m3u8`,
    type: "video",
    client: "Change Your Stars",
  },
  {
    id: 2,
    title: "Acadour Perfumes",
    category: "perfumes",
    thumbnail: `${URL}/assets/Videos/perfumes/acadour-1/master.m3u8`,
    type: "video",
    client: "Acadour",
  },
  {
    id: 3,
    title: "Bath Valley",
    category: "decor",
    thumbnail: `${URL}/assets/Videos/tile/bath-valley-tile-1/master.m3u8`,
    type: "video",
    client: "Bath Valley Tiles",
  },
  {
    id: 4,
    title: "Tile Shop",
    category: "decor",
    thumbnail: `${URL}/assets/Videos/tile/tile-hero-1/master.m3u8`,
    type: "video",
    client: "Bath Valley Tiles",
  },
  {
    id: 5,
    title: "Real Estate Promo",
    category: "real-estate",
    thumbnail: `${URL}/assets/Videos/real-estate/goldust-city-sajjan-1/master.m3u8`,
    type: "video",
    client: "New Housing Project",
  },
  {
    id: 6,
    title: "Real Estate Promo",
    category: "real-estate",
    thumbnail: `${URL}/assets/Videos/real-estate/goldust-promo-1/master.m3u8`,
    type: "video",
    client: "Goldust City",
  },
];

export const allPortfolioItems: PortfolioItem[] = [
  ...batch1,
  ...HomeItems,
];

export type ImagesGalleryTypes = {
  id: number;
  title: string;
  category: string;
  thumbnail: string;
  type: "image";
};

let imageIdCounter = 1;

function createImageSet(categoryName: string, title: string, count: number): ImagesGalleryTypes[] {
  const items: ImagesGalleryTypes[] = [];
  for (let i = 1; i <= count; i++) {
    items.push({
      id: imageIdCounter++,
      title,
      category: categoryName,
      thumbnail: `${URL}/assets/images/${categoryName}/${i}.webp`,
      type: "image",
    });
  }
  return items;
}

const imageCategoryDefinitions = [
  {
    categoryName: "ayurvedic-products",
    title: "Ayurvedic Products",
    count: 14,
  },
  { categoryName: "carry-bag", title: "Carry Bag", count: 2 },
  { categoryName: "interior", title: "Interior Design", count: 14 },
  { categoryName: "body", title: "Body Building", count: 3 },
  { categoryName: "kosmic-karma", title: "Kosmic Karma", count: 35 },
  { categoryName: "modal-shoot", title: "Modal Photoshoot", count: 25 },
  { categoryName: "Jewellery", title: "Jewellery Collection", count: 60 },
];

export const ImagesGallery: ImagesGalleryTypes[] = imageCategoryDefinitions.flatMap(
  def => createImageSet(def.categoryName, def.title, def.count),
);

const allImagesCategory: Categoriestype = {
  id: "all",
  name: "All Galleries",
};

const dynamicImageCategories: Categoriestype[] = imageCategoryDefinitions.map(
  def => ({
    id: def.categoryName, // e.g., "carry-bag"
    name: def.title, // e.g., "Carry Bag"
  }),
);

export const imageCategories: Categoriestype[] = [
  allImagesCategory,
  ...dynamicImageCategories,
];
