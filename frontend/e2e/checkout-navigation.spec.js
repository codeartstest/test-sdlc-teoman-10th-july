const { test, expect } = require('@playwright/test');
const { mockProducts, mockPaginatedResponse } = require('./mock-data');

test.beforeEach(async ({ page }) => {
  await page.context().clearCookies();
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
});

test.describe('Checkout Flow', () => {
  test('should redirect to home when cart is empty', async ({ page }) => {
    await page.evaluate(() => localStorage.clear());
    await page.goto('/checkout');

    await expect(page).toHaveURL('/', { timeout: 10000 });
  });

  test('should display order summary with items', async ({ page }) => {
    await page.route('**/api/products**', (route) => {
      route.fulfill({ json: mockPaginatedResponse() });
    });

    await page.goto('/');
    await page.waitForSelector('.product-card__button', { timeout: 15000 });

    await page.locator('.product-card__button', { hasText: 'Add to Cart' }).first().click();
    await page.locator('.navbar__cart-link', { hasText: 'Cart' }).click();
    await page.waitForSelector('.cart-summary__button', { timeout: 5000 });
    await page.locator('.cart-summary__button', { hasText: 'Proceed to Checkout' }).click();

    await expect(page).toHaveURL('/checkout', { timeout: 5000 });
    await expect(page.locator('.checkout__summary')).toBeVisible();
    await expect(page.locator('.checkout__summary-item')).toHaveCount(1);
  });

  test('should fill and submit checkout form', async ({ page }) => {
    await page.route('**/api/products**', (route) => {
      route.fulfill({ json: mockPaginatedResponse() });
    });

    await page.goto('/');
    await page.waitForSelector('.product-card__button', { timeout: 15000 });

    await page.locator('.product-card__button', { hasText: 'Add to Cart' }).first().click();
    await page.goto('/checkout');
    await page.waitForSelector('.checkout__form', { timeout: 10000 });

    await page.locator('input[name="name"]').fill('John Doe');
    await page.locator('input[name="email"]').fill('john@example.com');
    await page.locator('input[name="address"]').fill('123 Main St');
    await page.locator('input[name="city"]').fill('New York');
    await page.locator('input[name="zipCode"]').fill('10001');

    page.on('dialog', (dialog) => dialog.accept());
    await page.locator('.checkout__button', { hasText: 'Place Order' }).click();

    await expect(page).toHaveURL('/', { timeout: 10000 });
  });
});

test.describe('404 Page', () => {
  test('should show 404 for unknown route', async ({ page }) => {
    await page.goto('/nonexistent-page');
    await page.waitForSelector('h1', { timeout: 10000 });

    await expect(page.locator('h1')).toHaveText('404');
  });

  test('should have link back to home from 404', async ({ page }) => {
    await page.goto('/nonexistent-page');
    await page.waitForSelector('a', { hasText: 'Back to Home' }, { timeout: 10000 });

    await page.locator('a', { hasText: 'Back to Home' }).click();
    await expect(page).toHaveURL('/', { timeout: 10000 });
  });
});

test.describe('Navigation', () => {
  test('should navigate between pages via navbar', async ({ page }) => {
    await page.route('**/api/products**', (route) => {
      route.fulfill({ json: mockPaginatedResponse() });
    });

    await page.goto('/');
    await page.waitForSelector('.navbar__cart-link', { timeout: 15000 });

    await page.locator('.navbar__cart-link', { hasText: 'Cart' }).click();
    await expect(page).toHaveURL('/cart', { timeout: 5000 });

    await page.locator('.navbar__title').click();
    await expect(page).toHaveURL('/', { timeout: 5000 });
  });
});
