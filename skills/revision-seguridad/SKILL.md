---
name: revision-seguridad
description: "Revisión de cambios pendientes para detectar fallas de seguridad, secretos expuestos, inyecciones y problemas de dependencias. Para usar en diffs, PRs o antes de desplegar. (security review, OWASP, vulnerabilities)"
---

# Security Review

Security review focused on pending changes. Systematic audit, not theoretical.

## When to Use

- Before merging a PR.
- When modifying auth, routes, DB queries, or user input.
- When the user asks for "security review", "audit", "check security".
- Post-incident, to verify the fix doesn't introduce new vulnerabilities.

## Checklist

### Secrets & Credentials
- No API keys, tokens, passwords in the diff.
- No URLs with embedded credentials.
- Environment variables referenced, never hardcoded.

### Injection
- SQL: prepared statements or query builder with bound parameters. Never concatenation.
- XSS: output escaped in HTML/JSX. `dangerouslySetInnerHTML` only with explicit sanitization.
- Command: no `exec()`, `system()`, `subprocess` with user strings.
- Path traversal: no concatenating user input into file paths.

### Authentication & Authorization
- Auth middleware on all protected routes.
- Roles/permissions verified on the backend, not just frontend.
- JWT: expiration configured, separate refresh token.

### Data Exposure
- No PII in logs or error responses.
- No stack traces in production.
- Rate limiting on public endpoints.

### Dependencies
- New dependencies: verified, legitimate, maintained.
- No `*` in package.json/requirements.txt versions.

## Output

Emit at completion con formato accionable (mismo que `revision-codigo`):

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
- Parte de 100. Critical -25 c/u, High -10 c/u, Medium -3 c/u. Minimo 0.
- 90-100: ship. 70-89: fix High antes de merge. <70: bloquea deploy.
- Si no hay diff (solo pregunta), marca `N/A - sin diff` y no inventes score.

Ejemplo bueno:
- `api/login.py:42`: [CRITICAL] SQL concatenado con f-string. Usa query parametrizada con placeholders.

Ejemplo malo (no hacer):
- `- [findings]` sin path ni fix.
