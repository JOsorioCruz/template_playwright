const { faker } = require('@faker-js/faker');

class TestDataGenerator {
    static generateUser() {
        return {
            username: faker.internet.username() + Date.now(), // ✅ username() en minúsculas
            password: faker.internet.password({ length: 12 }),
            email: faker.internet.email(),
        };
    }

    static generateWeakPassword() {
        return faker.internet.password({ length: 4 });
    }

    static generateExistingUser() {
        return {
            username: 'testuser123',
            password: 'Test123456',
        };
    }
}

module.exports = TestDataGenerator;