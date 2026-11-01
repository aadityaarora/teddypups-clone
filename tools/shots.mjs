// Full-page screenshots at 390 / 768 / 1440
// Reference:  node tools/shots.mjs                      -> recon/shots/
// Your build: node tools/shots.mjs http://localhost:3000 -> recon/local/
// Single page: node tools/shots.mjs http://localhost:3000 /puppies
// Needs recon/pages.json (from recon.mjs)

import { chromium } from 'playwright';
import fs from 'node:fs/promises';

const ORIGIN = 'https://puppy.instabizweb.com';
const base = process.argv[2] || ORIGIN;
const only = process.argv[3];
const outDir = base === ORIGIN ? 'recon/shots' : 'recon/local';

const all = JSON.parse(await fs.readFile('recon/pages.json', 'utf8')).map((u) => new URL(u).pathname);
const details = all.filter((p) => /^\/puppies\/.+/.test(p));
let paths = [...all.filter((p) => !/^\/puppies\/.+/.test(p)), ...details.slice(0, 2)];
if (only) paths = [only];

const sizes = [
  { name: 'mobile', width: 390, height: 844, mobile: true },
  { name: 'tablet', width: 768, height: 1024, mobile: true },
  { name: 'desktop', width: 1440, height: 900, mobile: false },
];

const slugOf = (p) => (p.replace(/\/$/, '') === '' ? 'home' : p.replace(/\/$/, '').slice(1).replace(/\//g, '__'));

async function autoScroll(page) {
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let y = 0;
      const t = setInterval(() => {
        window.scrollBy(0, 400);
        y += 400;
        if (y >= document.body.scrollHeight) { clearInterval(t); window.scrollTo(0, 0); resolve(); }
      }, 100);
    });
  });
}

const browser = await chromium.launch();
for (const s of sizes) {
  await fs.mkdir(`${outDir}/${s.name}`, { recursive: true });
  const ctx = await browser.newContext({
    viewport: { width: s.width, height: s.height },
    isMobile: s.mobile, hasTouch: s.mobile, deviceScaleFactor: 1,
    reducedMotion: 'reduce',
  });
  const page = await ctx.newPage();
  for (const p of paths) {
    try {
      await page.goto(base + p, { waitUntil: 'networkidle', timeout: 45000 });
      await autoScroll(page);
      await page.waitForTimeout(1000);
      await page.screenshot({ path: `${outDir}/${s.name}/${slugOf(p)}.png`, fullPage: true });
      console.log(s.name, p);
    } catch (e) { console.warn('x', s.name, p, e.message); }
  }
  if (s.name === 'mobile' && !only) {
    try {
      await page.goto(base + '/', { waitUntil: 'networkidle' });
      await page.getByRole('button', { name: /menu/i }).first().click();
      await page.waitForTimeout(800);
      await page.screenshot({ path: `${outDir}/mobile/_menu-open.png` });
    } catch (e) { console.warn('x menu', e.message); }
  }
  await ctx.close();
}
await browser.close();
console.log('Done ->', outDir);
