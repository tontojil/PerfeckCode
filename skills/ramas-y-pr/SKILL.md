---
name: ramas-y-pr
description: >
  Crea ramas, flujo de PR y commits convencionales. Usalo cuando crees una rama, haces commit o abres un PR.
  (branch creation, PR workflow, conventional commits)
license: MIT
metadata:
  version: "1.0"
---

# Ramas y PR

Guia para crear ramas, mantener commits legibles y abrir PR revisables. Aplica a todo cambio que requiera revision antes de integrar.

## Cuando usar

- Crear una rama nueva para una funcionalidad, correccion o refactor.
- Escribir commits que sigan Conventional Commits.
- Abrir, revisar o integrar un Pull Request con `gh`.

## Flujo de ramas

Estructura base:

```
main                          <- Produccion (nunca push directo)
└── development               <- Rama principal de desarrollo
    ├── feature/nombre-corto  <- Funcionalidades nuevas
    ├── fix/descripcion       <- Correccion de errores
    ├── refactor/descripcion  <- Refactor sin cambio de comportamiento
    └── hotfix/error-urgente  <- Correccion urgente en produccion
```

Formato de nombre:

```bash
feature/TECH-123-descripcion-corta   # Con ticket de Linear o Jira
feature/nombre-descriptivo           # Sin ticket
fix/descripcion-del-error
refactor/que-se-refactoriza
hotfix/error-urgente
```

Reglas del flujo:

1. Parte siempre desde una rama limpia y actualizada.
2. Usa una rama por proposito. No mezcles funcionalidad con refactor.
3. Sincroniza con frecuencia para evitar divergencias grandes.
4. El destino por defecto es `development`, no `main`.

```bash
# 1. Crear desde main limpio
git checkout main
git pull origin main
git checkout -b feature/nombre-funcionalidad

# 2. Desarrollar con commits frecuentes cada 30 a 60 minutos
git commit -m "feat(auth): estructura inicial de login"
git commit -m "feat(auth): validacion de credenciales"

# 3. Respaldar en remoto
git push -u origin feature/nombre-funcionalidad

# 4. Mantener actualizada durante el desarrollo
git fetch origin
git rebase origin/development
```

## Conventional Commits

Formato obligatorio:

```
type(scope): descripcion en minusculas
```

Tipos permitidos:

| Tipo | Uso |
|------|------|
| `feat` | Funcionalidad nueva |
| `fix` | Correccion de error |
| `refactor` | Refactor sin cambio de comportamiento |
| `test` | Agrega o modifica pruebas |
| `docs` | Solo documentacion |
| `ci` | Cambios de CI/CD |
| `chore` | Mantenimiento |
| `perf` | Mejora de rendimiento |

Ejemplos:

```bash
feat(auth): agregar login con google
fix(tenant): corregir validacion de dominio
refactor(tests): mover pruebas a integracion
test(api): agregar pruebas de validacion
docs(api): actualizar documentacion de endpoints
feat(api)!: cambiar formato de respuesta paginada
```

Notas:

- Usa minusculas en la descripcion y modo imperativo.
- Agrega `!` despues de `type(scope)` para indicar cambio incompatible.
- Para WIP usa el prefijo solo en local y haz squash antes del PR:

```bash
WIP: avance de funcionalidad de reportes
```

## Flujo de PR

Antes de crear el PR:

```bash
# Verificar estado y diferencias
git status
git diff origin/development...HEAD

# Verificar pruebas y calidad segun el proyecto
# npm test, npm run lint, npm run build

# Compactar commits si el proyecto lo exige, N = numero de commits
git rebase -i HEAD~N
```

Checklist del PR:

- [ ] Todas las pruebas pasan con evidencia reciente.
- [ ] Lint y formato pasan.
- [ ] Commits en Conventional Commits, sin huellas de IA.
- [ ] PR apunta a `development`, no a `main`.
- [ ] Descripcion clara con resumen, cambios y pruebas.
- [ ] Sin secretos, sin `.DS_Store`, sin archivos temporales.

## Ejemplo gh pr create

```bash
gh pr create \
  --base development \
  --title "feat(auth): agregar login con google" \
  --body "## Resumen
Agrega inicio de sesion con Google para simplificar el registro.

## Cambios
- Nuevo proveedor OAuth en auth.
- Pruebas de validacion de token.
- Documentacion del flujo.

## Pruebas
- npm test: 42 pruebas en verde.
- Verificacion manual en entorno local."
```

Verificar despues de crear:

```bash
gh pr view --web
gh pr checks
```

## Integracion

```
rama feature -> development -> main (produccion)
```

- Integra solo con CI en verde y revision aprobada.
- Evita `merge` desde `main` hacia ramas de trabajo; prefiere `rebase`.
- Elimina la rama despues de integrar.

## Hotfix urgente

```bash
# 1. Guardar trabajo en curso
git stash push --include-untracked -m "WIP: pausa para hotfix"

# 2. Crear hotfix desde main
git checkout main && git pull origin main
git checkout -b hotfix/descripcion-error

# 3. Corregir, probar y commit
git commit -m "fix(pagos): corregir calculo de total con impuestos"

# 4. Integrar y volver
git checkout main && git merge hotfix/descripcion-error
git push origin main
git branch -d hotfix/descripcion-error
git checkout rama-anterior && git stash pop
```

## Reglas de seguridad

```
NO HACER: git push --force en main o development
NO HACER: git clean -fd sin ejecutar antes git clean -n
NO HACER: git reset --hard sin revisar git status
NO HACER: push directo a main
NO HACER: rebase en ramas compartidas
HACER SIEMPRE: git status antes de operaciones destructivas
HACER SIEMPRE: git log origin/main..HEAD --oneline antes de push o PR
HACER SIEMPRE: respetar hooks, nunca usar --no-verify
```

## Keywords

branch, pr, pull request, commit, conventional commits, git workflow, merge, gh pr create

## Referencias

1. Conventional Commits 1.0.0, tipos, scopes y breaking changes: https://www.conventionalcommits.org/
2. Pull requests en GitHub, crear, revisar e integrar: https://docs.github.com/en/pull-requests
3. GitHub Flow, ramas, PR, revision y deploy: https://docs.github.com/en/get-started/using-github/github-flow
4. Documentacion de Git, branch, rebase, stash y clean: https://git-scm.com/doc

La documentacion oficial prevalece. Nunca `push --force` en `main` ni `development`, nunca `--no-verify`.

### Checklist aplicable por PR

- [ ] Rama desde `main` limpio con nombre `feature/`, `fix/`, `refactor/` o `hotfix/`, un proposito por rama.
- [ ] Commits atomicos en Conventional Commits, sin `Co-Authored-By` de IA, `git status` y `git diff` revisados.
- [ ] Tests, lint y build en verde con evidencia fresca, commits compactados si el proyecto lo exige.
- [ ] PR hacia `development` con resumen, cambios y como se probo, `gh pr create --base development` verificado.
- [ ] Seguridad: `git clean -n` antes de `git clean -fd`, sin secretos ni `.DS_Store`, `git log origin/main..HEAD` limpio.
