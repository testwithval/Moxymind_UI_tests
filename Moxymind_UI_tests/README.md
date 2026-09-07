# Moxymind UI tests — Sauce Demo

Playwright + TypeScript UI tests for [Sauce Demo](https://www.saucedemo.com/) (Swag Labs).

This repo covers the main shop journey: **login**, **blocked account**, **add to cart**, and **checkout**.

## Test cases

| # | What it checks | Why this is essential |
|---|----------------|------------------------|
| **TC1** | `standard_user` logs in and sees the product catalog | Login is the gateway. Inventory, cart, and checkout are behind authentication. If a valid customer cannot sign in, nothing else in the shop works. |
| **TC2** | `locked_out_user` is refused and sees an error | Suspended accounts must stay out, and the UI must explain why. A silent failure (or letting a locked user in) is a security and support problem. |
| **TC3** | Adding a backpack updates the cart badge **and** the cart page | Add-to-cart is the core shopping action. Badge and cart contents must match, or customers lose trust and may pay for the wrong items. |
| **TC4** | Full checkout: cart → details → overview → confirmation | Checkout is the revenue path. If any step drops the item or fails to confirm, the shop cannot complete a purchase. |

Specs live in `tests/` and repeat the “why essential” rationale above each test.

## Prerequisites

- Node.js **22** (or 20+)
- npm
- Network access to `https://www.saucedemo.com/`

## Run locally

```bash
git clone https://github.com/testwithval/Moxymind_UI_tests.git
cd Moxymind_UI_tests
npm install
npx playwright install chromium
npm test
```

That is the command-line demo: four tests on Chromium, headless.

### Other useful commands

| Command | What it does |
|---------|----------------|
| `npm test` | Run the suite (headless Chromium) |
| `npx playwright test --headed` | Watch the browser |
| `npx playwright test tests/01-login.spec.ts` | Run one file |
| `npx playwright test --ui` | Playwright UI mode |
| `npx playwright show-report` | Open the last HTML report |
| `npm run typecheck` | TypeScript check only |

HTML report is written to `playwright-report/` after each run.

## Demo credentials

These are **public** Sauce Labs demo accounts (also listed on the login page). They are not secrets.

| Username | Password | Used in |
|----------|----------|---------|
| `standard_user` | `secret_sauce` | TC1, TC3, TC4 |
| `locked_out_user` | `secret_sauce` | TC2 |

## Project structure

```
├── playwright.config.ts      # baseURL, data-test locators, Chromium
├── src/
│   ├── data/test-data.ts     # users, product, checkout details
│   ├── fixtures/saucedemo.ts # page-object fixtures
│   └── pages/                # Page Object Model
│       ├── login.page.ts
│       ├── inventory.page.ts
│       ├── cart.page.ts
│       └── checkout.page.ts
└── tests/
    ├── 01-login.spec.ts      # TC1 + TC2
    ├── 02-cart.spec.ts       # TC3
    └── 03-checkout.spec.ts   # TC4
```

Locators use Sauce Demo’s `data-test` attributes (`testIdAttribute: 'data-test'` in Playwright), not CSS class names.

## CI

GitHub Actions (`.github/workflows/playwright.yml`) runs `npm test` on every push to `main` and on pull requests.
