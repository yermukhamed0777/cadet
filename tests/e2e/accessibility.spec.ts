import { expect, test } from '@playwright/test';
import { onboard } from './helpers';

test.use({ viewport: { width: 375, height: 812 } });

test('guest sign-in has a skip link, a main target and accessible validation errors', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveURL(/\/login$/);

  await page.evaluate(() => document.body.focus());
  await page.keyboard.press('Tab');
  await expect(page.locator(':focus')).toHaveText('Skip to content');
  await page.keyboard.press('Enter');
  expect(await page.evaluate(() => document.activeElement?.id)).toBe('main-content');

  await page.getByLabel('Email').fill('not-an-email');
  await page.getByLabel('Password', { exact: true }).fill('x');
  await page.getByRole('button', { name: 'Sign in' }).click();
  await expect(page.getByText('Enter a valid email address')).toBeVisible();
  expect(await page.locator('#email').getAttribute('aria-invalid')).toBe('true');
});

test('major workspaces keep landmarks, labels, announcements and no mobile overflow', async ({ page }) => {
  await onboard(page, 'a11y@example.com');

  const routes = ['/home', '/my-path', '/documents', '/fitness', '/profile', '/profile/data'];
  for (const route of routes) {
    await page.goto(route);
    await expect(page.locator('#main-content')).toHaveCount(1);
    expect(await page.locator('h1').count()).toBeGreaterThanOrEqual(1);
    expect(await page.locator('[aria-live="polite"]').count()).toBeGreaterThanOrEqual(1);
    const state = await page.evaluate(() => {
      const controls = Array.from(
        document.querySelectorAll<HTMLElement>('input, select, textarea'),
      ).filter((el) => el.getClientRects().length > 0);
      const unlabelled = controls.filter(
        (el) =>
          !el.getAttribute('aria-label') &&
          !el.getAttribute('aria-labelledby') &&
          !(el as HTMLInputElement).labels?.length,
      ).length;
      return {
        unlabelled,
        overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
        title: document.title,
      };
    });
    expect(state.unlabelled, `${route} unlabelled controls`).toBe(0);
    expect(state.overflow, `${route} horizontal overflow`).toBe(false);
    expect(state.title).toContain('CADET');
  }

  await page.goto('/profile/edit');
  await page.getByLabel('Last name').fill('');
  await page.getByRole('button', { name: 'Save', exact: true }).click();
  await expect(page.getByText('Enter last name')).toBeVisible();
  expect(await page.locator('#lastName').getAttribute('aria-invalid')).toBe('true');
});
