import { expect, test } from '@playwright/test';

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  test('all content is still visible', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    // Scroll-reveal must never hide content when the script cannot run.
    const hidden = await page.locator('[data-reveal]').evaluateAll((els) =>
      els.filter((el) => getComputedStyle(el).opacity === '0').length,
    );
    expect(hidden).toBe(0);
    await expect(page.locator('[data-count="71"]')).toHaveText('71');
  });
});

test.describe('with reduced motion', () => {
  test.use({ reducedMotion: 'reduce' });

  test('content is shown immediately, without waiting to scroll', async ({ page }) => {
    await page.goto('/');
    const lastSection = page.locator('#contact [data-reveal]').first();
    await expect(lastSection).toHaveCSS('opacity', '1');
  });
});

test('falls back to a still image when WebGL2 is unavailable', async ({ page }) => {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    // @ts-expect-error narrowing the overloads is not useful here
    HTMLCanvasElement.prototype.getContext = function (type: string, ...rest: unknown[]) {
      if (type === 'webgl2') return null;
      return original.call(this, type, ...rest);
    };
  });
  await page.emulateMedia({ colorScheme: 'light' });
  await page.goto('/');
  await expect(page.locator('[data-chrome]')).toHaveAttribute('data-fallback', 'true');
  const still = page.locator('img[src="/chrome-light.webp"]');
  await expect(still).toBeVisible();
  await expect.poll(() => still.evaluate((img: HTMLImageElement) => img.naturalWidth)).toBeGreaterThan(0);
});

test('the shader compiles and renders when WebGL2 is available', async ({ page, browserName }) => {
  test.skip(browserName !== 'chromium', 'headless WebGL2 support varies by engine');
  // Headless browsers render WebGL in software, which the site deliberately avoids; force it on here.
  await page.goto('/?force-webgl');
  const canvas = page.locator('[data-chrome]');
  await expect.poll(() => canvas.evaluate((c: HTMLCanvasElement) => c.width)).toBeGreaterThan(0);
  await expect(canvas).not.toHaveAttribute('data-fallback', 'true');
});

test('uses the still image instead of software-rendered WebGL', async ({ page, browserName }) => {
  test.skip(browserName !== 'chromium', 'only Chromium reports a SwiftShader renderer headlessly');
  await page.addInitScript(() => {
    const original = WebGL2RenderingContext.prototype.getParameter;
    WebGL2RenderingContext.prototype.getParameter = function (p: number) {
      const info = this.getExtension('WEBGL_debug_renderer_info');
      if (p === info?.UNMASKED_RENDERER_WEBGL || p === this.RENDERER) return 'Google SwiftShader';
      return original.call(this, p);
    };
  });
  await page.goto('/');
  await expect(page.locator('[data-chrome]')).toHaveAttribute('data-fallback', 'true');
});

test('unknown routes return the 404 page', async ({ page }) => {
  const res = await page.goto('/this-page-does-not-exist');
  expect(res?.status()).toBe(404);
  await expect(page.getByRole('heading', { name: "This page doesn't exist." })).toBeVisible();
});
