import { readFile } from 'node:fs/promises';
import { expect, test } from '@playwright/test';
import { onboard } from './helpers';

test('a downloaded backup restores earlier state', async ({ page }) => {
  await onboard(page, 'backup@example.com');
  await page.goto('/documents');
  await page.getByText('Application submitted through the academy portal').first().click();
  await page.locator('label').filter({ hasText: /^Ready$/ }).first().click();
  await page.waitForTimeout(150);

  await page.goto('/profile/data');
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.getByRole('button', { name: 'Download backup' }).click(),
  ]);
  const text = await readFile(await download.path(), 'utf8');
  const backup = JSON.parse(text);
  expect(backup.schema).toBe(1);
  expect(backup.app).toBe('cadet');
  expect(backup.state.documentsProgress['doc-portal']).toBe('ready');

  // Change state after the backup was taken.
  await page.goto('/documents');
  await page.getByText('USMA Candidate Checklist').first().click();
  await page.locator('label').filter({ hasText: /^Ready$/ }).first().click();
  await page.waitForTimeout(150);
  await page.goto('/documents');
  await expect(page.getByText('2 / 10')).toBeVisible();

  await page.goto('/profile/data');
  await page.locator('input[type="file"]').setInputFiles({
    name: 'cadet-backup.json',
    mimeType: 'application/json',
    buffer: Buffer.from(text),
  });
  await page.getByRole('button', { name: 'Restore backup' }).click();
  await expect(page.getByText('Backup restored')).toBeVisible();
  await page.waitForTimeout(150);

  await page.goto('/documents');
  await expect(page.getByText('1 / 10')).toBeVisible();
});
