---
name: patrones-despliegue
description: Pipelines CI/CD, optimización Docker, health checks, rollback y deploy automático. Usalo cuando configurai deploys, escribai Dockerfiles o armai CI/CD. (CI/CD pipelines, Docker, rollback)
---

# Deployment Patterns

Deploy, CI/CD, and container patterns focused on zero-downtime and reliability.

## Cuando usar

- Configuring CI/CD pipeline.
- Writing or reviewing Dockerfile/docker-compose.yml.
- Planning deploy strategy (rolling, blue-green, canary).
- Debugging production deploy issues.

## Docker

### Dockerfile

Dockerfile canonico: ver skill `experto-docker`.
Acá solo estrategia: rolling / blue-green / canary, `maxUnavailable`, rollback.

### Docker Compose

```yaml
services:
  app:
    build: .
    ports: ["3000:3000"]
    environment:
      - DATABASE_URL=postgres://${DB_USER}:${DB_PASS}@db:5432/${DB_NAME}
    depends_on:
      db:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "wget", "-qO-", "http://localhost:3000/health"]
      interval: 10s
      timeout: 5s
      retries: 3
    restart: unless-stopped

  db:
    image: postgres:16-alpine
    volumes:
      - pgdata:/var/lib/postgresql/data
    environment:
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASS}
      POSTGRES_DB: ${DB_NAME}
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USER} -d ${DB_NAME}"]
      interval: 5s
      timeout: 3s
      retries: 5

volumes:
  pgdata:
```

## Health Checks

Three levels:

1. **Liveness** (`/health`): is the process alive? Returns 200 if server responds.
2. **Readiness** (`/ready`): ready for traffic? Checks DB, Redis, and dependencies.
3. **Deep** (`/health/deep`): checks queries, worker health, disk space. Not for orchestrator, monitoring only.

## Deploy Strategies

| Strategy | Downtime | Rollback | Complexity | When |
|---|---|---|---|---|
| **Rolling** | 0 | Minutes | Medium | Default for most |
| **Blue-Green** | 0 | Instant | High | Critical applications |
| **Canary** | 0 | Instant | High | High-risk changes |

### Rolling (Kubernetes)

```yaml
strategy:
  type: RollingUpdate
  rollingUpdate:
    maxSurge: 1
    maxUnavailable: 0
```

- `maxUnavailable: 0` guarantees no capacity loss.
- Health check must pass before marking pod as Ready.
- `minReadySeconds: 10` to avoid false positives.

## CI/CD Pipeline

```
Push → Lint → Test → Build → Scan → Deploy Staging → Smoke → Deploy Prod
```

Mandatory gates:
- Unit + integration tests pass.
- Security scan with no criticals.
- Successful build.
- Smoke test on staging (GET /health + critical endpoint).
- Manual approval for prod (if no mature continuous deployment).

## Rollback

Always have plan B before deploying:
- **DB migrations**: must be reversible. Forward migration + validated rollback script.
- **Feature flags**: toggle to disable problematic features without redeploy.
- **Rollback command**: one-liner: `kubectl rollout undo deployment/app` or `helm rollback`.
