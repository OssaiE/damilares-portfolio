# AreyouDami. — Portfolio

Cinematic, editorial portfolio for **Damilola Olawoyin** (AreyouDami.), creative
director & editor based in Lagos. Built from the Figma source as a pixel-faithful,
production-quality single-page experience.

## Tech stack

- **Next.js 16** (App Router, React 19, Turbopack) — statically prerendered
- **TypeScript**
- **Tailwind CSS v4** (CSS-first config via `@theme` in `globals.css`)
- **Motion** (Framer Motion) for reveals, the menu, and interactions

## Getting started

The folder name contains an apostrophe, so run npm with `--prefix` (or `cd` in first):

```bash
npm --prefix "Damilare's Portfolio" run dev     # http://localhost:3000
npm --prefix "Damilare's Portfolio" run build   # production build
```

## Structure

```
src/
  app/
    layout.tsx        Root layout — Inter (next/font), metadata, <MotionConfig>
    page.tsx          Home composition + skip link
    globals.css       Design tokens, @font-face, base styles, utilities
    icon.svg          Brand favicon
  components/
    SiteChrome.tsx    Client island: clapperboard nav + cursor
    Providers.tsx     <MotionConfig reducedMotion="user">
    icons.tsx         Hand-built SVG icon set
    layout/           Header (clapperboard nav), Footer
    sections/         Hero, FeaturedWorks
    ui/               BackgroundVideo, VideoScrubber, MaskedWordmark,
                      FramingGuides, CustomCursor, Wordmark, ClapperMenuIcon
  lib/
    site.ts           Single source of truth for all copy, nav, works, meta
    clap.ts           Synthesized clapper "clap" (Web Audio, reduced-motion safe)
```

## Design system

| Token             | Value     | Use                    |
| ----------------- | --------- | ---------------------- |
| `--color-primary` | `#FFCC00` | Brand yellow           |
| `--color-ink`     | `#111111` | Background / black     |
| `--color-paper`   | `#FFFFFF` | White / text           |
| `--color-subtext` | `#8E8E93` | Muted labels           |

Fonts: **Oriya Sangam MN** (display) + **Inter** (UI/body).

## Signature interactions

- **Clapperboard nav** — the bar bends ~2.78° (hinged at its bottom-left) as the
  drawer springs open and the page blurs behind it; the hamburger rotates and
  morphs into an ×; selecting an item snaps it shut ("Action!") with a subtle
  synthesized clap. All spring-driven; sound + motion are reduced-motion safe.
- **Particle wordmark** — "AreyouDami." is a dense field of ~45k yellow
  particles composited with `mix-blend-mode: exclusion` against the footage (the
  hero `<section>` is `isolate` so the blend resolves against the video, not a
  transparent backdrop). At rest the field is dense enough to read as solid type;
  the pointer gently repels the local particles so only the area you move over
  dissolves into particles and reforms behind you — no mask, no dark blob. The
  canvas carries headroom above the type so displaced particles are never clipped
  at the top. Disabled on coarse pointers / reduced motion (SVG type shows).
- **Lens selector** — the `135 / 50 / 35mm` chips reframe the hero footage with
  a dramatic spring zoom (over-shoots, then settles) plus a brief focus-pull blur.
- **Click-to-play reel** — the hero shows a camera-lens cursor ("SHOWREEL") and
  clicking anywhere opens a modal that plays the full 30s reel with sound.
- **Working scrubber** — the Featured Works transport really drives the video
  (play/pause + seek, keyboard accessible).
- **Menu viewfinder** — opening the clapper reveals a subtle camera focus overlay
  (rule-of-thirds grid, autofocus reticle that locks, edge guides, focus breathing).
- **Collaborator cursor** in the footer, framing guides, grain, staggered reveals.

## Accessibility & performance

- Semantic landmarks, skip link, ARIA on the slider/menu/lens controls, Escape +
  scroll-lock on the menu, keyboard-visible focus rings.
- `prefers-reduced-motion` honored globally (`MotionConfig reducedMotion="user"`);
  background videos fall back to their poster still.
- Video: `webm` + faststart `mp4`, `preload` tuned, plays only in view, poster +
  blur placeholder for graceful loading.
- Self-hosted subset fonts (~6.5 KB each), statically prerendered page.

## ⚠️ Asset notes (action needed before public launch)

1. **Display font licensing.** `Oriya Sangam MN` is an Apple system font,
   self-hosted here (`public/fonts/`, subset to Latin) for exact fidelity to the
   Figma. **Resolve licensing or swap for a licensed grotesque before shipping
   publicly.** Swap point: the `@font-face` + `--font-display` in `globals.css`.

2. **Footage.** The hero background + reel modal use the supplied 30s showreel
   (`showreel-bg.mp4` muted/clear ~20 MB for the loop; `showreel.mp4` ~39 MB with
   audio for the modal). The showreel background is intentionally kept clear, so
   it's heavier than a typical hero loop — dial the CRF up if you want it lighter.
   The Palmwine section still uses the earlier vertical BTS clip
   (`palmwine.*`) as a placeholder — swap in real documentary footage via the
   `featuredWorks` entry in `src/lib/site.ts`.

3. **Other routes.** Only the Home page was designed. The menu links
   (Works / Contact / About) need designs before those routes are built.
