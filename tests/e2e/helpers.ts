import { expect, type Page } from '@playwright/test';

export const FIXED_TIME = new Date('2026-11-26T12:00:00.000Z');

/** Register a deterministic demo account and complete both onboarding steps. */
export async function onboard(page: Page, email = 'applicant@example.com') {
  await page.clock.install({ time: FIXED_TIME });
  await page.goto('/');
  await expect(page).toHaveURL(/\/login$/);
  await page.getByRole('link', { name: 'Sign up' }).click();
  await expect(page).toHaveURL(/\/register$/);
  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Password', { exact: true }).fill('cadet2026');
  await page.getByRole('button', { name: 'Create account' }).click();
  await expect(page).toHaveURL(/\/profile\/setup$/);

  await page.getByLabel('Last name').fill('Doe');
  await page.getByLabel('First name').fill('Jane');
  await page.getByLabel('Date of birth').fill('2008-05-01');
  await page.getByLabel('City').fill('Boston');
  await page.locator('label').filter({ hasText: /^Male$/ }).click();
  await page.getByRole('button', { name: 'Save and continue' }).click();
  await expect(page).toHaveURL(/\/onboarding\/academies$/);

  await page.getByRole('link', { name: /U\.S\. Military Academy \(West Point\)/ }).click();
  await expect(page).toHaveURL(/\/academies\/westpoint$/);
  await page.getByRole('button', { name: 'Select this academy' }).click();
  await page.getByRole('button', { name: 'Confirm' }).click();
  await expect(page).toHaveURL(/\/academies\/westpoint\/specialties$/);

  await page.getByRole('link', { name: 'View details' }).first().click();
  await page.getByRole('button', { name: 'Select this program' }).click();
  await page.getByRole('button', { name: 'Confirm' }).click();
  await expect(page).toHaveURL(/\/home$/);
}
