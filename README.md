# SauceDemo UI Automation
Comprehensive project consist of automated UI testsuite for website [https://www.saucedemo.com] built using Playwright and Typescript

## Project Structure
/ — root
├── tests
        -fixtures
        -pages
        -tests
        -utils
├── playwright.config.ts
├── package.json 
└── .gitignore

## Prerequisite:
  -Node.js
  -A Chromium/Firefox/WebKit browser installed

## Installation & Setup 
- git clone https://github.com/ashishamity/SauceDemo-UI-Automation.git
- npm install

# Run all tests  
npx playwright test  

# Run tests in headed mode (see browser)  
npx playwright test --headed  

# Run a specific test file  
npx playwright test tests/yourTestFileName.spec.ts  
