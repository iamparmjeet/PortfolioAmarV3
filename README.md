# PortfolioAmarV3 — Amar Editz

> Cinematic portfolio for **Amarjeet Mishra** — freelance video editor, filmmaker & educator based in Ludhiana, Punjab.
> Live at **[amarjeetmishra.com](https://amarjeetmishra.com)** · Brand: **Amar Editz**

Production-grade Next.js 16 (App Router) portfolio — dark editorial aesthetic, HLS video streaming from Cloudflare R2, and a pluggable **Pipe** pipeline for video delivery. ISR-first, static-fallback safe, single-video-at-a-time playback.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [How It Works](#how-it-works)
- [Cloudflare Infrastructure](#cloudflare-infrastructure)
- [Pipe Integration](#pipe-integration)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [Deployment](#deployment)
- [Roadmap](#roadmap)
- [Credits](#credits)

---

## Overview

This repo is the canonical, deployable app for `amarjeetmishra.com`. It synthesizes three prior design explorations into one cinematic system:

- **Aesthetic:** warm near-black `#0B0908`, muted gold `#C9943A`, serif display (Cormorant Garamond), clean sans body (DM Sans), mono eyebrows (Space Mono) — A24 editorial feel.
- **Routing:** Next.js App Router (`src/app` only) — no `pages/` directory.
- **Content:** 26 portfolio items, 38 editorial stills, and supporting pages (Home, Work, About, Journal, Learn, Contact) — all derived from real data in `src/lib/data.ts` and `src/lib/portfolio-data.ts`.

---

## Features

| Area | Detail |
|------|--------|
| **Home** | Kinetic hero with skewY word reveal, mouse-follow glow, ticker marquee, stats strip, featured work (6), services list, gallery strip, contact CTA |
| **Work** | 9:16 vertical tile grid with blur → poster → HLS; category filter; ISR case-study pages with Screenplay layout (`FADE IN:` → `INT.` slugline → Act I/II/III → `FADE OUT.`) |
| **About** | Portrait, bio, derived stats, client wall (deduped from portfolio items) |
| **Journal** | Editorial articles (ghost-written drafts in Amar's voice; `src/lib/data.ts:294`) |
| **Learn** | `learnsimm` program — 3 modules, real data from learnsimm.com |
| **Contact** | Serif underline fields, Resend transactional email, toast feedback, WhatsApp secondary CTA (hidden until `brand.whatsapp` is set) |
| **Chat** | Streaming AI assistant (`ai` + `@ai-sdk/openai` via OpenRouter) at `src/components/chat/AmarChat.tsx` — hidden when `OPENROUTER_API_KEY` is unset |
| **Video** | `next-video/player` only (no raw `<video>`), Zustand single-playback contract, HLS everywhere |
| **Styling** | Tailwind CSS v4 with CSS-first tokens in `src/app/globals.css` — no brand hex in JSX |

---

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | **Next.js 16.2** (App Router), React 19, TypeScript strict (`no any`) |
| Styling | **Tailwind CSS v4**, CSS variables in `globals.css`, Biome 2.4 for lint/format |
| Media | `next/image` (allow-listed `media.amarjeetmishra.com`), `next-video` HLS player |
| State | **Zustand** (`src/stores/videoStore.ts`) — single-video-at-a-time |
| Data fetching | **TanStack Query 5** + Hono RPC typed client (`src/lib/pipe/*`), ISR fallback to static data |
| Email | **Resend** (`src/app/api/contact/route.ts`) |
| AI Chat | `ai` + `@ai-sdk/openai` via **OpenRouter** |

---

## How It Works

### Rendering & Data Flow

```
Browser ──→ Next.js Server (ISR, revalidate 3600)
              ├── tries Pipe  GET /api/v1/videos  (via src/lib/pipe/server.ts)
              │     └─→ Cloudflare Worker + D1 (Pipe pipeline)
              └── fallback ──→ src/lib/portfolio-data.ts  (static, always available)

Client islands ──→ TanStack Query ──→ /api/pipe/* proxy ──→ Pipe Worker
                  (filters, live polling; key never hits the bundle)

Media bytes ──→ Cloudflare R2  ──→  media.amarjeetmishra.com  ──→ Browser
                (video bytes never touch the Next.js server)
```

1. **ISR-first:** `/work` and `/work/[slug]` use `revalidate = 3600` + `generateStaticParams` — 26 pages prerender at build, revalidate hourly. Server helpers in `src/lib/pipe/server.ts:7` try Pipe first, fall back to static `allPortfolioItems` on any error or when env is unset.
2. **Client proxy:** `/api/pipe/[...path]/route.ts:5` proxies public reads and injects `PIPE_PUBLIC_API_KEY` server-side. TanStack hooks in `src/lib/pipe/hooks.ts:1` call `/api/pipe` so the key is never bundled.
3. **Single playback:** Every player goes through `src/components/video/HlsPlayer.tsx:1` and the Zustand contract (`requestPlay(id)` + `useEffect` pause on eviction) — only one video plays at a time.
4. **Media convention:** `…/master.m3u8` → `…/master.webp` (poster) + `…/blur-thumbnail.webp` (blur placeholder). Any new R2 upload following this convention gets tiles for free. Mapping lives in `src/lib/pipe/mappers.ts:20`.

### Key Constraints (never violate)

- No fake testimonials — empty state if `testimonials.length === 0`
- No raw `<video>` — `next-video/player` only
- No `pages/` router — `src/app` only
- No `any` — strict TS
- No brand hex in JSX — use CSS variables from `globals.css`
- No client exposure of `PIPE_PUBLIC_API_KEY`

---

## Cloudflare Infrastructure

All media is served from **Cloudflare R2** behind the CDN domain `media.amarjeetmishra.com`. Video bytes never pass through the app server.

| Service | Role |
|---------|------|
| **Cloudflare R2** | Object storage for every HLS ladder, poster, blur thumbnail, and editorial still. S3-compatible API. **Zero egress fees** — bandwidth is free, so growth doesn't tax delivery cost. |
| **Cloudflare CDN (Cache)** | Edge caching in front of R2. Aggressive cache headers; re-uploads use versioned paths (never overwrite) to avoid stale cache. Faster streaming in India via nearby edge. |
| **Cloudflare Workers** | Hosts the **Pipe** pipeline worker (`PIPE_API_URL`) — Hono API + D1 database that serves the public video manifests (`GET /api/v1/videos`). |
| **Cloudflare D1** | SQLite-backed DB behind the Pipe Worker — stores video metadata, manifests, and pipeline state. |

**Media conventions:**

- HLS master: `https://media.amarjeetmishra.com/assets/Videos/<project>/<n>/master.m3u8`
- Poster: `…/master.webp` (derived via `replace("master.m3u8", "master.webp")`)
- Blur placeholder: `…/blur-thumbnail.webp`
- Images allow-listed in `next.config.ts:4` (`remotePatterns: [{ hostname: "media.amarjeetmishra.com" }]`)

Why R2: egress pricing on traditional object storage penalizes success — the more people watch, the more you pay. R2 removes that tax. Storage + requests cost little; bandwidth is free.

---

## Pipe Integration

**Pipe** is the video pipeline that lives outside this repo at `~/Code/Projects/pipe` (Cloudflare Worker + D1 + R2 + Hono). This portfolio consumes it as a **read-only public API**.

### Current Integration (live)

- **Server ISR** — `src/lib/pipe/server.ts:7` (`getPortfolioItems`, `getPortfolioItemBySlug`) fetches `GET /api/v1/videos?limit=100&status=ready` with `next: { revalidate: 3600 }`. Falls back to static data when unconfigured or on any error.
- **Next proxy** — `src/app/api/pipe/[...path]/route.ts:5` (`GET` only) forwards to `${PIPE_API_URL}/api/v1/<path>` with `Authorization: Bearer <PIPE_PUBLIC_API_KEY>` injected server-side.
- **Client hooks** — `src/lib/pipe/hooks.ts:1` (`usePipeVideos`, `usePipeVideo`) + `src/lib/pipe/client.ts:7` (`pipeFetch`) hit `/api/pipe` via TanStack Query (`staleTime 5m`, `gcTime 60m`, `refetchOnWindowFocus: false`). Query keys centralized in `src/lib/pipe/queryKeys.ts:1`.
- **Mappers** — `src/lib/pipe/mappers.ts:34` (`toPortfolioItem`) adapts `PipePublicVideo` → `PortfolioItem`, preferring `formats.website.hls` else `cover.url`, deriving poster/blur by convention.
- **Config** — `src/lib/pipe/config.ts:4` (`getPipeConfig`) reads `PIPE_API_URL` + `PIPE_PUBLIC_API_KEY` (server-only; never `NEXT_PUBLIC_*`). `isConfigured` gates every Pipe call.

When `PIPE_API_URL` / `PIPE_PUBLIC_API_KEY` are unset, the entire app runs cleanly on static `portfolio-data.ts` — no errors, no empty states.

### Future / Planned

- **Typed RPC client** — share Pipe's `AppType` via workspace and switch from `fetch` + manual mappers to the typed Hono `hc` client (dep already present).
- **Per-project case-study writes** — replace `categoryNarratives` in `src/lib/portfolio-data.ts:320` with per-slug real write-ups; Pipe can carry `brief`/`approach`/`craft`/`outcome` fields.
- **Soorma FC case study** — real client placeholder at `src/lib/portfolio-data.ts:134` (`mediaUrl: ""`) — needs R2 HLS upload + Pipe manifest.
- **Gallery & stills via Pipe** — extend Pipe manifests to include gallery videos/images so case-study galleries come from the pipeline instead of static arrays.
- **Search / filter server-side** — push category/tag filtering into Pipe query params (`?category=…&tag=…`) once catalog grows; client hooks already accept query strings.
- **Webhooks / revalidation** — Pipe publish → `revalidateTag` / `revalidatePath` so new uploads appear instantly instead of at the next hourly ISR window.
- **Uploads from portfolio (admin)** — authenticated mutations (behind an admin route) that write directly to Pipe — currently read-only by design.

---

## Getting Started

```bash
cd PortfolioAmarV3
bun install
cp .env.example .env   # fill values (see below)
bun run dev            # http://localhost:3000
```

### Scripts

| Command | What it does |
|---------|--------------|
| `bun run dev` | Next.js dev server |
| `bun run build` | Production build (should be green before any commit) |
| `bun run typecheck` | `tsc --noEmit` |
| `bun run lint` | `biome check src/` |
| `bun run lint:fix` | `biome check --write src/` |

### Quality Gate (run before declaring done)

```bash
bun run typecheck && bun run lint && bun run build
```

---

## Environment Variables

Copy `.env.example` → `.env` and set the same vars in Vercel.

| Var | Required | Notes |
|-----|----------|-------|
| `RESEND_API_KEY` | **P0** | Resend transactional email (`re_…`) |
| `CONTACT_EMAIL` | **P0** | Destination for contact form; sender is `onboarding@resend.dev` until domain is verified (`src/app/api/contact/route.ts:40`) |
| `OPENROUTER_API_KEY` | optional | Powers `/api/chat` streaming chatbot; chat UI hidden if unset |
| `PIPE_API_URL` | optional | Pipe Worker URL (e.g. `https://pipe.<account>.workers.dev` or `http://localhost:8787`); when unset, app falls back to static data |
| `PIPE_PUBLIC_API_KEY` | optional | Server-only `read` scope key (120/min). **Never** `NEXT_PUBLIC_*` — injected server-side via `src/app/api/pipe/*` |

Media is never proxied through the app server — all HLS/posters stream from `https://media.amarjeetmishra.com` (R2).

---

## Project Structure

```
src/
├── app/
│   ├── layout.tsx           # fonts (Cormorant Garamond / DM Sans / Space Mono), CSS vars, grain, header/footer
│   ├── page.tsx             # Home: Hero, Ticker, StatsStrip, FeaturedWork, ServicesList, GalleryStrip, ContactCTA
│   ├── globals.css          # CSS variables — warm near-black #0B0908, gold #C9943A, editorial tokens
│   ├── about/page.tsx
│   ├── contact/page.tsx
│   ├── work/page.tsx + [slug]/page.tsx   # ISR revalidate=3600, generateStaticParams
│   ├── journal/page.tsx + [slug]/page.tsx
│   ├── learn/page.tsx
│   ├── api/contact/route.ts # Resend
│   ├── api/chat/route.ts    # OpenRouter streaming
│   └── api/pipe/[...path]/route.ts  # Pipe proxy (server key injection)
├── components/
│   ├── layout/Header.tsx, Footer.tsx, CustomCursor.tsx, FloatingWhatsApp.tsx
│   ├── home/Hero.tsx, FeaturedWork.tsx, ServicesList.tsx, GalleryStrip.tsx, etc.
│   ├── work/WorkGrid.tsx, VideoTile.tsx, StillTile.tsx, StillsLightbox.tsx
│   ├── video/HlsPlayer.tsx, ReelCard.tsx
│   ├── contact/ContactForm.tsx
│   ├── motion/Reveal.tsx, KineticText.tsx
│   └── chat/AmarChat.tsx
├── lib/
│   ├── data.ts              # brand, socials, services, journal — real content
│   ├── portfolio-data.ts    # 26 portfolio items + 38 stills (ISR fallback source)
│   ├── pipe/{client,server,hooks,queryKeys,mappers,config}.ts
│   └── utils.ts
├── stores/videoStore.ts     # Zustand single-playback contract
└── types/
```

---

## Deployment

- **Target:** Vercel — auto-deploys `main`, preview deploys for `feat/*`
- **Active branch:** `feat/amar-v4` (V4 redesign; `main` still holds v3)
- **Snapshot / rollback:** branch `snapshot/portfolio-v3-2026-08-28` at `4b6be07`, tags `portfolio-v3-final-2026-08-28` + `v3-snapshot-2026-08-28`
- **Build:** 45 routes (26 work ISR pages). No special Vercel config — just set env vars.
- **Images:** `next.config.ts:4` allow-lists `media.amarjeetmishra.com` for `next/image`.

---

## Roadmap

**P0 — before launch**

- [ ] Set `RESEND_API_KEY` + `CONTACT_EMAIL` and replace `onboarding@resend.dev` sender with verified domain
- [ ] Confirm `brand.email` / set `brand.whatsapp` in `src/lib/data.ts:38`
- [ ] Replace `brand.showreelUrl` test reel with real 2026 showreel (or `""` to hide)
- [ ] Verify R2 HLS URLs resolve; set `PIPE_API_URL` + `PIPE_PUBLIC_API_KEY`

**P1 — strongly recommended**

- [ ] Soorma FC case study + media (`src/lib/portfolio-data.ts:134`)
- [ ] Real testimonials (`src/lib/data.ts:143` — currently `[]`, section renders empty state)
- [ ] Per-project case-study copy (replace `categoryNarratives`)
- [ ] Pipe webhook → `revalidateTag` for instant publish

**P2 — nice to have**

- [ ] Per-project `year` sluglines, OG image / favicon polish
- [ ] Real journal posts (currently honest drafts — `src/lib/data.ts:294`)

---

## Credits

- **Design & Build** — [Parmjeet Singh](https://github.com/iamparmjeet) — architecture, design synthesis (8-phase workflow in `CLAUDE.md`), Next.js 16 + Tailwind v4 implementation, Pipe pipeline integration, and Cloudflare infrastructure.
- **Client & Brand** — **Amarjeet Mishra — Amar Editz** — freelance video editor, filmmaker & educator, Ludhiana, Punjab — [amarjeetmishra.com](https://amarjeetmishra.com) · [Instagram](https://www.instagram.com/edit_with_amar) · [YouTube](https://www.youtube.com/@AmarEditzOfficial) · [LinkedIn](https://www.linkedin.com/in/amarjeetmishra001/) · [Fiverr](https://www.fiverr.com/amarmishra008)
- **Institute** — [learnsimm.com](https://learnsimm.com) — Shiva Institute of Modern Media (SIMM), Punjab
- **Infrastructure** — [Cloudflare R2](https://developers.cloudflare.com/r2/) (storage + zero-egress CDN via `media.amarjeetmishra.com`), Cloudflare Workers + D1 (Pipe pipeline), [Vercel](https://vercel.com) (hosting), [Resend](https://resend.com) (email), [OpenRouter](https://openrouter.ai) (AI chat)
- **Stack credits** — Next.js, React, Tailwind CSS, Biome, next-video, Zustand, TanStack Query, Hono

---

## License

Private — all rights reserved. Portfolio content © Amarjeet Mishra.
