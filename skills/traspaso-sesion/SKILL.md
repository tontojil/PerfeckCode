---
name: traspaso-sesion
description: Generar archivo HANDOFF.md con estado del proyecto para traspaso limpio entre sesiones, ideal antes de hacer clear o si la sesión se alarga. (HANDOFF, session, context, handover)
---

# Handoff — Traspaso limpio entre sesiones

Genera un archivo `HANDOFF.md` en la raíz del proyecto con TODO el contexto necesario para que una sesión nueva continúe sin arrastrar basura.

## Cuándo usar

- Sesión larga (>30 min) y el modelo empieza a repetir patrones
- 3+ intentos fallidos con la misma solución
- Antes de hacer `/clear` o cerrar la sesión
- Cuando el usuario dice "traspaso-sesion", "handoff", "traspaso", o "crea handoff"

## Estructura del HANDOFF.md

Generar el archivo con ESTE formato exacto:

```markdown
# Handoff — [fecha/hora]

## Objetivo
[Qué estamos tratando de lograr. Una frase clara. Sin ambigüedad.]

## Estado Actual
[Dónde estamos. Qué funciona. Qué NO funciona. Sé honesto — esto es lo más importante.]

## Archivos Clave
- `ruta/absoluta/archivo.ts` — qué es y por qué importa
- `ruta/absoluta/otro.tsx` — qué es y por qué importa

## Cambios Hechos
- [Cambio 1] — por qué se hizo
- [Cambio 2] — por qué se hizo

## Intentos Fallidos
- [Intento 1] — por qué falló. NO repetir este approach.
- [Intento 2] — por qué falló. NO repetir este approach.

## Próximos Pasos
1. [Paso concreto 1]
2. [Paso concreto 2]
3. [Paso concreto 3]

## Notas
[Cualquier contexto extra: convenciones, decisiones, advertencias, estado de git]
```

## Reglas

- **Sin ficción.** Si algo no se probó, decir "no verificado".
- **Fallos > éxitos.** Documentar lo que NO funcionó es más valioso que lo que sí.
- **Rutas absolutas.** Nada de `./` o `../`.
- **Sobrescribir sin miedo.** Si ya existe HANDOFF.md, pisarlo (es más fresco).
- **No hagas commit de HANDOFF.md.** Es temporal. Está en .gitignore o debería estarlo.

## Post-generación

1. Decir explícitamente: "HANDOFF.md creado. Cierra esta sesión y abre una nueva. Leerá el handoff automáticamente."
2. No seguir trabajando después de generar el handoff. El punto es CERRAR la sesión.

## Referencias oficiales y repositorios famosos

Esta sección amplía sin modificar el formato HANDOFF existente. Úsela para traspasos consistentes y auditables.

### Documentación oficial

- GitHub Docs Markdown: https://docs.github.com/github/writing-on-github/getting-started-with-writing-and-formatting-on-github — formato `HANDOFF.md`.
- Conventional Commits: https://www.conventionalcommits.org/ — mensajes citados en Cambios Hechos.
- Git Log: https://git-scm.com/docs/git-log — historial para documentar cambios con precisión.
- Git Status: https://git-scm.com/docs/git-status — estado limpio antes de cerrar sesión.
- Gitignore: https://git-scm.com/docs/gitignore — mantener `HANDOFF.md` como temporal fuera del repo.
- GitHub Flow: https://docs.github.com/get-started/using-github/github-flow — rama, cambios y próximos pasos.
- OWASP Secrets: https://owasp.org/www-community/vulnerabilities/Information_exposure_through_temporary_files — no incluir secretos en handoff.

### Repositorios famosos y listas curadas

- Awesome Handoffs: https://github.com/sindresorhus/awesome — curaduría general aplicable a plantillas.
- OpenCode Docs: https://opencode.ai/docs/ — sesiones, `/clear` y continuidad de contexto.
- Claude Code Best Practices: https://github.com/anthropics/claude-code — handoffs y compactación de contexto.
- Conventional Commits: https://github.com/conventional-changelog/commitlint — validación de mensajes citados.
- gitignore Templates: https://github.com/github/gitignore — patrones para excluir `HANDOFF.md`.

### Guías de profundización sugeridas

- Revise `git log --oneline -10` y `git status` antes de redactar Estado Actual.
- Consulte `.gitignore` para confirmar que `HANDOFF.md` permanece temporal.
- Valide rutas absolutas en Archivos Clave con `pwd` o explorador antes de escribir.
- Verifique Intentos Fallidos con comandos y salidas reales, sin reconstruir de memoria.
- Mida frescura: si el handoff supera una sesión larga, regenere en lugar de editar parcial.

### Checklist de verificación

- [ ] Se incluye fecha y hora en el título del handoff.
- [ ] El Objetivo describe una sola meta clara sin ambigüedad.
- [ ] El Estado Actual distingue verificado de no verificado con honestidad.
- [ ] Todos los Archivos Clave utilizan rutas absolutas con propósito descrito.
- [ ] Los Intentos Fallidos explican causa y prohíben repetir el enfoque.
- [ ] Los Próximos Pasos son concretos, ordenados y ejecutables en sesión nueva.
- [ ] No se incluyen secretos, tokens ni credenciales en el archivo.
- [ ] `HANDOFF.md` no se commitea y la sesión se cierra tras generarlo.
