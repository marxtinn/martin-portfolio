import { expect, test } from '@playwright/test';

test.beforeEach(async ({ isMobile }) => {
  test.skip(!isMobile, 'mobile-only behavior');
});

test('menu opens, navigates, and closes', async ({ page }) => {
  await page.goto('/');
  const toggle = page.getByRole('button', { name: 'Menu' });
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');

  await toggle.click();
  const menu = page.locator('#mobile-menu');
  await expect(menu).toBeVisible();
  await expect(page.getByRole('button', { name: 'Close' })).toHaveAttribute('aria-expanded', 'true');

  await menu.getByRole('link', { name: 'Stack' }).click();
  await expect(menu).toBeHidden();
  await expect(page.locator('#stack')).toBeInViewport();
});

test('nothing overflows horizontally', async ({ page }) => {
  await page.goto('/');
  const overflow = await page.evaluate(async () => {
    const widths: number[] = [];
    for (let y = 0; y < document.body.scrollHeight; y += 700) {
      window.scrollTo({ top: y, behavior: 'instant' });
      await new Promise((r) => setTimeout(r, 20));
      widths.push(document.documentElement.scrollWidth - document.documentElement.clientWidth);
    }
    return Math.max(...widths);
  });
  expect(overflow).toBe(0);
});
