# CLAUDE.md

AreyouDami. — cinematic portfolio for Damilola Olawoyin. Next.js 16 (App Router) +
TypeScript + Tailwind v4 + Motion. See `README.md` for full detail.

## Working here

- Folder name has an apostrophe — run npm with `--prefix "Damilare's Portfolio"`.
- Tailwind v4: **no `tailwind.config`**. Tokens live in `@theme` in
  `src/app/globals.css`. Colors: `primary #FFCC00`, `ink #111`, `paper #fff`,
  `subtext #8E8E93`. Fonts: `--font-display` (Oriya Sangam MN), Inter via next/font.
- All copy/content is in `src/lib/site.ts` — edit there, keep components presentational.
- Sections are client components (video/motion); chrome is the `SiteChrome` client
  island (`Header` = self-contained clapperboard nav with bar/drawer/blur, + cursor)
  so page content can stay server-rendered.
- Nav bend is exactly `-2.78°` hinged bottom-left; clap sound is `lib/clap.ts`
  (Web Audio, plays on shut only, silent under reduced-motion). Logo: `public/logo.svg`.

## Conventions

- Reveal easing is expo-out `[0.16, 1, 0.3, 1]`.
- Reduced motion is global via `MotionConfig reducedMotion="user"` — don't hand-roll.
- Prefer transforms/opacity (GPU) over layout animation.

## Open items (see README "Asset notes")

1. Oriya Sangam MN is self-hosted for fidelity — resolve licensing before public launch.
2. Only one (vertical, BTS) video provided; swap in final hero + Palmwine footage.
3. Only Home is designed; Works/Contact/About need designs.
