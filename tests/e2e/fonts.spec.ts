import { expect, test } from '@playwright/test';
import { collectErrors, onboard } from './helpers';

/**
 * Reproduces an environment where the Google Fonts hosts cannot be resolved
 * (`net::ERR_NAME_NOT_RESOLVED` on `fonts.googleapis.com` / `fonts.gstatic.com`)
 * and proves the public experience plus the onboarding flow still work.
 *
 * `--host-resolver-rules=MAP … ~NOTFOUND` fails DNS for those two hosts only,
 * which is the same failure the browser reports when the font CDN is blocked.
 * This option is file-level: `launchOptions` cannot be scoped to a describe.
 */
test.use({
  launchOptions: {
    args: [
      '--no-sandbox',
      '--host-resolver-rules=MAP fonts.googleapis.com ~NOTFOUND, MAP fonts.gstatic.com ~NOTFOUND',
    ],
  },
});

test('the app renders with the system-font fallback', async ({ page }) => {
  const errors = collectErrors(page);
  // Prove the scenario is real: the font stylesheet must actually fail to
  // resolve, otherwise this test would pass without testing anything.
  const fontFailures: string[] = [];
  page.on('requestfailed', (r) => {
    if (r.url().includes('fonts.googleapis.com') || r.url().includes('fonts.gstatic.com')) {
      fontFailures.push(`${r.url()} :: ${r.failure()?.errorText ?? 'unknown'}`);
    }
  });

  await page.goto('/');
  await expect(page).toHaveURL(/\/login$/);
  await expect(page.getByRole('link', { name: 'Sign up' })).toBeVisible();

  expect(
    fontFailures.some((f) => f.includes('net::ERR_NAME_NOT_RESOLVED')),
    `expected a font host DNS failure, got: ${JSON.stringify(fontFailures)}`,
  ).toBe(true);

  // The locally bundled stylesheet still applies and the font stack falls
  // back to system fonts instead of leaving the page unstyled.
  const style = await page.evaluate(() => {
    const computed = getComputedStyle(document.body);
    return {
      fontFamily: computed.fontFamily,
      backgroundColor: computed.backgroundColor,
      localCss: Boolean(document.querySelector('link[rel="stylesheet"][href*="assets/"]')),
    };
  });
  expect(style.localCss).toBe(true);
  expect(style.fontFamily).toContain('system-ui');
  expect(style.backgroundColor).not.toBe('');

  expect(errors).toEqual([]);
});

test('registration and onboarding still complete end to end', async ({ page }) => {
  const errors = collectErrors(page);

  await onboard(page);
  await expect(page.getByRole('heading', { name: /Jane/ }).first()).toBeVisible();

  await page.goto('/my-path');
  await expect(page.getByRole('heading', { name: 'My Path' })).toBeVisible();
  await expect(page.getByText(/completed steps/)).toBeVisible();

  expect(errors).toEqual([]);
});
