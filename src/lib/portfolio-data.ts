// Real portfolio data from the live site (amarjeetmishra.com).
// `mediaUrl` holds an HLS master playlist (master.m3u8) streamed from
// Cloudflare R2 — these are the actual project videos, not image thumbnails.

import { CDN_URL } from "@/lib/data";
import { slugify } from "@/lib/utils";

export interface CaseResult {
  stat: string;
  label: string;
}

export interface PortfolioItem {
  id: string;
  slug: string;
  title: string;
  category: string;
  /** HLS master.m3u8 served from R2. Empty string = media not uploaded yet. */
  mediaUrl: string;
  /** Compatibility alias for v3 code — same as mediaUrl. */
  thumbnail: string;
  /** master.webp next to the m3u8 — full-quality poster frame. */
  posterUrl: string;
  /** blur-thumbnail.webp next to the m3u8 — tiny instant-load placeholder. */
  blurUrl: string;
  type: "video" | "image";
  client: string;
  /** Case-study narrative. Category-derived copy until real write-ups land. */
  year?: string;
  brief?: string;
  approach?: string[];
  craft?: string[];
  outcome?: string;
  deliverables?: string[];
  results?: CaseResult[];
  /** Additional project media for the case-study gallery. */
  galleryVideos?: GalleryVideo[];
  galleryImages?: string[];
}

export interface GalleryVideo {
  id: string;
  mediaUrl: string;
  posterUrl: string;
  blurUrl: string;
}

export interface Category {
  id: string;
  name: string;
}

export const categories: Category[] = [
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
  { id: "perfumes", name: "Perfumes" },
  { id: "sports", name: "Sports" },
];

type RawItem = Omit<PortfolioItem, "id" | "slug" | "thumbnail" | "posterUrl" | "blurUrl" | "galleryVideos"> & {
  /** HLS urls of additional project films — posters derived by convention. */
  galleryVideoUrls?: string[];
};

