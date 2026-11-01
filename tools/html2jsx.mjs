// Convert one data-section of a recon page to JSX (a starting point for hand-finishing a component)
// usage: node tools/html2jsx.mjs <section> [page=home] > out.jsx
// - class/for/tabindex/SVG attrs -> React names, style strings -> objects
// - next/image <img> -> <Img media="/media/..." alt sizes /> placeholders
// - pup-stop blocks -> <PupStop pose=... className=... />
import fs from 'node:fs';

const [, , name, page = 'home'] = process.argv;
const s = fs.readFileSync(`recon/html/${page}.html`, 'utf8');
const start = s.indexOf(`<div data-section="${name}"`);
const next = s.indexOf('<div data-section=', start + 20);
let html = s.slice(start, next > 0 ? next : s.indexOf('</main>', start)).replace(/<!--.*?-->/g, '');

// Teddy mascots -> component
html = html.replace(/<div data-pup-stop="true"([^>]*)><div class="pup-buddy[^"]*"[^>]*><svg[\s\S]*?<\/svg><span aria-hidden="true" class="pup-bubble" data-show="false"><\/span><\/div><\/div>/g,
  (m, attrs) => {
    const a = Object.fromEntries([...attrs.matchAll(/([\w-]+)="([^"]*)"/g)].map((x) => [x[1], x[2]]));
    return `<PupStop svg={pup${a['data-pose'][0].toUpperCase() + a['data-pose'].slice(1)}Svg} pose="${a['data-pose']}" className="${a.class.replace('pup-stop ', '')}"${a['data-act'] ? ` act="${a['data-act']}"` : ''}${a['data-behind'] ? ' behind' : ''}${a['data-lane'] ? ' lane' : ''} />`;
  });

// next/image -> placeholder
html = html.replace(/<img ([^>]*?)\/?>/g, (m, attrs) => {
  const src = decodeURIComponent((attrs.match(/src="\/_next\/image\?url=([^&"]+)/) || attrs.match(/src="([^"]+)"/) || [])[1] || '');
  const alt = (attrs.match(/alt="([^"]*)"/) || [])[1] ?? '';
  const sizes = (attrs.match(/sizes="([^"]*)"/) || [])[1];
  return `<Img media="${src}" alt="${alt}"${sizes ? ` sizes="${sizes}"` : ''} />`;
});

const RENAME = { class: 'className', for: 'htmlFor', tabindex: 'tabIndex', srcset: 'srcSet', 'xlink:href': 'xlinkHref', 'xml:space': 'xmlSpace', fetchpriority: 'fetchPriority', viewbox: 'viewBox', autoplay: 'autoPlay', playsinline: 'playsInline', crossorigin: 'crossOrigin', readonly: 'readOnly', maxlength: 'maxLength', enterkeyhint: 'enterKeyHint', autocomplete: 'autoComplete' };
const camel = (k) => k.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
const styleObj = (v) => '{{ ' + v.split(';').filter((d) => d.trim()).map((d) => {
  const i = d.indexOf(':'); const p = d.slice(0, i).trim(); const val = d.slice(i + 1).trim().replace(/&quot;/g, '"');
  return `${p.startsWith('--') ? JSON.stringify(p) : camel(p)}: ${JSON.stringify(val)}`;
}).join(', ') + ' }}';

const VOID = new Set(['img', 'br', 'hr', 'input', 'meta', 'link', 'source', 'path', 'circle', 'ellipse', 'rect', 'line', 'polyline', 'polygon', 'stop', 'use']);
const out = html.replace(/<([a-zA-Z][\w-]*)((?:\s+[\w:-]+(?:="[^"]*")?)*)\s*(\/?)>/g, (m, tag, attrs, selfClose) => {
  if (/^[A-Z]/.test(tag)) return m; // already JSX
  const conv = [...attrs.matchAll(/([\w:-]+)(?:="([^"]*)")?/g)].map(([, k, v]) => {
    if (v === undefined) v = 'true';
    const key = RENAME[k] ?? (k.startsWith('data-') || k.startsWith('aria-') ? k : k.includes('-') || k.includes(':') ? camel(k.replace(':', '-')) : k);
    if (k === 'style') return `style=${styleObj(v)}`;
    if (v === 'true' && !k.startsWith('data-') && !k.startsWith('aria-')) return key;
    return `${key}="${v.replace(/&amp;/g, '&')}"`;
  }).join(' ');
  return `<${tag}${conv ? ' ' + conv : ''}${selfClose || VOID.has(tag) ? ' /' : ''}>`;
})
  .replace(/<\/(path|circle|ellipse|rect|line|polyline|polygon|stop|use)>/g, '')
  .replace(/>([^<]*[{}][^<]*)</g, (m, t) => `>{${JSON.stringify(t)}}<`);

process.stdout.write(out + '\n');
