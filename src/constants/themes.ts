// Every palette is a CSS class defined in globals.css. next-themes applies the
// active one to <html> (attribute="class"), and the swatch shown in the
// switcher is the palette's own --color-accent so the UI previews itself.
// Ported from portfolio-parm/src/constants/themes.ts — 12 palettes.
export interface PaletteDef {
  id: string;
  label: string;
  group: "Light" | "In-between" | "Dark";
  swatch: string;
}

export const PALETTES: PaletteDef[] = [
  { id: "palette-cream", label: "Cream", group: "Light", swatch: "#d6446b" },
  { id: "palette-ivory", label: "Ivory", group: "Light", swatch: "#bf3a4f" },
  { id: "palette-slate", label: "Slate", group: "Light", swatch: "#e83e6c" },
  {
    id: "palette-saffron",
    label: "Saffron",
    group: "Light",
    swatch: "#c03a24",
  },
  { id: "palette-mint", label: "Mint", group: "Light", swatch: "#c2493f" },
  { id: "palette-rose", label: "Rose", group: "Light", swatch: "#a8324e" },
  {
    id: "palette-amber",
    label: "Amber",
    group: "In-between",
    swatch: "#f0a040",
  },
  { id: "palette-night", label: "Night", group: "Dark", swatch: "#f06a8b" },
  { id: "palette-coal", label: "Coal", group: "Dark", swatch: "#ff5c8a" },
  { id: "palette-noir", label: "Noir", group: "Dark", swatch: "#d4a43c" },
  { id: "palette-ocean", label: "Ocean", group: "Dark", swatch: "#00c99a" },
  { id: "palette-studio", label: "Studio", group: "Dark", swatch: "#b8f020" },
];

export const PALETTE_IDS = PALETTES.map((p) => p.id);

export const DEFAULT_PALETTE = "palette-noir";
