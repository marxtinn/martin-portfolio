import { expect, test } from '@playwright/test';
import { scrollToTop, trackErrors } from './helpers';

const EMAIL = 'butarbutar.m@gmail.com';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('renders the core content and landmarks', async ({ page }) => {
  await expect(page).toHaveTitle('Martin Butarbutar, Frontend Engineer');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(/Interfaces that stay\s+easy to change\./);
  await expect(page.getByRole('navigation', { name: 'Primary' })).toBeVisible();
  for (const id of ['work', 'experience', 'stack', 'contact']) {
    await expect(page.locator(`section#${id}`)).toHaveCount(1);
  }
});

test('nav links scroll to their section and mark it current', async ({ page, isMobile }) => {
  test.skip(isMobile, 'desktop nav is hidden on mobile; covered in mobile.spec');
  const nav = page.getByRole('navigation', { name: 'Primary' });
  await nav.getByRole('link', { name: 'Experience' }).click();
  await expect(page.locator('#experience')).toBeInViewport();
  await expect(nav.getByRole('link', { name: 'Experience' })).toHaveAttribute('aria-current', 'true');
  await expect(nav.getByRole('link', { name: 'Work' })).toHaveAttribute('aria-current', 'false');
});

test('metrics settle on their real values', async ({ page }) => {
  await scrollToTop(page, '#metrics-title');
  for (const value of ['71', '314', '87', '283']) {
    await expect(page.locator(`[data-count="${value}"]`)).toHaveText(value);
  }
});

test('every project opens a dialog with its details', async ({ page }) => {
  const triggers = page.locator('[data-open]');
  await expect(triggers).toHaveCount(8);

  for (const trigger of await triggers.all()) {
    const title = (await trigger.locator('span').first().innerText()).split('\n')[0].trim();
    await trigger.scrollIntoViewIfNeeded();
    await trigger.click();
    const dialog = page.getByRole('dialog', { name: title });
    await expect(dialog).toBeVisible();
    await expect(dialog.locator('ol > li').first()).toBeVisible();
    await dialog.getByRole('button', { name: 'Close' }).click();
    await expect(dialog).toBeHidden();
  }
});

test('dialog closes on Escape and returns focus to its trigger', async ({ page }) => {
  const trigger = page.locator('[data-open="compliance"]');
  await trigger.scrollIntoViewIfNeeded();
  await trigger.click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.locator('html')).toHaveCSS('overflow', 'hidden');

  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toBeHidden();
  await expect(trigger).toBeFocused();
  await expect(page.locator('html')).not.toHaveCSS('overflow', 'hidden');
});

test('dialog closes when clicking the backdrop', async ({ page }) => {
  const trigger = page.locator('[data-open="tracker"]');
  await trigger.scrollIntoViewIfNeeded();
  await trigger.click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.mouse.click(4, 4);
  await expect(page.getByRole('dialog')).toBeHidden();
});

test('copy button puts the email on the clipboard', async ({ page, context, browserName }) => {
  test.skip(browserName !== 'chromium', 'clipboard permissions are only grantable in Chromium');
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  const button = page.locator('[data-copy]');
  await button.scrollIntoViewIfNeeded();
  await button.click();
  await expect(button).toContainText('Copied to clipboard');
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(EMAIL);
  await expect(button).toContainText(EMAIL, { timeout: 4000 });
});

test('contact and resume links are wired correctly', async ({ page, request }) => {
  const contact = page.locator('#contact');
  await expect(contact.getByRole('link', { name: 'Email' })).not.toHaveAttribute('target', /.+/);
  await expect(contact.getByRole('link', { name: 'Email' })).toHaveAttribute('href', `mailto:${EMAIL}`);
  for (const name of ['LinkedIn', 'GitHub', 'Resume']) {
    const link = contact.getByRole('link', { name: new RegExp(`^${name}`) });
    await expect(link).toHaveAttribute('target', '_blank');
    await expect(link).toHaveAttribute('rel', /noopener/);
  }

  // Every resume link, wherever it appears, opens in a new tab and says so to screen readers.
  const resumeLinks = page.locator('a[href="/Martin-Butarbutar-Resume.pdf"]');
  await expect(resumeLinks).toHaveCount(3);
  for (const link of await resumeLinks.all()) {
    await expect(link).toHaveAttribute('target', '_blank');
    await expect(link).toContainText('(opens in a new tab)');
  }
  const pdf = await request.get('/Martin-Butarbutar-Resume.pdf');
  expect(pdf.status()).toBe(200);
  expect(pdf.headers()['content-type']).toContain('pdf');
});

test('share metadata points at real files', async ({ page, request }) => {
  const og = await page.locator('meta[property="og:image"]').getAttribute('content');
  expect(og).toMatch(/^https?:\/\//);
  const res = await request.get(new URL(og!).pathname);
  expect(res.status()).toBe(200);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', /^https?:\/\//);
});

test('tab and home-screen icons are linked and load', async ({ page, request }) => {
  const icons = {
    'link[rel="icon"][type="image/svg+xml"]': 'image/svg+xml',
    'link[rel="icon"][sizes="32x32"]': 'image/',
    'link[rel="apple-touch-icon"]': 'image/png',
  };
  for (const [selector, type] of Object.entries(icons)) {
    const href = await page.locator(selector).getAttribute('href');
    const res = await request.get(href!);
    expect(res.status(), href!).toBe(200);
    expect(res.headers()['content-type']).toContain(type);
  }
});

test('loads and scrolls the whole page without errors', async ({ page }) => {
  const errors = trackErrors(page);
  await page.reload();
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 600) {
      window.scrollTo({ top: y, behavior: 'instant' });
      await new Promise((r) => setTimeout(r, 30));
    }
  });
  expect(errors).toEqual([]);
});
