// Recon for puppy.instabizweb.com
// Node 18+  |  usage: node recon.mjs
// Output: recon/ (html, rsc data, public assets, css, fonts, report.md, pages.json)

import fs from 'node:fs/promises';
import path from 'node:path';

const BASE = 'https://puppy.instabizweb.com';
const OUT = 'recon';
const HEADERS = { 'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/130 Safari/537.36' };
const MAX_PAGES = 150;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function get(url, type = 'text') {
  for (let i = 0; i < 3; i++) {
    try {
      const res = await fetch(url, { headers: HEADERS });
      if (!res.ok) throw new Error(String(res.status));
      return type === 'buf' ? Buffer.from(await res.arrayBuffer()) : await res.text();
    } catch (e) {
      if (i === 2) { console.warn(`  x ${url} (${e.message})`); return null; }
      await sleep(800 * (i + 1));
    }
  }
}

async function save(rel, data) {
  const p = path.join(OUT, rel);
  await fs.mkdir(path.dirname(p), { recursive: true });
  await fs.writeFile(p, data);
}

function normalize(href) {
  try {
    const u = new URL(href.replace(/&amp;/g, '&'), BASE);
    if (u.origin !== BASE) return null;
    if (/^\/(_next|cdn-cgi|api)\//.test(u.pathname)) return null;
    if (/\.[a-z0-9]{2,5}$/i.test(u.pathname)) return null;
    return u.origin + (u.pathname.replace(/\/$/, '') || '/');
  } catch { return null; }
}

const slugOf = (u) => {
  const p = new URL(u).pathname.replace(/\/$/, '');
  return p === '' ? 'home' : p.slice(1).replace(/\//g, '__');
};

async function pool(items, n, fn) {
  const list = [...items]; let i = 0;
  await Promise.all(Array.from({ length: n }, async () => { while (i < list.length) await fn(list[i++]); }));
}

// ---------- 1. Crawl pages ----------
const queue = [BASE + '/'];
const sitemap = await get(BASE + '/sitemap.xml');
if (sitemap) for (const m of sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)) queue.push(m[1].trim());

const seen = new Set();
const assets = new Set();
const cssFiles = new Set();
const external = new Set();

while (queue.length && seen.size < MAX_PAGES) {
  const url = normalize(queue.shift());
  if (!url || seen.has(url)) continue;
  seen.add(url);
  console.log('page', url);

  const html = await get(url);
  if (!html) continue;
  const slug = slugOf(url);
  await save(`html/${slug}.html`, html);

  for (const m of html.matchAll(/href="([^"#]+)/g)) {
    const n = normalize(m[1]);
    if (n && !seen.has(n)) queue.push(n);
  }

  // next/image originals
  for (const m of html.matchAll(/_next\/image\?url=([^&"'\\\s]+)/g)) assets.add(decodeURIComponent(m[1]));
  // direct public paths (also inside the RSC payload)
  for (const m of html.matchAll(/(?<!static)\/(?:media|brand|images?|img|icons?|videos?|assets)\/[A-Za-z0-9_\-.\/%~]+?\.(?:jpe?g|png|webp|avif|gif|svg|ico|mp4|webm|mov)/gi)) assets.add(m[0]);
  // static imports (next/static/media images, not fonts)
  for (const m of html.matchAll(/\/_next\/static\/media\/[^"'\\\s)]+?\.(?:jpe?g|png|webp|avif|gif|svg)/gi)) assets.add(m[0]);
  // favicons / manifest
  for (const m of html.matchAll(/href="(\/[^"]+?\.(?:ico|png|svg|webmanifest))"/gi)) assets.add(m[1]);
  // external video hosts
  for (const m of html.matchAll(/https?:\/\/[^"'\\\s]+?\.(?:mp4|webm|m3u8)/gi)) external.add(m[0]);
  for (const m of html.matchAll(/https?:\/\/(?:www\.)?(?:youtube\.com|youtu\.be|player\.vimeo\.com|video\.wixstatic\.com)[^"'\\\s]*/gi)) external.add(m[0]);
  // stylesheets
  for (const m of html.matchAll(/\/_next\/static\/css\/[^"'\\\s]+?\.css/g)) cssFiles.add(m[0]);

  // RSC payload = the page's data (puppies, text, etc.)
  const chunks = [...html.matchAll(/self\.__next_f\.push\(\[1,"((?:[^"\\]|\\.)*)"\]\)/g)].map((m) => {
    try { return JSON.parse('"' + m[1] + '"'); } catch { return ''; }
  });
  if (chunks.length) await save(`rsc/${slug}.txt`, chunks.join(''));

  await sleep(250);
}

const pages = [...seen].sort();
await save('pages.json', JSON.stringify(pages, null, 2));

// ---------- 2. Download assets into a Next.js-style public/ folder ----------
console.log(`\nDownloading ${assets.size} assets...`);
let okAssets = 0;
await pool(assets, 6, async (a) => {
  let url, rel;
  if (/^https?:\/\//.test(a)) { const u = new URL(a); url = a; rel = `/external/${u.host}${u.pathname}`; }
  else { rel = '/' + decodeURIComponent(a.split('?')[0]).replace(/^\/+/, ''); url = BASE + rel; }
  const buf = await get(url, 'buf');
  if (buf) { await save('public' + rel, buf); okAssets++; }
});

// ---------- 3. CSS, fonts, design tokens ----------
let allCss = '';
for (const c of cssFiles) {
  const css = await get(BASE + c);
  if (!css) continue;
  allCss += `\n/* ${c} */\n${css}`;
  await save('css/' + path.basename(c), css);
}
await save('css/_all.css', allCss);

const fontUrls = new Set([...allCss.matchAll(/url\(([^)]+?\.(?:woff2?|ttf|otf))\)/g)].map((m) => m[1].replace(/["']/g, '')));
for (const f of fontUrls) {
  const abs = new URL(f, BASE + '/_next/static/css/').href;
  const buf = await get(abs, 'buf');
  if (buf) await save('fonts/' + path.basename(new URL(abs).pathname), buf);
}

const count = (arr) => Object.entries(arr.reduce((o, k) => ((o[k] = (o[k] || 0) + 1), o), {})).sort((a, b) => b[1] - a[1]);

const faceFamilies = [...new Set([...allCss.matchAll(/@font-face\s*{([^}]*)}/g)]
  .map((m) => (m[1].match(/font-family:\s*([^;]+)/) || [])[1]?.trim()).filter(Boolean))];
const usedFamilies = count([...allCss.matchAll(/font-family:\s*([^;}]+)/g)].map((m) => m[1].trim()));
const colors = count([...allCss.matchAll(/#[0-9a-fA-F]{3,8}\b|rgba?\([^)]+\)|oklch\([^)]+\)|hsla?\([^)]+\)/g)].map((m) => m[0].toLowerCase()));
const vars = [...new Map([...allCss.matchAll(/(--[\w-]+)\s*:\s*([^;}]+)/g)]
  .filter((m) => !m[1].startsWith('--tw-'))
  .map((m) => [m[1], m[2].trim()])).entries()];
const keyframes = [...new Set([...allCss.matchAll(/@keyframes\s+([\w-]+)/g)].map((m) => m[1]))];
const breakpoints = count([...allCss.matchAll(/@media[^{]*\((?:min|max)-width:\s*([\d.]+(?:px|rem|em))/g)].map((m) => m[1]));

await save('tokens.json', JSON.stringify({ faceFamilies, usedFamilies, colors, vars, keyframes, breakpoints }, null, 2));

// ---------- 4. Report ----------
const report = `# Recon report: ${BASE}

## Pages (${pages.length})
${pages.map((p) => `- ${p}`).join('\n')}

## Assets
- Found: ${assets.size}, downloaded: ${okAssets} -> recon/public/ (copy straight into your Next.js public/)
- External videos/embeds: ${external.size ? '\n' + [...external].map((e) => `  - ${e}`).join('\n') : 'none found in HTML (check DevTools Network > Media on a puppy page)'}

## Fonts
- @font-face families (next/font names reveal the real font, e.g. __Fraunces_abc): ${faceFamilies.join(', ') || 'none'}
- Font files saved: ${fontUrls.size} -> recon/fonts/
- font-family usage:
${usedFamilies.slice(0, 15).map(([f, n]) => `  - ${f} (${n})`).join('\n')}

## Top colors
${colors.slice(0, 30).map(([c, n]) => `- ${c} (${n})`).join('\n')}

## Custom CSS variables (first 150, full list in tokens.json)
${vars.slice(0, 150).map(([k, v]) => `- ${k}: ${v}`).join('\n')}

## Animations (@keyframes)
${keyframes.join(', ') || 'none'}

## Breakpoints
${breakpoints.map(([b, n]) => `- ${b} (${n})`).join('\n')}

## Page data
Raw RSC payload per page in recon/rsc/. Feed rsc/puppies.txt + a detail page to AI to generate a typed puppies.ts.
`;
await save('report.md', report);
console.log(`\nDone. Open ${OUT}/report.md`);
