// Compare [data-section] offsets/heights between the reference and the local build at 390/768/1440
// usage: node tools/sections.mjs [route=/]   (reduced motion, like tools/shots.mjs)
import { chromium } from 'playwright';
const route = process.argv[2] || '/';
const browser = await chromium.launch();
for (const [name, width, height] of [['mobile', 390, 844], ['tablet', 768, 1024], ['desktop', 1440, 900]]) {
  const rows = {};
  for (const [who, base] of [['ref', 'https://puppy.instabizweb.com'], ['local', 'http://localhost:3000']]) {
    const page = await browser.newPage({ viewport: { width, height }, reducedMotion: 'reduce', isMobile: name !== 'desktop', hasTouch: name !== 'desktop' });
    await page.goto(base + route, { waitUntil: 'networkidle' });
    for (const [s, top, h] of await page.evaluate(() => [...document.querySelectorAll('[data-section]')].map((e) => {
      const r = e.getBoundingClientRect();
      return [e.dataset.section, Math.round(r.top + scrollY), Math.round(r.height)];
    }))) (rows[s] ??= {})[who] = [top, h];
    await page.close();
  }
  console.log(`\n${name}`);
  for (const [s, { ref, local }] of Object.entries(rows)) {
    const ok = ref && local && ref[0] === local[0] && ref[1] === local[1];
    console.log(`  ${ok ? 'ok  ' : 'DIFF'} ${s.padEnd(10)} ref ${ref ? ref.join('+') : '-'}  local ${local ? local.join('+') : '-'}`);
  }
}
await browser.close();
