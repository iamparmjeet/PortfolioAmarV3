# Amar V4 — Handoff Report

Production-grade Next.js 16 App Router portfolio, synthesized from three design explorations and live data, now with Pipe pipeline integration.

## 1. Design decisions made

| Axis | Source design | What was taken |
|------|---------------|----------------|
| Color system | **A** (`amarv2`) | Warm near-black `#0B0908 -> #1A1714`, muted gold `#C9943A` |
| Hero | **B** + **A** | Kinetic skewY word reveal; mouse-follow glow; scroll-hint strip |
| Work grid | **C** (`amarv3`) + Instagram | 9:16 vertical tiles with blur→poster, tap plays in place via Zustand store |
| Typography | **C** / **B** | Cormorant Garamond 300 display · DM Sans body · Space Mono eyebrows |
| Navigation | **A** | Fixed header, mono uppercase, live IST clock, gold Let's talk CTA |
| Services | **B** | Editorial rows with fill→outline number hover |
| About | **A** | Portrait + bio + derived stats + client wall |
| Contact | **A** + **C** | Serif underline fields; Watermark success state; WhatsApp secondary CTA |
| Footer | **A** | Giant `Amar.` wordmark, 4-col grid |
| Signature element | **C** | Screenplay case studies: `FADE IN:` → `INT.` slugline → Act I/II/III → `FADE OUT.` |

All 26 portfolio items, ~38 stills, and social links (Instagram, YouTube, Fiverr, LinkedIn) come from real `data.ts` / `portfolio-data.ts`. No fake testimonials; stats derived live from data.

## 2. Data gaps found (need populating before launch)

- `brand.whatsapp` (`src/lib/data.ts:38`) — WhatsApp CTA wired but hidden until set (`919XXXXXXXXX`).
- `brand.showreelUrl` — currently test reel (`amar-in-action/1/master.m3u8`); replace with real 2026 showreel or set to `""` to hide button.
- `brand.email` — `hello@amarjeetmishra.com`; confirm live.
- **Soorma FC** (`src/lib/portfolio-data.ts:132`) — real client placeholder with `mediaUrl: ""`; needs R2 HLS upload + brief/approach/results.
- Per-project case-study narrative — every `/work/[slug]` renders film + "coming soon" block until real write-ups land.
- Testimonials (`src/lib/data.ts:143`) — array empty; section renders nothing until real quotes exist.
- Services wording — adapted from designs; confirm copy.
- Pipe API — `PIPE_API_URL` + `PIPE_PUBLIC_API_KEY` server envs needed for live reads; fallback to static data when unset (see `src/lib/pipe/server.ts:1`).

## 3. TODOs by priority

**P0 — blocks launch**
1. Set `RESEND_API_KEY` + `CONTACT_EMAIL` envs and replace `onboarding@resend.dev` sender with verified domain (`src/app/api/contact/route.ts:40`).
2. Confirm `brand.email` and add WhatsApp number.
3. Verify R2 HLS URLs still resolve (grid and case pages stream them directly).
4. Set `PIPE_API_URL` + `PIPE_PUBLIC_API_KEY` for live Pipe reads (or keep static fallback).

**P1 — strongly recommended**
5. Write Soorma FC case study and upload its film.
6. Add real testimonials.
7. Add showreel and re-enable hero reel button.
8. Replace category-derived case-study narrative (`categoryNarratives` in `portfolio-data.ts`) with per-project write-ups.

**P2 — nice to have**
9. Per-project `year` fields for sluglines.
10. OG image / favicon polish.
11. Real journal posts for `/journal` (currently honest drafts).

**Media conventions** — posters derived from HLS path: `…/master.m3u8` → `…/master.webp` (poster) and `…/blur-thumbnail.webp` (blur placeholder). Any new upload following this convention gets tiles for free. Pipe's `formats.website.hls` → `mediaUrl` mapping respects same convention via `src/lib/pipe/mappers.ts:20`.

## 4. How to run

```bash
git checkout feat/amar-v4
bun install
cp .env.example .env  # fill RESEND_API_KEY, CONTACT_EMAIL, PIPE_API_URL, PIPE_PUBLIC_API_KEY, OPENROUTER_API_KEY
bun run dev        # http://localhost:3000

bun run typecheck  # tsc --noEmit
bun run lint       # biome check src/
bun run build      # production build — 45 routes (26 work ISR pages)
```

Env: `GMAIL_*` no longer required (legacy `src/lib/env.ts` removed). Required now: `RESEND_API_KEY`, `CONTACT_EMAIL`, optional `PIPE_API_URL`/`PIPE_PUBLIC_API_KEY` (server-only), `OPENROUTER_API_KEY` for chat.

## 5. Deployment notes

- **Vercel-ready** — no special config. Env vars needed: `RESEND_API_KEY`, `CONTACT_EMAIL`, `PIPE_API_URL`, `PIPE_PUBLIC_API_KEY`, `OPENROUTER_API_KEY`.
- `/work/[slug]` uses ISR `revalidate = 3600` with `generateStaticParams` — 26 pages prerender at build, revalidate hourly.
- All media streams from Cloudflare R2 (`media.amarjeetmishra.com`); video bytes never touch app server. `next/image` allow-listed in `next.config.ts:4`.
- Single-video-at-a-time enforced via Zustand store (`src/stores/videoStore.ts:1`); every player goes through `src/components/video/HlsPlayer.tsx:1` (next-video — no raw `<video>`).
- Pipe proxy at `src/app/api/pipe/[...path]/route.ts:1` injects key server-side; client hooks in `src/lib/pipe/hooks.ts:1` use `/api/pipe` with TanStack Query (staleTime 5m, `refetchOnWindowFocus: false`). Server ISR helpers in `src/lib/pipe/server.ts:1` try Pipe then fallback to `allPortfolioItems`.
- Stack: Next 16.2 · React 19 · Tailwind v4 (CSS-first tokens in `globals.css`) · Biome 2.4 · next-video 2.8 · zustand 5 · resend 6 · tanstack-query 5 · hono 4.

## 6. Branch / snapshot

- Snapshot of deployed v3: branch `snapshot/portfolio-v3-2026-08-28` at `4b6be07`, tags `portfolio-v3-final-2026-08-28` + `v3-snapshot-2026-08-28` — already pushed to `origin`.
- New work: branch `feat/amar-v4` (8 commits pushed). Diff from snapshot is 10 → 45 routes, new data layer, Pipe integration, and full cinematic UI. To launch: merge `feat/amar-v4` → `main` (or rename branch to `main` on Vercel) after env vars set.

## 7. TanStack / modularity best practices applied

- Query keys centralized (`src/lib/pipe/queryKeys.ts:1` factory `qk.*`).
- Server ISR fetch with `next: { revalidate: 3600 }` for SEO; client hooks optional for islands (filters) with `enabled` guards, `staleTime`/`gcTime`, and optimistic updates pattern (as in Pipe web `lib/hooks.ts`).
- Hono `hc` client type-only `AppType` import avoided in portfolio to keep bundle lean; portfolio uses fetch + Zod-ready mappers instead; `hono` kept as dep for future typed RPC if Pipe `AppType` is shared via workspace.
- Domain folders (`components/home`, `components/work`, `components/video`, `lib/pipe`) not tech folders; co-located hooks next to components when single-use.
- Server components default; `"use client"` only where needed (HlsPlayer, CategoryFilter, ContactForm, Header clock).
- Strict TypeScript, no `any`, `cn` via `clsx` + `tailwind-merge`.
