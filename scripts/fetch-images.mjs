#!/usr/bin/env node
/**
 * Download all images referenced by converted articles.
 * Reads .images-to-fetch.json (produced by convert-wxr.mjs)
 * and downloads each into public/uploads/, preserving folder structure.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const LIST_PATH = path.join(ROOT, '.images-to-fetch.json');
const OUT_DIR = path.join(ROOT, 'public/uploads');

if (!fs.existsSync(LIST_PATH)) {
  console.error('No image list found. Run convert-wxr.mjs first.');
  process.exit(1);
}

const urls = JSON.parse(fs.readFileSync(LIST_PATH, 'utf-8'));
console.log(`Fetching ${urls.length} image(s)...`);

let downloaded = 0;
let skipped = 0;
let failed = 0;

// Concurrency limit
const CONCURRENCY = 8;
const queue = [...urls];

async function worker() {
  while (queue.length > 0) {
    const url = queue.shift();
    if (!url) return;
    try {
      const m = url.match(/wp-content\/uploads\/(.+)$/);
      if (!m) { failed++; continue; }
      const relPath = m[1];
      const outPath = path.join(OUT_DIR, relPath);

      if (fs.existsSync(outPath)) {
        skipped++;
        continue;
      }

      fs.mkdirSync(path.dirname(outPath), { recursive: true });

      const res = await fetch(url);
      if (!res.ok) {
        console.warn(`  ⚠ ${res.status} ${url}`);
        failed++;
        continue;
      }
      const buf = Buffer.from(await res.arrayBuffer());
      fs.writeFileSync(outPath, buf);
      downloaded++;
      if (downloaded % 10 === 0) console.log(`  Downloaded ${downloaded}/${urls.length}...`);
    } catch (err) {
      console.warn(`  ✗ ${url}: ${err.message}`);
      failed++;
    }
  }
}

await Promise.all(Array.from({ length: CONCURRENCY }, () => worker()));

console.log(`\nDownloaded: ${downloaded}`);
console.log(`Skipped (already exists): ${skipped}`);
console.log(`Failed: ${failed}`);
