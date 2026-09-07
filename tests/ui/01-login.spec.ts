import { test, expect } from '../../src/fixtures/saucedemo';
import { copy, users } from '../../src/data/test-data';

/**
 * TC1 — Successful login
 *
 * Why this is essential:
 * Login is the gateway to the shop. Inventory, cart, and checkout are all
 * behind authentication. If a valid customer cannot sign in, no other
 * feature can be used — so this is the first smoke check for the product.
 */
test.describe('Login — valid customer', () => {
  test('standard user reaches the product catalog', async ({ loginPage, inventoryPage }) => {
    await test.step('Open the login page', async () => {
      await loginPage.goto();
    });

    await test.step('Submit valid credentials', async () => {
      await loginPage.login(users.standard.username, users.standard.password);
    });

    await test.step('Land on the inventory with products visible', async () => {
      await inventoryPage.expectLoaded();
      await expect(inventoryPage.title).toHaveText(copy.productsTitle);
    });
  });
});

/**
 * TC2 — Locked-out user is refused
 *
 * Why this is essential:
 * The app must block suspended accounts and explain why. A silent failure
 * (or letting a locked user in) would be a security and support problem.
 * This is the negative counterpart to successful login.
 */
test.describe('Login — locked-out customer', () => {
  test('locked_out_user sees an error and stays on the login page', async ({ loginPage }) => {
    await test.step('Open the login page', async () => {
      await loginPage.goto();
    });

    await test.step('Submit locked-out credentials', async () => {
      await loginPage.login(users.lockedOut.username, users.lockedOut.password);
    });

    await test.step('Show the locked-out error and do not enter the shop', async () => {
      await loginPage.expectLockedOutError(copy.lockedOutError);
    });
  });
});
