// Exercise the home page's motion features with motion enabled and report what happened
// usage: node tools/motion-check.mjs (dev server on :3000)
import { chromium } from 'playwright';
const browser = await chromium.launch();
const errors = [];
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: 'no-preference' });
page.on('pageerror', (e) => errors.push(e.message));
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });

// 1. Hero lineup: watch for duck -> pop and a name tag, collect the pups seen in seat order
const seen = new Set(), states = new Set();
const t0 = Date.now();
while (Date.now() - t0 < 12000) {
  const s = await page.evaluate(() => ({
    states: [...document.querySelectorAll('.tp-lineup__pup[data-state]')].map((e) => e.dataset.state),
    tags: document.querySelectorAll('.tp-lineup__ghost[data-tag=show]').length,
    names: [...document.querySelectorAll('.tp-lineup--tags .tp-lineup__name')].map((e) => e.textContent),
  }));
  s.states.forEach((x) => states.add(x));
  if (s.tags) states.add('tag');
  s.names.forEach((n) => seen.add(n));
  await page.waitForTimeout(150);
}
console.log('lineup states seen:', [...states].join(', ') || 'none', '| distinct pups shown:', seen.size);

// hover shows the tag
await page.hover('.tp-lineup__seat:nth-child(2) .tp-lineup__pup');
await page.waitForTimeout(400);
console.log('hover tag shown:', await page.evaluate(() => document.querySelector('.tp-lineup--tags .tp-lineup__seat:nth-child(2) .tp-lineup__ghost')?.dataset.tag === 'show'));

// 2. Meet treadmill
const meet = await page.evaluate(() => {
  const s = document.querySelector('.tp-meet');
  return { pinned: s.hasAttribute('data-pinned'), range: s.querySelector('[data-pin-range]').offsetHeight };
});
const meetTop = await page.evaluate(() => document.querySelector('.tp-meet').getBoundingClientRect().top + scrollY);
const read = () => page.evaluate(() => ({
  x: getComputedStyle(document.querySelector('.tp-meet__track')).transform,
  open: document.querySelectorAll('.tp-meet__track > .tp-door[data-open=true]').length,
}));
await page.evaluate((y) => scrollTo(0, y), meetTop + 50); await page.waitForTimeout(900);
const a = await read();
await page.evaluate((y) => scrollTo(0, y), meetTop + meet.range * 0.6); await page.waitForTimeout(1200);
const b = await read();
console.log('meet pinned:', meet.pinned, '| range px:', meet.range, '| start', a, '| 60%', b);

// 3. Chat steps
const journeyTop = await page.evaluate(() => document.querySelector('.tp-chat').getBoundingClientRect().top + scrollY);
const chatAt = async (dy) => {
  await page.evaluate((y) => scrollTo(0, y), journeyTop + dy); await page.waitForTimeout(1200);
  return page.evaluate(() => ({
    active: [...document.querySelectorAll('.tp-chat__step')].findIndex((e) => e.hasAttribute('data-active')),
    shown: [...document.querySelectorAll('.tp-msg-group')].map((e) => e.dataset.show).join(','),
    status: document.querySelector('.tp-phone__status').textContent,
  }));
};
console.log('chat near top:', await chatAt(200), '| further:', await chatAt(1100));

// 4. Plane
const pathsTop = await page.evaluate(() => document.querySelector('.tp-paths').getBoundingClientRect().top + scrollY);
const plane = async (dy) => { await page.evaluate((y) => scrollTo(0, y), pathsTop + dy); await page.waitForTimeout(500); return page.evaluate(() => document.querySelector('.tp-flight g[transform^="translate("]').getAttribute('transform')); };
console.log('plane:', await plane(-300), '->', await plane(400));

// 5. Families reveal + viewer
const famTop = await page.evaluate(() => document.querySelector('.tp-dusk').getBoundingClientRect().top + scrollY);
await page.evaluate((y) => scrollTo(0, y), famTop + 300); await page.waitForTimeout(1500);
console.log('prints revealed:', await page.evaluate(() => document.querySelectorAll('.tp-photowall__prints [data-revealed]').length));
await page.click('.tp-photowall__print >> nth=0');
await page.waitForTimeout(700);
const v1 = await page.evaluate(() => document.querySelector('dialog[aria-label="Photo viewer"]').open && document.querySelector('dialog[aria-label="Photo viewer"] p').textContent);
await page.keyboard.press('ArrowRight'); await page.waitForTimeout(500);
const v2 = await page.evaluate(() => document.querySelector('dialog[aria-label="Photo viewer"] p').textContent);
await page.keyboard.press('Escape'); await page.waitForTimeout(300);
console.log('viewer:', v1, '->', v2, '| closed:', await page.evaluate(() => !document.querySelector('dialog[aria-label="Photo viewer"]').open));

// 6. mobile horizontal scroll
const m = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
await m.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
console.log('390px horizontal scroll:', await m.evaluate(() => document.documentElement.scrollWidth > innerWidth));
console.log('errors:', errors.length ? errors : 'none');
await browser.close();
