// Uses Playwright fixtures for page object creation. See tests/fixtures.ts.
import { test, expect } from '../fixtures/fixtures';
import { TestData, getLoginTimeout } from '../utils/testData';

test.describe('Validate Login page test scenarios', () => {
  
  test('Verify user is able to login successfully with standard_user', async ({ loginPage, inventoryPage }) => {
    const { username, password } = TestData.validUsers.standard;
    await loginPage.goto();
    await loginPage.login(username, password);
    await inventoryPage.assertInventoryPageUrl();
    await expect(inventoryPage.inventoryContainer).toBeVisible();
    await expect(inventoryPage.productTitle).toContainText('Products');
  });

  const specialUsers = [
    { username: TestData.validUsers.problem.username, password: TestData.validUsers.problem.password },
    { username: TestData.validUsers.performanceGlitch.username, password: TestData.validUsers.performanceGlitch.password },
    { username: TestData.validUsers.error.username, password: TestData.validUsers.error.password },
    { username: TestData.validUsers.visual.username, password: TestData.validUsers.visual.password }
  ];

  specialUsers.forEach(user => {
    test(`Verify user is able to login succesfully with ${user.username}`, async ({ loginPage, inventoryPage }) => {
      await loginPage.goto();
      await loginPage.login(user.username, user.password);
      await inventoryPage.assertInventoryPageUrl({ timeout: getLoginTimeout(user.username) });
    });
  });

  test('Verify session is maintained after page refresh', async ({ loginPage, inventoryPage, page }) => {
    const { username, password } = TestData.validUsers.standard;
    await loginPage.goto();
    await loginPage.login(username, password);
    await inventoryPage.assertInventoryPageUrl();
    await page.reload();
    await inventoryPage.assertInventoryPageUrl();
    await expect(inventoryPage.inventoryContainer).toBeVisible();
  });

  test('Verify user should be able to login after logout', async ({ loginPage, inventoryPage, page }) => {
    const { username, password } = TestData.validUsers.standard;

    await loginPage.goto();
    await loginPage.login(username, password);
    await inventoryPage.assertInventoryPageUrl();

    // Logout
    await inventoryPage.logout();
    await expect(page).toHaveURL(/.*\/$/);

    // Login again
    await loginPage.login(username, password);
    await inventoryPage.assertInventoryPageUrl();
  });

  test('Verify error message is displayed for locked out user', async ({ loginPage }) => {
    const { username, password, expectedError } = TestData.specialUsers.lockedOut;
    await loginPage.goto();
    await loginPage.login(username, password);
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText(expectedError);
  });

  test('Verify error message for invalid login scenarios', async ({ loginPage }) => {
    const invalidLogins = [
      { username: TestData.invalidCredentials.wrongUsername.username, password: TestData.invalidCredentials.wrongUsername.password, expectedError: TestData.invalidCredentials.wrongUsername.expectedError },
      { username: TestData.invalidCredentials.wrongPassword.username, password: TestData.invalidCredentials.wrongPassword.password, expectedError: TestData.invalidCredentials.wrongPassword.expectedError },
      { username: TestData.invalidCredentials.bothWrong.username, password: TestData.invalidCredentials.bothWrong.password, expectedError: TestData.invalidCredentials.bothWrong.expectedError }
    ];
    for (const cred of invalidLogins) {
      await loginPage.goto();
      await loginPage.login(cred.username, cred.password);
      await expect(loginPage.errorMessage).toBeVisible();
      await expect(loginPage.errorMessage).toContainText(cred.expectedError);
    }
  });

  test('Verify user should be redirected to login when accessing inventory without authentication', async ({ page }) => {
    const inventoryUrl = '/inventory.html';
    const expectedLoginUrlPattern = /.*\/$/;
    await page.goto(inventoryUrl);
    await expect(page).toHaveURL(expectedLoginUrlPattern);
  });

  test('Verify input for password is masked', async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.passwordInput.fill('secret_sauce');
    const isPasswordMasked = await loginPage.isPasswordMasked();
    expect(isPasswordMasked).toBe(true);
  });
  
});



