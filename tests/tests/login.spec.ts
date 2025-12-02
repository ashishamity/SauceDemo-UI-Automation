
import { test, expect } from '../fixtures/fixtures';
import { TestData, getLoginTimeout } from '../utils/testData';

test.describe('Validate Login page test scenarios', () => {
  
  test('Verify user is able to login successfully with standard_user', async ({ loginPage, inventoryPage,page }) => {
    const { username, password } = TestData.allUsers.standard;
    await loginPage.goto();
    await loginPage.login(username, password);
    await inventoryPage.assertInventoryPageUrl();
    await expect(inventoryPage.inventoryContainer).toBeVisible();
    await expect(inventoryPage.productTitle).toContainText('Products');
  });

  const loginUsers = [
    { username: TestData.allUsers.problem.username, password: TestData.allUsers.problem.password },
    { username: TestData.allUsers.performanceGlitch.username, password: TestData.allUsers.performanceGlitch.password },
    { username: TestData.allUsers.error.username, password: TestData.allUsers.error.password },
    { username: TestData.allUsers.visual.username, password: TestData.allUsers.visual.password }
  ];

  loginUsers.forEach(user => {
    test(`Verify user is able to login succesfully with ${user.username}`, async ({ loginPage, inventoryPage }) => {
      await loginPage.goto();
      await loginPage.login(user.username, user.password);
      await inventoryPage.assertInventoryPageUrl({ timeout: getLoginTimeout(user.username) });
    });
  });

  test('Verify session is maintained after page refresh', async ({ loginPage, inventoryPage, page }) => {
    const { username, password } = TestData.allUsers.standard;
    await loginPage.goto();
    await loginPage.login(username, password);
    await inventoryPage.assertInventoryPageUrl();
    await page.reload();
    await inventoryPage.assertInventoryPageUrl();
    await expect(inventoryPage.inventoryContainer).toBeVisible();
  });

  test('Verify user should be able to login after logout', async ({ loginPage, inventoryPage, page }) => {
    const { username, password } = TestData.allUsers.standard;
    await loginPage.goto();
    await loginPage.login(username, password);
    await inventoryPage.assertInventoryPageUrl();
    await inventoryPage.logout();
    await loginPage.assertLoginPageURL();
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

  test('Verify user should be redirected to login when accessing inventory without authentication', async ({ page , loginPage}) => {
    const inventoryUrl = '/inventory.html';
    await page.goto(inventoryUrl);
    loginPage.assertLoginPageURL();
  });

  test('Verify input for password is masked', async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.passwordInput.fill('secret_sauce');
    const isPasswordMasked = await loginPage.isPasswordMasked();
    expect(isPasswordMasked).toBe(true);
  });
  
});
