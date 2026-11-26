import { mkdirSync } from 'node:fs';
import { expect, test } from '@playwright/test';
import { onboard } from './helpers';

const OUT = 'docs/walkthrough';
const shot = (page: import('@playwright/test').Page, name: string) =>
  page.screenshot({ path: `${OUT}/${name}.png`, animations: 'disabled' });

test.describe('deterministic walkthrough capture', () => {
  test.beforeAll(() => mkdirSync(OUT, { recursive: true }));

  test.use({ viewport: { width: 390, height: 844 } });

  test('captures the mobile flow with fixed time and seeded fixtures', async ({ page }) => {
    await page.clock.install({ time: new Date('2026-11-26T12:00:00.000Z') });
    await page.goto('/');
    await expect(page).toHaveURL(/\/login$/);
    await shot(page, '01-sign-in');

    await page.getByRole('link', { name: 'Sign up' }).click();
    await shot(page, '02-sign-up');

    await onboard(page, 'walkthrough@example.com');
    // The success toast is still visible here: evidence for CADET-014.
    await shot(page, '03-home-with-toast');

    await page.goto('/my-path');
    await shot(page, '04-my-path');
    await page.goto('/fitness');
    await shot(page, '05-fitness');
    await page.goto('/profile/data');
    await shot(page, '06-backup');
  });

  test('captures the desktop layout', async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const page = await context.newPage();
    await onboard(page, 'desktop@example.com');
    await shot(page, '07-home-desktop');
    await context.close();
  });
});
