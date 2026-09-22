---
name: acciones-github
description: Patrones de GitHub Actions para armar pipelines CI/CD, workflows reutilizables, builds con matriz, cache, secretos y actions a medida. (GitHub Actions, CI/CD, workflows)
---

## Cuando usar

Usa esta skill para pipelines GitHub Actions, matrix builds, cache, secretos y actions a medida.
Cubre workflows reutilizables, environments, concurrency y artefactos.
Para Docker/K8s y estrategias de rollback/deploy usa `experto-docker` y `patrones-despliegue`.
No uses esta skill para CI de otro proveedor (GitLab, Jenkins).

## Workflow Structure

```yaml
name: CI
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  validate:
    runs-on: ubuntu-latest
    timeout-minutes: 10
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with: { version: 10 }
      - uses: actions/setup-node@v4
        with: { node-version: 22, cache: pnpm }
      - run: pnpm install --frozen-lockfile
      - run: pnpm lint
      - run: pnpm typecheck
      - run: pnpm test
      - run: pnpm build
```

## Caching

### Node Modules

```yaml
- uses: actions/setup-node@v4
  with:
    node-version: 22
    cache: pnpm  # or npm, yarn
```

### Docker Layers

```yaml
- uses: docker/build-push-action@v6
  with:
    push: true
    tags: app:latest
    cache-from: type=gha
    cache-to: type=gha,mode=max
```

### Custom Cache

```yaml
- uses: actions/cache@v4
  with:
    path: |
      ~/.cache/pip
      ~/.local/share/virtualenvs
    key: pip-${{ runner.os }}-${{ hashFiles('requirements.txt') }}
    restore-keys: pip-${{ runner.os }}-
```

## Matrix Builds

```yaml
jobs:
  test:
    strategy:
      fail-fast: false
      matrix:
        node: [20, 22]
        os: [ubuntu-latest, macos-latest]
    runs-on: ${{ matrix.os }}
    steps:
      - uses: actions/setup-node@v4
        with: { node-version: ${{ matrix.node }} }
      - run: pnpm test
```

## Reusable Workflows

### Caller

```yaml
jobs:
  deploy:
    uses: org/reusable-workflows/.github/workflows/deploy.yml@v1
    with:
      environment: production
    secrets: inherit
```

### Reusable Workflow

```yaml
on:
  workflow_call:
    inputs:
      environment:
        required: true
        type: string
    secrets:
      DEPLOY_KEY:
        required: true

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: ${{ inputs.environment }}
    steps:
      - run: echo "Deploying to ${{ inputs.environment }}"
```

## Environments & Protection Rules

```yaml
jobs:
  deploy-production:
    runs-on: ubuntu-latest
    environment:
      name: production
      url: https://app.example.com
    steps:
      - run: ./deploy.sh
```

Configure in GitHub: Settings > Environments > Add protection rules:
- Required reviewers
- Wait timer
- Branch restrictions
- Required secrets

## Secrets Management

```yaml
# Repository secrets (Settings > Secrets)
- run: echo "$SECRET" | docker login -u user --password-stdin
  env:
    SECRET: ${{ secrets.DOCKER_TOKEN }}

# OIDC (no stored secrets)
permissions:
  id-token: write
steps:
  - uses: aws-actions/configure-aws-credentials@v4
    with:
      role-to-assume: arn:aws:iam::ACCOUNT:role/GitHubActions
      aws-region: us-east-1
```

## Concurrency

```yaml
concurrency:
  group: deploy-${{ github.ref }}
  cancel-in-progress: true  # Cancel older runs on same branch
```

## Conditional Steps

```yaml
steps:
  - if: github.event_name == 'pull_request'
    run: echo "PR checks"

  - if: github.ref == 'refs/heads/main'
    run: echo "Main branch only"

  - if: failure()
    run: echo "Previous step failed"
```

## Artifact Handling

```yaml
- uses: actions/upload-artifact@v4
  with:
    name: coverage-report
    path: coverage/
    retention-days: 7

- uses: actions/download-artifact@v4
  with:
    name: coverage-report
```

## Custom Action (TypeScript)

```typescript
// action.yml
// name: 'My Action'
// inputs:
//   token:
//     required: true
// outputs:
//   result:
//     description: 'Result'

import * as core from '@actions/core'
import * as github from '@actions/github'

const token = core.getInput('token')
const octokit = github.getOctokit(token)
const result = await octokit.rest.repos.listCommits({ owner, repo })
core.setOutput('result', JSON.stringify(result.data))
```

## Rules

- Fija version mayor (`@v4` minimo, ej. `actions/checkout@v4`); usa SHA solo en prod critico.
- `--frozen-lockfile` in CI. No `npm install`.
- Set `timeout-minutes` on every job.
- Use OIDC over stored secrets when possible.
- Concurrency groups to prevent parallel deploys.
- `fail-fast: false` on matrix builds for full visibility.
- Cache aggressively: node_modules, Docker layers, pip.
- Reusable workflows for repeated patterns.

## Salida esperada

Workflow en `.github/workflows/` con jobs, `timeout-minutes`, cache y concurrency.
Verifica con `actionlint` si existe (`actionlint .github/workflows/*.yml`); si no, valida YAML y permisos/OIDC.

## Referencias oficiales y repositorios famosos

1. GitHub Actions docs (workflows, jobs, environments, OIDC): https://docs.github.com/en/actions
2. Writing workflows (sintaxis, triggers, concurrency, permissions): https://docs.github.com/en/actions/writing-workflows
3. Awesome Actions curaduria sdras (ejemplos, reusable workflows, cache): https://github.com/sdras/awesome-actions
4. Actionlint (linter de workflows, jobs y expresiones): https://github.com/rhysd/actionlint

La documentacion oficial prevalece. Fije `@v4` minimo y use OIDC sobre secretos almacenados cuando sea posible.

### Checklist aplicable por workflow

- [ ] `timeout-minutes` en cada job, `concurrency` con `cancel-in-progress` para evitar deploys paralelos.
- [ ] `npm ci` o `--frozen-lockfile`, cache de dependencias y capas Docker con `type=gha`.
- [ ] `permissions` minimas por job, secretos solo via `secrets.*`, OIDC para AWS y GCP.
- [ ] Matriz con `fail-fast: false` para visibilidad total, artefactos con `retention-days` y reporte en fallo.
- [ ] Validado con `actionlint`, environments con revisores en produccion y `if: github.ref == 'refs/heads/main'` en deploy.
