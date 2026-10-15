---
name: gestion-secretos
description: "Para guardar claves y certificados sin fugas: vault, rotacion y permisos. Nunca en git ni en el chat. (secretos, vault, claves)"
---

# Gestion de Secretos

## Regla central

**Ninguna clave en codigo, git o chat. Produccion en servidor o vault, desarrollo en `.env` local que nunca se publica.**

## Cuando usar

- Guardar `.pfx`, API keys, tokens, contrasenas o certificados.
- Configurar un vault o cifrado de secretos en el repositorio.
- Rotar o revocar una clave expuesta.
- Revisar si algo se filtro en el historial de git.

## Proceso

### 1. Guardar

- Produccion: vault o variables del servidor. Desarrollo: `.env` local que no se publica.
- Permisos `0600` en archivos con secretos, un secreto por uso.
- Nombres de variables descriptivos sin incluir el valor.
- Verifica `.gitignore`:

```bash
# .gitignore minimo
.env
.env.local
*.pfx
*.pem
*.key
secrets/
```

Verificacion basica:

```bash
git status --short
git log --oneline -10
```

### 2. Usar vault en equipo o produccion

Usa HashiCorp Vault cuando hay varios entornos, rotacion frecuente o necesidad de auditoria. Flujo tipico:

```bash
# Autenticacion segun el metodo del equipo
vault login -method=oidc

# Leer un secreto sin dejarlo en el historial del shell
vault kv get -field=password secret/proyecto/produccion

# Inyectar como variable solo para el proceso actual
export DB_PASSWORD="$(vault kv get -field=password secret/proyecto/produccion)"
```

Buenas practicas con vault:

- Politicas por rol con acceso minimo necesario.
- Secretos dinamicos con TTL corto para bases de datos.
- Auditoria activada y revision periodica de accesos.
- Nunca imprimas el valor en logs ni en salida de CI.

### 3. Cifrar secretos en el repositorio con sops

Usa Mozilla SOPS cuando necesitas versionar configuracion cifrada junto al codigo. Ejemplo con AGE:

```yaml
# .sops.yaml
creation_rules:
  - path_regex: secrets/.*\.enc\.yaml$
    age: age1ejemplo0clave0publica0del0equipo0reemplazar
```

```bash
# Crear archivo cifrado
sops --age age1ejemplo0clave0publica0del0equipo0reemplazar secrets/produccion.enc.yaml

# Editar sin descifrar manualmente
sops secrets/produccion.enc.yaml

# Descifrar solo en memoria para un despliegue
sops -d secrets/produccion.enc.yaml | head -n 20
```

Contenido de ejemplo dentro del archivo cifrado:

```yaml
database_password: ENC[AES256_GCM,...]
api_key: ENC[AES256_GCM,...]
```

### 4. Alternativa simple con dotenv-vault

Si el proyecto es pequeno y ya usa `.env`, `dotenv-vault` permite cifrar y compartir el `.env` sin exponer valores:

```bash
# Instalar y autenticar segun la documentacion del proyecto
npm i -g dotenv-vault
dotenv-vault login

# Crear el vault y cifrar el .env local
dotenv-vault new
dotenv-vault push

# En servidor o CI solo se configura DOTENV_KEY
export DOTENV_KEY="dotenv://key_ejemplo_solo_en_servidor"
node -r dotenv-vault/config app.js
```

Usalo solo para proyectos simples. Para equipos grandes o cumplimiento estricto, prefiere Vault o SOPS.

### 5. Rotar

Frecuencia: cada 90 dias o de inmediato si hay sospecha de fuga.

```bash
# 1. Crear la clave nueva en el vault o proveedor
# 2. Actualizar el servidor o CI con la clave nueva
# 3. Verificar que la aplicacion funciona
# 4. Revocar la clave anterior
# 5. Registrar fecha y responsable sin anotar el valor
```

Lista de verificacion de rotacion:

- [ ] Clave nueva creada con permisos minimos.
- [ ] Servidor, CI y vault actualizados.
- [ ] Prueba funcional exitosa.
- [ ] Clave anterior revocada.
- [ ] Fecha de rotacion registrada.

### 6. Si se filtro

1. Revoca de inmediato en el proveedor.
2. Genera una clave nueva y actualiza todos los lugares donde se usaba.
3. Limpia el historial si quedo en git y fuerza rotacion en todos los entornos.
4. Revisa logs por uso anormal.
5. Notifica al responsable de seguridad segun el proceso del equipo.

Busqueda rapida de fugas:

```bash
# Buscar patrones comunes en el historial
git log -p -S "api_key" --oneline -- .
git log -p -S "password" --oneline -- .

# Escaneo con gitleaks si esta instalado
gitleaks detect --source . --verbose
```

## Contrato de salida

Entrega solo tipo de almacenamiento y fecha, nunca el valor ni la ruta exacta en el chat. Ejemplo valido: "Token de API en Vault, rotado el 2026-10-15". Ejemplo invalido: incluir el token o la clave completa.

## Referencias

1. HashiCorp Vault, gestion, rotacion y secretos dinamicos: https://developer.hashicorp.com/vault
2. Mozilla SOPS, cifrado de archivos de configuracion: https://github.com/mozilla/sops
3. dotenv-vault, cifrado y sincronizacion de `.env`: https://github.com/dotenv-org/dotenv-vault

La documentacion oficial prevalece. Nunca publiques claves en codigo, git, chat, logs o tickets.
