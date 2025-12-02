// Uses Playwright fixtures for page object creation. See tests/fixtures/fixtures.ts.
import { test, expect } from '../fixtures/fixtures';
import { TestData } from '../utils/testData';

test.describe('E2E Flow - Complete Purchase Journey', () => {
  test('Verify user is able purchase flow with single item', async ({ 
    loginPage, 
    inventoryPage,
    cartPage, 
    checkoutStepOne, 
    checkoutStepTwo, 
    checkoutComplete,
    page 
  }) => {
    // Step 1: Login
    await loginPage.goto();
    await loginPage.login(TestData.validUsers.standard.username, TestData.validUsers.standard.password);
    await expect(page).toHaveURL(/.*inventory.html/);
    // Step 2: Browse and add item to cart
    await inventoryPage.addProductToCart(TestData.products.backpack);
    expect(await inventoryPage.getCartItemCount()).toBe(1);
    // Step 3: Go to cart and verify
    await inventoryPage.goToCart();
    expect(await cartPage.getCartItemCount()).toBe(1);
    expect(await cartPage.isProductInCart(TestData.products.backpack)).toBe(true);
    // Step 4: Proceed to checkout
    await cartPage.checkout();
    await expect(page).toHaveURL(/.*checkout-step-one.html/);
    // Step 5: Fill checkout information
    await checkoutStepOne.completeStepOne(TestData.checkoutInfo.john.firstName, TestData.checkoutInfo.john.lastName, TestData.checkoutInfo.john.zip);
    await expect(page).toHaveURL(/.*checkout-step-two.html/);
    // Step 6: Review order
    expect(await checkoutStepTwo.getCartItemCount()).toBe(1);
    const itemTotal = await checkoutStepTwo.getItemTotal();
    const tax = await checkoutStepTwo.getTax();
    const total = await checkoutStepTwo.getTotal();
    // Verify calculations
    expect(itemTotal).toBe(TestData.productPrices.backpack);
    expect(tax).toBeGreaterThan(0);
    expect(await checkoutStepTwo.isTotalCalculationCorrect()).toBe(true);
    // Step 7: Complete purchase
    await checkoutStepTwo.finish();
    await expect(page).toHaveURL(/.*checkout-complete.html/);
    // Step 8: Verify order confirmation
    await expect(checkoutComplete.completeHeader).toBeVisible();
    expect(await checkoutComplete.isCartEmpty()).toBe(true);
    // Step 9: Return home
    await checkoutComplete.backHome();
    await expect(page).toHaveURL(/.*inventory.html/);
    expect(await inventoryPage.getCartItemCount()).toBe(0);
  });

  test('Verify user is able to complete purchase with all 6 items', async ({ 
    loginPage, 
    inventoryPage, 
    cartPage, 
    checkoutStepOne, 
    checkoutStepTwo, 
    checkoutComplete
   }) => {
    await loginPage.goto();
    await loginPage.login(TestData.validUsers.standard.username, TestData.validUsers.standard.password);

    // Add all products
    await inventoryPage.addAllProductsToCart();
    expect(await inventoryPage.getCartItemCount()).toBe(TestData.products.all.length);

    await inventoryPage.goToCart();
    await cartPage.checkout();
    await checkoutStepOne.completeStepOne(TestData.checkoutInfo.john.firstName, TestData.checkoutInfo.john.lastName, TestData.checkoutInfo.john.zip);

    // Verify all 6 items in order summary
    expect(await checkoutStepTwo.getCartItemCount()).toBe(TestData.products.all.length);

    await checkoutStepTwo.finish();
    await expect(checkoutComplete.completeHeader).toBeVisible();

    await checkoutComplete.backHome();
    expect(await inventoryPage.getCartItemCount()).toBe(0);
  });

  test(' Verify purchase flow with all major features', async ({
     loginPage, 
     inventoryPage, 
     cartPage, 
     checkoutStepOne, 
     checkoutStepTwo, 
     checkoutComplete, 
     productDetailPage, 
     page }) => {
    // Step 1: Login
    await loginPage.goto();
    await loginPage.login(TestData.validUsers.standard.username, TestData.validUsers.standard.password);
    await expect(page).toHaveURL(/.*inventory.html/);
    // Step 2: Add two products from inventory
    await inventoryPage.addProductToCart(TestData.products.backpack);
    await inventoryPage.addProductToCart(TestData.products.bikeLight);
    expect(await inventoryPage.getCartItemCount()).toBe(2);
    // Step 3: Add one product from product detail page
    await inventoryPage.clickProductByName(TestData.products.boltTShirt);
    await productDetailPage.addToCart();
    await productDetailPage.goToCart();
    expect(await cartPage.getCartItemCount()).toBe(3);
    // Step 4: Remove one item from cart
    await cartPage.removeItemByName(TestData.products.bikeLight);
    expect(await cartPage.getCartItemCount()).toBe(2);
    // Step 5: Go back to inventory, sort by price, add cheapest item
    await cartPage.continueShopping();
    await inventoryPage.sortBy('lohi');
    await inventoryPage.addProductToCartByIndex(0); // Add cheapest
    expect(await inventoryPage.getCartItemCount()).toBe(3);
    // Step 6: Go to cart and proceed to checkout
    await inventoryPage.goToCart();
    await cartPage.checkout();
    await expect(page).toHaveURL(/.*checkout-step-one.html/);
    // Step 7: Try to submit with empty first name (validation error)
    await checkoutStepOne.fillCheckoutInformation('', TestData.checkoutInfo.john.lastName, TestData.checkoutInfo.john.zip);
    await checkoutStepOne.continue();
    await expect(checkoutStepOne.errorMessage).toBeVisible();
    // Step 8: Fix error and continue
    await checkoutStepOne.fillCheckoutInformation(TestData.checkoutInfo.john.firstName, TestData.checkoutInfo.john.lastName, TestData.checkoutInfo.john.zip);
    await checkoutStepOne.continue();
    await expect(page).toHaveURL(/.*checkout-step-two.html/);
    // Step 9: Review order and verify items
    expect(await checkoutStepTwo.getCartItemCount()).toBe(3);
    expect(await checkoutStepTwo.isProductInOrder(TestData.products.backpack)).toBe(true);
    expect(await checkoutStepTwo.isProductInOrder(TestData.products.boltTShirt)).toBe(true);
    // Step 10: Complete purchase
    await checkoutStepTwo.finish();
    await expect(page).toHaveURL(/.*checkout-complete.html/);
    await expect(checkoutComplete.completeHeader).toBeVisible();
    expect(await checkoutComplete.isCartEmpty()).toBe(true);
    // Step 11: Return home and verify cart is empty
    await checkoutComplete.backHome();
    await expect(page).toHaveURL(/.*inventory.html/);
    expect(await inventoryPage.getCartItemCount()).toBe(0);
    // Step 12: Logout and verify session cleared
    await inventoryPage.logout();
    await expect(page).toHaveURL(/.*\/$/);
  });
});


