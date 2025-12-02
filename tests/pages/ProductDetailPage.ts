import { Page, Locator } from '@playwright/test';

export class ProductDetailPage {
  readonly page: Page;
  readonly addToCartButton: Locator;
  readonly shoppingCartLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.addToCartButton = page.locator('button[id^="add-to-cart"]');
    this.shoppingCartLink = page.locator('.shopping_cart_link');
  }
 
  async addToCart() {
    await this.addToCartButton.click();
  }

  async goToCart() {
    await this.shoppingCartLink.click();
  }

}