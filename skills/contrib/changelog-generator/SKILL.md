---
name: changelog-generator
description: "Convierte Conventional Commits en un changelog estructurado por version y tipo. Usalo para releases, notas de version y auditoria de cambios. (changelog, conventional commits, release, semver)"
---

# Changelog Generator

## Core Rule

Cada entrada del changelog proviene de un commit que sigue Conventional Commits. Ningun cambio entra al changelog sin tipo valido, alcance y referencia al commit. Esta regla mantiene el historial auditable y el versionado predecible.

## Cuándo usar

- Se prepara un release y se necesitan notas de version.
- El usuario pide "changelog", "notas del release" o "que cambio en la version".
- El historial tiene commits desordenados y se debe normalizar.
- Se quiere verificar que el versionado SemVer coincide con los tipos de commit.

## Process

1. Recolecta el rango exacto de commits con `git log <anterior>..<nuevo> --oneline`. Si no hay tags, define el rango por fecha o por rama y dejalo registrado.
2. Clasifica cada commit por tipo: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore` y `revert`. Marca `!` o `BREAKING CHANGE` como ruptura.
3. Agrupa por seccion en este orden fijo: `Rupturas`, `Funciones`, `Correcciones`, `Rendimiento`, `Documentacion`, `Mantenimiento`. Omite las secciones vacias sin dejar titulos vacios.
4. Redacta cada entrada con el formato `alcance: descripcion (hash corto)`. Usa verbos en pasado o imperativo consistente y conserva el idioma principal del repo.
5. Calcula la version sugerida por SemVer: ruptura sube major, `feat` sube minor, solo `fix` sube patch. Si el calculo contradice el tag pedido, lo reportas antes de publicar.
6. Genera comparacion y metadatos: fecha en formato `AAAA-MM-DD`, enlace de comparacion entre tags y lista de autores. Verifica que cada hash existe en el repo.
7. Valida con el checklist y entrega `CHANGELOG.md` parcial o completo mas el resumen para el release. Nunca mezcles entradas no liberadas con liberadas sin marcarlas como `No liberado`.

## Ejemplo deficiente contra ejemplo correcto

Ejemplo deficiente:

```markdown
## Nueva version

- Varios arreglos y mejoras.
- Actualizacion general del sistema.
```

Problema: no dice que cambio, no referencia commits y no permite auditar el release.

Ejemplo correcto:

```markdown
## [1.4.0] - 2026-10-20

### Funciones

- pago: agregar pago con tarjeta en checkout (a1b2c3d)
- auth: agregar renovacion de sesion (e4f5g6h)

### Correcciones

- pago: corregir doble cobro con reintento (i7j8k9l)

Comparacion: v1.3.0...v1.4.0
```

```python
# scripts/clasificar_commits.py
# Clasifica lineas de git log segun Conventional Commits.
import re

# Patron oficial: tipo(alcance)!: descripcion
patron = re.compile(r"^(feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert)(\(.+\))?(!)?: .+")

# Ejemplos de lineas reales del historial.
lineas = [
    "feat(pago): agregar pago con tarjeta",
    "arreglo general",  # linea invalida, se reporta
]

# Clasifica cada linea y marca las que no cumplen el formato.
for linea in lineas:
    if patron.match(linea):
        print("Valido: " + linea)
    else:
        print("Invalido: " + linea)
```

## Niveles de aplicación

- Nivel 1, notas rapidas: lista agrupada por `feat` y `fix` para un rango pequeno. Sin calculo de version. Sirve para pre releases internos.
- Nivel 2, release estandar: changelog completo con las seis secciones, version SemVer calculada y comparacion entre tags. Requiere historial limpio o normalizado.
- Nivel 3, auditoria: incluye autores, rupturas con guia de migracion y verificacion hash por hash. Se usa para releases publicos o con breaking changes.

## Reglas estrictas

- Nunca inventes descripciones. Cada entrada debe corresponder a un hash real del rango.
- Nunca publiques una ruptura sin su nota de migracion en la seccion `Rupturas`.
- Nunca mezcles commits fuera del rango. El rango `anterior..nuevo` se declara al inicio.
- Nunca uses titulos de seccion vacios. Si no hay `perf`, esa seccion no aparece.
- Siempre usa comillas ASCII y formato de fecha `AAAA-MM-DD` para evitar ambiguedad regional.

## Checklist aplicable

- [ ] Rango de commits declarado con comando exacto y tags verificados.
- [ ] Todos los commits clasificados por tipo valido o marcados como invalidos.
- [ ] Rupturas detectadas por `!` y por `BREAKING CHANGE` en el cuerpo.
- [ ] Version sugerida calculada y consistente con SemVer.
- [ ] Cada entrada tiene alcance, descripcion y hash corto real.
- [ ] Comparacion entre tags y fecha incluidas.
- [ ] Entradas no liberadas marcadas como `No liberado` si existen.
- [ ] `CHANGELOG.md` actualizado sin duplicar versiones anteriores.

## Output Contract

Entrega siempre en este orden:

1. Bloque Markdown listo para `CHANGELOG.md` con version, fecha y secciones.
2. Tabla `hash | tipo | alcance | descripcion | ruptura (si o no)`.
3. Version sugerida con justificacion en una linea.
4. Lista de commits invalidos con accion propuesta (reescribir, omitir o corregir).

Ejemplo de salida valida:

```
Version: 1.4.0, minor por 2 feat sin rupturas, fecha 2026-10-20.
Tabla: 5 commits, 4 validos, 1 invalido.
Invalidos: "arreglo general" sin tipo, propuesta: omitir del changelog y corregir el mensaje.
```

## Referencias oficiales

- Especificacion Conventional Commits: https://www.conventionalcommits.org/en/v1.0.0/
- Guia Keep a Changelog: https://keepachangelog.com/en/1.0.0/
- Especificacion SemVer: https://semver.org/
- Proyecto conventional-changelog: https://github.com/conventional-changelog/conventional-changelog
