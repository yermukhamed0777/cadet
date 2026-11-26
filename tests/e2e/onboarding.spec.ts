import { expect, test } from '@playwright/test';
import { onboard } from './helpers';

test('registration, onboarding and derived readiness work end to end', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text());
  });

  await onboard(page);
  await expect(page.getByRole('heading', { name: /Jane/ }).first()).toBeVisible();

  await page.goto('/my-path');
  await expect(page.getByRole('heading', { name: 'My Path' })).toBeVisible();
  await expect(page.getByText(/completed steps/)).toBeVisible();
  await expect(page.getByText('Account created')).toBeVisible();
  await expect(page.getByText('Academy selected')).toBeVisible();
  await expect(page.getByText('Program selected')).toBeVisible();

  expect(errors).toEqual([]);
});

test('a returning user keeps state after a reload', async ({ page }) => {
  await onboard(page, 'returning@example.com');
  await page.goto('/documents');
  await page.getByText('Application submitted through the academy portal').first().click();
  await page.locator('label').filter({ hasText: /^Ready$/ }).first().click();
  await page.waitForTimeout(150);

  await page.reload();
  await expect(page.getByText('1 / 10')).toBeVisible();
});
