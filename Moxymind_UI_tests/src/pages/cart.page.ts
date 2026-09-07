import { type Page, type Locator, expect } from '@playwright/test';

export class CartPage {
  readonly page: Page;
  readonly title: Locator;
  readonly cartItem: Locator;
  readonly itemName: Locator;
  readonly checkoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.getByTestId('title');
    this.cartItem = page.getByTestId('inventory-item');
    this.itemName = page.getByTestId('inventory-item-name');
    this.checkoutButton = page.getByTestId('checkout');
  }

  async expectLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/cart\.html/);
    await expect(this.title).toHaveText('Your Cart');
  }

  async expectItem(name: string): Promise<void> {
    await expect(this.cartItem).toHaveCount(1);
    await expect(this.itemName).toHaveText(name);
  }

  async checkout(): Promise<void> {
    await this.checkoutButton.click();
  }
}
