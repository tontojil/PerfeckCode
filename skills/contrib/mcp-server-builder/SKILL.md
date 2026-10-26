---
name: mcp-server-builder
description: "Construye servidores MCP desde un OpenAPI o desde cero en Python y TypeScript. Usalo para exponer herramientas a agentes con schemas validados y permisos minimos. (mcp, tools, openapi, server)"
---

# MCP Server Builder

## Core Rule

Toda herramienta MCP expone un schema validado, hace una sola accion y opera con el permiso minimo. Ninguna herramienta se publica sin manejo de errores, timeout y prueba directa. Esta regla evita herramientas fragiles que rompen al agente.

## Cuándo usar

- El usuario pide exponer una API existente como herramientas para un agente.
- Se necesita un servidor MCP nuevo en Python o TypeScript.
- El usuario pide "MCP", "tools para Claude" o "servidor de herramientas".
- Un OpenAPI ya existe y se quiere convertir en herramientas sin reescribir la API.

## Process

1. Inventaria la API origen: lee el OpenAPI, lista endpoints candidatos y descarta los destructivos salvo peticion explicita. Define el alcance en una frase.
2. Disena cada herramienta con nombre `verbo-recurso` en minusculas, descripcion de una linea, schema JSON de entrada con tipos y requeridos, y schema de salida con formato de error.
3. Genera el esqueleto en el SDK elegido: Python con `mcp.server` o TypeScript con `@modelcontextprotocol/sdk`. Registra nombre y version del servidor desde el inicio.
4. Implementa una herramienta por vez con timeout, validacion de entrada y errores tipados (`invalid_input`, `upstream_error`, `timeout`). Nunca propagues trazas internas al cliente.
5. Agrega configuracion por entorno: URL base, API key desde variables de entorno y modo solo lectura cuando aplique. Documenta cada variable en un `.env.ejemplo`.
6. Prueba cada herramienta con el inspector o con un cliente minimo: caso valido, entrada invalida y upstream caido. Registra los tres resultados.
7. Publica con versionado, README de instalacion, lista de herramientas y matriz de permisos. Marca las herramientas destructivas con advertencia explicita.

## Ejemplo deficiente contra ejemplo correcto

Ejemplo deficiente:

```typescript
// Una herramienta generica que hace todo y no valida nada.
server.tool("ejecutar", async (args: any) => {
  return await fetch(url + args.ruta); // sin timeout ni schema
});
```

Problema: nombre vago, sin schema, sin timeout y expone cualquier ruta sin control.

Ejemplo correcto:

```typescript
// Herramienta acotada con schema y timeout explicito.
// Registra la herramienta con nombre claro y descripcion util.
server.tool(
  "obtener-pedido",
  "Obtiene un pedido por id desde la API de ventas.",
  { id: z.string().min(1) }, // valida que el id no venga vacio
  async ({ id }) => {
    // Llama al backend con timeout de 8 segundos.
    const res = await fetch(baseUrl + "/pedidos/" + id, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) throw new Error("upstream_error: " + res.status);
    return res.json();
  }
);
```

```python
# Servidor MCP minimo en Python con una herramienta validada.
from mcp.server import Server

# Crea el servidor con nombre y version fijos.
servidor = Server("ventas-mcp", version="1.0.0")

# Registra la herramienta con descripcion y validacion de entrada.
@servidor.tool("obtener-pedido", "Obtiene un pedido por id.")
def obtener_pedido(id: str) -> dict:
    # Rechaza entradas vacias antes de llamar al backend.
    if not id.strip():
        raise ValueError("invalid_input: id vacio")
    # Aqui va la llamada HTTP con timeout de 8 segundos.
    return {"id": id, "estado": "pagado"}
```

## Niveles de aplicación

- Nivel 1, puente rapido: una a tres herramientas de solo lectura generadas desde OpenAPI, sin escritura. Prueba manual con inspector.
- Nivel 2, servidor de equipo: hasta diez herramientas con paginacion, errores tipados y configuracion por entorno. Requiere README y pruebas de los tres casos.
- Nivel 3, servidor publicado: versionado SemVer, CI con pruebas, matriz de permisos y auditoria de herramientas destructivas. Se usa para produccion compartida.

## Reglas estrictas

- Nunca expongas una operacion destructiva (`DELETE`, borrado masivo, reembolso) sin confirmacion explicita del usuario y advertencia en la descripcion.
- Nunca pongas API keys ni secretos en el codigo. Usa variables de entorno documentadas en `.env.ejemplo`.
- Nunca devuelvas trazas internas, SQL ni cabeceras sensibles en el error. Usa codigos tipados y mensajes cortos.
- Nunca crees una herramienta sin schema de entrada con tipos y campos requeridos.
- Siempre fija timeout en cada llamada de red. El valor por defecto sugerido es 8 segundos salvo justificacion.

## Checklist aplicable

- [ ] Alcance definido con lista de endpoints incluidos y excluidos.
- [ ] Cada herramienta tiene nombre `verbo-recurso`, descripcion y schemas.
- [ ] Validacion de entrada con tipos, rangos y requeridos.
- [ ] Timeout configurado en cada llamada externa.
- [ ] Errores tipados sin fuga de detalles internos.
- [ ] Variables de entorno documentadas en `.env.ejemplo`.
- [ ] Tres pruebas por herramienta: valido, invalido y upstream caido.
- [ ] README con instalacion, herramientas y permisos publicado.

## Output Contract

Entrega siempre en este orden:

1. Tabla `herramienta | metodo origen | lectura o escritura | riesgo`.
2. Codigo del servidor con schemas y manejo de errores.
3. Tabla de pruebas `herramienta | caso | resultado`.
4. Instrucciones de instalacion con comandos y variables requeridas.

Ejemplo de salida valida:

```
Herramientas: obtener-pedido GET lectura bajo, crear-pedido POST escritura medio.
Pruebas: 2 herramientas x 3 casos, 6 de 6 en verde.
Instalacion: pip install mcp, export API_URL, mcp inspect servidor.py.
```

## Referencias oficiales

- Introduccion al Model Context Protocol: https://modelcontextprotocol.io/introduction
- Guia rapida de servidores MCP: https://modelcontextprotocol.io/quickstart/server
- SDK de Python para MCP: https://github.com/modelcontextprotocol/python-sdk
- SDK de TypeScript para MCP: https://github.com/modelcontextprotocol/typescript-sdk
- Especificacion OpenAPI 3.1: https://spec.openapis.org/oas/v3.1.0