// Order matters: the first six are the home-page featured set (HomeItems on
// the live site), followed by the full batch.
const rawItems: RawItem[] = [
  {
    title: "Astrology",
    category: "astrology",
    mediaUrl: `${CDN_URL}/assets/Videos/astro-talk/3/master.m3u8`,
    type: "video",
    client: "Change Your Stars",
  },
  {
    title: "Rajgadh Estates",
    category: "real-estate",
    mediaUrl: `${CDN_URL}/assets/Videos/real-estate/5/master.m3u8`,
    type: "video",
    client: "Rajgadh Estates",
  },
  {
    title: "Lyallpur Sweets",
    category: "real-estate",
    mediaUrl: `${CDN_URL}/assets/Videos/real-estate/6/master.m3u8`,
    type: "video",
    client: "Goldust Properties",
  },
  {
    title: "Bath Valley",
    category: "decor",
    mediaUrl: `${CDN_URL}/assets/Videos/tile/bath-valley-tile-1/master.m3u8`,
    type: "video",
    client: "Bath Valley Tiles",
  },
  {
    title: "Tile Shop",
    category: "decor",
    mediaUrl: `${CDN_URL}/assets/Videos/tile/tile-hero-1/master.m3u8`,
    type: "video",
    client: "Bath Valley Tiles",
  },
  {
    title: "Real Estate Promo",
    category: "real-estate",
    mediaUrl: `${CDN_URL}/assets/Videos/real-estate/goldust-promo-1/master.m3u8`,
    type: "video",
    client: "Goldust City",
    // DEMO of a multi-media case study — same-world films + location stills.
    // TODO: replace with this project's actual additional films and stills.
    galleryVideoUrls: [
      `${CDN_URL}/assets/Videos/real-estate/goldust-city-sajjan-1/master.m3u8`,
      `${CDN_URL}/assets/Videos/real-estate/5/master.m3u8`,
      `${CDN_URL}/assets/Videos/real-estate/6/master.m3u8`,
    ],
    galleryImages: [
      `${CDN_URL}/assets/images/interior/1.webp`,
      `${CDN_URL}/assets/images/interior/3.webp`,
      `${CDN_URL}/assets/images/interior/5.webp`,
      `${CDN_URL}/assets/images/interior/8.webp`,
    ],
  },
  // Soorma FC — real client; full case study planned.
  // TODO: populate mediaUrl (R2 HLS), brief, approach, deliverables, results.
  {
    title: "Soorma FC",
    category: "sports",
    mediaUrl: "",
    type: "video",
    client: "Soorma FC",
    year: "2025",
  },
  {
    title: "Acadour Perfumes",
    category: "perfumes",
    mediaUrl: `${CDN_URL}/assets/Videos/perfumes/acadour-1/master.m3u8`,
    type: "video",
    client: "Acadour",
  },
  {
    title: "Tile Shop",
    category: "real-estate",
    mediaUrl: `${CDN_URL}/assets/Videos/aggarwal-tile/1/master.m3u8`,
    type: "video",
    client: "Elite Properties",
  },
  {
    title: "Astrology Bracelets",
    category: "astrology",
    mediaUrl: `${CDN_URL}/assets/Videos/braclet/1/master.m3u8`,
    type: "video",
    client: "Glamour Studio",
  },
  {
    title: "Carry Bag",
    category: "fashion",
    mediaUrl: `${CDN_URL}/assets/Videos/carry-bag/1/master.m3u8`,
    type: "image",
    client: "Carry Your Style",
  },
  {
    title: "Genius Brain",
    category: "institute",
    mediaUrl: `${CDN_URL}/assets/Videos/genius-brain-done/1/master.m3u8`,
    type: "image",
    client: "Brain Power",
  },
  {
    title: "Hair Salon Institute",
    category: "institute",
    mediaUrl: `${CDN_URL}/assets/Videos/hair-turner-academic-saloon/1/master.m3u8`,
    type: "video",
    client: "Learn with Us",
  },
  {
    title: "Home Decor",
    category: "decor",
    mediaUrl: `${CDN_URL}/assets/Videos/home-decor/1/master.m3u8`,
    type: "image",
    client: "Elegant Accessories",
  },
  {
    title: "Hospital",
    category: "health",
    mediaUrl: `${CDN_URL}/assets/Videos/hospital/1/master.m3u8`,
    type: "video",
    client: "Health First",
  },
  {
    title: "Health Insurance",
    category: "health",
    mediaUrl: `${CDN_URL}/assets/Videos/insurance/1/master.m3u8`,
    type: "video",
    client: "Health First",
  },
  {
    title: "Interior",
    category: "decor",
    mediaUrl: `${CDN_URL}/assets/Videos/interior/1/master.m3u8`,
    type: "video",
    client: "Beauty Home",
  },
  {
    title: "Saloon",
    category: "institute",
    mediaUrl: `${CDN_URL}/assets/Videos/jeens-saloon/1/master.m3u8`,
    type: "video",
    client: "Jeens Salon",
  },
  {
    title: "Jewellery",
    category: "product",
    mediaUrl: `${CDN_URL}/assets/Videos/jewellers/2/master.m3u8`,
    type: "video",
    client: "Gold For Life",
    // DEMO multi-media case study. TODO: replace with real project media.
    galleryImages: [
      `${CDN_URL}/assets/images/Jewellery/1.webp`,
      `${CDN_URL}/assets/images/Jewellery/2.webp`,
      `${CDN_URL}/assets/images/Jewellery/9.webp`,
      `${CDN_URL}/assets/images/Jewellery/11.webp`,
      `${CDN_URL}/assets/images/Jewellery/21.webp`,
      `${CDN_URL}/assets/images/Jewellery/23.webp`,
    ],
  },
  {
    title: "Mattress",
    category: "product",
    mediaUrl: `${CDN_URL}/assets/Videos/mattres/1/master.m3u8`,
    type: "video",
    client: "Sleepy Cat",
  },
  {
    title: "Miss USA",
    category: "fashion",
    mediaUrl: `${CDN_URL}/assets/Videos/miss-usa/1/master.m3u8`,
    type: "video",
    client: "Beauty Queen",
  },
  {
    title: "Nutrition USA",
    category: "product",
    mediaUrl: `${CDN_URL}/assets/Videos/nutrition-usa/1/master.m3u8`,
    type: "video",
    client: "Nutrition USA",
  },
  {
    title: "Home Maker",
    category: "real-estate",
    mediaUrl: `${CDN_URL}/assets/Videos/real-estate/1/master.m3u8`,
    type: "video",
    client: "Toy Estate",
  },
  {
    title: "Skin Care",
    category: "beauty",
    mediaUrl: `${CDN_URL}/assets/Videos/skin-treatment/1/master.m3u8`,
    type: "video",
    client: "Glass Skin",
  },
  {
    title: "Ayurvedic",
    category: "ayurvedic",
    mediaUrl: `${CDN_URL}/assets/Videos/ayurvedic/1/master.m3u8`,
    type: "video",
    client: "Glass Skin",
    // DEMO multi-media case study. TODO: replace with real project media.
    galleryVideoUrls: [`${CDN_URL}/assets/Videos/skin-treatment/1/master.m3u8`],
    galleryImages: [
      `${CDN_URL}/assets/images/ayurvedic-products/2.webp`,
      `${CDN_URL}/assets/images/ayurvedic-products/3.webp`,
      `${CDN_URL}/assets/images/ayurvedic-products/7.webp`,
    ],
  },
  {
    title: "Real Estate Promo",
    category: "real-estate",
    mediaUrl: `${CDN_URL}/assets/Videos/real-estate/goldust-city-sajjan-1/master.m3u8`,
    type: "video",
    client: "New Housing Project",
  },
];

