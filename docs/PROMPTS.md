# AI tools and prompts log

Tools used:
- Claude Code (agentic coding, recon scripts, page building, visual QA via Playwright)
- Sitepeel (DESIGN.md generation: measured fonts, colors, shadows, motion)

## Prompts

### 2026-11-02: CSS recon fix, screenshots, cursor/video research, data, global layout, hero
Read CLAUDE.md fully first. Context: I already ran tools/recon.mjs. Pages and 208 assets downloaded fine and are copied into public/. But CSS extraction got 0 files because Next 16 serves CSS from /_next/static/chunks/ not /_next/static/css/, so recon/css/_all.css and tokens are empty.

Do these in order, fixing any errors yourself:
1. Fix CSS recon: write and run tools/recon-css.mjs that finds every /_next/static/**/*.css link plus inline <style> in recon/html/*.html, downloads them into recon/css/ and recon/css/_all.css, and appends colors, CSS variables, keyframes, cursor-related rules and video URL hints to recon/report.md.
2. Run node tools/shots.mjs to screenshot the reference site. Open a few of the images to confirm they rendered with images.
3. Find exactly how the custom cursor works (grep recon/css/_all.css and the JS chunks referenced in recon/html for cursor, mousemove, pointermove; download the relevant JS chunk if needed) and write findings to docs/cursor.md.
4. Find how puppy videos are loaded on detail pages (recon/rsc and recon/html) and note it in docs/cursor.md under a Video section.
5. Build typed data in lib/data/: puppies.ts (all available + gone-home with slug, name, breed, gender, age, origin, status, images, video), testimonials.ts, faqs.ts, site.ts (phone, whatsapp, email, socials, nav), all text copied verbatim from recon.
6. Build the global layout: top tagline, skip link, header, mobile drawer, footer, mobile sticky WhatsApp/Call bar, and the custom cursor, matching recon/shots exactly.
7. Replace app/page.tsx with just the hero section for now.
8. Run the verify loop from CLAUDE.md for / at all 3 sizes and fix differences.
9. git add -A and commit.
When finished, give me a short summary of what you built and anything you could not match.

### 2026-11-02: Prepare repo for GitHub
Prepare the repo for GitHub:
1. recon/ must never be in git. Make sure .gitignore has recon/ and remove recon/ from ALL commits (history rewrite is fine, nothing is pushed yet). Confirm no file over 50 MB remains in history and show me git count-objects -vH.
2. Make app/styles/chrome.css readable: formatted, grouped by component, with short comments. Do not change visual output. Re-run the verify loop for / to confirm nothing changed.
3. Write README.md: overview, live URL placeholder, stack, folder structure, how to run, what each script in tools/ does, and a note that images and content come from the reference site for this assessment.
4. Run npm run build and fix anything that fails.
5. If the gh CLI is installed and logged in, create a public GitHub repo named teddypups-clone and push main. If not, stop and tell me exactly what to do.
Commit everything.

### 2026-11-02: Push to GitHub
Add this as origin and push main:https://github.com/aadityaarora/teddypups-clone
