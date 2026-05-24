#!/usr/bin/env node
/**
 * Scrape Google Maps search results for a local business keyword.
 * Usage: node scripts/scrape-local-maps.mjs "entreprise de peinture paris"
 * Outputs JSON array of up to 10 results to stdout.
 * Errors go to stderr so they don't pollute the JSON output.
 */
import puppeteer from 'puppeteer';

const keyword = process.argv.slice(2).join(' ').trim();
if (!keyword) {
  process.stderr.write('Usage: node scripts/scrape-local-maps.mjs "keyword"\n');
  process.exit(1);
}

const encoded = encodeURIComponent(keyword);
const url = `https://www.google.com/maps/search/${encoded}`;
process.stderr.write(`Scraping: ${url}\n`);

const browser = await puppeteer.launch({
  headless: 'new',
  args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-blink-features=AutomationControlled',
    '--lang=fr-FR,fr',
  ],
});

try {
  const page = await browser.newPage();

  await page.setExtraHTTPHeaders({ 'Accept-Language': 'fr-FR,fr;q=0.9' });
  await page.setViewport({ width: 1440, height: 900 });

  // Bypass Google consent page by pre-setting the CONSENT cookie
  await page.setCookie({
    name: 'CONSENT',
    value: 'YES+cb.20240101-00-p0.fr+FX+000',
    domain: '.google.com',
    path: '/',
    expires: Math.floor(Date.now() / 1000) + 365 * 24 * 3600,
  });
  await page.setCookie({
    name: 'SOCS',
    value: 'CAISHAgCEhJnd3NfMjAyNDA2MDEtMF9SQzEaAmZyIAEaBgiA_LWyBg',
    domain: '.google.com',
    path: '/',
    expires: Math.floor(Date.now() / 1000) + 365 * 24 * 3600,
  });

  await page.goto(url, { waitUntil: 'networkidle2', timeout: 45000 });

  // If consent page still appeared, click accept
  if (page.url().includes('consent.google') || page.url().includes('accounts.google')) {
    process.stderr.write('Consent page detected, clicking accept...\n');
    const btns = await page.$$('button');
    for (const btn of btns) {
      const text = await page.evaluate(el => el.textContent.trim(), btn);
      if (/accept|tout accepter|j'accepte/i.test(text)) {
        await btn.click();
        await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 15000 }).catch(() => {});
        break;
      }
    }
  }

  // Wait for the results feed
  await page.waitForSelector('[role="feed"]', { timeout: 20000 });
  // Extra wait for lazy-loaded cards
  await new Promise(r => setTimeout(r, 3000));

  const results = await page.evaluate(() => {
    const feed = document.querySelector('[role="feed"]');
    if (!feed) return [];

    const businesses = [];

    for (const child of Array.from(feed.children)) {
      if (businesses.length >= 10) break;

      // Each result card contains a link to the place
      const placeLink = child.querySelector('a[href*="/maps/place/"]');
      if (!placeLink) continue;

      // Name: most reliably in aria-label of the place link
      const name = (placeLink.getAttribute('aria-label') || '').trim();
      if (!name) continue;

      // Collect all non-empty text lines from the card (excluding duplicates of the name)
      const rawLines = [];
      const walker = document.createTreeWalker(child, NodeFilter.SHOW_TEXT);
      let node;
      while ((node = walker.nextNode())) {
        const t = node.textContent.trim();
        if (t && t !== name && t.length > 1 && !rawLines.includes(t)) {
          rawLines.push(t);
        }
      }

      // Try to extract rating from aria-label (e.g. "4,5 étoiles 123 avis")
      let rating = null;
      let reviewCount = null;
      const ratingEl = child.querySelector('[aria-label*="toile"]');
      if (ratingEl) {
        const label = ratingEl.getAttribute('aria-label') || '';
        const rMatch = label.match(/([\d][,\.][\d])/);
        if (rMatch) rating = rMatch[1].replace(',', '.');
        const cMatch = label.match(/(\d[\s ]?\d*)\s*avis/i);
        if (cMatch) reviewCount = cMatch[1].replace(/[\s ]/g, '');
      }

      businesses.push({
        name,
        rating,
        reviewCount,
        placeUrl: placeLink.href,
        rawLines,
      });
    }

    return businesses;
  });

  process.stderr.write(`Found ${results.length} results\n`);
  process.stdout.write(JSON.stringify(results, null, 2) + '\n');
} catch (err) {
  process.stderr.write(`Error: ${err.message}\n`);
  process.exit(1);
} finally {
  await browser.close();
}
