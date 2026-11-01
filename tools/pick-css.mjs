// Pick rules from the original compiled CSS by selector, keeping @media/@supports wrappers
// usage: node tools/pick-css.mjs <regex> [--keyframes name1,name2] [--auto-keyframes] [--pretty] > out.css
// e.g.   node tools/pick-css.mjs "\.tp-(header|menu)" --keyframes tp-menu-in,tp-menu-out
// Reads recon/css/10jf32vdx50lp.css (Tailwind layers are unwrapped; utilities are skipped unless matched)

import fs from 'node:fs';

const css = fs.readFileSync('recon/css/10jf32vdx50lp.css', 'utf8');
const re = new RegExp(process.argv[2]);
const kfArg = process.argv.indexOf('--keyframes');
const wantKf = new Set(kfArg > 0 ? process.argv[kfArg + 1].split(',') : []);

// Minimal CSS tree: { prelude, body } for blocks, nested for at-rules
function parse(s, i = 0, end = s.length) {
  const out = [];
  while (i < end) {
    let j = i, inStr = null;
    for (; j < end; j++) {
      const c = s[j];
      if (inStr) { if (c === '\\') j++; else if (c === inStr) inStr = null; continue; }
      if (c === '"' || c === "'") inStr = c;
      else if (c === '{' || c === ';' || c === '}') break;
    }
    if (j >= end || s[j] === '}') break;
    const prelude = s.slice(i, j).trim();
    if (s[j] === ';') { out.push({ prelude, statement: true }); i = j + 1; continue; }
    // find matching brace
    let depth = 0, k = j; inStr = null;
    for (; k < end; k++) {
      const c = s[k];
      if (inStr) { if (c === '\\') k++; else if (c === inStr) inStr = null; continue; }
      if (c === '"' || c === "'") inStr = c;
      else if (c === '{') depth++;
      else if (c === '}' && --depth === 0) break;
    }
    const inner = s.slice(j + 1, k);
    if (/^@(media|supports|layer|container)/.test(prelude)) out.push({ prelude, children: parse(inner) });
    else out.push({ prelude, body: inner });
    i = k + 1;
  }
  return out;
}

function emit(nodes) {
  let out = '';
  for (const n of nodes) {
    if (n.statement) continue;
    if (n.children) {
      const inner = emit(n.children);
      if (!inner) continue;
      if (/^@layer/.test(n.prelude)) out += inner; // unwrap Tailwind layers
      else out += `${n.prelude}{${inner}}`;
    } else if (/^@keyframes/.test(n.prelude)) {
      if (wantKf.has(n.prelude.replace(/^@keyframes\s+/, ''))) out += `${n.prelude}{${n.body}}`;
    } else if (/^@(property|font-face)/.test(n.prelude)) {
      continue;
    } else if (re.test(n.prelude)) {
      out += `${n.prelude}{${n.body}}`;
    }
  }
  return out;
}

// --auto-keyframes: also include every @keyframes referenced by the picked rules
if (process.argv.includes('--auto-keyframes')) {
  const names = new Set([...css.matchAll(/@keyframes\s+([\w-]+)/g)].map((m) => m[1]));
  for (const m of emit(parse(css)).matchAll(/animation(?:-name)?:([^;}]*)/g)) for (const w of m[1].split(/[\s,]+/)) if (names.has(w)) wantKf.add(w);
}
const result = emit(parse(css));

// --pretty: indented, one declaration per line (same style as app/styles/*.css)
function format(nodes, depth = 0) {
  const pad = '  '.repeat(depth);
  return nodes.filter((n) => !n.statement).map((n) => {
    const head = n.prelude.replace(/\s*,\s*(?![^()]*\))/g, `,\n${pad}`).replace(/:(hover|focus|is|not|where|has)\(/g, ':$1(');
    if (n.children) return `${pad}${head} {\n${format(n.children, depth + 1)}${pad}}\n`;
    if (/^@keyframes/.test(n.prelude)) {
      const steps = parse(n.body).map((k) => `${pad}  ${k.prelude} { ${k.body.split(';').filter(Boolean).map((d) => d.trim().replace(/:\s*/, ': ')).join('; ')}; }`);
      return `${pad}${head} {\n${steps.join('\n')}\n${pad}}\n`;
    }
    const decls = [];
    let cur = '', paren = 0;
    for (const c of n.body) { if (c === '(') paren++; if (c === ')') paren--; if (c === ';' && !paren) { decls.push(cur); cur = ''; } else cur += c; }
    if (cur.trim()) decls.push(cur);
    return `${pad}${head} {\n${decls.map((d) => `${pad}  ${d.trim().replace(/^([\w-]+):\s*/, '$1: ')};`).join('\n')}\n${pad}}\n`;
  }).join(depth ? '' : '\n');
}

if (process.argv.includes('--pretty')) {
  process.stdout.write(format(parse(result)));
} else {
  // one rule per line for readability
  let pretty = '';
  for (const c of result) { pretty += c; if (c === '}') pretty += '\n'; }
  process.stdout.write(pretty);
}
