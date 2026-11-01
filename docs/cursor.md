# Custom cursor (reverse-engineered from recon)

Sources: `recon/css/_all.css`, `recon/js/04u0_mknmf3rz.js` (module 50985 `PawTrailCanvas`),
`recon/js/177ya708_1zuj.js` (module 49054 paw path, module 18535 reduced-motion hook).

The cursor is two independent layers. There is no DOM "follower" div.

## 1. Native CSS cursor (SVG paw)

```css
@media (hover:hover) and (pointer:fine) and (prefers-reduced-motion:no-preference){
  html,body{cursor:url(/cursor/paw.svg) 9 6,auto}
  :is(a,button,summary,label[for],[role=button],[role=tab],select,input[type=checkbox],input[type=radio],input[type=submit]){cursor:url(/cursor/paw-press.svg) 9 6,pointer}
}
[data-admin],[data-admin] *{cursor:revert!important}
.tp-curtain:is([data-state=covering],[data-state=covered],[data-state=snap]){pointer-events:auto;cursor:progress}
```

- `/cursor/paw.svg`: 32x32 (viewBox 64), paw rotated -18deg, fill `#C2622B`, stroke `#2A170E` 3.4.
  `/cursor/paw-press.svg`: the "pressed" variant, used on interactive elements.
  Both were downloaded to `recon/public/cursor/` and copied to `public/cursor/`.
- Hotspot is `9 6`. Fallback `auto` / `pointer`.
- The whole block is gated by `(hover:hover) and (pointer:fine) and (prefers-reduced-motion:no-preference)`: touch devices and reduced-motion users get the normal OS cursor.

## 2. Paw-print trail (canvas, `PawTrailCanvas`)

Rendered once globally: `<canvas aria-hidden class="pointer-events-none fixed inset-0 z-[70] size-full">`.

Behaviour (exact constants from the minified source):
- Skips entirely if `prefers-reduced-motion: reduce` or if not `(hover: hover) and (pointer: fine)`.
- Canvas size = `innerWidth/innerHeight * dpr`, dpr capped at 2, resized on `resize`.
- `pointermove` (passive, window), only `pointerType === "mouse"`:
  - accumulates travelled distance; every **46px** drops a print.
  - angle = `atan2(dy, dx) + PI/2`; prints alternate left/right by **7px** perpendicular offset (`p = -p`).
  - print position = `clientX + cos(angle)*offset + 14`, `clientY + sin(angle)*offset + 16`.
  - max **14** prints (oldest shifted).
- rAF draw loop (only while prints exist):
  - lifetime **1000ms**; fully opaque until 600ms, then linear fade over 400ms.
  - `globalAlpha = 0.42 * l * l`.
  - transform: scale **0.27 * dpr**, translate to print, rotate(angle), translate(-32,-34), fill `#c2622b`.
  - Path2D = paw from module 49054: main pad
    `M32 30.5c-7.6 0-15.6 8.3-15.6 15.5 0 5.4 4.2 8.3 9.2 8.3 2.6 0 4.5-1.1 6.4-1.1s3.8 1.1 6.4 1.1c5 0 9.2-2.9 9.2-8.3 0-7.2-8-15.5-15.6-15.5z`
    plus four toe ellipses `(cx,cy,rx,ry,rot)`: `(14.6,29.2,5.3,6.9,-28)`, `(24.2,16.6,5.5,7.3,-10)`, `(39.8,16.6,5.5,7.3,10)`, `(49.4,29.2,5.3,6.9,28)`
    (each built as 4 cubic beziers with k=0.5523).
- Cleanup removes listeners, cancels rAF, clears the canvas.

Clone: `components/cursor/PawTrail.tsx` (client) + CSS rules above in `app/globals.css`.

## Related (not part of the cursor, noted for later pages)
- `.pup-buddy` / `.pup-actor`: an SVG puppy mascot (chunks `177ya708_1zuj.js`, `1llon2cx5n3pm.js`, `1wa3jfz4v5w2v.js`)
  that reacts to `pointermove`, `pointerenter` (petting + wag) and `click`; listens for a custom `pup:cue` event.
  Its SVG parts use `cursor:url(/cursor/paw-press.svg) 9 6,pointer`. Home-page only, to rebuild with that section.
- Smooth scroll: Lenis 1.3.26 is bundled (`data-lenis-prevent` on dialogs). Not replicated yet.
- `NavLink` (module 82394): `aria-current="page"` + `data-active`, label in `<span>` plus a `tp-nav-link__paw` icon.

# Video

Where the data lives: each puppy has a `media` array in the RSC payload embedded in the detail page HTML
(`self.__next_f.push` chunks in `recon/html/puppies__<slug>.html`). Video items look like:

```json
{ "id": "sfXWPM3b8qVt",
  "url": "/media/sfXWPM3b8qVt/5b2a08dab3/b942a5_fc2a6555d51b4e65b8ad229592c3755b.mp4",
  "kind": "video", "width": 352, "height": 400,
  "alt": "Video of female Korean Teacup Maltipoo puppy",
  "focalX": 0.5, "focalY": 0.42, "color": "#f2be6b", "blurDataUrl": null,
  "durationS": 15.034,
  "poster": { "id": "VEmjKw7D8k2w", "url": "/media/VEmjKw7D8k2w/...", ... } }
```

- MP4s are self-hosted under `/media/...` (same origin, already in `public/media/`). No YouTube/Vimeo/HLS.
- Puppies with video: korean-teacup-maltipoo-female, maltipoo-cavapoo-male, maltipoo-female-2 (3), maltipoo-max-male.
  Home and /puppies also reference 7 / 6 video items (cards/reels).
- No `<video>` in the server HTML: the client component `PuppyGallery` (module 547, `recon/js/1y11gwrsbuw85.js`) mounts it.
  - Main stage: `.tp-storypage relative aspect-[4/5] md:aspect-[5/6]`; for `kind === "video"`:
    `<video src={url} poster={poster?.url} class="size-full object-cover" muted loop playsInline autoPlay aria-label={alt}>`.
  - Slide transition (motion): clipPath inset from the right/left + `rotateY(-14 * dir)`, perspective 1400,
    0.7s ease `[.22,1,.36,1]`; exit opacity .4 scale .97; `AnimatePresence mode="popLayout"`.
  - Thumbnails (`h-24 w-20 md:h-28 md:w-24 rounded-[0.9rem] border-[3px]`): videos show their poster + a centered `▶` on `bg-cocoa/30`.
  - Labels: `"{name}, video {n} of {total}"` / `"{name}, photo {n} of {total}"`.
  - Click opens a fullscreen `<dialog>`; there the video is `controls autoPlay playsInline object-contain`, swipe ±80px to navigate, arrow keys too.
