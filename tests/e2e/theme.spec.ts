import { expect, test } from '@playwright/test';
import { scrollToTop } from './helpers';

test('follows the system color scheme by default', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
});

test('theme toggle switches and persists across reloads', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' });
  await page.goto('/');
  const html = page.locator('html');
  await expect(html).toHaveAttribute('data-theme', 'light');

  await page.getByRole('button', { name: 'Toggle color theme' }).click();
  await expect(html).toHaveAttribute('data-theme', 'dark');

  await page.reload();
  await expect(html).toHaveAttribute('data-theme', 'dark');
});

test('header switches to dark while the dark band is under it', async ({ page }) => {
  // Reduced motion turns off the site's smooth scrolling, so every jump below lands instantly
  // and exactly where we put it, in every engine.
  await page.emulateMedia({ colorScheme: 'light', reducedMotion: 'reduce' });
  await page.goto('/');
  const header = page.locator('[data-header]');

  await scrollToTop(page, '[data-band]', 200);
  await expect(header).toHaveAttribute('data-theme', 'dark');

  // Well past the boundary: right at it, the band's edge still touches the header zone,
  // which correctly keeps the header dark.
  await scrollToTop(page, '#experience', 200);
  await expect(header).not.toHaveAttribute('data-theme', /.+/);

  // And back again, to prove the switch works in both directions.
  await scrollToTop(page, '[data-band]', 200);
  await expect(header).toHaveAttribute('data-theme', 'dark');
});

test('header is transparent at the top and solid after scrolling', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 640 });
  await page.goto('/');
  const header = page.locator('[data-header]');
  await expect(header).toHaveAttribute('data-scrolled', 'false');
  await page.evaluate(() => window.scrollTo({ top: 400, behavior: 'instant' }));
  await expect(header).toHaveAttribute('data-scrolled', 'true');
});
