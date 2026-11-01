// CSS recon for puppy.instabizweb.com (Next 16 serves CSS from /_next/static/chunks/)
// usage: node tools/recon-css.mjs
// Reads recon/html/*.html, downloads every /_next/static/**/*.css + inline <style>,
// writes recon/css/*.css, recon/css/_all.css, recon/tokens.json, appends to recon/report.md

import fs from 'node:fs/promises';
import path from 'node:path';

const BASE = 'https://puppy.instabizweb.com';
const OUT = 'recon';
const HEADERS = { 'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/130 Safari/537.36' };

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

// ---------- 1. Collect CSS links + inline styles ----------
const htmlFiles = (await fs.readdir(`${OUT}/html`)).filter((f) => f.endsWith('.html'));
const cssFiles = new Set();
const inline = new Map(); // content -> first page seen
const videoHints = new Set();

for (const f of htmlFiles) {
  const html = await fs.readFile(`${OUT}/html/${f}`, 'utf8');
  for (const m of html.matchAll(/\/_next\/static\/[^"'\\\s)]+?\.css/g)) cssFiles.add(m[0]);
  for (const m of html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)) if (m[1].trim() && !inline.has(m[1])) inline.set(m[1], f);
  for (const m of html.matchAll(/(?:https?:)?\/\/?[^"'\\\s<>]*?\.(?:mp4|webm|m3u8|mov)\b[^"'\\\s<>]*/gi)) videoHints.add(m[0]);
  for (const m of html.matchAll(/(?:youtube\.com\/embed|youtu\.be|player\.vimeo\.com|stream\.mux\.com|cloudinary\.com\/[^"'\\\s]*\/video)[^"'\\\s<>]*/gi)) videoHints.add(m[0]);
  for (const m of html.matchAll(/"(?:video|videoUrl|videoSrc|poster)\\?"\s*:\s*\\?"([^"\\]+)/gi)) videoHints.add(`${m[0].split(':')[0]}: ${m[1]}`);
}
console.log(`${cssFiles.size} css links, ${inline.size} inline <style> blocks`);

// ---------- 2. Download ----------
let allCss = '';
for (const c of [...cssFiles].sort()) {
  const css = await get(BASE + c);
  if (!css) continue;
  console.log('css', c, css.length);
  allCss += `\n/* ${c} */\n${css}`;
  await save('css/' + path.basename(c), css);
}
let n = 0;
for (const [css, page] of inline) {
  allCss += `\n/* inline <style> from ${page} */\n${css}`;
  await save(`css/inline-${++n}.css`, css);
}
await save('css/_all.css', allCss);

// fonts referenced by the CSS
const fontUrls = new Set([...allCss.matchAll(/url\(([^)]+?\.(?:woff2?|ttf|otf))\)/g)].map((m) => m[1].replace(/["']/g, '')));
for (const f of fontUrls) {
  const abs = new URL(f, BASE + '/_next/static/chunks/').href;
  const buf = await get(abs, 'buf');
  if (buf) await save('fonts/' + path.basename(new URL(abs).pathname), buf);
}

// ---------- 3. Tokens ----------
const count = (arr) => Object.entries(arr.reduce((o, k) => ((o[k] = (o[k] || 0) + 1), o), {})).sort((a, b) => b[1] - a[1]);

const faceFamilies = [...new Set([...allCss.matchAll(/@font-face\s*{([^}]*)}/g)]
  .map((m) => (m[1].match(/font-family:\s*([^;]+)/) || [])[1]?.trim()).filter(Boolean))];
const usedFamilies = count([...allCss.matchAll(/font-family:\s*([^;}]+)/g)].map((m) => m[1].trim()));
const colors = count([...allCss.matchAll(/#[0-9a-fA-F]{3,8}\b|rgba?\([^)]+\)|oklch\([^)]+\)|hsla?\([^)]+\)/g)].map((m) => m[0].toLowerCase()));
const vars = [...new Map([...allCss.matchAll(/(--[\w-]+)\s*:\s*([^;}]+)/g)]
  .filter((m) => !m[1].startsWith('--tw-'))
  .map((m) => [m[1], m[2].trim()])).entries()];

// full @keyframes blocks (brace-matched)
function blocks(re) {
  const out = [];
  for (const m of allCss.matchAll(re)) {
    let i = allCss.indexOf('{', m.index), depth = 0, j = i;
    for (; j < allCss.length; j++) { if (allCss[j] === '{') depth++; else if (allCss[j] === '}' && --depth === 0) break; }
    out.push(allCss.slice(m.index, j + 1));
  }
  return out;
}
const keyframes = [...new Map(blocks(/@keyframes\s+([\w-]+)/g).map((b) => [b.match(/@keyframes\s+([\w-]+)/)[1], b])).entries()];
const breakpoints = count([...allCss.matchAll(/@media[^{]*\((?:min|max)-width:\s*([\d.]+(?:px|rem|em))/g)].map((m) => m[1]));

// rules mentioning cursor (selector + body, flat rules only)
const cursorRules = [...new Set([...allCss.matchAll(/[^{}]*\{[^{}]*\}/g)].map((m) => m[0].trim())
  .filter((r) => /cursor/i.test(r) && !/cursor:\s*(pointer|default|not-allowed|text|auto|grab|grabbing|inherit)\s*[;}]/.test(r.replace(/cursor:\s*none/, ''))))];
const cursorPointerCount = (allCss.match(/cursor:\s*pointer/g) || []).length;
const cursorNone = [...allCss.matchAll(/[^{}]*\{[^{}]*cursor:\s*none[^{}]*\}/g)].map((m) => m[0].trim());

await save('tokens.json', JSON.stringify({ faceFamilies, usedFamilies, colors, vars, keyframes: keyframes.map(([k]) => k), breakpoints }, null, 2));

// ---------- 4. Append to report ----------
const section = `

---

# CSS recon (tools/recon-css.mjs, ${new Date().toISOString().slice(0, 10)})

## Stylesheets (${cssFiles.size} linked, ${inline.size} inline)
${[...cssFiles].sort().map((c) => `- ${c}`).join('\n')}
- Combined: recon/css/_all.css (${(allCss.length / 1024).toFixed(1)} KB)

## Fonts
- @font-face families: ${faceFamilies.join(', ') || 'none'}
- Font files saved: ${fontUrls.size} -> recon/fonts/
- font-family usage:
${usedFamilies.slice(0, 15).map(([f, c]) => `  - ${f} (${c})`).join('\n')}

## Top colors
${colors.slice(0, 40).map(([c, k]) => `- ${c} (${k})`).join('\n')}

## Custom CSS variables (non --tw-, ${vars.length} total)
${vars.slice(0, 200).map(([k, v]) => `- ${k}: ${v}`).join('\n')}

## Breakpoints
${breakpoints.map(([b, k]) => `- ${b} (${k})`).join('\n')}

## Keyframes (${keyframes.length})
${keyframes.map(([, b]) => '```css\n' + b + '\n```').join('\n')}

## Cursor-related rules
- cursor:pointer occurrences: ${cursorPointerCount}
- cursor:none rules:
${cursorNone.map((r) => '```css\n' + r + '\n```').join('\n') || '  none'}
- other cursor rules:
${cursorRules.filter((r) => !cursorNone.includes(r)).slice(0, 40).map((r) => '```css\n' + r + '\n```').join('\n') || '  none'}

## Video URL hints (from recon/html)
${[...videoHints].map((v) => `- ${v}`).join('\n') || 'none found'}
`;
const report = await fs.readFile(`${OUT}/report.md`, 'utf8');
await save('report.md', report.replace(/\n\n---\n\n# CSS recon[\s\S]*$/, '') + section);
console.log(`\nDone. ${keyframes.length} keyframes, ${vars.length} vars, ${cursorRules.length} cursor rules`);
