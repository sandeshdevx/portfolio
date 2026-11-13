// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Set SITE_URL in CI or replace the fallback once the production domain is known.
// The fallback keeps the static build and sitemap generation deterministic without secrets.
const site = process.env.SITE_URL ?? 'https://example.com';

// https://astro.build/config
export default defineConfig({
  devToolbar: {
    enabled: false
  },
  site,
  output: 'static',
  trailingSlash: 'never',
  integrations: [
    sitemap({
      filter: (page) => !page.endsWith('/og') && !page.endsWith('/og/'),
    }),
  ],
  build: {
    format: 'directory',
  },
});
