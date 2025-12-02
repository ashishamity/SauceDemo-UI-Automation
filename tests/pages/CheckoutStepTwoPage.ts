import { Page, Locator, expect } from '@playwright/test';

export class CheckoutStepTwoPage {
  readonly page: Page;
  readonly cartItems: Locator;
  readonly cartItemNames: Locator;
  readonly cartItemPrices: Locator;
  readonly paymentInformation: Locator;
  readonly shippingInformation: Locator;
  readonly itemTotalLabel: Locator;
  readonly taxLabel: Locator;
  readonly totalLabel: Locator;
  readonly finishButton: Locator;
  readonly shoppingCartLink: Locator;
  readonly menuButton: Locator;
  constructor(page: Page) {
    this.page = page;
    this.cartItems = page.locator('.cart_item');
    this.cartItemNames = page.locator('.inventory_item_name');
    this.cartItemPrices = page.locator('.inventory_item_price');
    this.paymentInformation = page.locator('[data-test="payment-info-value"]');
    this.shippingInformation = page.locator('[data-test="shipping-info-value"]');
    this.itemTotalLabel = page.locator('.summary_subtotal_label');
    this.taxLabel = page.locator('.summary_tax_label');
    this.totalLabel = page.locator('.summary_total_label');
    this.finishButton = page.locator('#finish');
    this.shoppingCartLink = page.locator('.shopping_cart_link');
    this.menuButton = page.locator('#react-burger-menu-btn');
  }

  async finish() {
    await this.finishButton.click();
  }

  async getCartItemCount(): Promise<number> {
    return await this.cartItems.count();
  }

  async getCartItemNames(): Promise<string[]> {
    return await this.cartItemNames.allTextContents();
  }

  async getCartItemPrices(): Promise<string[]> {
    return await this.cartItemPrices.allTextContents();
  }

  async getItemTotal(): Promise<number> {
    const text = await this.itemTotalLabel.textContent() || '';
    const match = text.match(/\$(\d+\.\d{2})/);
    return match ? parseFloat(match[1]) : 0;
  }

  async getTax(): Promise<number> {
    const text = await this.taxLabel.textContent() || '';
    const match = text.match(/\$(\d+\.\d{2})/);
    return match ? parseFloat(match[1]) : 0;
  }

  async getTotal(): Promise<number> {
    const text = await this.totalLabel.textContent() || '';
    const match = text.match(/\$(\d+\.\d{2})/);
    return match ? parseFloat(match[1]) : 0;
  }

  async isTotalCalculationCorrect(): Promise<boolean> {
    const itemTotal = await this.getItemTotal();
    const tax = await this.getTax();
    const total = await this.getTotal();

    const expectedTotal = parseFloat((itemTotal + tax).toFixed(2));
    return Math.abs(expectedTotal - total) < 0.01; // Allow for rounding
  }

  async isProductInOrder(productName: string): Promise<boolean> {
    const itemNames = await this.getCartItemNames();
    return itemNames.includes(productName);
  }
   async assertOnStepTwo(){
      await expect(this.page).toHaveURL(/.*checkout-step-two.html/);
    }

}