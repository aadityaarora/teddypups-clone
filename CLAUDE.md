# TeddyPups clone

Goal: pixel-accurate clone of https://puppy.instabizweb.com (design, layout, responsiveness, behaviour).
Stack: Next.js 16 App Router, TypeScript, Tailwind CSS v4, motion, embla-carousel-react, zod. Deploy on Vercel.

## Reference material (source of truth, read before building anything)
- `docs/DESIGN.md`: measured tokens. Fonts: Fraunces (headings), Figtree (body), Shantell Sans (handwritten labels).
- `app/globals.css`: tokens already set up (`bg-milk`, `text-cocoa`, `font-display`, `font-hand`, `shadow-pop`, `.btn-primary`, `.container-site`, `.section`, `.h-display`...). Use these, add new tokens here only if a measured value is missing.
- `recon/html/*.html`: raw HTML of every page. Copy text VERBATIM from here. Original class names hint at structure.
- `recon/rsc/*.txt`: Next.js RSC payload per page, contains the structured data (puppies, images, videos).
- `recon/css/_all.css`: the original compiled CSS. Grep it for exact values (keyframes, cursor, hover, transitions).
- `recon/shots/{mobile,tablet,desktop}/*.png`: visual truth at 390 / 768 / 1440. Open these images and match them.
- `public/`: real assets at the same paths as the original (`/media/...`, `/brand/logo.png`).

## Routes
`/`, `/puppies` (filters `?origin=local|imported`, `?breed=`), `/puppies/[slug]`, `/happy-families`, `/how-it-works` (has `#delivery`), `/faq`, `/gone-home`, `/contact`.

## Global UI
Top tagline "every puppy is family", skip link, header (logo + nav + WhatsApp CTA + Menu button), mobile drawer ("where to, friend?" + Close), footer ("Home, at last.", Explore, Say hello, socials), mobile sticky bar (WhatsApp us + Call), custom cursor (see recon css/html, hidden on touch).
WhatsApp: https://wa.me/971541676733 with prefilled `text`. Detail pages prefill "Hi TeddyPups! I'm interested in {name}, the {breed}: {url}".

## Rules
- Never invent copy, colours or spacing. Take them from recon files.
- Server Components by default. `"use client"` only for carousel, drawer, accordion, gallery, cursor, forms, filters.
- `next/image` for every image with proper `sizes`. Images are local under `public/`.
- Data lives in `lib/data/*.ts`, typed. Pages read from there.
- Forms: Server Action + zod, hidden honeypot field named `website`, success + error state.
- Mobile-first. Every page must have no horizontal scroll at 390px.
- Respect `prefers-reduced-motion`.

## Verify loop (do this after every page)
1. `npm run dev` running on :3000
2. `node tools/shots.mjs http://localhost:3000 /<route>` -> writes `recon/local/{mobile,tablet,desktop}/<slug>.png`
3. Open both `recon/shots/...` and `recon/local/...` images, list differences, fix, repeat until close.
4. `git add -A && git commit -m "<page>: done"`

## Prompt log
Append every prompt the user gives you to `docs/PROMPTS.md` with a timestamp before you start working on it.