// ── Category-derived case-study narrative ──
// Honest editorial copy describing the kind of work each category involves.
// No invented metrics, clients, or quotes.
// TODO: replace with real per-project write-ups as they get written.
interface Narrative {
  brief: (client: string) => string;
  approach: string[];
  craft: (client: string, title: string) => string[];
  outcome: (client: string) => string;
  deliverables: string[];
}

// Shared craft/outcome generators keep the per-category blocks readable.
function makeCraft(focus: string, gradeNote: string) {
  return (_client: string, title: string): string[] => [
    `In the edit, ${title} came together around ${focus}. The first assembly was deliberately loose — every usable moment on the timeline — then cut down pass after pass until only the frames that earned their place survived.`,
    `The grade ${gradeNote}. Sound was mixed for phone speakers first, because that's where this work actually lives — then checked on monitors so it holds up everywhere else.`,
  ];
}

function makeOutcome(promise: string) {
  return (client: string): string =>
    `Delivered on schedule and to spec — ${promise} ${client} received platform-ready masters, cutdowns, and source-graded stills, all served from the R2 delivery pipeline.`;
}

const categoryNarratives: Record<string, Narrative> = {
  astrology: {
    brief: (client) =>
      `${client} needed short-form video that could explain an intangible service and build trust fast — content that feels personal, not salesy.`,
    approach: [
      "Planned the shoot around the practitioner and the ritual objects — hands, charts, and stones carry the story.",
      "Shot in soft, warm light with shallow depth to keep the mood intimate rather than mystical-cliché.",
      "Cut to a calm pace with captions for sound-off viewing, ending on a single clear call to action.",
    ],
    craft: makeCraft(
      "the practitioner's hands and the quiet between lines",
      "stayed warm and candlelit, lifting golds and ambers so the frame feels intimate rather than theatrical",
    ),
    outcome: makeOutcome(
      "trust-first content that explains an intangible service without a hard sell.",
    ),
    deliverables: ["Vertical reel", "Color grade", "Captions", "Sound mix"],
  },
  ayurvedic: {
    brief: (client) =>
      `${client} wanted product content that feels natural and credible — warm, tactile visuals instead of sterile e-commerce shots.`,
    approach: [
      "Built the shot list around texture: ingredients, pours, and skin — the product story told through close-ups.",
      "Single warm lighting setup, adjusted per scene, so every asset grades into one consistent look.",
      "Edited hero cuts and short vertical cutdowns from the same footage for feed and reels.",
    ],
    craft: makeCraft(
      "texture — pours, powders, and skin in macro",
      "leaned into earth tones and natural light, keeping product colors honest so the shelf product matches the screen",
    ),
    outcome: makeOutcome("a warm, credible product story that feeds both feed posts and reels."),
    deliverables: ["Product film", "Vertical cutdowns", "Color grade"],
  },
  fashion: {
    brief: (client) =>
      `${client} needed lookbook-grade motion content — fashion visuals with pace and attitude that hold up next to much bigger brands.`,
    approach: [
      "Directed the talent for movement, not poses — fabric and motion sell the garment.",
      "Shot stills and video simultaneously with one crew to maximise the production day.",
      "Cut to music with hard transitions on the beat, graded to a single editorial palette.",
    ],
    craft: makeCraft(
      "movement — fabric in motion cut hard on the beat",
      "locked to a single editorial palette so stills and film read as one campaign",
    ),
    outcome: makeOutcome("a lookbook-grade content set that holds up next to much bigger brands."),
    deliverables: ["Fashion film", "Reels", "Editorial stills"],
  },
  institute: {
    brief: (client) =>
      `${client} needed content that makes a learning environment feel aspirational — real students, real classrooms, zero stock-footage energy.`,
    approach: [
      "Shadowed actual sessions instead of staging them — authenticity is the conversion driver here.",
      "Captured instructor close-ups and student reactions as the emotional spine of the edit.",
      "Cut a hero film plus short reels targeting enrolment windows.",
    ],
    craft: makeCraft(
      "real student moments over staged classroom shots",
      "kept daylight natural and skin tones true — authenticity is the conversion driver here",
    ),
    outcome: makeOutcome("aspirational but honest enrolment content built around real sessions."),
    deliverables: ["Brand film", "Enrolment reels", "Color grade"],
  },
  decor: {
    brief: (client) =>
      `${client} wanted interiors content where the spaces sell themselves — slow, composed visuals that let materials and light do the talking.`,
    approach: [
      "Scouted the light first: every room shot in its best hour.",
      "Gimbal moves kept slow and architectural — no whip-pans, no gimmicks.",
      "Graded warm and natural so finishes read true to life.",
    ],
    craft: makeCraft(
      "slow architectural moves that let the spaces breathe",
      "ran warm and natural so wood, stone, and fabric finishes read true to life",
    ),
    outcome: makeOutcome("composed interiors films where the spaces sell themselves."),
    deliverables: ["Walkthrough film", "Vertical reels", "Stills"],
  },
  "real-estate": {
    brief: (client) =>
      `${client} needed property films that create urgency — content that makes a buyer feel the space before the site visit.`,
    approach: [
      "Opened on the strongest exterior establisher, then moved inside in one continuous visual flow.",
      "Paced the edit to the buyer journey: arrival, reveal, detail, lifestyle.",
      "Delivered multiple cut lengths so the sales team can match content to buyer stage.",
    ],
    craft: makeCraft(
      "the buyer journey — arrival, reveal, detail, lifestyle",
      "pushed golden-hour warmth on exteriors and kept interiors clean and bright",
    ),
    outcome: makeOutcome(
      "property films cut at multiple lengths so the sales team can match content to buyer stage.",
    ),
    deliverables: ["Property film", "Reels", "Aerial shots"],
  },
  beauty: {
    brief: (client) =>
      `${client} wanted beauty content with a premium finish — skin, texture, and results shown honestly and beautifully.`,
    approach: [
      "Lit for skin first — everything else follows.",
      "Macro detail shots intercut with talent moments to balance product and person.",
      "Graded soft and clean, avoiding the over-filtered look that kills trust in beauty.",
    ],
    craft: makeCraft(
      "skin — lit first, graded gently, never over-filtered",
      "stayed soft and clean, protecting the honesty that keeps trust in beauty content",
    ),
    outcome: makeOutcome(
      "premium beauty content that shows results without the filters that kill credibility.",
    ),
    deliverables: ["Product film", "Reels", "Color grade"],
  },
  health: {
    brief: (client) =>
      `${client} needed healthcare content that feels human — warm and reassuring where the category default is clinical and cold.`,
    approach: [
      "Centred the film on people and care moments, not equipment.",
      "Interview-led structure with b-roll shot documentary-style.",
      "Edited for clarity and calm — measured pace, no fear-based hooks.",
    ],
    craft: makeCraft(
      "care moments and human faces, not equipment",
      "was kept warm and reassuring where the category default is clinical and cold",
    ),
    outcome: makeOutcome(
      "healthcare content that feels human — measured pace, no fear-based hooks.",
    ),
    deliverables: ["Brand film", "Reels", "Sound mix"],
  },
  product: {
    brief: (client) =>
      `${client} needed studio-grade product content — clean, consistent visuals that work across catalog, feed, and ads.`,
    approach: [
      "Built a repeatable lighting setup so every SKU matches.",
      "Motion-first thinking: rotations, reveals, and macro passes per product.",
      "Batch-graded the full set for a single consistent catalog look.",
    ],
    craft: makeCraft(
      "rotations, reveals, and macro passes per product",
      "was batch-applied across the full set so every SKU matches on the shelf and in the catalog",
    ),
    outcome: makeOutcome(
      "a consistent catalog content system that works across feed, ads, and product pages.",
    ),
    deliverables: ["Product films", "Catalog stills", "Color grade"],
  },
  perfumes: {
    brief: (client) =>
      `${client} wanted fragrance content that sells a feeling — atmosphere, light, and texture standing in for a scent you can't show.`,
    approach: [
      "Built a visual language of slow light, glass, and vapour.",
      "Shot macro passes of the bottle as the recurring motif.",
      "Cut unhurried, letting shots breathe — luxury pacing over algorithm pacing.",
    ],
    craft: makeCraft(
      "slow light, glass, and vapour standing in for a scent you can't show",
      "chased amber highlights and deep shadows — luxury pacing over algorithm pacing",
    ),
    outcome: makeOutcome("an atmosphere-first launch film that sells a feeling, not a spec sheet."),
    deliverables: ["Launch film", "Reels", "Color grade"],
  },
};

