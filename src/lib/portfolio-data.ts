// lib/portfolio-data.ts
import { URL } from "@/lib/data";

import { generateUUID } from "./utils";

export type PortfolioItem = {
  id: string;
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
    id: generateUUID(),
    title: "Tile Shop",
    category: "real-estate",
    thumbnail: `${URL}/assets/Videos/aggarwal-tile/1/master.m3u8`,
    type: "video",
    client: "Elite Properties",
  },
  {
    id: generateUUID(),
    title: "Astrology",
    category: "astrology",
    thumbnail: `${URL}/assets/Videos/astro-talk/3/master.m3u8`,
    type: "video",
    client: "Change Your Stars",
  },
  {
    id: generateUUID(),
    title: "Astrology Braclets",
    category: "astrology",
    thumbnail: `${URL}/assets/Videos/braclet/1/master.m3u8`,
    type: "video",
    client: "Glamour Studio",
  },
  {
    id: generateUUID(),
    title: "Carry Bag",
    category: "fashion",
    thumbnail: `${URL}/assets/Videos/carry-bag/1/master.m3u8`,
    type: "image",
    client: "Carry Your Style",
  },
  {
    id: generateUUID(),
    title: "Genius Brain",
    category: "institute",
    thumbnail: `${URL}/assets/Videos/genius-brain-done/1/master.m3u8`,
    type: "image",
    client: "Brain Power",
  },
  {
    id: generateUUID(),
    title: "Hair Salon Institute",
    category: "institute",
    thumbnail: `${URL}/assets/Videos/hair-turner-academic-saloon/1/master.m3u8`,
    type: "video",
    client: "Learn with Us",
  },
  {
    id: generateUUID(),
    title: "Home Decor",
    category: "decor",
    thumbnail: `${URL}/assets/Videos/home-decor/1/master.m3u8`,
    type: "image",
    client: "Elegant Accessories",
  },
  {
    id: generateUUID(),
    title: "Hospital",
    category: "health",
    thumbnail: `${URL}/assets/Videos/hospital/1/master.m3u8`,
    type: "video",
    client: "Health First",
  },
  {
    id: generateUUID(),
    title: "Health Insurance",
    category: "health",
    thumbnail: `${URL}/assets/Videos/insurance/1/master.m3u8`,
    type: "video",
    client: "Health First",
  },
  {
    id: generateUUID(),
    title: "Interior",
    category: "decor",
    thumbnail: `${URL}/assets/Videos/interior/1/master.m3u8`,
    type: "video",
    client: "Beauty Home",
  },
  {
    id: generateUUID(),
    title: "Saloon",
    category: "institute",
    thumbnail: `${URL}/assets/Videos/jeens-saloon/1/master.m3u8`,
    type: "video",
    client: "Jeens Salon",
  },
  {
    id: generateUUID(),
    title: "Jewellery",
    category: "product",
    thumbnail: `${URL}/assets/Videos/jewellers/2/master.m3u8`,
    type: "video",
    client: "Gold For Life",
  },
  // {
  //   id: generateUUID(),
  //   title: "Kid Toys",
  //   category: "product",
  //   thumbnail: `${URL}/assets/Videos/kid-toy/1/master.m3u8`,
  //   type: "video",
  //   client: "Toy Zone",
  // },
  {
    id: generateUUID(),
    title: "Mattress",
    category: "product",
    thumbnail: `${URL}/assets/Videos/mattres/1/master.m3u8`,
    type: "video",
    client: "Sleepy Cat",
  },
  {
    id: generateUUID(),
    title: "Miss USA",
    category: "fashion",
    thumbnail: `${URL}/assets/Videos/miss-usa/1/master.m3u8`,
    type: "video",
    client: "Beauty Queen",
  },
  {
    id: generateUUID(),
    title: "Nutrition USA",
    category: "product",
    thumbnail: `${URL}/assets/Videos/nutrition-usa/1/master.m3u8`,
    type: "video",
    client: "Nutrition USA",
  },
  {
    id: generateUUID(),
    title: "Home Maker",
    category: "real-estate",
    thumbnail: `${URL}/assets/Videos/real-estate/1/master.m3u8`,
    type: "video",
    client: "Toy Estate",
  },
  {
    id: generateUUID(),
    title: "Skin Care",
    category: "beauty",
    thumbnail: `${URL}/assets/Videos/skin-treatment/1/master.m3u8`,
    type: "video",
    client: "Glass Skin",
  },
  {
    id: generateUUID(),
    title: "Ayurvedic",
    category: "ayurvedic",
    thumbnail: `${URL}/assets/Videos/ayurvedic/1/master.m3u8`,
    type: "video",
    client: "Glass Skin",
  },
];

