#!/usr/bin/env node
/**
 * Scrape Google Maps search results for a local business keyword.
 * Usage: node scripts/scrape-local-maps.mjs "entreprise de peinture paris"
 * Outputs JSON array of up to 10 results to stdout.
 * Errors go to stderr so they don't pollute the JSON output.
 *
 * Each result includes:
 *   name, rating, reviewCount, placeUrl, rawLines,
 *   lat, lng  (from placeUrl coords),
 *   schedule  { Lundi: "09:00 – 18:00", Mardi: ..., ... } (best-effort from place page)
 */
import puppeteer from 'puppeteer';

const keyword = process.argv.slice(2).join(' ').trim();
if (!keyword) {
  process.stderr.write('Usage: node scripts/scrape-local-maps.mjs "keyword"\n');
  process.exit(1);
}

const FR_DAYS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

const COOKIES = [
  {
    name: 'CONSENT',
    value: 'YES+cb.20240101-00-p0.fr+FX+000',
    domain: '.google.com',
    path: '/',
    expires: Math.floor(Date.now() / 1000) + 365 * 24 * 3600,
  },
  {
    name: 'SOCS',
    value: 'CAISHAgCEhJnd3NfMjAyNDA2MDEtMF9SQzEaAmZyIAEaBgiA_LWyBg',
    domain: '.google.com',
    path: '/',
    expires: Math.floor(Date.now() / 1000) + 365 * 24 * 3600,
  },
];

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

async function fetchSchedule(placeUrl) {
  const page = await browser.newPage();
  const schedule = {};
  try {
    await page.setExtraHTTPHeaders({ 'Accept-Language': 'fr-FR,fr;q=0.9' });
    for (const c of COOKIES) await page.setCookie(c);
    await page.goto(placeUrl, { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise(r => setTimeout(r, 2500));

    // Try to expand the hours section if it's collapsed
    await page.evaluate(() => {
      const btns = [...document.querySelectorAll('button')];
      const hoursBtn = btns.find(b =>
        /horaires|opening hours/i.test(b.getAttribute('aria-label') || b.textContent)
        && !/fermer/i.test(b.getAttribute('aria-label') || '')
      );
      if (hoursBtn) hoursBtn.click();
    }).catch(() => {});
    await new Promise(r => setTimeout(r, 1000));

    const raw = await page.evaluate((days) => {
      const result = {};

      // Strategy 1: <table><tr><td> structure
      document.querySelectorAll('table tr').forEach(row => {
        const cells = [...row.querySelectorAll('td')];
        if (cells.length < 2) return;
        const dayText = cells[0].textContent.trim();
        const day = days.find(d => d.toLowerCase() === dayText.toLowerCase());
        if (day) {
          result[day] = cells.slice(1).map(c => c.textContent.trim()).join(' ').trim() || 'Fermé';
        }
      });
      if (Object.keys(result).length >= 5) return result;

      // Strategy 2: walk all text nodes, match "DayName" followed by a time/status
      const textNodes = [];
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      let node;
      while ((node = walker.nextNode())) {
        const t = node.textContent.trim();
        if (t.length > 1) textNodes.push(t);
      }

      for (let i = 0; i < textNodes.length; i++) {
        const t = textNodes[i];
        const day = days.find(d => d.toLowerCase() === t.toLowerCase());
        if (!day || result[day]) continue;
        // Next 1-3 text nodes may contain the time(s)
        const candidates = textNodes.slice(i + 1, i + 4).join(' ');
        const timeMatch = candidates.match(/(\d{1,2}[h:]\d{2}\s*[–\-]\s*\d{1,2}[h:]\d{2}|Ouvert 24h\/24|Fermé)/i);
        if (timeMatch) result[day] = timeMatch[0].trim();
      }

      // Strategy 3: aria-label scan (some Google Maps versions embed hours there)
      if (Object.keys(result).length < 5) {
        document.querySelectorAll('[aria-label]').forEach(el => {
          const lbl = el.getAttribute('aria-label') || '';
          days.forEach(day => {
            if (result[day]) return;
            const rx = new RegExp(day + '[\\s:,;]+([\\d:h\\s–\\-]+(?:Fermé)?|Ouvert 24h\\/24)', 'i');
            const m = lbl.match(rx);
            if (m) result[day] = m[1].trim();
          });
        });
      }

      return result;
    }, FR_DAYS);

    Object.assign(schedule, raw);
  } catch (err) {
    process.stderr.write(`  Schedule fetch failed: ${err.message}\n`);
  } finally {
    await page.close();
  }
  return schedule;
}

try {
  const page = await browser.newPage();

  await page.setExtraHTTPHeaders({ 'Accept-Language': 'fr-FR,fr;q=0.9' });
  await page.setViewport({ width: 1440, height: 900 });

  for (const c of COOKIES) await page.setCookie(c);

  await page.goto(url, { waitUntil: 'networkidle2', timeout: 45000 });

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

  await page.waitForSelector('[role="feed"]', { timeout: 20000 });
  await new Promise(r => setTimeout(r, 3000));

  const results = await page.evaluate(() => {
    const feed = document.querySelector('[role="feed"]');
    if (!feed) return [];

    const businesses = [];

    for (const child of Array.from(feed.children)) {
      if (businesses.length >= 10) break;

      const placeLink = child.querySelector('a[href*="/maps/place/"]');
      if (!placeLink) continue;

      const name = (placeLink.getAttribute('aria-label') || '').trim();
      if (!name) continue;

      const rawLines = [];
      const walker = document.createTreeWalker(child, NodeFilter.SHOW_TEXT);
      let node;
      while ((node = walker.nextNode())) {
        const t = node.textContent.trim();
        if (t && t !== name && t.length > 1 && !rawLines.includes(t)) {
          rawLines.push(t);
        }
      }

      let rating = null;
      let reviewCount = null;
      const ratingEl = child.querySelector('[aria-label*="toile"]');
      if (ratingEl) {
        const label = ratingEl.getAttribute('aria-label') || '';
        const rMatch = label.match(/([\d][,\.][\d])/);
        if (rMatch) rating = rMatch[1].replace(',', '.');
        const cMatch = label.match(/(\d[\s ]?\d*)\s*avis/i);
        if (cMatch) reviewCount = cMatch[1].replace(/[\s ]/g, '');
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

  // Enrich each result with coordinates and full schedule
  for (const result of results) {
    // Coordinates from URL pattern !3d{lat}!4d{lng}
    const coordMatch = result.placeUrl.match(/!3d([\d.-]+)!4d([\d.-]+)/);
    if (coordMatch) {
      result.lat = parseFloat(coordMatch[1]);
      result.lng = parseFloat(coordMatch[2]);
    } else {
      result.lat = null;
      result.lng = null;
    }

    process.stderr.write(`  Fetching schedule for: ${result.name}\n`);
    result.schedule = await fetchSchedule(result.placeUrl);
    const dayCount = Object.keys(result.schedule).length;
    process.stderr.write(`    → ${dayCount} day(s) found\n`);

    await new Promise(r => setTimeout(r, 500));
  }

  process.stdout.write(JSON.stringify(results, null, 2) + '\n');
} catch (err) {
  process.stderr.write(`Error: ${err.message}\n`);
  process.exit(1);
} finally {
  await browser.close();
}
