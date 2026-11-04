---
name: patrones-despliegue
description: Pipelines CI/CD, optimización Docker, health checks, rollback y deploy automático. Úsala cuando configures deploys, escribas Dockerfiles o armes CI/CD. (CI/CD pipelines, Docker, rollback)
---

# Patrones de Despliegue

Patrones de deploy, CI/CD y contenedores con enfoque en cero caídas y confiabilidad.

## Cuando usar

- Cuando configuras un pipeline de CI/CD.
- Cuando escribes o revisas un `Dockerfile` o `docker-compose.yml`.
- Cuando planificas una estrategia de despliegue (rolling, blue-green, canary).
- Cuando depuras un problema de despliegue en producción.

## Fuentes oficiales

Consulta siempre la documentación oficial antes de improvisar sintaxis o banderas:

- Docker: https://docs.docker.com/
- Kubernetes: https://kubernetes.io/docs/
- GitHub Actions: https://docs.github.com/en/actions

## Docker

### Dockerfile multistage con healthcheck

Utiliza construcción por etapas para imágenes livianas y seguras. La etapa `builder` compila, la etapa `runner` solo contiene lo necesario para ejecución.

```dockerfile
# Etapa 1: construcción
FROM node:22-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . ./
RUN npm run build

# Etapa 2: ejecución
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
# Usuario no root por seguridad
RUN addgroup -S app && adduser -S app -G app
COPY --from=builder /app/package.json /app/package-lock.json ./
COPY --from=builder /app/dist ./dist
RUN npm ci --omit=dev && chown -R app:app /app
USER app
EXPOSE 3000
# Verificación de salud integrada en la imagen
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:3000/health || exit 1
CMD ["node", "dist/main.js"]
```

Buenas prácticas aplicadas:

1. `npm ci` en lugar de `npm install` para builds reproducibles.
2. `--omit=dev` para excluir dependencias de desarrollo en producción.
3. Usuario no root.
4. `HEALTHCHECK` con `start-period` para evitar falsos negativos durante el arranque.
5. Solo se copia `dist` a la imagen final, no el código fuente completo.

### Docker Compose con healthcheck y dependencias sanas

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

Tres niveles, con responsabilidad distinta:

1. **Liveness** (`/health`): indica si el proceso está vivo. Devuelve 200 si el servidor responde. El orquestador reinicia el contenedor si falla.
2. **Readiness** (`/ready`): indica si está listo para recibir tráfico. Verifica base de datos, Redis y dependencias externas.
3. **Profundo** (`/health/deep`): verifica consultas reales, estado de workers y espacio en disco. Solo para monitoreo, no para el orquestador.

## Estrategias de Despliegue

| Estrategia | Caída | Rollback | Complejidad | Cuándo usar |
|---|---|---|---|---|
| **Rolling** | 0 | Minutos | Media | Opción por defecto para la mayoría |
| **Blue-Green** | 0 | Instantáneo | Alta | Aplicaciones críticas |
| **Canary** | 0 | Instantáneo | Alta | Cambios de alto riesgo |

### Estrategia rolling en Kubernetes

Es la estrategia por defecto recomendada. Reemplaza pods de forma gradual sin perder capacidad.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: app
spec:
  replicas: 3
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  minReadySeconds: 10
  template:
    metadata:
      labels:
        app: app
    spec:
      containers:
        - name: app
          image: registry.example.com/app:1.2.3
          ports:
            - containerPort: 3000
          livenessProbe:
            httpGet:
              path: /health
              port: 3000
            initialDelaySeconds: 10
            periodSeconds: 10
          readinessProbe:
            httpGet:
              path: /ready
              port: 3000
            initialDelaySeconds: 5
            periodSeconds: 5
