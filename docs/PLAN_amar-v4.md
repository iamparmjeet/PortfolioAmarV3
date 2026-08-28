# Amar V4 — File-by-File Implementation Plan
## Branch: feat/amar-v4  (from 4b6be07, tagged portfolio-v3-final-2026-08-28)
## Snapshot taken: 2026-08-28 | Tags: portfolio-v3-final-2026-08-28, v3-snapshot-2026-08-28 | Branch: snapshot/portfolio-v3-2026-08-28
### Status: PLAN ONLY — do not commit this file or any docs/* (per instruction, ship-loop planning phase without commits)

> This plan implements Amar V4 as a production-grade Next.js 14 App Router site (src/app) with TanStack Query + Hono RPC data layer that reads portfolio video manifests from the PIPE pipeline (Code/Projects/pipe), falling back to static portfolio-data.ts until PIPE is live.

---

## 0. Governance — ship-loop risk tier

**Tier: Medium** (multi-module feature, new data plane — portfolio now depends on external API + R2 pipeline — but no auth/payments/secrets mutation in this slice set).

Required docs (created but NOT committed on feat/amar-v4 until you approve):
- `docs/Handover.md` — continuity (done/in-progress/broken/next)
- `docs/Decisions.md` — why per slice
- `docs/Flow.md` — entry -> modules -> exit trace
- `docs/Constraints.md` — forbidden/required patterns
- `docs/Feature-amar-v4.md` — scoped slices + verification per slice
- `docs/Architecture.md` — system map after Phase 4 scaffold

Rollback target for every slice: `git revert <sha>` to previous commit on feat/amar-v4, or `git restore` branch to `snapshot/portfolio-v3-2026-08-28` (tag portfolio-v3-final-2026-08-28). Build breaks do not reach main until `npm run build && npx tsc --noEmit && npx biome check` pass.

---

## 1. Map — one paragraph flow

Entry `src/app/layout.tsx` (fonts + CSS vars + grain + header/footer) -> `src/app/page.tsx` (server component composes Hero, Ticker, StatsStrip, FeaturedWork, ServicesList, GalleryStrip, ContactCTA) -> `src/components/home/*` and `src/components/work/PortfolioCard` (each card: next/image poster, blur placeholder, category chip, HlsPlayer 9:16 tile that calls Zustand `requestPlay`) -> `src/app/work/[slug]/page.tsx` (ISR `revalidate=3600` + `generateStaticParams` from portfolio-data or PIPE API; renders CaseStudy with HlsPlayer via next-video/player) -> `src/app/api/contact/route.ts` (Resend) -> `src/lib/pipe/*` (typed Hono `hc` RPC client + TanStack Query hooks; public `/api/v1` read with API-key, proxy via Next route to avoid key leakage) -> PIPE Worker (D1+ R2, `@pipe/api`, `@pipe/db`, `@pipe/types`) -> R2 egress free via `media.amarjeetmishra.com` (never proxied through app server). Runner (`apps/runner`) is out-of-process; portfolio only consumes its output URLs.

---

## 2. Constraints (ask/one clarification before coding)

```
MUST use App Router only (no pages/ router)
MUST use next/image (all posters), never raw <img> for thumbnails
MUST use next-video/player for every HLS playback, never raw <video>
MUST use CSS variables from globals.css for all brand tokens (no style={{ color: '#...' }})
MUST use Zustand videoStore (src/stores/videoStore.ts) for single-video-at-a-time, no Context ref registry
MUST NOT invent fake testimonials — render empty state if array empty
MUST NOT expose Pipe API key in client bundle — proxy public reads via src/app/api/pipe/* or server fetch with ISR
MUST keep strict TypeScript (no any)
MUST run Biome (not Prettier) and keep husky/lefthook conventional commits (no emoji)
ASK — see open questions below before locking pipe env + fetch strategy
```

**Open questions — need your picks before Slice 1 (answer inline, I will adjust plan without extra ceremony):**

