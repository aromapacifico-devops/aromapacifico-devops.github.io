// Exports each page of the architecture diagram file to an SVG for the site.
// Usage: node scripts/diagrams.mjs [path to aromapacifico-devops-docs]
// Needs the draw.io desktop CLI. DRAWIO_CMD overrides the command, for example DRAWIO_CMD="drawio".
// The flatpak build reads and writes only under the home directory.
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, readdirSync, mkdirSync } from 'node:fs';
import { join, resolve } from 'node:path';

const docs = resolve(process.argv[2] || '../aromapacifico-devops-docs');
const dir = join(docs, 'docs/architecture/diagrams');
const out = resolve('public/img/diagrams');
const icons = resolve('scripts/icons');
const cmd = (process.env.DRAWIO_CMD || 'flatpak run com.jgraph.drawio.desktop').split(' ');
mkdirSync(out, { recursive: true });

// Page order follows the numbered PNG files of the documents repository
const names = readdirSync(dir).filter((n) => n.endsWith('.drawio.png')).map((n) => n.replace('.drawio.png', '')).sort();

names.forEach((name, i) => {
  const file = join(out, `${name}.svg`);
  execFileSync(cmd[0], [...cmd.slice(1), '--disable-gpu', '-x', '-f', 'svg', '--theme', 'light', '-b', '20', '-p', String(i + 1), '-o', file, join(dir, 'platform-architecture.drawio')], { stdio: 'ignore', timeout: 180000 });
  let svg = readFileSync(file, 'utf8');
  // Labels keep their HTML text. The PNG copy of each label that draw.io adds as a fallback is dropped.
  svg = svg.replace(/(<\/foreignObject>)<image [^>]*\/>/g, '$1').replace(/ requiredFeatures="[^"]*"/g, '');
  // draw.io writes its own Azure icons as paths of its installation
  svg = svg.replace(/xlink:href="file:\/\/\/[^"]*?\/img\/lib\/(azure2\/[^"]+\.svg)"/g, (_, rel) => `xlink:href="data:image/svg+xml;base64,${readFileSync(join(icons, rel)).toString('base64')}"`);
  if (svg.includes('file:///')) throw new Error(`${name} still points to a local file`);
  writeFileSync(file, svg);
  console.log(name, `${Math.round(svg.length / 1024)} kB`);
});
