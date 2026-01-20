const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
    testDir: './tests',
    timeout: 30000,
    retries: 1,

    reporter: [
        ['html'],
        ['allure-playwright', {
            outputFolder: 'allure-results',
            detail: true,
            suiteTitle: true
        }]
    ],

    use: {
        baseURL: 'https://www.demoblaze.com',
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
        trace: 'on-first-retry',
        headless: true,
    },

    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
    ],
});