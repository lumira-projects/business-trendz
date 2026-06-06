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
      filter: (page) =>
        !page.includes('/admin/') &&
        !page.includes('/api/') &&
        !page.includes('/mentions-legales/') &&
        !page.includes('/politique-') &&
        !page.includes('/nous-contacter/'),
      changefreq: 'weekly',
      priority: 0.7,
      i18n: { defaultLocale: 'fr', locales: { fr: 'fr-FR' } },
      serialize(item) {
        if (item.url === 'https://business-trendz.com/') {
          return { ...item, priority: 1.0, changefreq: 'daily' };
        }
        if (item.url.includes('/c/')) {
          return { ...item, priority: 0.8, changefreq: 'daily' };
        }
        return item;
      },
    }),
  ],
});
