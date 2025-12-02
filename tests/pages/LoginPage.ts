import { Page, Locator } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;
  readonly errorCloseButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.locator('#user-name');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.locator('#login-button');
    this.errorMessage = page.locator('[data-test="error"]');
    this.errorCloseButton = page.locator('.error-button');
  }
  
  async goto() {
    await this.page.goto('/');
  }

  async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async getErrorMessage(): Promise<string> {
    return await this.errorMessage.textContent() || '';
  }

  async closeErrorMessage() {
    await this.errorCloseButton.click();
  }
 
  async isPasswordMasked(): Promise<boolean> {
    const inputType = await this.passwordInput.getAttribute('type');
    return inputType === 'password';
  }

  async submitWithEnterKey() {
    await this.passwordInput.press('Enter');
  }

  async clearFields() {
    await this.usernameInput.clear();
    await this.passwordInput.clear();
  }
}