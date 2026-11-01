# TeddyPups clone

A pixel-accurate rebuild of [puppy.instabizweb.com](https://puppy.instabizweb.com), a Dubai teacup-puppy boutique site, made as a front-end assessment. The goal is to match the reference's design, layout, responsiveness and behaviour at 390 / 768 / 1440 px.

**Live:** _TBD (Vercel URL goes here)_

> **Content notice.** All images, videos, puppy listings and copy in this repo come from the reference site and are used only for this assessment. They are not mine and this is not a real shop.

## Status

| Area | State |
| --- | --- |
| Global layout: skip link, header, mobile drawer, footer, mobile WhatsApp/Call bar | Done |
| Custom cursor (CSS paw cursor + canvas paw-print trail) | Done |
| Home hero | Done, within 0.3% of the reference pixels at all three sizes |
| Rest of home, `/puppies`, `/puppies/[slug]`, `/happy-families`, `/how-it-works`, `/faq`, `/gone-home`, `/contact` | Not started |
| Intro curtain animation, interactive Teddy mascot, lineup rotation, Lenis smooth scroll | Not built yet (static fallbacks are in place) |

## Stack

- [Next.js 16](https://nextjs.org) App Router (Turbopack, Cache Components), React 19, TypeScript
- Tailwind CSS v4 plus the reference site's own component CSS, ported rule-for-rule
- `next/font` (Fraunces, Figtree, Shantell Sans with their variable axes), `next/image`
- motion, embla-carousel-react, zod (for upcoming pages and forms)
- Playwright + sharp for screenshot-based visual QA

## Folder structure

```
app/
  layout.tsx          Fonts, skip link, Header, <main>, Footer, WhatsApp bar, paw trail
  page.tsx            Home (hero only for now)
  globals.css         Theme tokens, base styles and components from the original CSS
  styles/chrome.css   Header, menu, hero, lineup, mascot and footer rules (original values, grouped and commented)
components/
  layout/             Header, HeaderBehavior (scroll hide/show), NavLink, MobileMenu, Footer, WhatsAppBar
  home/Hero.tsx       Hero copy, puppy lineup, peeking Teddy, quilt
  cursor/PawTrail.tsx Canvas paw-print trail
  art/                Static Teddy SVGs (pup-svgs.ts) and the PupStop wrapper
  media/MediaImage.tsx next/image with the original focal point, colour and blur placeholder
  icons/Paw.tsx
lib/
  data/               Typed content: puppies.ts (generated), testimonials.ts, faqs.ts, site.ts
  hooks.ts            useReducedMotion
public/
  media/, brand/, cursor/   Assets at the same paths as the reference site
docs/
  DESIGN.md           Measured design tokens
  cursor.md           How the reference cursor and puppy videos work
  PROMPTS.md          Log of prompts used to build this with AI tools
tools/                Recon and QA scripts (below)
recon/                Local only, git-ignored: raw HTML, RSC payloads, CSS, JS and screenshots of the reference
```

## Running it

Requires Node 20+.

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # production build
npm run start        # serve the production build
npm run lint
```

The visual QA scripts use Playwright's Chromium. Install it once with `npx playwright install chromium`.

`recon/` is not in git. To regenerate it from the live reference site:

```bash
node tools/recon.mjs        # pages, RSC data, assets
node tools/recon-css.mjs    # stylesheets, tokens, cursor and video notes
node tools/shots.mjs        # reference screenshots
```

## tools/

| Script | What it does |
| --- | --- |
| `recon.mjs` | Crawls the reference site (sitemap and links). Saves each page's HTML and its Next.js RSC payload, downloads every image and video into `recon/public/`, and writes `recon/report.md` and `recon/pages.json`. |
| `recon-css.mjs` | Finds every `/_next/static/**/*.css` link and inline `<style>` in the saved HTML (Next 16 serves CSS from `/chunks/`). Downloads them into `recon/css/` and `_all.css` with fonts, writes `recon/tokens.json`, and appends colours, CSS variables, keyframes, cursor rules and video URLs to the report. |
| `extract-data.mjs` | Parses the RSC payloads and generates typed `lib/data/puppies.ts`, `testimonials.ts` and `faqs.ts`. Copy is kept verbatim. |
| `pick-css.mjs` | Pulls rules out of the original compiled CSS by selector regex, keeping their `@media`/`@supports` wrappers and named `@keyframes`. Used to port component styles exactly. |
| `shots.mjs` | Full-page Playwright screenshots at 390 / 768 / 1440. Without arguments it shoots the reference into `recon/shots/`. `node tools/shots.mjs http://localhost:3000 /route` shoots the local build into `recon/local/`. |
| `diff.mjs` | Pixel diff of the top N px of two screenshots. Prints the percentage of differing pixels and the hot 50 px bands, and can write a red-highlight diff image. |
| `crop.mjs` | Crops a vertical slice of a tall screenshot for inspection. |
| `menu-check.mjs` | Opens and closes the mobile drawer on the local build, screenshots it, and reports console errors. |
| `style-snapshot.mjs` | Dumps the computed styles of every element (and its pseudo-elements) at all three sizes. `--compare a.json b.json` proves a CSS refactor changed nothing. |

## Verify loop

After each page:

1. `npm run dev`
2. `node tools/shots.mjs http://localhost:3000 /<route>`
3. Compare `recon/shots/<size>/<page>.png` with `recon/local/<size>/<page>.png` (`node tools/diff.mjs ...`), fix, repeat.
4. Commit.

On Windows Git Bash, prefix step 2 with `MSYS_NO_PATHCONV=1` so `/route` isn't rewritten to a Windows path.
