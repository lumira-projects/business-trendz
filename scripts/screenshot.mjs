#!/usr/bin/env node
/**
 * Spin up a quick static server on the dist/ folder, screenshot the key pages,
 * and save them under outputs/ so we can share visual previews with the user.
 */
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(ROOT, 'dist');
const OUT = process.argv[2] || path.join(ROOT, 'screenshots');

fs.mkdirSync(OUT, { recursive: true });

// ---------- Tiny static server ----------
const mime = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.xml': 'application/xml',
  '.json': 'application/json',
};

const server = http.createServer((req, res) => {
  let urlPath = decodeURIComponent(req.url.split('?')[0]);
  if (urlPath.endsWith('/')) urlPath += 'index.html';
  let filePath = path.join(DIST, urlPath);
  if (!fs.existsSync(filePath) && fs.existsSync(filePath + '/index.html')) {
    filePath = filePath + '/index.html';
  }
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not found');
    return;
  }
  const ext = path.extname(filePath).toLowerCase();
  res.writeHead(200, { 'Content-Type': mime[ext] || 'application/octet-stream' });
  fs.createReadStream(filePath).pipe(res);
});

await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const PORT = server.address().port;
const BASE = `http://127.0.0.1:${PORT}`;
console.log(`Local preview server: ${BASE}`);

// ---------- Capture screenshots ----------
const browser = await puppeteer.launch({
  headless: 'new',
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
});

const targets = [
  { name: 'home-desktop',         url: '/',                            viewport: { width: 1440, height: 900 }, fullPage: true },
  { name: 'home-mobile',          url: '/',                            viewport: { width: 390,  height: 844 }, fullPage: true },
  { name: 'article-desktop',      url: '/guide-credit-bailleur/',      viewport: { width: 1440, height: 900 }, fullPage: true },
  { name: 'article-mobile',       url: '/guide-credit-bailleur/',      viewport: { width: 390,  height: 844 }, fullPage: true },
  { name: 'category-desktop',     url: '/c/business/',                 viewport: { width: 1440, height: 900 }, fullPage: true },
  { name: 'contact-desktop',      url: '/nous-contacter/',             viewport: { width: 1440, height: 900 }, fullPage: true },
];

for (const t of targets) {
  const page = await browser.newPage();
  await page.setViewport({ ...t.viewport, deviceScaleFactor: 2 });
  await page.goto(BASE + t.url, { waitUntil: 'networkidle0', timeout: 30000 });
  // Wait briefly for fonts to settle
  await new Promise((r) => setTimeout(r, 600));
  const outPath = path.join(OUT, `${t.name}.png`);
  await page.screenshot({ path: outPath, fullPage: t.fullPage });
  console.log(`  ✓ ${t.name} → ${outPath}`);
  await page.close();
}

await browser.close();
server.close();
console.log('\nDone.');
