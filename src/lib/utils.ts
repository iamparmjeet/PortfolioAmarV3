import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

// Legacy helpers retained for v3 compatibility during incremental migration.
// TODO: remove after src migration to amar-v4 (no longer used in new data layer).
export function randomId(length = 8) {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

export function formatUrlForDisplay(url: string | undefined | null): string {
  if (!url) {
    return "";
  }
  try {
    const urlObject = new URL(url);
    return urlObject.hostname;
  } catch (error) {
    console.error("Invalid URL provided:", url, error);
    return url;
  }
}

export function FullDateAndTime() {
  const now = new Date();
  return now.toLocaleString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  });
}

export function generateUUID(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Math.random().toString(12).substring(2, 10) + Math.random().toString(20).substring(2, 15);
}
