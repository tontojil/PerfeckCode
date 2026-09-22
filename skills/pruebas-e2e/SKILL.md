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
  login.page.ts    # selectors + actions for /login
  checkout.page.ts # selectors + actions for /checkout
```

- Selectors in page objects, assertions in tests.
- One page object per route/component.
- Async methods returning locators, not raw elements.

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

## CI Configuration

```yaml
# Playwright in CI
- uses: actions/checkout@v4
- uses: actions/setup-node@v4
- run: npx playwright install --with-deps chromium
- run: npx playwright test --reporter=html
- uses: actions/upload-artifact@v4
  if: failure()
  with:
    name: playwright-report
    path: playwright-report/
```

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
