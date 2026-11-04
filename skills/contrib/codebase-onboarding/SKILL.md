---
name: codebase-onboarding
description: "Genera documentacion de onboarding desde el analisis real del repo: arquitectura, comandos y primer dia. Usalo para incorporar personas, auditar docs o crear README util. (onboarding, docs, architecture, readme)"
---

# Codebase Onboarding

## Core Rule

Toda afirmacion del documento de onboarding debe venir del codigo leido, no de suposiciones. Si un dato no se encontro en el repositorio, se marca como `No verificado` y se indica donde buscarlo. Esta regla evita guias que no compilan.

## Cuándo usar

- Una persona nueva se incorpora al proyecto y necesita su guia de primer dia.
- El usuario pide "documenta este repo", "README" o "guia de inicio".
- La documentacion existente esta desactualizada y se debe regenerar desde el codigo.
- Se necesita un mapa de arquitectura rapido antes de una feature grande.

## Process

1. Inventaria el repositorio: lista el arbol superior, el gestor de paquetes (`package.json`, `pyproject.toml`, `go.mod`, `pom.xml`), el README actual y la carpeta `docs`. Registra versiones de lenguaje y runtime.
2. Identifica el punto de entrada: `main`, `app.py`, `server.js`, `Program.cs` o equivalente. Sigue las importaciones hasta dibujar los tres modulos principales y sus dependencias.
3. Extrae los comandos reales: instalacion, desarrollo, pruebas, lint y build desde los archivos de configuracion. No inventes comandos que no existen en el repo.
4. Detecta servicios externos: base de datos, colas, almacenamiento y variables de entorno requeridas. Lee `.env.ejemplo` si existe y lista cada variable con su proposito.
5. Redacta la guia en este orden fijo: vision en una frase, arquitectura en un parrafo, requisitos, instalacion paso a paso, comandos diarios, estructura de carpetas, flujo de una peticion, como probar, como contribuir y glosario.
6. Valida cada comando copiandolo tal cual del repo y marcando los que fueron ejecutados contra los que solo fueron leidos. Si un comando falla, lo reportas y no lo incluyes como valido.
7. Entrega el documento con una seccion de `Brechas detectadas` que lista lo que falta en el repo (por ejemplo sin `.env.ejemplo` o sin pruebas).

## Ejemplo deficiente contra ejemplo correcto

Ejemplo deficiente:

```markdown
# Mi App

Esta app usa microservicios avanzados con Kubernetes.

## Instalacion

npm install
npm start
```

Problema: describe una arquitectura que no existe en el codigo e inventa comandos sin verificar el `package.json`.

Ejemplo correcto:

```markdown
# Mi App, guia de primer dia

Vision: API REST de facturacion en Express con Postgres.

## Requisitos verificados en el repo

- Node 20, segun `.nvmrc`.
- Postgres 15, segun `docker-compose.yml`.

## Instalacion real, copiada de package.json

npm ci
docker compose up -d db
npm run migrate
npm run dev
```

```python
# scripts/verificar_onboarding.py
# Revisa que los comandos documentados existen en package.json.
import json

# Carga los scripts reales del proyecto.
with open("package.json", encoding="utf-8") as archivo:
    datos = json.load(archivo)

# Lista de comandos que la guia promete documentar.
requeridos = ["dev", "test", "migrate"]

# Verifica cada comando y reporta el faltante.
for nombre in requeridos:
    if nombre not in datos.get("scripts", {}):
        print("Falta script: " + nombre)
```

## Niveles de aplicación

- Nivel 1, ficha rapida: una pagina con requisitos, instalacion y tres comandos diarios. Se genera en menos de 30 minutos y solo con archivos de configuracion.
- Nivel 2, guia de primer dia: documento completo con arquitectura, flujo de una peticion y glosario. Requiere leer el punto de entrada y dos modulos centrales.
- Nivel 3, kit de incorporacion: guia mas diagrama de arquitectura, lista de primeros tickets sugeridos y checklist de entorno verificado comando por comando.

## Reglas estrictas

- Nunca afirmes una version, un puerto o un comando sin citar el archivo donde lo leiste.
- Nunca incluyas secretos, tokens ni valores reales de `.env` en la guia. Usa valores de ejemplo claramente falsos.
- Nunca describas una base de datos o un servicio que no aparece en el codigo o en el compose. Si el usuario lo menciona pero no esta en el repo, marcalo como `No verificado`.
- Siempre indica que comandos fueron ejecutados y cuales solo fueron leidos.
- Siempre usa comillas ASCII rectas y rutas exactas tal como aparecen en el repo.

## Checklist aplicable

- [ ] Arbol superior y gestor de paquetes identificados con versiones.
- [ ] Punto de entrada localizado y tres modulos principales descritos.
- [ ] Comandos de instalacion, dev, test y build copiados desde su archivo origen.
- [ ] Variables de entorno listadas desde `.env.ejemplo` o marcadas como faltantes.
- [ ] Estructura de carpetas explicada en una tabla `carpeta | proposito`.
- [ ] Flujo de una peticion trazado desde la ruta hasta la base de datos.
- [ ] Seccion de brechas con lo que falta por documentar o configurar.
- [ ] Enlaces internos del repo verificados y sin rutas rotas.

## Output Contract

Entrega siempre en este orden:

1. `ONBOARDING.md` o seccion equivalente con los 10 bloques del paso 5.
2. Tabla de evidencia `afirmacion | archivo | linea | verificado con ejecucion (si o no)`.
3. Lista de brechas con prioridad `alta`, `media` o `baja`.
4. Tiempo estimado de primer dia: `entorno (<min) + primera prueba (<min) + primer commit (<min)`.

Ejemplo de salida valida:

```
Archivo: ONBOARDING.md, 10 bloques completos.
Evidencia: Node 20 | .nvmrc | 1 | no | npm run dev | package.json | 8 | si.
Brechas: alta, falta .env.ejemplo para POSTGRES_URL.
Estimacion: entorno 20 min + primera prueba 15 min + primer commit 30 min.
```

## Referencias oficiales

- Guia de README de GitHub: https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-readmes
- Metodo Diataxis para documentacion tecnica: https://diataxis.fr/
- Guia Write the Docs sobre documentacion de software: https://www.writethedocs.org/guide/
- Modelo C4 para diagramas de arquitectura: https://c4model.com/
