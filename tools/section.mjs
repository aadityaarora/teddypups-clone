// Print one data-section of a recon page with images/long SVGs summarised, for reading structure
// usage: node tools/section.mjs <section> [page=home] [--raw]
import fs from 'node:fs';
const [, , name, page = 'home', raw] = process.argv;
const s = fs.readFileSync(`recon/html/${page}.html`, 'utf8');
const start = s.indexOf(`<div data-section="${name}"`);
if (start < 0) throw new Error('no section ' + name);
const next = s.indexOf('<div data-section=', start + 20);
const end = next > 0 ? next : s.indexOf('</main>', start);
let html = s.slice(start, end);
if (!raw) {
  html = html
    .replace(/<svg[\s\S]*?<\/svg>/g, (m) => (m.length > 400 ? `<SVG ${(m.match(/(class|viewBox|aria-label)="[^"]*"/g) || []).join(' ')} len=${m.length}/>` : m))
    .replace(/<img [^>]*?alt="([^"]*)"[^>]*?src="\/_next\/image\?url=([^&"]+)[^>]*>/g, (m, alt, u) => `<IMG "${alt}" ${decodeURIComponent(u).slice(0, 40)} sizes=${(m.match(/sizes="([^"]*)"/) || [])[1]}/>`)
    .replace(/<!--.*?-->/g, '');
}
process.stdout.write(html + '\n');
