import { Page, Locator, expect } from '@playwright/test';

export class InventoryPage {
  readonly page: Page;
  
  readonly appLogo: Locator;
  readonly shoppingCartLink: Locator;
  readonly shoppingCartBadge: Locator;
  readonly menuButton: Locator;

  readonly logoutLink: Locator;
  readonly sortDropdown: Locator;
  readonly productImages: Locator;
  readonly addToCartButtons: Locator;
  readonly removeButtons: Locator;
  readonly inventoryContainer: Locator;
   readonly productTitle: Locator;

  static readonly INVENTORY_URL_PATTERN = /.*inventory.html$/;

  constructor(page: Page) {
    this.page = page;
    this.appLogo = page.locator('.app_logo');
    this.shoppingCartLink = page.locator('.shopping_cart_link');
    this.shoppingCartBadge = page.locator('.shopping_cart_badge');
    this.menuButton = page.locator('#react-burger-menu-btn');
    this.logoutLink = page.locator('#logout_sidebar_link');
    this.sortDropdown = page.locator('[data-test="product-sort-container"]');
    this.productImages = page.locator('.inventory_item_img');
    this.addToCartButtons = page.locator('button[id^="add-to-cart"]');
    this.removeButtons = page.locator('button[id^="remove"]');
    this.inventoryContainer = page.locator('.inventory_container');
    this.productTitle = page.locator('.title');
  }

  async openMenu() {
    await this.menuButton.click();
    await this.logoutLink.waitFor({ state: 'visible' });
  }

  async logout() {
    await this.openMenu();
    await this.logoutLink.click();
  }

  async addProductToCart(productName: string) {
    const product = this.page.locator(`.inventory_item:has-text("${productName}")`);
    const addButton = product.locator('button[id^="add-to-cart"]');
    await addButton.click();
  }

  async addProductToCartByIndex(index: number) {
    await this.addToCartButtons.nth(index).click();
  }

  async getCartItemCount(): Promise<number> {
    const isVisible = await this.shoppingCartBadge.isVisible();
    if (!isVisible) return 0;
    const count = await this.shoppingCartBadge.textContent();
    return parseInt(count || '0');
  }

  async goToCart() {
    await this.shoppingCartLink.click();
  }

  async clickProductByName(productName: string) {
    await this.page.locator(`.inventory_item_name:has-text("${productName}")`).click();
  }

  async clickProductImageByIndex(index: number) {
    await this.productImages.nth(index).click();
  }
 
  async sortBy(option: 'az' | 'za' | 'lohi' | 'hilo') {
    await this.sortDropdown.selectOption(option);
  }
  
  async isProductInCart(productName: string): Promise<boolean> {
    const product = this.page.locator(`.inventory_item:has-text("${productName}")`);
    const removeButton = product.locator('button[id^="remove"]');
    return await removeButton.isVisible();
  }

  async getProductPrice(productName: string): Promise<string> {
    const product = this.page.locator(`.inventory_item:has-text("${productName}")`);
    const price = product.locator('.inventory_item_price');
    return await price.textContent() || '';
  }

  async addAllProductsToCart() {
    const buttonCount = await this.addToCartButtons.count();
    for (let i = 0; i < buttonCount; i++) {
      await this.addToCartButtons.nth(0).click();
      await this.page.waitForTimeout(100);
    }
  }
  async assertInventoryPageUrl(options: object = {}) {
    await expect(this.page).toHaveURL(InventoryPage.INVENTORY_URL_PATTERN, options);
  }

  async assertCartItemCount(expectedCount: number){
    const count = await this.getCartItemCount();
    expect(count).toBe(1);
  }
}