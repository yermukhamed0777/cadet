import { expect, test } from '@playwright/test';
import { onboard } from './helpers';

test('demo account deletion removes the account and its local data', async ({ page }) => {
  await onboard(page, 'delete-me@example.com');
  await page.goto('/documents');
  await page.getByText('Application submitted through the academy portal').first().click();
  await page.locator('label').filter({ hasText: /^Ready$/ }).first().click();
  await page.waitForTimeout(150);
  await expect(page.getByText('1 / 10')).toBeVisible();

  await page.goto('/profile');
  await page.getByRole('button', { name: 'Delete demo account and local data' }).click();
  const confirm = page.getByRole('button', { name: 'Delete permanently' });
  await expect(confirm).toBeDisabled();
  await page.getByLabel('Type DELETE to confirm').fill('DELETE');
  await expect(confirm).toBeEnabled();
  await confirm.click();
  await expect(page).toHaveURL(/\/login$/);
  await expect(page.getByText('Demo account and local data deleted')).toBeVisible();

  await page.getByLabel('Email').fill('delete-me@example.com');
  await page.getByLabel('Password', { exact: true }).fill('cadet2026');
  await page.getByRole('button', { name: 'Sign in' }).click();
  await expect(page.getByRole('alert')).toContainText('Incorrect email or password.');
});
