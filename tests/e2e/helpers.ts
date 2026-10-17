import type { Page } from '@playwright/test';

/**
 * Jump (never animate) so the element's top sits `offset` px above the viewport top.
 * Avoid window.scrollBy in tests: the site uses smooth scrolling, so it animates and
 * finishes at an engine-dependent time.
 */
export async function scrollToTop(page: Page, selector: string, offset = 0) {
  await page.evaluate(
    ([sel, off]) => {
      const el = document.querySelector(sel);
      if (!el) throw new Error(`missing ${sel}`);
      window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY + off, behavior: 'instant' });
    },
    [selector, offset] as const,
  );
}

/** Collect uncaught errors and console errors for the lifetime of the page. */
export function trackErrors(page: Page) {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  return errors;
}
