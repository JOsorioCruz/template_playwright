const BasePage = require('./BasePage');

class SignUpPage extends BasePage {
    constructor(page) {
        super(page);

        // Locators
        this.signUpButton = '#signin2';
        this.usernameInput = '#sign-username';
        this.passwordInput = '#sign-password';
        this.submitButton = 'button[onclick="register()"]';
        this.modalDialog = '#signInModal';
        this.closeButton = '#signInModal .close';
    }

    async openSignUpModal() {
        await this.click(this.signUpButton);
        await this.waitForElement(this.modalDialog);
    }

    async fillSignUpForm(username, password) {
        await this.fill(this.usernameInput, username);
        await this.fill(this.passwordInput, password);
    }

    async submitSignUp() {
        const alertPromise = this.waitForAlert();
        await this.click(this.submitButton);
        return await alertPromise;
    }

    async closeModal() {
        await this.click(this.closeButton);
    }

    async performSignUp(username, password) {
        await this.openSignUpModal();
        await this.fillSignUpForm(username, password);
        return await this.submitSignUp();
    }
}

module.exports = SignUpPage;