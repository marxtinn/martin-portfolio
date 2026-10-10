# Martin Butarbutar, portfolio

Astro 7 + Tailwind CSS 4. Static output, no UI framework runtime; interactions are small inline scripts.

## Commands

| Command           | What it does                         |
| ----------------- | ------------------------------------ |
| `npm run dev`     | Dev server at http://localhost:4321  |
| `npm run build`   | Type-check, then build to `dist/`    |
| `npm run preview` | Serve the production build locally   |

## Editing content

All copy (projects, experience, skills, metrics) lives in `src/data/site.ts`.

- Portrait: replace `src/assets/portrait.jpg` (ideally 900px+ wide for sharp retina rendering).
- Resume: replace `public/Martin-Butarbutar-Resume.pdf`.
- Social card: `public/og.jpg` (1200x630).
- Domain: set `site` in `astro.config.mjs` before deploying.

## Deploy

Any static host works (Vercel, Netlify, Cloudflare Pages, GitHub Pages). Build command `npm run build`, output directory `dist`.