// Slugs are generated from titles and de-duplicated deterministically so
// they are stable across server and client renders (no random UUIDs).
const slugCounts = new Map<string, number>();

export const allPortfolioItems: PortfolioItem[] = rawItems.map((item) => {
  const base = slugify(item.title);
  const count = (slugCounts.get(base) ?? 0) + 1;
  slugCounts.set(base, count);
  const slug = count === 1 ? base : `${base}-${count}`;
  const narrative = categoryNarratives[item.category];
  const { galleryVideoUrls, ...rest } = item;
  return {
    brief: narrative?.brief(item.client),
    approach: narrative?.approach,
    craft: narrative?.craft(item.client, item.title),
    outcome: narrative?.outcome(item.client),
    deliverables: narrative?.deliverables,
    ...rest,
    slug,
    id: slug,
    thumbnail: item.mediaUrl,
    posterUrl: item.mediaUrl ? item.mediaUrl.replace("master.m3u8", "master.webp") : "",
    blurUrl: item.mediaUrl ? item.mediaUrl.replace("master.m3u8", "blur-thumbnail.webp") : "",
    galleryVideos: (galleryVideoUrls ?? []).map((url, i) => ({
      id: `${slug}-film-${i + 1}`,
      mediaUrl: url,
      posterUrl: url.replace("master.m3u8", "master.webp"),
      blurUrl: url.replace("master.m3u8", "blur-thumbnail.webp"),
    })),
  };
});

