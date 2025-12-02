import { Page, Locator } from '@playwright/test';


export class CheckoutCompletePage {
  readonly page: Page;
  readonly backHomeButton: Locator;
  readonly shoppingCartBadge: Locator;
  readonly completeHeader: Locator;
  


  constructor(page: Page) {
    this.page = page;
    this.backHomeButton = page.locator('#back-to-products');
    this.shoppingCartBadge = page.locator('.shopping_cart_badge');
    this.completeHeader = page.locator('.complete-header');
  }

  async backHome() {
    await this.backHomeButton.click();
  }

  async isCartEmpty(): Promise<boolean> {
    return !(await this.shoppingCartBadge.isVisible());
  }

   async getCompleteHeader(): Promise<string> {
    return await this.completeHeader.textContent() || '';
  }

}