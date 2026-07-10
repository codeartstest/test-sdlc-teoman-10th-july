const { test, expect } = require('@playwright/test');
const { mockProducts, mockPaginatedResponse, mockMultiPageResponse } = require('./mock-data');

test.beforeEach(async ({ page }) => {
  await page.context().clearCookies();
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
});

test.describe('Product Listing', () => {
  test('should display products on home page', async ({ page }) => {
    await page.route('**/api/products**', (route) => {
      route.fulfill({ json: mockPaginatedResponse() });
    });

    await page.goto('/');
    await page.waitForSelector('.product-card', { timeout: 15000 });

    await expect(page.locator('.product-card')).toHaveCount(3);
    await expect(page.locator('.product-card__title')).toHaveText([
      'Test Product 1',
      'Test Product 2',
      'Test Product 3',
    ]);
  });

  test('should display product prices correctly', async ({ page }) => {
    await page.route('**/api/products**', (route) => {
      route.fulfill({ json: mockPaginatedResponse() });
    });

    await page.goto('/');
    await page.waitForSelector('.product-card__price', { timeout: 15000 });

    await expect(page.locator('.product-card__price')).toHaveText([
      '$29.99',
      '$49.99',
      '$9.99',
    ]);
  });

  test('should show pagination info', async ({ page }) => {
    await page.route('**/api/products**', (route) => {
      route.fulfill({ json: mockPaginatedResponse() });
    });

    await page.goto('/');
    await page.waitForSelector('.pagination__info', { timeout: 15000 });

    await expect(page.locator('.pagination__info')).toContainText('Page 1 of 1');
  });

  test('should navigate to next and previous pages', async ({ page }) => {
    let currentPage = 1;
    await page.route('**/api/products**', (route) => {
      const url = new URL(route.request().url());
      currentPage = parseInt(url.searchParams.get('page')) || 1;
      route.fulfill({ json: mockMultiPageResponse(currentPage, 2) });
    });

    await page.goto('/');
    await page.waitForSelector('.pagination__button', { timeout: 15000 });

    await expect(page.locator('.pagination__button', { hasText: 'Previous' })).toBeDisabled();
    await expect(page.locator('.pagination__button', { hasText: 'Next' })).toBeEnabled();

    await page.locator('.pagination__button', { hasText: 'Next' }).click();
    await expect(page.locator('.pagination__info')).toContainText('Page 2 of 2', { timeout: 10000 });

    await expect(page.locator('.pagination__button', { hasText: 'Next' })).toBeDisabled();
    await expect(page.locator('.pagination__button', { hasText: 'Previous' })).toBeEnabled();

    await page.locator('.pagination__button', { hasText: 'Previous' }).click();
    await expect(page.locator('.pagination__info')).toContainText('Page 1 of 2', { timeout: 10000 });
  });

  test('should show empty state when no products', async ({ page }) => {
    await page.route('**/api/products**', (route) => {
      route.fulfill({
        json: {
          data: [],
          pagination: { page: 1, limit: 10, totalItems: 0, totalPages: 0, hasNext: false, hasPrev: false },
        },
      });
    });

    await page.goto('/');
    await page.waitForSelector('.empty-state__title', { timeout: 15000 });

    await expect(page.locator('.empty-state__title')).toHaveText('No products found');
  });
});