1. **Repo shape for amar-v4 scaffold:** The external folder `AmarV3/amar-v4` is already a complete Next scaffold. On feat/amar-v4 I propose to **overwrite PortfolioAmarV3 contents with that scaffold** (preserving .git + remote) so the deployment repo stays single-source (`git merge feat/amar-v4 -> main` = launch). Alternative: keep them as sibling projects and init a separate git at `AmarV3/`. Which do you prefer? **Recommended: overwrite-in-place.**

2. **Pipe integration depth:**
   - (a) Portfolio reads live from PIPE public API `/api/v1/videos` (ISR, key on server) with static `portfolio-data.ts` as fallback when `PIPE_API_URL` unset or 5xx.
   - (b) Keep static as primary and add an `/admin/library` that mirrors PIPE dashboard (separate admin route).
   **Recommended: (a) + light (b) — portfolio ISR from Pipe; admin page reuses Pipe Library component via embedded RPC.**

3. **Public API auth:** Pipe public reads require an API key (`read` scope, rate-limit 120/min). Options:
   - `PIPE_PUBLIC_API_KEY` as server-only env, portfolio ISR fetches via `fetch(PIPE_API_URL/api/v1/videos, { headers: { Authorization: Bearer ${key} } })` inside `getVideos()` (no client key).
   - or expose a Next route `src/app/api/pipe/[...path]/route.ts` that proxies and injects key.
   **Recommended: server ISR fetch (zero proxy latency, no client key).** OK?

4. **Pipe base URL env name:** Pipe uses `NEXT_PUBLIC_API_URL` for its own Worker. For portfolio, use `PIPE_API_URL` (server) + `NEXT_PUBLIC_PIPE_API_URL` (if direct client Hono RPC ever needed). Confirm prod Worker URL (e.g. `https://pipe.<account>.workers.dev`)?

5. **Admin/dashboard hosting:** Should portfolio include an authenticated `/studio` route that mounts Pipe's Library/Upload via shared `@pipe/api` AppType + TanStack, or keep Pipe dashboard at its own Vercel (`apps/web`) and portfolio purely public? **Recommended: keep separate for now; portfolio only consumes public API.** Add `src/app/(studio)/` later if needed.

6. **Next/TanStack versions:** Current PortfolioAmarV3 uses Next 16.2, React 19, motion 12. New spec asks Next 14.2 + React 18.3. I propose **Next 15.4 + React 19** unified with amar-v4 existing scaffold (already on Next 16) to avoid downgrade churn — still App Router compliant, ISR, typed. Pin `next ^15.x`, `react ^19`, `tanstack ^5`. OK, or must be 14.2?

Reply with e.g. `1a 2a 3server-ISR 4 PIPE_API_URL=https://... 5 separate 6 Next15 OK` and I proceed.

---

## 3. Synthesis decision (per CLAUDE.md guarderails)

| Axis | Decision | Taken from | Reason |
|------|----------|------------|--------|
| Color system | warm near-black #0B0908 -> #1A1714 + muted gold #C9943A | amar-v4 globals.css (Design A) | Richest ink depth, film-grade accent, not neon |
| Hero layout | kinetic skewY word reveal + mouse-follow glow, full min-h-screen, scroll hint strip | Design B + A | Editorial motion without stock image |
| Work grid | 9:16 vertical tiles, blur->poster, tap plays in place via Zustand, title/chip -> /work/[slug] | amarv3 + amar-v4 ReelCard | Instagram-native affordance, single playback |
| Typography | Cormorant Garamond 300 display, DM Sans body, Space Mono eyebrows | Design C/B + amar-v4 layout.tsx | A24-grade editorial pairing, readable at 14-16px |
| Navigation | fixed header, mono uppercase, live IST clock, gold Let's talk | Design A + amar-v4 Header | Film industry grade, minimal |
| Services | editorial rows with fill->outline number hover | Design B | Only non-card services treatment that scales to 6 items |
| About | portrait + bio + derived stats + client wall | Design A + amar-v4 stats | Honest stats derived from data, no vanity numbers |
| Contact | serif underline fields, Resend route, WhatsApp secondary CTA | Design A+C | Premium form, Indian market WhatsApp |
| Footer | giant Amar. wordmark, 4-col grid | Design A | Brand memory device |
| Signature motion | Screenplay case study FADE IN -> INT slugline -> ACT I/II/III -> FADE OUT | amar-v4 CaseStudy | Only element worth preserving verbatim |

