const { test, expect } = require('@playwright/test');
const { allure } = require('allure-playwright');
const SignUpPage = require('../pages/SignUpPage');
const TestDataGenerator = require('../utils/testData');

test.describe('Sign Up Functionality', () => {
    let signUpPage;

    test.beforeEach(async ({ page }) => {
        signUpPage = new SignUpPage(page);
        await signUpPage.navigate('/');

        await allure.epic('User Management');
        await allure.feature('Sign Up');
    });

    test('TC001 - Successful user registration with valid data', async () => {
        await allure.story('Positive Sign Up');
        await allure.severity('critical');

        const userData = TestDataGenerator.generateUser();

        await allure.step('Open Sign Up modal', async () => {
            await signUpPage.openSignUpModal();
        });

        await allure.step('Fill registration form', async () => {
            await signUpPage.fillSignUpForm(userData.username, userData.password);
        });

        await allure.step('Submit registration', async () => {
            const alertMessage = await signUpPage.submitSignUp();

            await allure.step('Verify success message', async () => {
                expect(alertMessage).toBe('Sign up successful.');
            });
        });

        await allure.attachment('User Data', JSON.stringify(userData, null, 2), 'application/json');
    });

    test('TC002 - Registration fails with existing username', async () => {
        await allure.story('Negative Sign Up');
        await allure.severity('high');

        const existingUser = TestDataGenerator.generateExistingUser();

        const alertMessage = await signUpPage.performSignUp(
            existingUser.username,
            existingUser.password
        );

        expect(alertMessage).toBe('This user already exist.');
    });

    test('TC003 - Registration fails with empty fields', async () => {
        await allure.story('Validation');
        await allure.severity('medium');

        await signUpPage.openSignUpModal();
        const alertMessage = await signUpPage.submitSignUp();

        expect(alertMessage).toBe('Please fill out Username and Password.');
    });

    test('TC004 - Registration fails with only username', async () => {
        await allure.story('Validation');

        const userData = TestDataGenerator.generateUser();

        await signUpPage.openSignUpModal();
        await signUpPage.fillSignUpForm(userData.username, '');
        const alertMessage = await signUpPage.submitSignUp();

        expect(alertMessage).toBe('Please fill out Username and Password.');
    });
});