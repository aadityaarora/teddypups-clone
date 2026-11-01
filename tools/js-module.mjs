// Print the minified source of the Turbopack module that exports <Name> (searches recon/js/*.js)
// usage: node tools/js-module.mjs <ExportName> [maxChars]
import fs from 'node:fs';
const [, , name, max = '20000'] = process.argv;
for (const f of fs.readdirSync('recon/js')) {
  const s = fs.readFileSync(`recon/js/${f}`, 'utf8');
  const at = s.indexOf(`s(["${name}"`);
  if (at < 0) continue;
  // module headers look like `},12345,e=>{` or `,12345,e=>{` (optionally several ids)
  const heads = [...s.slice(0, at).matchAll(/[,\[](\d{2,6}),(?:\d{2,6},)*[a-z]=>\{/g)];
  const start = heads.length ? heads[heads.length - 1].index : 0;
  console.log(`// ${f} @${start}`);
  console.log(s.slice(start, Math.min(at + 200, start + +max)));
  break;
}
