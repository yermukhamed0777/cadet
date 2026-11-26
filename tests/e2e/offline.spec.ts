import { expect, test } from '@playwright/test';
import { onboard } from './helpers';

test('the root build registers a service worker and survives an offline reload', async ({ page, context }) => {
  await onboard(page, 'offline@example.com');
  const ready = await page.evaluate(async () => {
    if (!('serviceWorker' in navigator)) return false;
    const reg = await navigator.serviceWorker.ready;
    return Boolean(reg.active);
  });
  expect(ready).toBe(true);

  await context.setOffline(true);
  await page.reload();
  await expect(page.getByRole('heading', { name: /Hello, Jane/ })).toBeVisible();
  await context.setOffline(false);
});
