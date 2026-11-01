// Mobile menu check: opens the drawer, screenshots recon/local/mobile/_menu-open.png, closes it, reports console errors
// usage: node tools/menu-check.mjs (dev server on :3000)
import { chromium } from 'playwright';
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
const p = await ctx.newPage();
const errs = []; p.on('console', (m) => m.type() === 'error' && errs.push(m.text())); p.on('pageerror', (e) => errs.push(e.message));
await p.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
await p.getByRole('button', { name: /menu/i }).first().click();
await p.waitForTimeout(800);
await p.screenshot({ path: 'recon/local/mobile/_menu-open.png' });
await p.getByRole('button', { name: 'Close' }).click();
await p.waitForTimeout(300);
console.log('dialog open after close:', await p.evaluate(() => document.querySelector('dialog').open));
console.log('errors:', errs.length ? errs : 'none');
await b.close();
