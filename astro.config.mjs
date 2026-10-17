// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// Canonical/OG URLs. On Vercel this resolves to the production domain automatically
// (e.g. https://your-project.vercel.app); SITE_URL overrides it if you add a custom domain later.
const site =
  process.env.SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : 'http://localhost:4321');

export default defineConfig({
  site,
  integrations: [sitemap()],
  build: {
    // ~6 KB gzipped: cheaper inline than as a render-blocking request.
    inlineStylesheets: 'always',
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
