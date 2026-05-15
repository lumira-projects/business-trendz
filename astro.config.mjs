import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://business-trendz.com',
  trailingSlash: 'always',
  build: {
    format: 'directory',
  },
  markdown: {
    shikiConfig: {
      theme: 'github-light',
      wrap: true,
    },
  },
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/admin/') && !page.includes('/api/'),
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
      i18n: { defaultLocale: 'fr', locales: { fr: 'fr-FR' } },
      serialize(item) {
        // Higher priority for the homepage
        if (item.url === 'https://business-trendz.com/') {
          return { ...item, priority: 1.0, changefreq: 'daily' };
        }
        // Higher priority for category pages
        if (item.url.includes('/c/')) {
          return { ...item, priority: 0.8, changefreq: 'daily' };
        }
        // Legal pages: low priority
        if (
          item.url.includes('/mentions-legales/') ||
          item.url.includes('/politique-') ||
          item.url.includes('/nous-contacter/')
        ) {
          return { ...item, priority: 0.3, changefreq: 'yearly' };
        }
        return item;
      },
    }),
  ],
});
