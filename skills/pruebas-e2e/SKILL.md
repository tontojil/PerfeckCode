---
name: pruebas-e2e
description: "Tests E2E con Playwright, Page Object Model, estrategia de pruebas, CI y prevención de regresiones. Úsalo cuando escribas tests de navegador, armes la suite o configures E2E en CI. (E2E testing, Playwright, Page Object Model)"
---

# E2E Testing

End-to-end testing with Playwright. Focus on user flows, not implementation details.

## When to Use

- Writing new E2E tests for a feature.
- Designing test strategy for a project.
- Setting up E2E in CI/CD.
- Debugging flaky tests or slow suites.
- User asks for "E2E tests", "Playwright", "browser tests".

## Test Strategy

### What to test (E2E)
- Critical user flows (login, checkout, onboarding).
- Multi-service interactions and API contract boundaries.
- Cross-browser regressions (Chromium + Firefox + WebKit).
- Mobile viewport (iPhone 14, Pixel 7).

### What NOT to test (E2E)
- Visual details (use snapshot tests).
- Every possible input combination (use unit/integration).
- Internal state or implementation details.

## Playwright Patterns

### Page Object Model

```
pages/
  login.page.ts    # selectores + acciones para /login
  checkout.page.ts # selectores + acciones para /checkout
tests/
  login.spec.ts    # aserciones y flujos
  checkout.spec.ts
```

- Selectores en page objects, aserciones en tests.
- Un page object por ruta/componente.
- Metodos async que devuelven acciones, no elementos crudos.

Ejemplo real minimo (clase completa):

```typescript
// pages/login.page.ts
import type { Page, Locator } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly email: Locator;
  readonly password: Locator;
  readonly submit: Locator;
  readonly error: Locator;

  constructor(page: Page) {
    this.page = page;
    // Prioridad getByRole > getByLabel > getByTestId
    this.email = page.getByLabel('Email');
    this.password = page.getByLabel('Contraseña');
    this.submit = page.getByRole('button', { name: 'Iniciar sesión' });
    this.error = page.getByTestId('login-error');
  }

  async goto(): Promise<void> {
    await this.page.goto('/login');
  }

  async login(email: string, password: string): Promise<void> {
    await this.email.fill(email);
    await this.password.fill(password);
    await this.submit.click();
  }
}
```

Uso en el spec (asercion fuera del page object):

```typescript
// tests/login.spec.ts
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';

test('login feliz redirige a /panel', async ({ page }) => {
  const login = new LoginPage(page);
  await login.goto();
  await login.login('ana@ejemplo.cl', 'Clave1234.');
  await page.waitForURL('/panel');
  await expect(page.getByRole('heading', { name: 'Panel' })).toBeVisible();
});

test('login con clave invalida muestra error', async ({ page }) => {
  const login = new LoginPage(page);
  await login.goto();
  await login.login('ana@ejemplo.cl', 'clave-erronea');
  await expect(login.error).toContainText('Credenciales inválidas');
});
```

### Fixtures

- `test.beforeEach`: authenticated state via `page.context().storageState()`.
- `test.use({ storageState })`: reuse auth across tests.
- Seed DB via API, not UI.

### Selectors

Priority: `getByRole` > `getByLabel` > `getByTestId` > `getByText` > CSS.

```typescript
// Good
page.getByRole('button', { name: 'Enviar' })
page.getByLabel('Email')
page.getByTestId('checkout-total')

// Avoid
page.locator('.btn-primary')      // breaks on restyle
page.locator('//div[2]/button')   // breaks on restructure
```

### Configuracion completa (playwright.config.ts)

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30 * 1000,
  expect: { timeout: 5000 },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  // Reintentos: 2 en CI, 0 en local
  retries: process.env.CI ? 2 : 0,
  // Workers: 1 en CI para corridas deterministas, auto en local
  workers: process.env.CI ? 1 : undefined,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: process.env.BASE_URL ?? 'http://localhost:3000',
    // Trace solo en reintento para depurar sin llenar disco
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    // Viewports moviles solicitados por la estrategia
    { name: 'mobile-iphone', use: { ...devices['iPhone 14'] } },
    { name: 'mobile-pixel', use: { ...devices['Pixel 7'] } },
  ],
  // Levanta la app antes de los tests en CI
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  //   timeout: 120 * 1000,
  // },
});
```

Claves: `trace: on-first-retry` habilita `trace.zip`, `workers: 1` en CI
evita condiciones de carrera, `retries: 2` absorbe flakiness de red.

## CI Configuration

```yaml
# .github/workflows/e2e.yml — Chromium + Firefox + WebKit
name: e2e
on:
  push:
    branches: [main]
  pull_request:

