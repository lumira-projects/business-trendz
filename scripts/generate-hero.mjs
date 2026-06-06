#!/usr/bin/env node
/**
 * Generate a hero image using Hugging Face Inference API (free tier).
 * Requires: HF_TOKEN env variable (token gratuit sur huggingface.co)
 * Converts to .webp quality 85 and saves in public/uploads/YYYY/MM/[slug].webp
 *
 * Usage:
 *   HF_TOKEN=hf_xxx node scripts/generate-hero.mjs [slug] "[prompt]"
 *
 * Ou avec le token dans .env.local :
 *   node scripts/generate-hero.mjs [slug] "[prompt]"
 */

import { createWriteStream, mkdirSync, unlinkSync, existsSync, readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SITE_ROOT = path.resolve(__dirname, '..');

// Load .env.local if present
const envPath = path.join(SITE_ROOT, '.env.local');
if (existsSync(envPath)) {
  readFileSync(envPath, 'utf8').split('\n').forEach((line) => {
    const [key, ...val] = line.split('=');
    if (key && val.length && !process.env[key.trim()]) {
      process.env[key.trim()] = val.join('=').trim().replace(/^["']|["']$/g, '');
    }
  });
}

const HF_TOKEN = process.env.HF_TOKEN;
if (!HF_TOKEN) {
  console.error('Erreur : HF_TOKEN manquant.');
  console.error('1. Crée un token gratuit sur https://huggingface.co/settings/tokens');
  console.error('2. Ajoute HF_TOKEN=hf_xxx dans le fichier .env.local à la racine du site');
  process.exit(1);
}

const [,, slug, ...promptParts] = process.argv;
const prompt = promptParts.join(' ');

if (!slug || !prompt) {
  console.error('Usage: node scripts/generate-hero.mjs [slug] "[prompt]"');
  process.exit(1);
}

// Target directory
const now = new Date();
const year = now.getFullYear();
const month = String(now.getMonth() + 1).padStart(2, '0');
const uploadDir = path.join(SITE_ROOT, 'public', 'uploads', String(year), month);
const webpPath = path.join(uploadDir, `${slug}.webp`);
const tmpPath = path.join(uploadDir, `${slug}_tmp.bin`);

mkdirSync(uploadDir, { recursive: true });

console.log(`Generating image for "${slug}"...`);
console.log(`Prompt: ${prompt}\n`);

// Call HuggingFace Inference API — FLUX.1-schnell (free, fast)
const HF_MODEL = 'black-forest-labs/FLUX.1-schnell';
const response = await fetch(
  `https://api-inference.huggingface.co/models/${HF_MODEL}`,
  {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${HF_TOKEN}`,
      'Content-Type': 'application/json',
      'x-wait-for-model': 'true',
    },
    body: JSON.stringify({
      inputs: prompt,
      parameters: { width: 1344, height: 768 },
    }),
  }
);

if (!response.ok) {
  const err = await response.text();
  console.error(`HuggingFace error ${response.status}: ${err}`);
  process.exit(1);
}

// Write binary response to tmp file
const buffer = Buffer.from(await response.arrayBuffer());
import { writeFileSync } from 'fs';
writeFileSync(tmpPath, buffer);
console.log(`Image téléchargée (${Math.round(buffer.length / 1024)} Ko)`);

// Convert to webp
const { default: sharp } = await import('sharp');
await sharp(tmpPath).webp({ quality: 85 }).toFile(webpPath);
console.log(`Converti en webp : ${webpPath}`);

unlinkSync(tmpPath);

const heroImagePath = `/uploads/${year}/${month}/${slug}.webp`;
console.log(`\nheroImage: "${heroImagePath}"`);
