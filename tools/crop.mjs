// Crop a vertical slice of a screenshot for inspection
// usage: node tools/crop.mjs <in.png> <out.png> <top> <height>
import sharp from 'sharp';
const [, , src, out, top = '0', height = '1200'] = process.argv;
const meta = await sharp(src).metadata();
const t = Math.min(+top, meta.height - 1);
await sharp(src).extract({ left: 0, top: t, width: meta.width, height: Math.min(+height, meta.height - t) }).toFile(out);
console.log(out, meta.width + 'x' + meta.height);
