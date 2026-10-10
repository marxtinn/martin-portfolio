// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// TODO: replace with your real domain before deploying (used for canonical + OG URLs).
export default defineConfig({
  site: 'https://martinbutarbutar.dev',
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
