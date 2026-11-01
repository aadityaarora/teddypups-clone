// Pixel diff of the top region of two screenshots
// usage: node tools/diff.mjs <ref.png> <local.png> <height> [out.png] [--from <top px>]
import sharp from 'sharp';
const fromAt = process.argv.indexOf('--from');
const from = fromAt > 0 ? +process.argv.splice(fromAt, 2)[1] : 0;
const [, , a, b, h = '900', out] = process.argv;
const load = async (f) => { const m = await sharp(f).metadata(); return sharp(f).extract({ left: 0, top: from, width: m.width, height: Math.min(+h, m.height - from) }).raw().ensureAlpha().toBuffer({ resolveWithObject: true }); };
const [A, B] = await Promise.all([load(a), load(b)]);
const w = Math.min(A.info.width, B.info.width), H = Math.min(A.info.height, B.info.height);
const d = Buffer.alloc(w * H * 4); let bad = 0; const rows = new Array(H).fill(0);
for (let y = 0; y < H; y++) for (let x = 0; x < w; x++) {
  const i = (y * A.info.width + x) * 4, j = (y * B.info.width + x) * 4, k = (y * w + x) * 4;
  const delta = Math.abs(A.data[i] - B.data[j]) + Math.abs(A.data[i + 1] - B.data[j + 1]) + Math.abs(A.data[i + 2] - B.data[j + 2]);
  const hit = delta > 60; if (hit) { bad++; rows[y]++; }
  d[k] = hit ? 255 : A.data[i] / 3; d[k + 1] = hit ? 0 : A.data[i + 1] / 3; d[k + 2] = hit ? 0 : A.data[i + 2] / 3; d[k + 3] = 255;
}
console.log(`${a} vs ${b}: ${(100 * bad / (w * H)).toFixed(2)}% pixels differ`);
const bands = []; for (let y = 0; y < H; y += 50) { const s = rows.slice(y, y + 50).reduce((p, c) => p + c, 0); if (s > w * 2) bands.push(`${y + from}-${y + from + 50}:${(100 * s / (w * 50)).toFixed(1)}%`); }
console.log('hot bands:', bands.join(' ') || 'none');
if (out) await sharp(d, { raw: { width: w, height: H, channels: 4 } }).png().toFile(out);
