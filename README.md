# Business Trendz

Static site built with [Astro](https://astro.build) — migrated from WordPress in May 2026.

## Stack

- **Framework**: Astro v5 (static site generator)
- **Hosting**: Cloudflare Pages
- **Domain**: business-trendz.com (registered at OVH, DNS managed by Cloudflare)
- **Form backend**: Web3Forms → `lumiraprojects@gmail.com`
- **Content**: Markdown files in `src/content/`

## Project structure

```
site/
├── public/                 # Static assets (favicon, og-default.svg, robots.txt, /uploads/)
├── scripts/                # WordPress migration scripts
│   ├── convert-wxr.mjs     # WXR → Markdown converter
│   └── fetch-images.mjs    # Download images from old WP site
├── src/
│   ├── components/         # Header, Footer, ArticleCard
│   ├── content/
│   │   ├── articles/       # 65 blog posts (.md)
│   │   └── pages/          # Legal pages (mentions, politique...)
│   ├── layouts/            # BaseLayout, ArticleLayout, PageLayout
│   ├── pages/              # Routes (index, [slug], c/[category], etc.)
│   └── styles/global.css   # Design system (typography, colors, gradients)
└── astro.config.mjs
```

## Local development

```bash
npm install
npm run dev          # Hot-reloading dev server on http://localhost:4321/
npm run build        # Production build → dist/
npm run preview      # Serve the production build locally
```

## Re-importing content from WordPress

If we ever need to re-run the migration:

```bash
npm run convert         # Parses ../wordpress-export/*.xml → src/content/
npm run fetch-images    # Downloads all referenced images to public/uploads/
```

Skipped slugs (managed manually) are listed in `scripts/convert-wxr.mjs`.

## Deployment

Pushed to GitHub `main` branch → Cloudflare Pages auto-builds and deploys.

Build settings (Cloudflare Pages):
- Build command: `npm run build`
- Build output: `dist`
- Node version: 22

## Custom domain

- `business-trendz.com` and `www.business-trendz.com` are attached to the Cloudflare Pages project.
- Domain registered at OVH, nameservers point to Cloudflare.

## Design

See `src/styles/global.css` for the full design system:
- **Headlines**: Archivo Black (sentence case, never uppercase)
- **Serif accent**: DM Serif Display (italic, blue→coral gradient)
- **Body**: Inter
- **Brand gradient**: `#1E3A8A → #6366F1 → #EC4899 → #FF6B6B`

## Contact form

The contact form in `src/pages/nous-contacter.astro` uses Web3Forms.
At deploy time, the placeholder `WEB3FORMS_ACCESS_KEY` is replaced with the real access key
generated for `lumiraprojects@gmail.com`.
