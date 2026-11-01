// Dump computed styles of every element (+ ::before/::after) at 390/768/1440, plus 1440 with motion enabled
// usage: node tools/style-snapshot.mjs <out.json> [url]   (compare two dumps with --compare a.json b.json)
import { chromium } from 'playwright';
import fs from 'node:fs';

if (process.argv[2] === '--compare') {
  const [a, b] = [process.argv[3], process.argv[4]].map((f) => JSON.parse(fs.readFileSync(f, 'utf8')));
  let diffs = 0;
  for (const size of Object.keys(a)) {
    if (a[size].length !== b[size].length) { console.log(size, 'element count', a[size].length, '->', b[size].length); diffs++; continue; }
    a[size].forEach((el, i) => {
      for (const k of Object.keys(el.s)) if (el.s[k] !== b[size][i].s[k]) { if (diffs++ < 30) console.log(size, el.path, k, el.s[k], '->', b[size][i].s[k]); }
    });
  }
  console.log(diffs ? `${diffs} differences` : 'identical computed styles');
  process.exit(diffs ? 1 : 0);
}

const [out, url = 'http://localhost:3000/'] = process.argv.slice(2);
const browser = await chromium.launch();
const result = {};
for (const [name, width, height, motion] of [['mobile', 390, 844, 'reduce'], ['tablet', 768, 1024, 'reduce'], ['desktop', 1440, 900, 'reduce'], ['desktop-motion', 1440, 900, 'no-preference']]) {
  const page = await browser.newPage({ viewport: { width, height }, reducedMotion: motion });
  await page.goto(url, { waitUntil: 'networkidle' });
  result[name] = await page.evaluate(() => {
    const pick = (cs) => { const o = {}; for (let i = 0; i < cs.length; i++) o[cs[i]] = cs.getPropertyValue(cs[i]); return o; };
    const path = (el) => { const p = []; for (; el && el !== document.documentElement; el = el.parentElement) p.unshift(el.tagName.toLowerCase() + (el.classList[0] ? '.' + el.classList[0] : '')); return p.join('>'); };
    return [...document.querySelectorAll('*')].flatMap((el) => [
      { path: path(el), s: pick(getComputedStyle(el)) },
      { path: path(el) + '::before', s: pick(getComputedStyle(el, '::before')) },
      { path: path(el) + '::after', s: pick(getComputedStyle(el, '::after')) },
    ]);
  });
  await page.close();
}
await browser.close();
fs.writeFileSync(out, JSON.stringify(result));
console.log('wrote', out, Object.fromEntries(Object.entries(result).map(([k, v]) => [k, v.length])));