---

## 4. Target folder structure (src/ root — best-practice modular)

```
src/
  app/
    layout.tsx
    page.tsx
    globals.css
    icon.svg
    not-found.tsx
    sitemap.ts / robots.ts
    work/[slug]/page.tsx        // ISR case study, generateStaticParams, HlsPlayer
    about/page.tsx
    contact/page.tsx
    journal/page.tsx + [slug]/page.tsx
    learn/page.tsx
    llms.txt/route.ts
    api/
      contact/route.ts          // Resend
      pipe/
        videos/route.ts         // server proxy (if needed) — inject PIPE_PUBLIC_API_KEY
        videos/[id]/route.ts
  components/
    layout/Header.tsx + Footer.tsx + CustomCursor.tsx + FloatingWhatsApp.tsx
    home/Hero.tsx + Ticker.tsx + StatsStrip.tsx + FeaturedWork.tsx + ServicesList.tsx + GalleryStrip.tsx + ContactCTA.tsx + ShowreelModal.tsx
    work/PortfolioCard.tsx + PortfolioGrid.tsx + CategoryFilter.tsx + CaseStudy/* (ScreenplayHeader, ActSection, Deliverables, Results)
    video/HlsPlayer.tsx + ReelCard.tsx
    contact/ContactForm.tsx + WhatsAppCTA.tsx
    chat/AmarChat.tsx
    motion/Reveal.tsx + KineticText.tsx
    ui/* (primitive buttons, inputs, labels — Radix where needed)
  lib/
    data.ts            // brand, socials, services, journal, learn, stats (no invented testimonials)
    portfolio-data.ts  // static fallback, enriched with gallery + narrative helpers, no UUID per render
    pipe/
      client.ts        // hc<AppType> typed RPC client (type-only AppType import, no server bundle)
      hooks.ts         // TanStack Query wrappers (usePipeVideos, usePipeVideo, usePipeCategories)
      queryKeys.ts     // central qk.* keys
      mappers.ts       // toPortfolioItem adapter: pipe public manifest -> PortfolioItem (HlsFormat -> mediaUrl/poster/blur)
      config.ts        // PIPE_API_URL, PIPE_PUBLIC_API_KEY getters (server-only)
      server.ts        // server fetch helpers for ISR: getPipeVideos(), getPipeVideoBySlug() with fallback to portfolio-data.ts
  stores/
    videoStore.ts      // Zustand single-video playback (required spec)
  types/
    index.ts           // PortfolioItem, GalleryImage, etc (single source; lib re-exports)
  hooks/               // co-located per-component hooks only if shared; else next to component file
```

Rules:
- `src/app` is the only hard App Router root.
- `components/` subfolders by domain, not file type.
- Co-locate component-specific hooks next to component (e.g. `components/home/useScrollHint.ts`).
- Barrel exports only at domain boundary (`components/home/index.ts` optional).
- No `any`, Zod for all API inputs (reuse `@pipe/types` schemas where possible).

---

## 5. Pipe linkage detail (what changes vs CLAUDE.md spec)

**Current spec assumes local static data:** `WorkGrid pulls projects from portfolio-data.ts, slugify title if no slug`.

**Revised with Pipe (please confirm Q2/Q3):**

- `src/lib/pipe/mappers.ts` adapts Pipe's `toPublicManifest` shape to Amar V4's `PortfolioItem`:
  - `pipe.formats.website.hls` -> `mediaUrl` (HLS master), derives `posterUrl` = `hls.replace('master.m3u8','master.webp')`, `blurUrl` = `hls.replace('master.m3u8','blur-thumbnail.webp')` (same convention R2 pipeline uses).
  - `pipe.categories[0]` -> `category`, `pipe.title` -> `title`/`client`, `pipe.cover.url` -> fallback poster if no HLS yet.
  - `slug` is canonical from Pipe (`video.slug`); versioning kept for cache-bust (`slug + /${version}/`).