jobs:
  e2e:
    runs-on: ubuntu-latest
    timeout-minutes: 30
    strategy:
      fail-fast: false
      matrix:
        project: [chromium, firefox, webkit]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      # Instala dependencias del SO + el navegador de la matriz
      - run: npx playwright install --with-deps ${{ matrix.project }}
      - run: npx playwright test --project=${{ matrix.project }} --reporter=html
        env:
          CI: true
          BASE_URL: http://localhost:3000
      - uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: playwright-report-${{ matrix.project }}
          path: |
            playwright-report/
            test-results/
          retention-days: 7
```

- Matriz con `chromium`, `firefox` y `webkit` para regresion cruzada.
- `install --with-deps <navegador>` instala dependencias del SO en el runner.
- `--project=` ejecuta solo el navegador de la matriz; el trace (`on-first-retry`) y el HTML quedan en `test-results/` y `playwright-report/`.
- `retries=2` y `workers=1` vienen del `playwright.config.ts` cuando `CI=true`.

- `--retries=2` in CI, `--retries=0` locally.
- `--workers=1` in CI for deterministic runs.
- HTML report uploaded on failure for debugging.

## Flaky Test Prevention

- Auto-wait for elements (Playwright default). No `page.waitForTimeout(500)`.
- `page.waitForURL()` after navigation, not `page.waitForTimeout()`.
- Mock external APIs with `page.route()` — isolate from third-party failures.
- Atomic tests: each test seeds its own data, no inter-test dependencies.
- Run 10x locally before marking as stable: `npx playwright test --repeat-each=10`.

## Debugging

```bash
npx playwright test --debug           # step-by-step
npx playwright test --ui              # interactive UI
npx playwright codegen <url>          # record actions → test code
npx playwright show-trace test-results/failed/trace.zip
```

- `await page.screenshot({ path: 'debug.png' })` mid-test.
- Trace: `use: { trace: 'on-first-retry' }` in config.

## Output

Emit at completion:

```
## E2E: [feature/flow]

### Test Plan
- [flow]: [scenarios] scenarios

### Coverage
- Happy path: [covered/not covered]
- Errors: [covered]
- Edge cases: [covered]
- Mobile: [covered/not covered]

### CI
- Command: [npx playwright test ...]
- Retries: [N]
- Estimated runtime: [Xs]
```

## Referencias oficiales y repositorios famosos

1. Playwright Intro (instalacion, primeros tests, codegen): https://playwright.dev/docs/intro
2. Playwright Test retries y trace viewer (flakiness, debugging): https://playwright.dev/docs/test-retries
3. Awesome Playwright curaduria mxschmitt (Page Objects, fixtures, CI): https://github.com/mxschmitt/awesome-playwright
4. Practical Test Pyramid por Martin Fowler (proporciones E2E 10 %, integracion 30 %, unit 60 %): https://martinfowler.com/articles/practical-test-pyramid.html

La documentacion oficial prevalece. Priorice `getByRole` sobre selectores fragiles.

### Checklist aplicable por suite E2E

- [ ] Page Objects con selectores estables, aserciones en specs, datos por API y auth con `storageState`.
- [ ] Solo viajes criticos en E2E (login, checkout, pagos feliz y rechazo), validaciones en unitario.
- [ ] `trace: on-first-retry`, screenshot solo en fallo, `retries=2` en CI y `0` local, `workers=1` en CI determinista.
- [ ] `npx playwright test --repeat-each=10` verde, sin `waitForTimeout`, terceros con `page.route`.
- [ ] Reporte HTML en fallo, `trace.zip` adjunto al issue, mobiles iPhone 14 y Pixel 7 cubiertos.
