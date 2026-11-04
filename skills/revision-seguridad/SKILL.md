---
name: revision-seguridad
description: "Revisión de cambios pendientes para detectar fallas de seguridad, secretos expuestos, inyecciones y problemas de dependencias. Para usar en diffs, PRs o antes de desplegar. (security review, OWASP, vulnerabilities)"
---

# Revisión de seguridad

Auditoría sistemática de los cambios pendientes. El objetivo es detectar vulnerabilidades reales en el diff, no describir teoría general.

## Cuándo usar

- Antes de fusionar un PR.
- Cuando se modifica autenticación, rutas, consultas a base de datos o entradas de usuario.
- Cuando el usuario pide "revisión de seguridad", "auditoría" o "verificar seguridad".
- Después de un incidente, para verificar que la corrección no introduce nuevas vulnerabilidades.

## Proceso de revisión

1. Obtenga el diff real con `git diff`, `git diff main...HEAD` o `gh pr diff`. No revise a ciegas.
2. Recorra la lista de verificación de abajo sobre los archivos modificados.
3. Ejecute al menos una herramienta automática de la sección Herramientas.
4. Clasifique cada hallazgo por severidad y proponga una corrección concreta con archivo y línea.

## Lista de verificación

### Secretos y credenciales

- No hay API keys, tokens ni contraseñas en el diff.
- No hay URLs con credenciales incrustadas.
- Las variables de entorno se referencian por nombre, nunca se escriben con valores reales.
- No hay archivos `.env`, `*.pem` ni `*.key` agregados al repositorio.

### Inyección

- SQL: se usan sentencias preparadas o query builder con parámetros. Nunca concatenación.
- XSS: la salida se escapa en HTML/JSX. `dangerouslySetInnerHTML` solo con sanitización explícita.
- Comandos: no se usa `exec()`, `system()` ni `subprocess` con cadenas de usuario.
- Path traversal: no se concatena entrada de usuario en rutas de archivos sin validación.

### Autenticación y autorización

- El middleware de autenticación cubre todas las rutas protegidas.
- Los roles y permisos se verifican en el backend, no solo en el frontend.
- JWT con expiración configurada y token de refresco separado.
- Sin endpoints nuevos sin control de acceso ni registros de auditoría en acciones sensibles.

### Exposición de datos

- No hay PII en logs ni en respuestas de error.
- No hay stack traces en producción.
- Rate limiting en endpoints públicos.
- Cabeceras de seguridad básicas presentes cuando aplica.

### Dependencias

- Las dependencias nuevas son legítimas, tienen mantenimiento activo y justificación clara.
- No se usa `*` en versiones de `package.json` o `requirements.txt`.
- Se ejecutó auditoría de dependencias antes de aprobar.

## Referencias obligatorias

Use estas referencias para clasificar cada hallazgo con un identificador estándar:

- OWASP Cheat Sheet Series: https://github.com/OWASP/CheatSheetSeries — guias practicas para correccion de autenticacion, validacion, secretos y cabeceras.
- OWASP Top 10: https://owasp.org/www-project-top-ten/
  - A01 Control de acceso roto, A02 Fallas criptográficas, A03 Inyección, A04 Diseño inseguro, A05 Configuración incorrecta, A06 Componentes vulnerables, A07 Fallas de autenticación, A08 Fallas de integridad, A09 Fallas de registro, A10 SSRF.
  - Cada hallazgo debe indicar la categoría OWASP correspondiente cuando aplique. Ejemplo: "A03 Inyección".
- CWE: https://cwe.mitre.org/
  - Agregue el identificador CWE cuando sea posible. Ejemplos frecuentes: CWE-798 (credenciales hardcodeadas), CWE-89 (inyección SQL), CWE-79 (XSS), CWE-78 (inyección de comandos), CWE-22 (path traversal), CWE-311 (falta de cifrado), CWE-918 (SSRF).
  - Formato sugerido: `[OWASP A03 / CWE-89]`.

## Herramientas con comandos

Ejecute al menos una herramienta según el tipo de cambio. Incluya la salida relevante en el informe.

### npm audit (dependencias Node.js)

```bash
npm audit --audit-level=high
npm audit fix --dry-run
```

Use `npm ci` para reproducir instalaciones limpias antes de auditar. Pida confirmación antes de ejecutar `npm install` o `npm audit fix` con escritura.

### pip-audit (dependencias Python)

```bash
pip-audit --desc
pip-audit -r requirements.txt --desc
```

Si el proyecto usa `uv`, también puede usar `uv pip audit` cuando esté disponible.

### gitleaks (secretos en git)

```bash
gitleaks detect --source . -v
gitleaks detect --source . --log-opts="--all" -v
```

Si detecta un secreto, no lo muestre completo en el informe. Indique archivo, línea y tipo de secreto.

### trivy (vulnerabilidades y configuración)

```bash
trivy fs --severity HIGH,CRITICAL .
trivy config .
trivy image nombre-imagen:tag
```

`trivy fs` cubre dependencias y sistema de archivos. `trivy config` revisa Dockerfiles y Terraform. `trivy image` revisa imágenes de contenedor antes del despliegue.

## Guía de rotación de secretos

Aplique estos pasos cuando se detecta un secreto expuesto en el diff, en el historial o en logs:

1. Revoque el secreto comprometido en el proveedor (panel de API keys, proveedor cloud, Auth0, Transbank, SII u otro). No reutilice el mismo valor.
2. Genere un secreto nuevo con entropía suficiente y permisos mínimos.
3. Actualice el secreto en el vault o en las variables de entorno del servidor y CI/CD. Nunca lo escriba en el chat ni en un commit.
4. Elimine el secreto del código y del historial si ya se publicó:
   ```bash
   git log -S "valor-o-patron" --oneline --all
   ```
   Si el secreto llegó a remoto, considere rotación obligatoria y limpieza de historial con `git filter-repo` o BFG, seguida de force push coordinado.
5. Verifique que no queden copias en logs, artefactos de CI, imágenes Docker o backups accesibles.
6. Confirme que la aplicación funciona con el secreto nuevo y registre la fecha de rotación.
7. Si hubo exposición pública, notifique al responsable y revise accesos anómalos en el proveedor.

## Salida

Emite al completar con formato accionable (mismo que `revision-codigo`):

```
## Security Review: [branch/PR]

### Critical (blocks deploy)
- `path:line`: [SEVERITY] [problema]. [fix concreto].

### High
- `path:line`: [problema]. [fix concreto].

### Medium
- `path:line`: [problema]. [fix concreto].

### Pass
- [checks que pasaron]
```

Reglas de score:

- Parte de 100. Critical -25 c/u, High -10 c/u, Medium -3 c/u. Mínimo 0.
- 90-100: ship. 70-89: fix High antes de merge. <70: bloquea deploy.
- Si no hay diff (solo pregunta), marca `N/A - sin diff` y no inventes score.
- Cada hallazgo incluye referencia OWASP o CWE cuando aplique. Ejemplo: `[OWASP A03 / CWE-89]`.

Ejemplo bueno:

- `api/login.py:42`: [CRITICAL] [OWASP A03 / CWE-89] SQL concatenado con f-string. Usa query parametrizada con placeholders.

Ejemplo malo (no hacer):

- `- [findings]` sin path ni fix.