- `src/lib/pipe/server.ts` exports:
  ```ts
  export async function getPortfolioItems(): Promise<PortfolioItem[]> {
    if (!process.env.PIPE_API_URL || !process.env.PIPE_PUBLIC_API_KEY) return allPortfolioItems; // fallback
    const res = await fetch(`${PIPE_API_URL}/api/v1/videos?limit=100&status=ready`, {
      headers: { Authorization: `Bearer ${PIPE_PUBLIC_API_KEY}` },
      next: { revalidate: 3600 },
    });
    if (!res.ok) return allPortfolioItems;
    const { videos } = await res.json();
    return videos.map(toPortfolioItem);
  }
  ```
- `src/app/work/[slug]/page.tsx`:
  ```ts
  export const revalidate = 3600;
  export async function generateStaticParams() {
    const items = await getPortfolioItems();
    return items.map(i => ({ slug: i.slug }));
  }
  ```
  Detail fetch tries Pipe `GET /api/v1/videos/:id` or `.../:slug/latest` before falling back to `getItemBySlug`.
- **TanStack + Hono RPC on client:** `src/lib/pipe/client.ts` + `hooks.ts` used only in client components (filter chips, live job polling on upload/admin, not needed for static grid). Grid itself stays server-fetched ISR for SEO.
- **Env:** `.env.example` adds `PIPE_API_URL` + `PIPE_PUBLIC_API_KEY` (server). Never `NEXT_PUBLIC_` for the key. `NEXT_PUBLIC_PIPE_API_URL` only if direct browser Hono RPC needed in studio route.
- **ISR vs CSR split:** Portfolio pages are ISR (server), interactive islands (CategoryFilter, ReelCard play button) are `use client` islands with Zustand + TanStack where live.

This keeps video bytes on R2, never through Next server, and respects Pipe rate limiting (server ISR caches for 1h, so ~24 requests/day per page, not per visitor).

---

## 6. File-by-file commit plan (atomic, no emoji, conventional commits)

Each row = one `git commit`. Messages use hooks: `feat:`, `fix:`, `chore:`, `refactor:`, `docs:` — present tense, scoped. No emoji. Each commit should build (`npm run build` + `tsc --noEmit`) green before next.

