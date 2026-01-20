class BasePage {
    constructor(page) {
        this.page = page;
    }

    async navigate(path = '') {
        await this.page.goto(path);
    }

    async waitForElement(selector, timeout = 10000) {
        await this.page.waitForSelector(selector, { timeout });
    }

    async click(selector) {
        await this.page.click(selector);
    }

    async fill(selector, text) {
        await this.page.fill(selector, text);
    }

    async getText(selector) {
        return await this.page.textContent(selector);
    }

    async waitForAlert() {
        return new Promise((resolve) => {
            this.page.once('dialog', async (dialog) => {
                const message = dialog.message();
                await dialog.accept();
                resolve(message);
            });
        });
    }
}

module.exports = BasePage;