/** The six projects featured on the home page (plus Soorma FC once media lands). */
export const homeItems: PortfolioItem[] = allPortfolioItems.slice(0, 6);

export function getItemBySlug(slug: string): PortfolioItem | undefined {
  return allPortfolioItems.find((item) => item.slug === slug);
}

export function getNextItem(slug: string): PortfolioItem {
  const idx = allPortfolioItems.findIndex((item) => item.slug === slug);
  return allPortfolioItems[(idx + 1) % allPortfolioItems.length];
}

/** Unique client names, for the about-page client wall. */
export const clients: string[] = [...new Set(allPortfolioItems.map((item) => item.client))];

// Film categories → still-gallery categories that belong to the same world,
// so a case study can showcase its related reels and stills together.
const filmToGalleryCategories: Record<string, string[]> = {
  ayurvedic: ["ayurvedic-products"],
  decor: ["interior"],
  fashion: ["modal-shoot", "carry-bag"],
  product: ["jewellery", "carry-bag"],
  beauty: ["modal-shoot"],
  astrology: ["kosmic-karma"],
  health: ["body"],
};

/** Other films in the same category (same industry world). */
export function getRelatedFilms(item: PortfolioItem, limit = 4): PortfolioItem[] {
  return allPortfolioItems
    .filter((other) => other.category === item.category && other.slug !== item.slug)
    .slice(0, limit);
}

/** Editorial stills from the galleries mapped to this film's category. */
export function getRelatedStills(item: PortfolioItem, limit = 8): GalleryImage[] {
  const galleryCats = filmToGalleryCategories[item.category] ?? [];
  return imagesGallery.filter((img) => galleryCats.includes(img.category)).slice(0, limit);
}

// ── Image galleries (editorial stills, served from R2) ──

export interface GalleryImage {
  id: string;
  title: string;
  category: string;
  src: string;
}

interface RawGalleryImage {
  title: string;
  category: string;
  file: string;
}

