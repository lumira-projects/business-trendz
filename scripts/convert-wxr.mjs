#!/usr/bin/env node
/**
 * WordPress WXR → Astro content collection converter.
 *
 * Usage:
 *   node scripts/convert-wxr.mjs              # convert all published posts
 *   node scripts/convert-wxr.mjs <slug>       # convert only one post by slug
 *
 * Outputs:
 *   src/content/articles/<slug>.md            # Markdown with frontmatter
 *   public/uploads/<...>                       # Downloaded images
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { XMLParser } from 'fast-xml-parser';
import TurndownService from 'turndown';
import { gfm } from 'turndown-plugin-gfm';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const WXR_PATH = path.resolve(ROOT, '../wordpress-export/businesstrendz.WordPress.2026-05-14.xml');
const OUT_ARTICLES = path.join(ROOT, 'src/content/articles');
const OUT_PAGES = path.join(ROOT, 'src/content/pages');
const OUT_UPLOADS = path.join(ROOT, 'public/uploads');

// Slugs to skip during conversion:
//  - 'nous-contacter' is a custom Astro page (form, layout)
//  - 'politique-de-cookies' has empty body in WP — we maintain custom Markdown
//  - 'blog-des-tendances-business' and '' are stubs we don't need
const SKIP_PAGE_SLUGS = new Set([
  'nous-contacter',
  'politique-de-cookies',
  'blog-des-tendances-business',
  '',
]);

const onlySlug = process.argv[2];

// ---------- Read & parse WXR ----------
console.log(`Reading WXR file: ${WXR_PATH}`);
const xml = fs.readFileSync(WXR_PATH, 'utf-8');

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  cdataPropName: '__cdata',
  textNodeName: '__text',
  isArray: (name) => ['item', 'category', 'wp:postmeta'].includes(name),
});

const parsed = parser.parse(xml);
const channel = parsed.rss.channel;
const items = channel.item || [];

console.log(`Total items in WXR: ${items.length}`);

// ---------- Build attachment map (id → URL) ----------
const attachments = {};
for (const item of items) {
  const postType = unwrap(item['wp:post_type']);
  if (postType === 'attachment') {
    const id = String(unwrap(item['wp:post_id']));
    const url = unwrap(item['wp:attachment_url']);
    attachments[id] = url;
  }
}
console.log(`Attachments found: ${Object.keys(attachments).length}`);

// ---------- Setup Turndown ----------
const turndown = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
  bulletListMarker: '-',
  emDelimiter: '*',
  strongDelimiter: '**',
});
turndown.use(gfm);

// Keep figure captions
turndown.addRule('figcaption', {
  filter: ['figcaption'],
  replacement: (content) => `\n*${content.trim()}*\n`,
});

// Strip empty paragraphs (WordPress adds tons)
turndown.addRule('empty-p', {
  filter: (node) => node.nodeName === 'P' && !node.textContent.trim() && !node.querySelector('img'),
  replacement: () => '',
});

// Rewrite image URLs to local /uploads/...
turndown.addRule('local-images', {
  filter: 'img',
  replacement: (_, node) => {
    const src = node.getAttribute('src') || '';
    const alt = node.getAttribute('alt') || '';
    const localSrc = toLocalUploadPath(src);
    return localSrc ? `![${alt}](${localSrc})` : '';
  },
});

// ---------- Convert posts and pages ----------
fs.mkdirSync(OUT_ARTICLES, { recursive: true });
fs.mkdirSync(OUT_PAGES, { recursive: true });
fs.mkdirSync(OUT_UPLOADS, { recursive: true });

const imagesToFetch = new Set();
let converted = 0;
let convertedPages = 0;
let skipped = 0;

for (const item of items) {
  const postType = unwrap(item['wp:post_type']);
  const status = unwrap(item['wp:status']);

  if (postType !== 'post' && postType !== 'page') continue;
  if (status !== 'publish') {
    skipped++;
    continue;
  }

  const slug = unwrap(item['wp:post_name']);
  if (!slug) {
    skipped++;
    continue;
  }
  if (postType === 'page' && SKIP_PAGE_SLUGS.has(slug)) {
    skipped++;
    continue;
  }
  if (onlySlug && slug !== onlySlug) continue;

  const title = decodeHTML(unwrap(item.title));
  const link = unwrap(item.link);
  const pubDate = new Date(unwrap(item['wp:post_date_gmt']) || unwrap(item.pubDate));
  const updatedDate = parseUpdatedDate(item);
  const rawContent = unwrap(item['content:encoded']) || '';
  const rawExcerpt = unwrap(item['excerpt:encoded']) || '';

  // Categories (only "category" taxonomy, not "post_tag")
  const cats = (item.category || [])
    .filter((c) => c['@_domain'] === 'category')
    .map((c) => decodeHTML(unwrap(c)))
    .filter(Boolean);

  // Hero image: from postmeta _thumbnail_id
  const heroImage = getHeroImage(item, attachments);

  // Convert HTML body to Markdown
  let bodyHTML = rawContent;
  // Strip Divi shortcodes (start with [et_pb_*])
  bodyHTML = stripDiviShortcodes(bodyHTML);
  // Convert WordPress auto-paragraphs
  bodyHTML = wpautop(bodyHTML);

  let bodyMD = turndown.turndown(bodyHTML).replace(/\n{3,}/g, '\n\n').trim();

  // Strip leading H1 if it duplicates the post title (PageLayout/ArticleLayout already show it)
  const titleNorm = (s) => s.replace(/\s+/g, ' ').trim().toLowerCase();
  const firstH1Match = bodyMD.match(/^#\s+([^\n]+)\n+/);
  if (firstH1Match && titleNorm(firstH1Match[1]) === titleNorm(title)) {
    bodyMD = bodyMD.slice(firstH1Match[0].length).trim();
  }

  // Description: use excerpt or first paragraph, fully stripped of markdown/HTML
  const description = stripMarkdown(
    decodeHTML(rawExcerpt.replace(/<[^>]+>/g, '').trim())
    || extractFirstParagraph(bodyMD)
    || title
  ).slice(0, 200);

  // Reading time estimate (200 words/min)
  const wordCount = bodyMD.split(/\s+/).length;
  const readingTime = Math.max(1, Math.round(wordCount / 200));

  // Hero image path
  const localHero = heroImage ? toLocalUploadPath(heroImage) : undefined;
  if (heroImage) imagesToFetch.add(heroImage);

  // Collect images from body
  for (const m of bodyHTML.matchAll(/https:\/\/business-trendz\.com\/wp-content\/uploads\/[^\s<>"')]+\.(?:jpg|jpeg|png|webp|gif|svg)/gi)) {
    imagesToFetch.add(m[0]);
  }

  // Build frontmatter (article-specific vs page-simple)
  let frontmatter;
  let outDir;
  if (postType === 'post') {
    frontmatter = {
      title,
      description,
      pubDate: pubDate.toISOString(),
      updatedDate: updatedDate ? updatedDate.toISOString() : undefined,
      author: 'Business Trendz',
      categories: cats,
      heroImage: localHero,
      heroImageAlt: title,
      readingTime,
    };
    outDir = OUT_ARTICLES;
  } else {
    frontmatter = {
      title,
      description,
      pubDate: pubDate.toISOString(),
      updatedDate: updatedDate ? updatedDate.toISOString() : undefined,
    };
    outDir = OUT_PAGES;
  }

  const fmYAML = toYAML(frontmatter);
  const md = `---\n${fmYAML}---\n\n${bodyMD}\n`;

  const outPath = path.join(outDir, `${slug}.md`);
  fs.writeFileSync(outPath, md, 'utf-8');
  if (postType === 'post') {
    converted++;
  } else {
    convertedPages++;
  }
  console.log(`  ✓ [${postType}] ${slug}`);
}

console.log(`\nConverted: ${converted} article(s), ${convertedPages} page(s)`);
console.log(`Skipped: ${skipped}`);
console.log(`Images referenced: ${imagesToFetch.size}`);

// Write image list to disk for the fetch script
fs.writeFileSync(path.join(ROOT, '.images-to-fetch.json'), JSON.stringify([...imagesToFetch], null, 2));
console.log(`Image list written to .images-to-fetch.json\n`);

// ---------- Helpers ----------
function unwrap(node) {
  if (node === undefined || node === null) return '';
  if (typeof node === 'string') return node;
  if (typeof node === 'number') return String(node);
  if (typeof node === 'object') {
    if ('__cdata' in node) return node.__cdata;
    if ('__text' in node) return node.__text;
  }
  return '';
}

function decodeHTML(str) {
  return String(str)
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&#8217;/g, '’')
    .replace(/&#8216;/g, '‘')
    .replace(/&#8220;/g, '“')
    .replace(/&#8221;/g, '”')
    .replace(/&#8211;/g, '–')
    .replace(/&#8212;/g, '—')
    .replace(/&#8230;/g, '…')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)));
}

function parseUpdatedDate(item) {
  const postmeta = item['wp:postmeta'] || [];
  for (const m of postmeta) {
    const key = unwrap(m['wp:meta_key']);
    if (key === '_edit_last_modified' || key === 'post_modified_gmt') {
      return new Date(unwrap(m['wp:meta_value']));
    }
  }
  const modGMT = unwrap(item['wp:post_modified_gmt']);
  if (modGMT) return new Date(modGMT);
  return null;
}

function getHeroImage(item, attachments) {
  const postmeta = item['wp:postmeta'] || [];
  for (const m of postmeta) {
    const key = unwrap(m['wp:meta_key']);
    if (key === '_thumbnail_id') {
      const id = unwrap(m['wp:meta_value']);
      return attachments[id] || null;
    }
  }
  return null;
}

function toLocalUploadPath(url) {
  if (!url) return null;
  const m = url.match(/wp-content\/uploads\/(.+)$/);
  return m ? `/uploads/${m[1]}` : null;
}

function stripDiviShortcodes(html) {
  // Remove [et_pb_*] shortcodes but keep their inner content
  let prev;
  do {
    prev = html;
    html = html.replace(/\[\/?et_pb_[^\]]*\]/g, '');
    html = html.replace(/\[\/?et_[^\]]*\]/g, '');
  } while (html !== prev);
  return html;
}

function wpautop(text) {
  // Simplified version of WordPress's wpautop:
  // wrap text blocks separated by double newlines in <p>
  if (text.includes('<p>') || text.includes('<h')) {
    return text; // already has block markup
  }
  return text
    .split(/\n{2,}/)
    .map((para) => `<p>${para.trim().replace(/\n/g, '<br />')}</p>`)
    .join('\n\n');
}

function extractFirstParagraph(md) {
  const m = md.match(/^([^#\n][^\n]+)$/m);
  return m ? m[1] : '';
}

function stripMarkdown(text) {
  if (!text) return '';
  return String(text)
    // Markdown links [text](url) → text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // Reference-style links [text][ref] → text
    .replace(/\[([^\]]+)\]\[[^\]]*\]/g, '$1')
    // Images ![alt](src) → alt
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
    // Bold / italic / strikethrough markers
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/_([^_]+)_/g, '$1')
    .replace(/~~([^~]+)~~/g, '$1')
    // Inline code `text` → text
    .replace(/`([^`]+)`/g, '$1')
    // Headers
    .replace(/^#{1,6}\s+/gm, '')
    // Blockquotes
    .replace(/^>\s+/gm, '')
    // List markers
    .replace(/^[\s]*[-*+]\s+/gm, '')
    .replace(/^[\s]*\d+\.\s+/gm, '')
    // Collapse whitespace
    .replace(/\s+/g, ' ')
    .trim();
}

function toYAML(obj) {
  const lines = [];
  for (const [key, value] of Object.entries(obj)) {
    if (value === undefined || value === null || value === '') continue;
    if (Array.isArray(value)) {
      if (value.length === 0) continue;
      lines.push(`${key}:`);
      for (const v of value) lines.push(`  - ${yamlQuote(v)}`);
    } else {
      lines.push(`${key}: ${yamlQuote(value)}`);
    }
  }
  return lines.join('\n') + '\n';
}

function yamlQuote(value) {
  if (typeof value === 'number') return String(value);
  const s = String(value);
  // Always quote strings to be safe
  return `"${s.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
}
