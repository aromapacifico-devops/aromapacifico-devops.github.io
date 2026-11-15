// Rebuilds the screens and the brand of the site from the documents repository.
// The diagrams come from scripts/diagrams.mjs.
// Usage: node scripts/assets.mjs [path to aromapacifico-devops-docs]
// Needs pdftoppm (poppler) for the screens and the brand.
import sharp from 'sharp';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readdirSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const docs = resolve(process.argv[2] || '../aromapacifico-devops-docs');
const out = resolve('public');
const tmp = mkdtempSync(join(tmpdir(), 'aroma-site-'));
for (const d of ['img/screens', 'brand']) mkdirSync(join(out, d), { recursive: true });

// Screens of the three views, one WebP per page of each PDF
for (const view of ['farmer', 'carrier', 'buyer']) {
  execFileSync('pdftoppm', ['-r', '144', '-png', join(docs, `docs/design/${view}-views.pdf`), join(tmp, view)], { stdio: 'ignore' });
  for (const f of readdirSync(tmp).filter((n) => n.startsWith(`${view}-`))) {
    await sharp(join(tmp, f)).webp({ quality: 86 }).toFile(join(out, 'img/screens', f.replace('.png', '.webp')));
  }
}

// Brand, cut from the branding slides
execFileSync('pdftoppm', ['-r', '150', '-png', '-f', '1', '-l', '2', join(docs, 'docs/design/aroma-pacifico-branding.pdf'), join(tmp, 'brand')], { stdio: 'ignore' });
const cut = async (page, box, file, width) => {
  const img = sharp(join(tmp, `brand-${page}.png`));
  const { width: w, height: h } = await img.metadata();
  const region = { left: Math.round(box[0] * w), top: Math.round(box[1] * h), width: Math.round(box[2] * w), height: Math.round(box[3] * h) };
  const part = await img.extract(region).png().toBuffer();
  const trimmed = await sharp(part).trim({ background: '#ffffff', threshold: 12 }).png().toBuffer();
  // White becomes transparent so the mark sits on the warm canvas
  const { data, info } = await sharp(trimmed).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  for (let i = 0; i < data.length; i += 4) {
    const m = Math.min(data[i], data[i + 1], data[i + 2]);
    if (m > 235) data[i + 3] = Math.round(((255 - m) / 20) * 255);
  }
  await sharp(data, { raw: info }).resize({ width }).png().toFile(join(out, 'brand', file));
};
await cut(1, [0.5, 0.02, 0.48, 0.3], 'logo.png', 640);
await cut(2, [0.1, 0.36, 0.18, 0.42], 'isotype.png', 256);

await sharp(join(docs, 'docs/design/design-system-sheet.png')).resize({ width: 1800 }).webp({ quality: 86 }).toFile(join(out, 'img/design-system-sheet.webp'));
console.log('Assets rebuilt from', docs);