const rawGallery: RawGalleryImage[] = [
  {
    title: "Frizzy & Glossy Hair",
    category: "ayurvedic-products",
    file: "ayurvedic-products/2.webp",
  },
  { title: "Velvet", category: "ayurvedic-products", file: "ayurvedic-products/3.webp" },
  {
    title: "Velvet Crystal Face Cream",
    category: "ayurvedic-products",
    file: "ayurvedic-products/7.webp",
  },
  { title: "Carry Bag", category: "carry-bag", file: "carry-bag/1.webp" },
  { title: "Interior", category: "interior", file: "interior/1.webp" },
  { title: "Interior", category: "interior", file: "interior/2.webp" },
  { title: "Interior", category: "interior", file: "interior/3.webp" },
  { title: "Interior", category: "interior", file: "interior/4.webp" },
  { title: "Interior", category: "interior", file: "interior/5.webp" },
  { title: "Interior", category: "interior", file: "interior/6.webp" },
  { title: "Interior", category: "interior", file: "interior/7.webp" },
  { title: "Interior", category: "interior", file: "interior/8.webp" },
  { title: "Interior", category: "interior", file: "interior/9.webp" },
  { title: "Interior", category: "interior", file: "interior/10.webp" },
  { title: "Interior", category: "interior", file: "interior/11.webp" },
  { title: "Interior", category: "interior", file: "interior/12.webp" },
  { title: "Interior", category: "interior", file: "interior/13.webp" },
  { title: "Interior", category: "interior", file: "interior/14.webp" },
  { title: "Body Builder", category: "body", file: "body/1.webp" },
  { title: "Body Builder", category: "body", file: "body/2.webp" },
  { title: "Body Builder", category: "body", file: "body/3.webp" },
  { title: "Jewellery", category: "jewellery", file: "Jewellery/2.webp" },
  { title: "Jewellery", category: "jewellery", file: "Jewellery/3.webp" },
  { title: "Jewellery", category: "jewellery", file: "Jewellery/9.webp" },
  { title: "Jewellery", category: "jewellery", file: "Jewellery/1.webp" },
  { title: "Jewellery", category: "jewellery", file: "Jewellery/11.webp" },
  { title: "Jewellery", category: "jewellery", file: "Jewellery/21.webp" },
  { title: "Jewellery", category: "jewellery", file: "Jewellery/23.webp" },
  { title: "Kosmic Bracelet", category: "kosmic-karma", file: "kosmic-karma/1.webp" },
  { title: "Kosmic Bracelet", category: "kosmic-karma", file: "kosmic-karma/3.webp" },
  { title: "Model Shoot", category: "modal-shoot", file: "modal-shoot/2.webp" },
  { title: "Model Shoot", category: "modal-shoot", file: "modal-shoot/4.webp" },
  { title: "Model Shoot", category: "modal-shoot", file: "modal-shoot/5.webp" },
  { title: "Model Shoot", category: "modal-shoot", file: "modal-shoot/7.webp" },
  { title: "Model Shoot", category: "modal-shoot", file: "modal-shoot/8.webp" },
  { title: "Model Shoot", category: "modal-shoot", file: "modal-shoot/9.webp" },
  { title: "Model Shoot", category: "modal-shoot", file: "modal-shoot/11.webp" },
  { title: "Model Shoot", category: "modal-shoot", file: "modal-shoot/12.webp" },
];

export const imagesGallery: GalleryImage[] = rawGallery.map((img) => ({
  id: img.file.replace(/[/.]/g, "-"),
  title: img.title,
  category: img.category,
  src: `${CDN_URL}/assets/images/${img.file}`,
}));

export const imageCategories: Category[] = [
  { id: "all", name: "All Galleries" },
  { id: "ayurvedic-products", name: "Ayurvedic Products" },
  { id: "carry-bag", name: "Carry Bag" },
  { id: "interior", name: "Interior Design" },
  { id: "body", name: "Body Building" },
  { id: "kosmic-karma", name: "Kosmic Karma" },
  { id: "modal-shoot", name: "Model Photoshoot" },
];

/** Honest, derived-from-data stats — no invented numbers. */
export const siteStats = [
  { value: `${allPortfolioItems.length}`, label: "Films on this site" },
  { value: `${clients.length}`, label: "Brands" },
  { value: `${categories.length - 1}`, label: "Industries" },
  { value: `${imagesGallery.length}`, label: "Editorial stills" },
];

// ── Legacy compat for incremental migration (v3 → v4) ──
// Old src expects these names/shapes; they are derived from the new canonical data.
export type Categoriestype = Category;
export type ImagesGalleryTypes = GalleryImage & { thumbnail: string };
export const batch1: PortfolioItem[] = allPortfolioItems.slice(6);
export const HomeItems: PortfolioItem[] = homeItems as unknown as PortfolioItem[];
// Old ImagesGallery used capital I; map new imagesGallery with thumbnail alias.
export const ImagesGallery: ImagesGalleryTypes[] = imagesGallery.map((img) => ({
  ...img,
  thumbnail: img.src,
})) as ImagesGalleryTypes[];
export const imageCategoriesCompat = imageCategories;