```

Reglas clave:

- `maxUnavailable: 0` garantiza que no se pierde capacidad durante el despliegue.
- `maxSurge: 1` permite crear un pod adicional para acelerar el reemplazo.
- La verificación de salud debe pasar antes de marcar el pod como `Ready`.
- `minReadySeconds: 10` evita falsos positivos cuando el pod arranca rápido pero aún no es estable.

## Pipeline CI/CD con GitHub Actions con rollback

Flujo obligatorio:

```
Push -> Lint -> Test -> Build -> Scan -> Deploy Staging -> Smoke -> Deploy Prod
```

Compuertas obligatorias:

- Pruebas unitarias y de integración aprobadas.
- Escaneo de seguridad sin vulnerabilidades críticas.
- Build exitoso con etiqueta inmutable por commit.
- Prueba de humo en staging (`GET /health` más endpoint crítico).
- Aprobación manual para producción si no existe despliegue continuo maduro.

Ejemplo completo en `.github/workflows/deploy.yml`:

```yaml
name: deploy

on:
  push:
    branches: [main]

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  lint-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm run lint
      - run: npm test

  build-scan:
    needs: lint-test
    runs-on: ubuntu-latest
    permissions:
      packages: write
    outputs:
      tag: ${{ steps.meta.outputs.tag }}
    steps:
      - uses: actions/checkout@v4
      - id: meta
        run: echo "tag=sha-${GITHUB_SHA::7}" >> "$GITHUB_OUTPUT"
      - uses: docker/build-push-action@v6
        with:
          context: .
          push: true
          tags: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:${{ steps.meta.outputs.tag }}
      # Escaneo de vulnerabilidades, falla si hay críticas
      - uses: aquasecurity/trivy-action@0.28.0
        with:
          image-ref: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:${{ steps.meta.outputs.tag }}
          severity: CRITICAL
          exit-code: "1"

  deploy-staging:
    needs: build-scan
    runs-on: ubuntu-latest
    environment: staging
    steps:
      - run: |
          kubectl set image deployment/app \
            app=${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:${{ needs.build-scan.outputs.tag }} \
            -n staging
          kubectl rollout status deployment/app -n staging --timeout=180s

  smoke-staging:
    needs: deploy-staging
    runs-on: ubuntu-latest
    steps:
      - run: |
          curl --fail --retry 5 --retry-delay 10 https://staging.example.com/health
          curl --fail https://staging.example.com/api/critical

  deploy-prod:
    needs: smoke-staging
    runs-on: ubuntu-latest
    environment: production
    steps:
      - run: |
          kubectl set image deployment/app \
            app=${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:${{ needs.build-scan.outputs.tag }} \
            -n production
          kubectl rollout status deployment/app -n production --timeout=300s

  rollback-prod:
    needs: deploy-prod
    if: failure()
    runs-on: ubuntu-latest
    environment: production
    steps:
      - run: |
          kubectl rollout undo deployment/app -n production
          kubectl rollout status deployment/app -n production --timeout=180s
```

## Rollback

Ten siempre un plan B antes de desplegar:

- **Migraciones de base de datos**: deben ser reversibles. Migración hacia adelante más script de reversa validado.
- **Feature flags**: permiten desactivar funciones con problemas sin redesplegar.
- **Comando de reversa en un paso**: `kubectl rollout undo deployment/app` o `helm rollback <release> 1`.
- En el pipeline de ejemplo, el job `rollback-prod` se ejecuta solo si `deploy-prod` falla (`if: failure()`), lo que garantiza reversa automática.
- Etiqueta imágenes por SHA de commit, nunca uses `latest` en producción, para que el rollback apunte a una versión exacta.

## Comandos de verificación

Ejecuta estos comandos después de cada despliegue para confirmar estado sano:

```bash
# Estado del despliegue y de los pods
kubectl rollout status deployment/app -n production
kubectl get pods -n production -l app=app
kubectl get events -n production --sort-by=.lastTimestamp | tail -20

# Historial y capacidad de reversa
kubectl rollout history deployment/app -n production
kubectl describe deployment app -n production | grep -i image

# Verificación de salud desde fuera del clúster
curl --fail https://example.com/health
curl --fail https://example.com/ready

# Verificación de imagen local y salud de contenedores
docker images | grep app
docker ps --filter "health=unhealthy"
docker inspect --format='{{.State.Health.Status}}' <container_id>

# Si usas Helm
helm history <release> -n production
helm status <release> -n production
```
