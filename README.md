# Martin Butarbutar, portfolio

Astro 7 + Tailwind CSS 4. Static output, no UI framework runtime; interactions are small inline scripts.

Design: monochrome editorial layout (Instrument Sans) with a liquid-chrome hero rendered by a
single WebGL2 fragment shader in `src/scripts/chrome.ts` (no 3D library). It pauses offscreen,
caps pixel ratio at 1.5, renders one still frame under reduced motion, and leaves a plain hero
if WebGL2 is unavailable.

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

## Tests

End-to-end tests run against the production build with Playwright on Chromium, Firefox, WebKit
and a mobile profile, including axe accessibility scans in light and dark mode.

```bash
npm test          # build, serve, run everything
npm run test:ui   # interactive runner
```

CI (`.github/workflows/ci.yml`) runs the suite plus a Lighthouse budget on every push and PR:
100 for accessibility, best practices and SEO, 90+ performance, CLS under 0.05.