| # | Commit message | Files touched (create/modify) | Notes / verification |
|---|----------------|-------------------------------|----------------------|
| 0 | `chore: snapshot portfolio v3 at 4b6be07 with branch and tags` | (already done) branch `snapshot/portfolio-v3-2026-08-28`, tags `portfolio-v3-final-2026-08-28`, `v3-snapshot-2026-08-28`; stash of next-env delta | Done 2026-08-28. Push when ready: `git push origin snapshot/portfolio-v3-2026-08-28 --tags` |
| 1 | `chore: scaffold amar-v4 base — Next App Router, Tailwind v4, Biome, TS strict` | `package.json`, `tsconfig.json`, `biome.json`, `next.config.ts`, `postcss.config.mjs`, `.env.example`, `src/app/globals.css`, `src/app/layout.tsx` skeleton, `src/lib/utils.ts` | From amar-v4 scaffold. Set CSS var names per globals.css spec. Run `bun install && npm run typecheck` |
| 2 | `feat: add design tokens and global styles with phase-1 derived CSS variables` | `src/app/globals.css` | Values per audit — bg #0B0908, surface, accent #C9943A, display/body/mono fonts, radii, transitions. Grain overlay, eyebrow, marquee primitives |
| 3 | `feat: add brand data layer and types with real content and TODO gaps` | `src/types/index.ts`, `src/lib/data.ts`, `src/lib/portfolio-data.ts` | Port from data.ts + portfolio-data.ts (static fallback). Add Soorma FC placeholder, no fake testimonials, mark `// TODO: populate` for whatsapp/showreel/hlsUrl. Export `getItemBySlug`, `siteStats`, `clients` |
| 4 | `feat: add video playback store for single-video-at-a-time` | `src/stores/videoStore.ts` | Exact Zustand snippet from spec. No Context. |
| 5 | `feat: add typed Pipe client and server fetch helpers with static fallback` | `src/lib/pipe/config.ts`, `src/lib/pipe/client.ts`, `src/lib/pipe/mappers.ts`, `src/lib/pipe/server.ts`, `src/lib/pipe/queryKeys.ts`, `src/lib/pipe/hooks.ts`, `.env.example` (PIPE vars) | Type-only `import type { AppType } from '@pipe/api'`? Actually local copy of AppType or install `@pipe/types` as workspace dep. For portfolio isolation, copy minimal types or add `dependencies: @pipe/types@*` if monorepo linkage desired. Hooks wrap `hc` + `useQuery` with `refetchInterval` and optimistic deletes as in pipe web |
| 6 | `feat: implement root layout with fonts, grain, header, footer, analytics` | `src/app/layout.tsx`, `src/components/layout/Header.tsx`, `src/components/layout/Footer.tsx`, `src/components/layout/CustomCursor.tsx`, `src/components/layout/FloatingWhatsApp.tsx` | next/font Cormorant_Garamond/DM_Sans/Space_Mono, personJsonLd, Vercel analytics. Header: mono nav, IST clock, gold CTA. Footer: Amar. wordmark |
| 7 | `feat: implement home hero with showreel trigger and scroll indicator` | `src/components/home/Hero.tsx`, `src/components/home/ShowreelModal.tsx`, `src/components/motion/KineticText.tsx`, `src/components/motion/Reveal.tsx` | `min-h-screen`, `--font-display`, showreel button gated on brand.showreelUrl, HlsPlayer modal via videoStore, subtle grain gradient |
| 8 | `feat: add home ticker, stats strip and services list` | `src/components/home/Ticker.tsx`, `src/components/home/StatsStrip.tsx`, `src/components/home/ServicesList.tsx` | Stats derived live from lib (not hardcoded). Services editorial rows with hover number |
| 9 | `feat: implement video player components wired to video store` | `src/components/video/HlsPlayer.tsx`, `src/components/video/ReelCard.tsx` | Uses next-video/player, `useVideoStore` contract (requestPlay + useEffect pause on eviction), ref via playerRef, playsInline, accent var |
|10 | `feat: add featured work grid with category filter and case study links` | `src/components/work/PortfolioCard.tsx`, `src/components/work/PortfolioGrid.tsx`, `src/components/work/CategoryFilter.tsx`, `src/components/home/FeaturedWork.tsx` | Server fetch via getPortfolioItems() (Pipe with fallback). Card: next/image thumb + gold hover border + title overlay -> /work/[slug]. Filter is client island using TanStack pipe hooks or static categories |
|11 | `feat: add gallery strip for editorial stills` | `src/components/home/GalleryStrip.tsx`, `src/components/work/GalleryGrid.tsx` | Pulls from imagesGallery, horizontal scroll + lightbox affordance, next/image fill+sizes |
|12 | `feat: implement work case study page with ISR and HLS gallery` | `src/app/work/[slug]/page.tsx`, `src/components/work/CaseStudy/*` | `revalidate=3600`, `generateStaticParams` from Pipe or static, HlsPlayer for galleryVideos, R2 hygiene notes, fallback when hlsUrl empty |
|13 | `feat: add contact section with form, WhatsApp CTA and social links` | `src/components/contact/ContactForm.tsx`, `src/components/contact/WhatsAppCTA.tsx`, `src/components/home/ContactCTA.tsx`, `src/app/contact/page.tsx` | Controlled inputs via useState idle/sending/success/error, POST /api/contact, socials filtered by http, WhatsApp wa.me link gated on brand.whatsapp |
|14 | `feat: add contact API route with Resend` | `src/app/api/contact/route.ts` | Exact snippet from spec, env RESEND_API_KEY, CONTACT_EMAIL, replyTo, 400/500 handling |
|15 | `feat: add testimonials guard and empty state` | `src/components/home/Testimonials.tsx` (gated) | Render only if testimonials.length>0 && !isPlaceholder |
|16 | `feat: add about, journal, learn and static routes` | `src/app/about/page.tsx`, `src/app/journal/{page.tsx,[slug]/page.tsx}`, `src/app/learn/page.tsx`, `src/app/sitemap.ts`, `src/app/robots.ts`, `src/app/llms.txt/route.ts`, `src/app/not-found.tsx` | About portrait+bio+client wall, journal ISR, learnsimm modules |
|17 | `feat: add chat and polish interactions` | `src/components/chat/AmarChat.tsx` | Optional AI chat via @ai-sdk/openai, guarded by env |
|18 | `chore: configure pipe API proxy for client reads if needed` | `src/app/api/pipe/[...path]/route.ts` (only if Q3 picks proxy) | Injects PIPE_PUBLIC_API_KEY server-side, forwards to Pipe Worker, returns public manifest |
|19 | `chore: update next.config, env examples and deployment notes` | `next.config.ts` (remotePatterns for media.amarjeetmishra.com), `.env.example` (RESEND_API_KEY, CONTACT_EMAIL, PIPE_API_URL, PIPE_PUBLIC_API_KEY), `README.md` | Document `bun install && bun run dev`, `PIPE_MODE` toggle |
|20 | `chore: quality gate — typecheck, biome and production build` | — | `npx tsc --noEmit`, `npx biome check src/`, `npm run build` — fix any remaining errors, generate `HANDOFF.md` |

