import { Page, Locator } from '@playwright/test';


export class CheckoutStepOnePage {
  readonly page: Page;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly continueButton: Locator;
  readonly shoppingCartBadge: Locator;
   readonly errorMessage: Locator;


  constructor(page: Page) {
    this.page = page;
    this.firstNameInput = page.locator('#first-name');
    this.lastNameInput = page.locator('#last-name');
    this.postalCodeInput = page.locator('#postal-code');
    this.continueButton = page.locator('#continue');
    this.shoppingCartBadge = page.locator('.shopping_cart_badge');
    this.errorMessage = page.locator('[data-test="error"]');

  }

  async fillCheckoutInformation(firstName: string, lastName: string, postalCode: string) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
  }

  async continue() {
    await this.continueButton.click();
  }
  async completeStepOne(firstName: string, lastName: string, postalCode: string) {
    await this.fillCheckoutInformation(firstName, lastName, postalCode);
    await this.continue();
  }
}