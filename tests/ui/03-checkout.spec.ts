import { test } from '../../src/fixtures/saucedemo';
import { checkoutInfo, copy, products, users } from '../../src/data/test-data';

/**
 * TC4 — Complete checkout
 *
 * Why this is essential:
 * Checkout is the revenue path: cart → customer details → overview →
 * confirmation. If any step drops the item or fails to confirm the order,
 * the shop cannot complete a purchase.
 */
test.describe('Checkout', () => {
  test('customer can buy one item and see the confirmation page', async ({
    loginPage,
    inventoryPage,
    cartPage,
    checkoutPage,
  }) => {
    await test.step('Log in and add a backpack to the cart', async () => {
      await loginPage.goto();
      await loginPage.login(users.standard.username, users.standard.password);
      await inventoryPage.expectLoaded();
      await inventoryPage.addToCart(products.backpack.addToCartTestId);
      await inventoryPage.openCart();
      await cartPage.expectItem(products.backpack.name);
    });

    await test.step('Start checkout and fill shipping details', async () => {
      await cartPage.checkout();
      await checkoutPage.expectInfoStep();
      await checkoutPage.fillCustomerInfo(
        checkoutInfo.firstName,
        checkoutInfo.lastName,
        checkoutInfo.postalCode,
      );
    });

    await test.step('Review the overview and finish the order', async () => {
      await checkoutPage.expectOverview(products.backpack.name);
      await checkoutPage.finish();
      await checkoutPage.expectOrderComplete(copy.orderComplete);
    });
  });
});
