import { Page, Locator } from '@playwright/test';


export class CartPage {
  readonly page: Page;
  readonly cartItems: Locator;
  readonly cartItemNames: Locator;
  readonly cartItemDescriptions: Locator;
  readonly continueShoppingButton: Locator;
  readonly checkoutButton: Locator;


  constructor(page: Page) {
    this.page = page;
    this.cartItems = page.locator('.cart_item');
    this.cartItemNames = page.locator('.inventory_item_name');
    this.cartItemDescriptions = page.locator('.inventory_item_desc');
    this.continueShoppingButton = page.locator('#continue-shopping');
    this.checkoutButton = page.locator('#checkout');
  }


  async getCartItemCount(): Promise<number> {
    return await this.cartItems.count();
  }

  async getCartItemNames(): Promise<string[]> {
    return await this.cartItemNames.allTextContents();
  }

  async removeItemByName(productName: string) {
    const item = this.page.locator(`.cart_item:has-text("${productName}")`);
    const removeButton = item.locator('button[id^="remove"]');
    await removeButton.click();
  }

  async continueShopping() {
    await this.continueShoppingButton.click();
  }

  async checkout() {
    await this.checkoutButton.click();
  }

  async isProductInCart(productName: string): Promise<boolean> {
    const cartItems = await this.getCartItemNames();
    return cartItems.includes(productName);
  }
}