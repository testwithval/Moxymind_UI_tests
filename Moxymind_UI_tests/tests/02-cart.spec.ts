import { test } from '../src/fixtures/saucedemo';
import { products, users } from '../src/data/test-data';

/**
 * TC3 — Add a product to the cart
 *
 * Why this is essential:
 * Adding to cart is the core shopping action. The header badge and the cart
 * page must agree on what was added; otherwise customers lose trust and may
 * check out with the wrong items (or none).
 */
test.describe('Cart', () => {
  test('adding a backpack updates the badge and the cart page', async ({
    loginPage,
    inventoryPage,
    cartPage,
  }) => {
    await test.step('Log in as a standard user', async () => {
      await loginPage.goto();
      await loginPage.login(users.standard.username, users.standard.password);
      await inventoryPage.expectLoaded();
    });

    await test.step('Add Sauce Labs Backpack to the cart', async () => {
      await inventoryPage.addToCart(products.backpack.addToCartTestId);
      await inventoryPage.expectCartCount(1);
    });

    await test.step('Open the cart and verify the same item is listed', async () => {
      await inventoryPage.openCart();
      await cartPage.expectLoaded();
      await cartPage.expectItem(products.backpack.name);
    });
  });
});