**PP post-scaffold file count:** ~45 files. Each commit is `git add <those files> && git commit -m "<message>"` — no bundling, no emoji.

TanStack best practices baked in:
- Query keys centralized (`qk.pipeVideos`, `qk.pipeVideo(slug)`) with `queryKeyFactory`.
- `useQuery` enabled gated on PIPE_API_URL presence, `staleTime` 5m, `gcTime` 1h, `refetchOnWindowFocus false` for static grids.
- `useMutation` optimistic updates for any studio admin mutations (delete video, clear mock) with `onMutate` rollback as in `pipe/apps/web/lib/hooks.ts`.
- `hc` client init with `credentials: include` only for dashboard studio; public reads use server fetch with `next: { revalidate }` (no cookie).

Modularity best practices:
- Domain folders (`components/home`, `components/work`, `components/video`) not tech folders.
- Each domain `index.ts` re-exports only public API.
- Hooks co-located (`components/work/usePortfolioFilters.ts`) when single-use; shared hooks in `src/hooks/`.
- Zod at boundaries (form + Pipe mapper), strict props interfaces per component.
- Server components default; `use client` only for `HlsPlayer`, `CategoryFilter`, `ContactForm`, `Header` clock.

---

## 7. Next steps after plan approval

1. You confirm Q1–Q6 (or say `proceed with recommended defaults`).
2. I apply the stash pop decision: keep `next-env.d.ts` change popped or discarded on feat/amar-v4 (currently stashed).
3. Slice 1 execution: overwrite PortfolioAmarV3 working tree with amar-v4 scaffold files (without committing plan/docs), then commit #1 per table above. Continue slice-by-slice, verifying each build before next, asking for approval at Medium-tier plan gates if behavior drifts.
4. After Slice 20, run Quality Gate (tsc + biome + build), then write final `HANDOFF.md` (design decisions, data gaps, TODOs P0/P1/P2, how to run, Vercel env) — again not committing docs until you say so.

---

## 8. Handover template for this branch (draft, not committed)

```md
## Handover - 2026-08-28 HH:MM - model: muse-spark-1.2
Done: Snapshot PortfolioAmarV3 at 4b6be07 -> snapshot/portfolio-v3-2026-08-28 + tags portfolio-v3-final-2026-08-28 / v3-snapshot-2026-08-28; branched feat/amar-v4; plan drafted (PLAN_amar-v4.md) awaiting approval — no code yet.
In-progress: Plan review — awaiting answers to Q1–Q6 (repo shape, Pipe depth, key handling, env names, studio scope, Next version).
Broken: Pipe Runner not yet exercised end-to-end (needs R2 creds + ffmpeg); amar-v4 .next cache from sibling folder not relevant to PortfolioAmarV3 repo.
Avoid: Do not push tags/branches until user approves; do not commit docs/*; do not expose PIPE_PUBLIC_API_KEY as NEXT_PUBLIC_; do not use raw <video>.
Next: Pop stash if desired, start Slice 1 scaffold on user approval (git add per file-by-file table).
```