export const HomeItems: PortfolioItem[] = [
  {
    id: generateUUID(),
    title: "Astrology",
    category: "astrology",
    thumbnail: `${URL}/assets/Videos/astro-talk/3/master.m3u8`,
    type: "video",
    client: "Change Your Stars",
  },
  {
    id: generateUUID(),
    title: "Acadour Perfumes",
    category: "perfumes",
    thumbnail: `${URL}/assets/Videos/perfumes/acadour-1/master.m3u8`,
    type: "video",
    client: "Acadour",
  },
  {
    id: generateUUID(),
    title: "Bath Valley",
    category: "decor",
    thumbnail: `${URL}/assets/Videos/tile/bath-valley-tile-1/master.m3u8`,
    type: "video",
    client: "Bath Valley Tiles",
  },
  {
    id: generateUUID(),
    title: "Tile Shop",
    category: "decor",
    thumbnail: `${URL}/assets/Videos/tile/tile-hero-1/master.m3u8`,
    type: "video",
    client: "Bath Valley Tiles",
  },
  {
    id: generateUUID(),
    title: "Real Estate Promo",
    category: "real-estate",
    thumbnail: `${URL}/assets/Videos/real-estate/goldust-city-sajjan-1/master.m3u8`,
    type: "video",
    client: "New Housing Project",
  },
  {
    id: generateUUID(),
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

// Images below

export type ImagesGalleryTypes = {
  id: string;
  title: string;
  category: string;
  thumbnail: string;
};

const ImagesGalleryArr: ImagesGalleryTypes[] = [
  {
    id: generateUUID(),
    title: "Frizzy & Glossy Hair",
    category: "ayurvedic-products",
    thumbnail: `${URL}/assets/images/ayurvedic-products/2.webp`,
  },
  {
    id: generateUUID(),
    title: "Velvet",
    category: "ayurvedic-products",
    thumbnail: `${URL}/assets/images/ayurvedic-products/3.webp`,
  },
  {
    id: generateUUID(),
    title: "Velvet Crystal Face Cream",
    category: "ayurvedic-products",
    thumbnail: `${URL}/assets/images/ayurvedic-products/7.webp`,
  },
  {
    id: generateUUID(),
    title: "Carry Bag",
    category: "carry-bag",
    thumbnail: `${URL}/assets/images/carry-bag/1.webp`,
  },
  {
    id: generateUUID(),
    title: "Interior",
    category: "interior",
    thumbnail: `${URL}/assets/images/interior/1.webp`,
  },
  {
    id: generateUUID(),
    title: "Interior",
    category: "interior",
    thumbnail: `${URL}/assets/images/interior/2.webp`,
  },
  {
    id: generateUUID(),
    title: "Interior",
    category: "interior",
    thumbnail: `${URL}/assets/images/interior/3.webp`,
  },
  {
    id: generateUUID(),
    title: "Interior",
    category: "interior",
    thumbnail: `${URL}/assets/images/interior/4.webp`,
  },
  {
    id: generateUUID(),
    title: "Interior",
    category: "interior",
    thumbnail: `${URL}/assets/images/interior/5.webp`,
  },
  {
    id: generateUUID(),
    title: "Interior",
    category: "interior",
    thumbnail: `${URL}/assets/images/interior/6.webp`,
  },
  {
    id: generateUUID(),
    title: "Interior",
    category: "interior",
    thumbnail: `${URL}/assets/images/interior/7.webp`,
  },
  {
    id: generateUUID(),
    title: "Interior",
    category: "interior",
    thumbnail: `${URL}/assets/images/interior/8.webp`,
  },
  {
    id: generateUUID(),
    title: "Interior",
    category: "interior",
    thumbnail: `${URL}/assets/images/interior/8.webp`,
  },
  {
    id: generateUUID(),
    title: "Interior",
    category: "interior",
    thumbnail: `${URL}/assets/images/interior/9.webp`,
  },
  {
    id: generateUUID(),
    title: "Interior",
    category: "interior",
    thumbnail: `${URL}/assets/images/interior/10.webp`,
  },
  {
    id: generateUUID(),
    title: "Interior",
    category: "interior",
    thumbnail: `${URL}/assets/images/interior/11.webp`,
  },
  {
    id: generateUUID(),
    title: "Interior",
    category: "interior",
    thumbnail: `${URL}/assets/images/interior/12.webp`,
  },
  {
    id: generateUUID(),
    title: "Interior",
    category: "interior",
    thumbnail: `${URL}/assets/images/interior/13.webp`,
  },
  {
    id: generateUUID(),
    title: "Interior",
    category: "interior",
    thumbnail: `${URL}/assets/images/interior/14.webp`,
  },
  {
    id: generateUUID(),
    title: "Body Builder",
    category: "body",
    thumbnail: `${URL}/assets/images/body/1.webp`,
  },
  {
    id: generateUUID(),
    title: "Body Builder",
    category: "body",
    thumbnail: `${URL}/assets/images/body/2.webp`,
  },
  {
    id: generateUUID(),
    title: "Body Builder",
    category: "body",
    thumbnail: `${URL}/assets/images/body/3.webp`,
  },
  {
    id: generateUUID(),
    title: "Jewellery",
    category: "jewellery",
    thumbnail: `${URL}/assets/images/Jewellery/2.webp`,
  },
  {
    id: generateUUID(),
    title: "Jewellery",
    category: "jewellery",
    thumbnail: `${URL}/assets/images/Jewellery/3.webp`,
  },
  {
    id: generateUUID(),
    title: "Jewellery",
    category: "jewellery",
    thumbnail: `${URL}/assets/images/Jewellery/9.webp`,
  },
  {
    id: generateUUID(),
    title: "Jewellery",
    category: "jewellery",
    thumbnail: `${URL}/assets/images/Jewellery/1.webp`,
  },
  {
    id: generateUUID(),
    title: "Jewellery",
    category: "jewellery",
    thumbnail: `${URL}/assets/images/Jewellery/11.webp`,
  },
  {
    id: generateUUID(),
    title: "Jewellery",
    category: "jewellery",
    thumbnail: `${URL}/assets/images/Jewellery/21.webp`,
  },
  {
    id: generateUUID(),
    title: "Jewellery",
    category: "jewellery",
    thumbnail: `${URL}/assets/images/Jewellery/23.webp`,
  },
  {
    id: generateUUID(),
    title: "Kosmic Bracelet",
    category: "kosmic-karma",
    thumbnail: `${URL}/assets/images/kosmic-karma/1.webp`,
  },
  {
    id: generateUUID(),
    title: "Kosmic Bracelet",
    category: "kosmic-karma",
    thumbnail: `${URL}/assets/images/kosmic-karma/3.webp`,
  },
  {
    id: generateUUID(),
    title: "Modal Shoot",
    category: "modal-shoot",
    thumbnail: `${URL}/assets/images/modal-shoot/2.webp`,
  },
  {
    id: generateUUID(),
    title: "Modal Shoot",
    category: "modal-shoot",
    thumbnail: `${URL}/assets/images/modal-shoot/4.webp`,
  },
  {
    id: generateUUID(),
    title: "Modal Shoot",
    category: "modal-shoot",
    thumbnail: `${URL}/assets/images/modal-shoot/5.webp`,
  },
  {
    id: generateUUID(),
    title: "Modal Shoot",
    category: "modal-shoot",
    thumbnail: `${URL}/assets/images/modal-shoot/7.webp`,
  },
  {
    id: generateUUID(),
    title: "Modal Shoot",
    category: "modal-shoot",
    thumbnail: `${URL}/assets/images/modal-shoot/8.webp`,
  },
  {
    id: generateUUID(),
    title: "Modal Shoot",
    category: "modal-shoot",
    thumbnail: `${URL}/assets/images/modal-shoot/9.webp`,
  },
  {
    id: generateUUID(),
    title: "Modal Shoot",
    category: "modal-shoot",
    thumbnail: `${URL}/assets/images/modal-shoot/11.webp`,
  },
  {
    id: generateUUID(),
    title: "Modal Shoot",
    category: "modal-shoot, Jewellery",
    thumbnail: `${URL}/assets/images/modal-shoot/12.webp`,
  },
];

const imageCategoryDefinitions = [
  {
    categoryName: "ayurvedic-products",
    title: "Ayurvedic Products",
  },
  { categoryName: "carry-bag", title: "Carry Bag" },
  { categoryName: "interior", title: "Interior Design" },
  { categoryName: "body", title: "Body Building" },
  { categoryName: "kosmic-karma", title: "Kosmic Karma" },
  { categoryName: "modal-shoot", title: "Modal Photoshoot" },
];

export const ImagesGallery: ImagesGalleryTypes[] = ImagesGalleryArr;

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
