const { test, expect } = require('@playwright/test');
const { mockProducts, mockPaginatedResponse } = require('./mock-data');

test.beforeEach(async ({ page }) => {
  await page.context().clearCookies();
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
});

test.describe('Cart Operations', () => {
  test('should add product to cart', async ({ page }) => {
    await page.route('**/api/products**', (route) => {
      route.fulfill({ json: mockPaginatedResponse() });
    });

    await page.goto('/');
    await page.waitForSelector('.product-card__button', { timeout: 15000 });

    await page.locator('.product-card__button', { hasText: 'Add to Cart' }).first().click();

    await expect(page.locator('.navbar__cart-count')).toHaveText('1', { timeout: 5000 });
  });

  test('should view cart with items', async ({ page }) => {
    await page.route('**/api/products**', (route) => {
      route.fulfill({ json: mockPaginatedResponse() });
    });

    await page.goto('/');
    await page.waitForSelector('.product-card__button', { timeout: 15000 });

    await page.locator('.product-card__button', { hasText: 'Add to Cart' }).first().click();
    await page.locator('.navbar__cart-link', { hasText: 'Cart' }).click();

    await expect(page).toHaveURL('/cart', { timeout: 5000 });
    await expect(page.locator('.cart-item')).toHaveCount(1);
    await expect(page.locator('.cart-item__name')).toHaveText(['Test Product 1']);
  });

  test('should increase quantity in cart', async ({ page }) => {
    await page.route('**/api/products**', (route) => {
      route.fulfill({ json: mockPaginatedResponse() });
    });

    await page.goto('/');
    await page.waitForSelector('.product-card__button', { timeout: 15000 });

    await page.locator('.product-card__button', { hasText: 'Add to Cart' }).first().click();
    await page.locator('.navbar__cart-link', { hasText: 'Cart' }).click();

    await page.waitForSelector('.cart-item__button', { timeout: 5000 });
    await page.locator('.cart-item__button', { hasText: '+' }).click();
    await expect(page.locator('.cart-item__quantity')).toHaveText('2');
  });

  test('should decrease quantity in cart', async ({ page }) => {
    await page.route('**/api/products**', (route) => {
      route.fulfill({ json: mockPaginatedResponse() });
    });

    await page.goto('/');
    await page.waitForSelector('.product-card__button', { timeout: 15000 });

    await page.locator('.product-card__button', { hasText: 'Add to Cart' }).first().click();
    await page.locator('.product-card__button', { hasText: 'Add to Cart' }).first().click();
    await page.locator('.navbar__cart-link', { hasText: 'Cart' }).click();

    await page.waitForSelector('.cart-item__button', { timeout: 5000 });
    await page.locator('.cart-item__button', { hasText: '-' }).click();
    await expect(page.locator('.cart-item__quantity')).toHaveText('1');
  });

  test('should remove item from cart', async ({ page }) => {
    await page.route('**/api/products**', (route) => {
      route.fulfill({ json: mockPaginatedResponse() });
    });

    await page.goto('/');
    await page.waitForSelector('.product-card__button', { timeout: 15000 });

    await page.locator('.product-card__button', { hasText: 'Add to Cart' }).first().click();
    await page.locator('.navbar__cart-link', { hasText: 'Cart' }).click();

    await page.waitForSelector('.cart-item__button', { timeout: 5000 });
    await page.locator('.cart-item__button', { hasText: 'Remove' }).click();

    await expect(page.locator('.cart-empty')).toBeVisible({ timeout: 5000 });
  });

  test('should show empty cart message', async ({ page }) => {
    await page.goto('/cart');
    await page.waitForSelector('.cart-empty', { timeout: 10000 });

    await expect(page.locator('.cart-empty')).toBeVisible();
    await expect(page.locator('.cart-empty')).toContainText('Your cart is empty');
  });

  test('should persist cart across page refresh', async ({ page }) => {
    await page.route('**/api/products**', (route) => {
      route.fulfill({ json: mockPaginatedResponse() });
    });

    await page.goto('/');
    await page.waitForSelector('.product-card__button', { timeout: 15000 });

    await page.locator('.product-card__button', { hasText: 'Add to Cart' }).first().click();
    await expect(page.locator('.navbar__cart-count')).toHaveText('1');

    await page.reload();
    await page.waitForSelector('.navbar__cart-count', { timeout: 15000 });

    await expect(page.locator('.navbar__cart-count')).toHaveText('1');
  });
});
