import type { Page } from '@playwright/test';

/** Scroll an element to the top of the viewport without smooth scrolling. */
export async function scrollToTop(page: Page, selector: string) {
  await page.evaluate((sel) => {
    const el = document.querySelector(sel);
    if (!el) throw new Error(`missing ${sel}`);
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY, behavior: 'instant' });
  }, selector);
}

/** Collect uncaught errors and console errors for the lifetime of the page. */
export function trackErrors(page: Page) {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  return errors;
}
