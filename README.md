# 🚀 Demoblaze Automation - Playwright + POM

Proyecto de automatización de pruebas E2E para [Demoblaze](https://www.demoblaze.com) utilizando Playwright, Page Object Model (POM), JavaScript y mejores prácticas de Clean Code.

## 📋 Tabla de Contenidos

- [Descripción](#descripción)
- [Prerrequisitos del Sistema](#prerrequisitos-del-sistema)
- [Tecnologías Utilizadas](#tecnologías-utilizadas)
- [Instalación](#instalación)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Configuración](#configuración)
- [Ejecución de Pruebas](#ejecución-de-pruebas)
- [Reportes](#reportes)
- [Casos de Prueba](#casos-de-prueba)
- [Buenas Prácticas](#buenas-prácticas)
- [Troubleshooting](#troubleshooting)

---

## 📖 Descripción

Framework de automatización de pruebas diseñado para validar la funcionalidad de registro (Sign Up) de la aplicación web Demoblaze. Implementa patrones de diseño robustos y generación de datos dinámicos para garantizar pruebas confiables y mantenibles.

### Características principales:
- ✅ Page Object Model (POM)
- ✅ Generación dinámica de datos con Faker
- ✅ Reportes detallados con Allure
- ✅ Clean Code y principios SOLID
- ✅ Manejo de alertas del navegador
- ✅ Screenshots y videos en fallos
- ✅ Retry automático de pruebas fallidas

---

## 💻 Prerrequisitos del Sistema

### Sistema Operativo
- macOS 10.15+ / Windows 10+ / Linux (Ubuntu 20.04+)

### Software Requerido

| Software | Versión Mínima | Verificación | Instalación |
|----------|----------------|--------------|-------------|
| **Node.js** | 16.x o superior | `node --version` | [nodejs.org](https://nodejs.org/) |
| **npm** | 8.x o superior | `npm --version` | Incluido con Node.js |
| **Git** | 2.x | `git --version` | [git-scm.com](https://git-scm.com/) |

### Verificar Instalación
```bash
# Node.js
node --version
# Salida esperada: v18.x.x o superior

# npm
npm --version
# Salida esperada: 9.x.x o superior

# Git
git --version
# Salida esperada: git version 2.x.x
```

### Instalación de Node.js (si no está instalado)

#### macOS
```bash
# Usando Homebrew
brew install node

# O descarga el instalador desde nodejs.org
```

#### Windows
```bash
# Descarga el instalador MSI desde nodejs.org
# O usando Chocolatey:
choco install nodejs
```

#### Linux (Ubuntu/Debian)
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

---

## 🛠️ Tecnologías Utilizadas

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **Playwright** | ^1.40.0 | Framework de automatización E2E |
| **@faker-js/faker** | ^8.0.0 | Generación de datos de prueba |
| **allure-playwright** | ^2.15.0 | Reportes de pruebas |
| **allure-commandline** | ^2.25.0 | Generador de reportes Allure |
| **JavaScript (ES6+)** | - | Lenguaje de programación |

---

## 📦 Instalación

### Paso 1: Clonar o crear el proyecto
```bash
# Opción A: Clonar desde repositorio (si existe)
git clone <url-del-repositorio>
cd demoblaze-automation

# Opción B: Crear desde cero
mkdir demoblaze-automation
cd demoblaze-automation
```

### Paso 2: Inicializar proyecto Node.js
```bash
npm init -y
```

### Paso 3: Instalar dependencias
```bash
# Instalar Playwright
npm install -D @playwright/test

# Instalar Faker para generación de datos
npm install -D @faker-js/faker

# Instalar Allure para reportes
npm install -D allure-playwright allure-commandline

# Instalar navegadores de Playwright
npx playwright install
```

**Nota:** La instalación de navegadores puede tardar varios minutos dependiendo de tu conexión a internet.

### Paso 4: Verificar instalación
```bash
npx playwright --version
# Salida esperada: Version 1.40.x
```

---

## 📁 Estructura del Proyecto
```
demoblaze-automation/
│
├── pages/                      # Page Object Models
│   ├── BasePage.js            # Clase base con métodos comunes
│   └── SignUpPage.js          # Page Object para Sign Up
│
├── tests/                      # Casos de prueba
│   └── signUp.spec.js         # Suite de pruebas de registro
│
├── utils/                      # Utilidades y helpers
│   └── testData.js            # Generador de datos de prueba
│
├── allure-results/            # Resultados de Allure (generado)
├── allure-report/             # Reporte HTML de Allure (generado)
├── test-results/              # Screenshots y videos (generado)
│
├── playwright.config.js       # Configuración de Playwright
├── package.json               # Dependencias y scripts
├── package-lock.json          # Lock de dependencias
└── README.md                  # Documentación del proyecto
```

### Paso 5: Crear estructura de carpetas
```bash
mkdir pages tests utils
```

---

## ⚙️ Configuración

### 1. Crear `playwright.config.js`
```bash
touch playwright.config.js
```

**Contenido del archivo:**
```javascript
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
```

### 2. Crear archivos del proyecto

#### `pages/BasePage.js`
```javascript
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
```

#### `pages/SignUpPage.js`
```javascript
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
```

#### `utils/testData.js`
```javascript
const { faker } = require('@faker-js/faker');

class TestDataGenerator {
  static generateUser() {
    return {
      username: faker.internet.username() + Date.now(),
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
```

#### `tests/signUp.spec.js`
```javascript
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
```

### 3. Configurar scripts en `package.json`

Edita tu `package.json` y agrega estos scripts:
```json
{
  "name": "demoblaze-automation",
  "version": "1.0.0",
  "description": "Automated testing for Demoblaze using Playwright",
  "main": "index.js",
  "scripts": {
    "test": "npx playwright test",
    "test:headed": "npx playwright test --headed",
    "test:signup": "npx playwright test signUp.spec.js",
    "test:debug": "npx playwright test --debug",
    "test:ui": "npx playwright test --ui",
    "report": "allure generate allure-results --clean && allure open",
    "report:generate": "allure generate allure-results --clean",
    "report:open": "allure open allure-report"
  },
  "keywords": ["playwright", "automation", "testing", "e2e"],
  "author": "Tu Nombre",
  "license": "ISC",
  "devDependencies": {
    "@faker-js/faker": "^8.0.0",
    "@playwright/test": "^1.40.0",
    "allure-commandline": "^2.25.0",
    "allure-playwright": "^2.15.0"
  }
}
```

---

## 🧪 Ejecución de Pruebas

### Comandos principales
```bash
# Ejecutar todas las pruebas
npm test

# Ejecutar pruebas con navegador visible
npm run test:headed

# Ejecutar solo pruebas de Sign Up
npm run test:signup

# Ejecutar en modo debug (paso a paso)
npm run test:debug

# Ejecutar con UI Mode (interfaz interactiva)
npm run test:ui

# Ejecutar en un navegador específico
npx playwright test --project=chromium
```

### Opciones avanzadas
```bash
# Ejecutar un test específico
npx playwright test -g "TC001"

# Ejecutar con más workers (paralelo)
npx playwright test --workers=4

# Ejecutar sin headless
npx playwright test --headed --project=chromium

# Ver trazas de ejecución
npx playwright show-trace trace.zip
```

---

## 📊 Reportes

### Reporte HTML nativo de Playwright

Después de ejecutar las pruebas:
```bash
npx playwright show-report
```

### Reporte Allure

#### Generar y abrir reporte
```bash
# Generar y abrir automáticamente
npm run report

# Solo generar
npm run report:generate

# Solo abrir reporte existente
npm run report:open
```

#### Características del reporte Allure:
- 📈 Gráficos de ejecución
- 🎯 Severidad de casos
- 📝 Steps detallados
- 📎 Attachments (JSON, screenshots)
- 📊 Tendencias históricas
- ⏱️ Tiempos de ejecución

### Limpiar reportes
```bash
# Limpiar resultados de Allure
rm -rf allure-results allure-report

# Limpiar resultados de Playwright
rm -rf test-results playwright-report
```

---

## 📝 Casos de Prueba

### Suite: Sign Up Functionality

| ID | Caso de Prueba | Severidad | Tipo |
|----|----------------|-----------|------|
| TC001 | Registro exitoso con datos válidos | Critical | Positivo |
| TC002 | Fallo con usuario existente | High | Negativo |
| TC003 | Fallo con campos vacíos | Medium | Validación |
| TC004 | Fallo con solo username | Medium | Validación |

### Cobertura de pruebas:
- ✅ Happy path (registro exitoso)
- ✅ Validaciones de campos
- ✅ Manejo de duplicados
- ✅ Manejo de alertas JavaScript
- ✅ Generación dinámica de datos

---

## 🎯 Buenas Prácticas Implementadas

### Clean Code
- ✅ Nombres descriptivos y autoexplicativos
- ✅ Métodos con responsabilidad única (SRP)
- ✅ Evitar magic numbers/strings
- ✅ Comentarios solo cuando es necesario

### POM (Page Object Model)
- ✅ Separación de lógica de negocio y pruebas
- ✅ Encapsulación de locators
- ✅ Reutilización de código
- ✅ Fácil mantenimiento

### DRY (Don't Repeat Yourself)
- ✅ BasePage con métodos comunes
- ✅ TestDataGenerator centralizado
- ✅ Configuración global en playwright.config.js

### Manejo de datos
- ✅ Datos dinámicos con Faker
- ✅ Evita colisiones de datos
- ✅ Datos separados de la lógica

### Reportes y trazabilidad
- ✅ Allure con categorización (Epic, Feature, Story)
- ✅ Screenshots en fallos
- ✅ Videos de ejecución
- ✅ Attachments con datos de prueba

---

## 🔧 Troubleshooting

### Error: "Cannot find module '@playwright/test'"
```bash
# Solución: Reinstalar dependencias
npm install
npx playwright install
```

### Error: "faker.internet.userName is not a function"
```bash
# Causa: Versión antigua de Faker
# Solución: Usar username() en minúsculas
faker.internet.username() // ✅ Correcto
faker.internet.userName() // ❌ Incorrecto (versiones antiguas)
```

### Error: "Timeout 30000ms exceeded"
```javascript
// Solución: Aumentar timeout en playwright.config.js
timeout: 60000, // 60 segundos
```

### Navegadores no instalados
```bash
# Reinstalar navegadores
npx playwright install --force
```

### Puerto Allure ocupado
```bash
# Cambiar puerto
allure open allure-report -p 8080
```

### Permisos en macOS/Linux
```bash
# Dar permisos de ejecución
chmod +x node_modules/.bin/playwright
```

---

## 📚 Recursos Adicionales

- [Documentación Playwright](https://playwright.dev)
- [Faker.js Documentation](https://fakerjs.dev)
- [Allure Framework](https://docs.qameta.io/allure/)
- [JavaScript ES6+ Guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

---

## ✍️ Autor

**Jairo Alonso Osorio Cruz** - QA Engineer  
📧 Email: osoriocruzjairo@gmail.com  
🔗 LinkedIn: [tu-perfil](https://www.linkedin.com/in/jairo-osorio-c-8461061b3/)

---

## 🎓 Notas de Aprendizaje

Este proyecto fue creado con fines educativos para demostrar:
- Implementación de POM con Playwright
- Generación de datos con Faker
- Reportes avanzados con Allure
- Mejores prácticas de Clean Code en automatización