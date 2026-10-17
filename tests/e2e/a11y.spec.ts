import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

// Reduced motion renders every section in its final state, so axe checks what users actually read.
test.use({ reducedMotion: 'reduce' });

for (const scheme of ['light', 'dark'] as const) {
  test(`no WCAG 2.1 AA violations in ${scheme} mode`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: scheme, reducedMotion: 'reduce' });
    await page.goto('/');
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
    expect(results.violations).toEqual([]);
  });
}

test('no violations with a project dialog open', async ({ page }) => {
  await page.goto('/');
  const trigger = page.locator('[data-open="assistant"]');
  await trigger.scrollIntoViewIfNeeded();
  await trigger.click();
  await expect(page.getByRole('dialog')).toBeVisible();
  const results = await new AxeBuilder({ page }).include('dialog[open]').withTags(['wcag2a', 'wcag2aa']).analyze();
  expect(results.violations).toEqual([]);
});

test('skip link moves focus to the main content', async ({ page, browserName, isMobile }) => {
  test.skip(isMobile, 'keyboard navigation');
  test.skip(browserName === 'webkit', 'Safari only tabs to links when the user enables it');
  await page.goto('/');
  await page.keyboard.press('Tab');
  const skip = page.getByRole('link', { name: 'Skip to content' });
  await expect(skip).toBeFocused();
  await expect(skip).toBeVisible();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/#main$/);
});
