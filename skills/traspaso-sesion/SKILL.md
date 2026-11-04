---
name: traspaso-sesion
description: Generar archivo HANDOFF.md con estado del proyecto para traspaso limpio entre sesiones, ideal antes de hacer clear o si la sesión se alarga. (HANDOFF, session, context, handover)
metadata:
  version: "1.1.0"
---

# Handoff — Traspaso limpio entre sesiones

Genera un archivo `HANDOFF.md` en la raiz del proyecto con todo el contexto necesario para que una sesion nueva continue sin arrastrar informacion innecesaria.

## Cuando usar

- Sesion larga (mas de 30 minutos) y el modelo empieza a repetir patrones
- Tres o mas intentos fallidos con la misma solucion
- Antes de hacer `/clear` o cerrar la sesion
- Cuando la persona usuaria dice "traspaso-sesion", "handoff", "traspaso" o "crea handoff"

## Ejemplo minimo

Ejemplo minimo de `HANDOFF.md` valido. Los campos entre corchetes se reemplazan con informacion real y verificada:

```markdown
# Handoff — 2026-10-15 12:00 UTC

## Objetivo
Corregir el error de autenticacion en `login.ts` sin romper la sesion existente.

## Estado Actual
Funciona: validacion de formulario y redireccion basica.
No funciona: renovacion de token (error 401 no verificado en local).

## Archivos Clave
- `C:/proyecto/src/auth/login.ts` — logica de login y renovacion de token
- `C:/proyecto/src/api/client.ts` — cliente HTTP con interceptores

## Cambios Hechos
- Ajuste de timeout en `client.ts` — evita cancelacion prematura

## Intentos Fallidos
- Reintento automatico con backoff — falló por 401 persistente. No repetir sin revisar el refresh token.

## Próximos Pasos
1. Reproducir el 401 en local con logs
2. Revisar `refreshToken` en `login.ts`
3. Agregar test para renovacion expirada

## Notas
Rama `fix/auth-refresh`. `git status` limpio salvo `login.ts`. Sin secretos en este archivo.
```

## Estructura del HANDOFF.md

Generar el archivo con este formato exacto:

```markdown
# Handoff — [fecha/hora]

## Objetivo
[Qué se intenta lograr. Una frase clara. Sin ambigüedad.]

## Estado Actual
[Dónde está el trabajo. Qué funciona. Qué NO funciona. Ser honesto — esto es lo más importante.]

## Archivos Clave
- `ruta/absoluta/archivo.ts` — qué es y por qué importa
- `ruta/absoluta/otro.tsx` — qué es y por qué importa

## Cambios Hechos
- [Cambio 1] — por qué se hizo
- [Cambio 2] — por qué se hizo

## Intentos Fallidos
- [Intento 1] — por qué falló. NO repetir este enfoque.
- [Intento 2] — por qué falló. NO repetir este enfoque.

## Próximos Pasos
1. [Paso concreto 1]
2. [Paso concreto 2]
3. [Paso concreto 3]

## Notas
[Cualquier contexto extra: convenciones, decisiones, advertencias, estado de git]
```

## Reglas

- **Sin ficcion.** Si algo no se probo, indicar "no verificado".
- **Los fallos valen mas que los exitos.** Documentar lo que NO funciono es mas valioso que lo que si funciono.
- **Rutas absolutas.** Nada de `./` o `../`.
- **Sobrescribir sin miedo.** Si ya existe HANDOFF.md, reemplazarlo con la version mas reciente.
- **No hacer commit de HANDOFF.md.** Es temporal. Debe estar en .gitignore o quedar fuera del repo.
- **Sin secretos.** Nunca incluir tokens, claves, contrasenas ni credenciales.

## Post-generacion

1. Decir explicitamente: "HANDOFF.md creado. Cierra esta sesion y abre una nueva. La sesion nueva leera el handoff automaticamente."
2. No seguir trabajando despues de generar el handoff. El objetivo es cerrar la sesion.

## Referencias oficiales

- Markdown en GitHub (formato de `HANDOFF.md`): https://docs.github.com/github/writing-on-github/getting-started-with-writing-and-formatting-on-github
- Conventional Commits (mensajes citados en Cambios Hechos): https://www.conventionalcommits.org/
- Git Log (historial para documentar cambios con precision): https://git-scm.com/docs/git-log
- Git Status (estado limpio antes de cerrar sesion): https://git-scm.com/docs/git-status
- Gitignore (mantener `HANDOFF.md` como temporal fuera del repo): https://git-scm.com/docs/gitignore
- GitHub Flow (rama, cambios y proximos pasos): https://docs.github.com/get-started/using-github/github-flow
- OpenCode Docs (sesiones, `/clear` y continuidad de contexto): https://opencode.ai/docs/
- OWASP, exposicion por archivos temporales (no incluir secretos): https://owasp.org/www-community/vulnerabilities/Information_exposure_through_temporary_files

## Checklist de verificacion

- [ ] Se incluye fecha y hora en el titulo del handoff.
- [ ] El Objetivo describe una sola meta clara sin ambigüedad.
- [ ] El Estado Actual distingue lo verificado de lo no verificado con honestidad.
- [ ] Todos los Archivos Clave usan rutas absolutas con proposito descrito.
- [ ] Los Intentos Fallidos explican la causa y prohiben repetir el enfoque.
- [ ] Los Proximos Pasos son concretos, ordenados y ejecutables en sesion nueva.
- [ ] No se incluyen secretos, tokens ni credenciales en el archivo.
- [ ] `HANDOFF.md` no se commitea y la sesion se cierra tras generarlo.
