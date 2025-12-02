import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutStepOnePage } from '../pages/CheckoutStepOnePage';
import { CheckoutStepTwoPage } from '../pages/CheckoutStepTwoPage';
import { CheckoutCompletePage } from '../pages/CheckoutCompletetPage';
import { ProductDetailPage } from '../pages/ProductDetailPage';

export const test = base.extend<{
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
  cartPage: CartPage;
  checkoutStepOne: CheckoutStepOnePage;
  checkoutStepTwo: CheckoutStepTwoPage;
  checkoutComplete: CheckoutCompletePage;
  productDetailPage: ProductDetailPage;
}>({
  loginPage: async ({ page }, use) => { await use(new LoginPage(page)); },
  inventoryPage: async ({ page }, use) => { await use(new InventoryPage(page)); },
  cartPage: async ({ page }, use) => { await use(new CartPage(page)); },
  checkoutStepOne: async ({ page }, use) => { await use(new CheckoutStepOnePage(page)); },
  checkoutStepTwo: async ({ page }, use) => { await use(new CheckoutStepTwoPage(page)); },
  checkoutComplete: async ({ page }, use) => { await use(new CheckoutCompletePage(page)); },
  productDetailPage: async ({ page }, use) => { await use(new ProductDetailPage(page)); },
});

export { expect } from '@playwright/test';