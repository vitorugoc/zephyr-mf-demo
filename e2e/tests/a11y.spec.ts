import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

for (const { route, heading } of [
  { route: 'catalog', heading: 'Service Catalog' },
  { route: 'golden-paths', heading: 'Golden Paths' },
]) {
  test(`${heading} page has no axe violations`, async ({ page }) => {
    await page.goto(`/#/${route}`);
    await expect(page.getByRole('heading', { level: 1, name: heading })).toBeVisible();

    const results = await new AxeBuilder({ page }).analyze();

    expect(results.violations).toEqual([]);
  });
}
