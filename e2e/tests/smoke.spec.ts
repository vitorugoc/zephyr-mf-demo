import { expect, test } from '@playwright/test';

const heading = (page: import('@playwright/test').Page, name: string) =>
  page.getByRole('heading', { level: 1, name });

test('composes both remotes into the shell', async ({ page }) => {
  await page.goto('/');
  await expect(heading(page, 'Service Catalog')).toBeVisible();

  await page.getByRole('link', { name: 'Golden Paths' }).click();

  await expect(heading(page, 'Golden Paths')).toBeVisible();
  await expect(page).toHaveURL(/#\/golden-paths$/);
});

test('keeps a catalog outage inside the catalog page', async ({ page }) => {
  await page.route('http://localhost:3001/**', (route) => route.abort());

  await page.goto('/#/catalog');

  await expect(page.getByRole('alert')).toContainText('Service Catalog is unavailable');
  await page.getByRole('link', { name: 'Golden Paths' }).click();
  await expect(heading(page, 'Golden Paths')).toBeVisible();
});

test('recovers the catalog on retry once it is back', async ({ page }) => {
  await page.route('http://localhost:3001/**', (route) => route.abort());
  await page.goto('/#/catalog');
  await expect(page.getByRole('alert')).toBeVisible();

  await page.unrouteAll();
  await page.getByRole('button', { name: 'Retry' }).click();

  await expect(heading(page, 'Service Catalog')).toBeVisible();
});
