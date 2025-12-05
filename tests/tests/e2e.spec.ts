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

    const { username, password } = TestData.allUsers.standard;
    const product = TestData.products.backpack;
    const expectedPrice = TestData.productPrices.backpack;
    const {firstName,lastName,zip} = TestData.checkoutInfo.john;


    await test.step('Login', async () => {
      await loginPage.goto();
      await loginPage.login(username, password);
      await inventoryPage.assertInventoryPageUrl();
    });

    await test.step('Add item to cart and verify count', async () => {
      await inventoryPage.addProductToCart(product);
      await inventoryPage.assertCartItemCount(1);
    });

    await test.step('Open cart and verify product', async () => {
      await inventoryPage.goToCart();
      await cartPage.assertCartItemCount(1);
      await cartPage.assertProductInCart(product);
    });

   await test.step('Proceed to checkout and fill details', async () => {
      await cartPage.checkout();
      await checkoutStepOne.assertOnStepOne();
      await checkoutStepOne.completeStepOne(firstName,lastName,zip);
      await checkoutStepTwo.assertOnStepTwo();
      expect(await checkoutStepTwo.getCartItemCount()).toBe(1);
    });
    
    
   await test.step('Verify order summary & calculations', async () => {
    const itemTotal = await checkoutStepTwo.getItemTotal();
    const tax = await checkoutStepTwo.getTax();
    const total = await checkoutStepTwo.getTotal();
    expect(itemTotal).toBe(expectedPrice);
    expect(tax).toBeGreaterThan(0);
    expect(await checkoutStepTwo.isTotalCalculationCorrect()).toBe(true);
    });

    await test.step('Complete purchase and verify confirmation', async () => {
      await checkoutStepTwo.finish();
      await expect(page).toHaveURL(/.*checkout-complete.html/);
      await expect(checkoutComplete.completeHeader).toBeVisible();
      expect(await checkoutComplete.isCartEmpty()).toBe(true);
    });
   await test.step('Return home and final validations', async () => {
       await checkoutComplete.backHome();
       await expect(page).toHaveURL(/.*inventory.html/);
       expect(await inventoryPage.getCartItemCount()).toBe(0);
    });
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
    await loginPage.login(TestData.allUsers.standard.username, TestData.allUsers.standard.password);

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

  // Test Step - Launch the application and verify user is on inventory page.
   
    await loginPage.goto();
    await loginPage.login(TestData.allUsers.standard.username, TestData.allUsers.standard.password);
    await expect(page).toHaveURL(/.*inventory.html/);
  
  // Add prodcuts to cart and verify the count
    await inventoryPage.addProductToCart(TestData.products.backpack);
    await inventoryPage.addProductToCart(TestData.products.bikeLight);
    expect(await inventoryPage.getCartItemCount()).toBe(2);
    
  // Add products to cart again and verify the count should be increased

    await inventoryPage.clickProductByName(TestData.products.boltTShirt);
    await productDetailPage.addToCart();
    await productDetailPage.goToCart();
    expect(await cartPage.getCartItemCount()).toBe(3);

    // Remove one product and verify count of card should be decreased
    await cartPage.removeItemByName(TestData.products.bikeLight);
    expect(await cartPage.getCartItemCount()).toBe(2);

    //Sort by low to high and add 1st product in cart and verify the cart count
    await cartPage.continueShopping();
    await inventoryPage.sortBy('lohi');
    await inventoryPage.addProductToCartByIndex(0);
    expect(await inventoryPage.getCartItemCount()).toBe(3);

    //Navigate to checkout page one and verify the url
   
    await inventoryPage.goToCart();
    await cartPage.checkout();
    await expect(page).toHaveURL(/.*checkout-step-one.html/);
    
   // Verify if error message is displayed if any field is left emmpty.
    await checkoutStepOne.fillCheckoutInformation('', TestData.checkoutInfo.john.lastName, TestData.checkoutInfo.john.zip);
    await checkoutStepOne.continue();
    await expect(checkoutStepOne.errorMessage).toBeVisible();
    
    // Verify user is able to navigate to to checkout step two page
    await checkoutStepOne.fillCheckoutInformation(TestData.checkoutInfo.john.firstName, TestData.checkoutInfo.john.lastName, TestData.checkoutInfo.john.zip);
    await checkoutStepOne.continue();
    await expect(page).toHaveURL(/.*checkout-step-two.html/);

    //Verify product counta and product is present on the checkout page.
    expect(await checkoutStepTwo.getCartItemCount()).toBe(3);
    expect(await checkoutStepTwo.isProductInOrder(TestData.products.backpack)).toBe(true);
    expect(await checkoutStepTwo.isProductInOrder(TestData.products.boltTShirt)).toBe(true);
   
    // Verify checkout is succesffull and banner is visible
    await checkoutStepTwo.finish();
    await expect(page).toHaveURL(/.*checkout-complete.html/);
    await expect(checkoutComplete.completeHeader).toBeVisible();
    expect(await checkoutComplete.isCartEmpty()).toBe(true);

   // Verify count is 0 when returend to  inventory page.
    await checkoutComplete.backHome();
    await expect(page).toHaveURL(/.*inventory.html/);
    expect(await inventoryPage.getCartItemCount()).toBe(0);
    // Logout and assert login page url
    await inventoryPage.logout();
    await loginPage.assertLoginPageURL();
  });
});


