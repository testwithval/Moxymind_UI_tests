/**
 * Public demo credentials published by Sauce Labs for https://www.saucedemo.com/
 * They are not secrets — documented on the login page itself.
 */
export const users = {
  standard: {
    username: 'standard_user',
    password: 'secret_sauce',
  },
  lockedOut: {
    username: 'locked_out_user',
    password: 'secret_sauce',
  },
} as const;

export const products = {
  backpack: {
    name: 'Sauce Labs Backpack',
    addToCartTestId: 'add-to-cart-sauce-labs-backpack',
    removeTestId: 'remove-sauce-labs-backpack',
  },
} as const;

export const checkoutInfo = {
  firstName: 'Jane',
  lastName: 'Doe',
  postalCode: '10001',
} as const;

export const copy = {
  lockedOutError: 'Epic sadface: Sorry, this user has been locked out.',
  productsTitle: 'Products',
  cartTitle: 'Your Cart',
  orderComplete: 'Thank you for your order!',
} as const;
