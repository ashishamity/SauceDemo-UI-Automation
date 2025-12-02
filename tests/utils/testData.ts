export const TestData = {
  
  allUsers: {
    standard: {
      username: 'standard_user',
      password: 'secret_sauce',
    },
    problem: {
      username: 'problem_user',
      password: 'secret_sauce',
    },
    performanceGlitch: {
      username: 'performance_glitch_user',
      password: 'secret_sauce',
    },
    error: {
      username: 'error_user',
      password: 'secret_sauce',
    },
    visual: {
      username: 'visual_user',
      password: 'secret_sauce',
    }
  },

  // Invalid credentials
  invalidCredentials: {
    wrongUsername: {
      username: 'invalid_user',
      password: 'secret_sauce',
      expectedError: 'Username and password do not match'
    },
    wrongPassword: {
      username: 'standard_user',
      password: 'wrong_password',
      expectedError: 'Username and password do not match'
    },
    bothWrong: {
      username: 'invalid_user',
      password: 'wrong_password',
      expectedError: 'Username and password do not match'
    },
    emptyUsername: {
      username: '',
      password: 'secret_sauce',
      expectedError: 'Username is required'
    },
    emptyPassword: {
      username: 'standard_user',
      password: '',
      expectedError: 'Password is required'
    },
    bothEmpty: {
      username: '',
      password: '',
      expectedError: 'Username is required'
    }
  },

  specialUsers: {
    lockedOut: {
      username: 'locked_out_user',
      password: 'secret_sauce',
      expectedError: 'this user has been locked out'
    }
  },


  products: {
    backpack: 'Sauce Labs Backpack',
    bikeLight: 'Sauce Labs Bike Light',
    boltTShirt: 'Sauce Labs Bolt T-Shirt',
    fleeceJacket: 'Sauce Labs Fleece Jacket',
    onesie: 'Sauce Labs Onesie',
    redTShirt: 'Test.allTheThings() T-Shirt (Red)',
    all: [
      'Sauce Labs Backpack',
      'Sauce Labs Bike Light',
      'Sauce Labs Bolt T-Shirt',
      'Sauce Labs Fleece Jacket',
      'Sauce Labs Onesie',
      'Test.allTheThings() T-Shirt (Red)'
    ]
  },

  checkoutInfo: {
    john: { firstName: 'John', lastName: 'Doe', zip: '12345' },
    jane: { firstName: 'Jane', lastName: 'Smith', zip: '54321' },
    bob: { firstName: 'Bob', lastName: 'Brown', zip: '67890' }
  },

 
  productPrices: {
    backpack: 29.99,
    bikeLight: 9.99,
    boltTShirt: 15.99,
    fleeceJacket: 49.99,
    onesie: 7.99,
    redTShirt: 15.99
  },

  
  errorMessages: {
    invalidCredentials: 'Username and password do not match',
    usernameRequired: 'Username is required',
    passwordRequired: 'Password is required',
    lockedOut: 'this user has been locked out'
  },

 
  urls: {
    login: '/',
    inventory: '/inventory.html'
  },

 
  timeouts: {
    default: 5000,
    performanceGlitch: 10000
  },
 
};

export function getAllValidUsers() {
  return Object.values(TestData.allUsers);
}


export function getLoginTimeout(username: string): number {
  return username === TestData.allUsers.performanceGlitch.username ? 10000 : 5000;
}