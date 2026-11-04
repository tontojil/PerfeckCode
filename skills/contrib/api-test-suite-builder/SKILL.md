---
name: api-test-suite-builder
description: "Genera suites de pruebas Vitest y Pytest desde rutas API con casos felices, bordes y errores. Úsalo para cubrir endpoints nuevos, subir cobertura o estandarizar pruebas de API. (API, Vitest, Pytest, cobertura)"
---

# API Test Suite Builder

Genera suites de pruebas de API que cubren la ruta feliz, los bordes y los errores. El objetivo es que cada endpoint tenga pruebas deterministas que fallan sin el cambio y pasan con el cambio.

## Core Rule

**Cada endpoint genera al menos una prueba feliz, dos pruebas de borde y una prueba de error, con datos aislados y sin estado compartido.**

## When to Use (Cuándo usar)

- Un endpoint nuevo necesita su suite de pruebas inicial.
- La cobertura de API está bajo el umbral y el usuario pide subirla.
- El usuario pide "genera tests para esta API" o "cubre estas rutas".
- Un bug en producción revela un caso que ninguna prueba cubría.
- Antes de refactorizar un controlador o cambiar un contrato de API.

## Process

1. Inventaria las rutas con método, parámetros, códigos esperados y autenticación.
2. Define la matriz de casos: feliz, bordes, errores y autorización.
3. Genera la suite en Vitest o Pytest según el stack con datos de prueba aislados.
4. Ejecuta la suite completa y verifica que cada prueba falla sin el código.
5. Mide la cobertura del módulo y agrega los casos que faltan hasta el umbral.
6. Documenta cómo ejecutar la suite y qué variables de entorno necesita.

### Matriz mínima por endpoint

| Caso | Ejemplo | Código esperado |
|---|---|---|
| Feliz | Crear pago con datos válidos | 201 con cuerpo correcto |
| Borde 1 | Monto en el límite mínimo permitido | 201 o 422 según la regla |
| Borde 2 | Lista vacía o paginación en el borde | 200 con arreglo vacío |
| Error | Cuerpo inválido o campo faltante | 400 con mensaje claro |
| Auth | Token ausente o sin permiso | 401 o 403 |

## Ejemplo deficiente contra ejemplo correcto

Ejemplo deficiente (suite incompleta en Pytest):

```python
# test_pagos_deficiente.py
# Solo cubre la ruta feliz y comparte estado global
def test_crear_pago(client):
    respuesta = client.post("/pagos", json={"monto": 100})
    assert respuesta.status_code == 201
```

Problema: no cubre bordes ni errores, y depende de datos globales que hacen la prueba frágil.

Ejemplo correcto:

```python
# test_pagos.py
# Suite aislada con ruta feliz, borde y error
import pytest

@pytest.fixture
def pago_valido():
    # Datos aislados por prueba, sin estado compartido
    return {"monto": 100, "moneda": "CLP"}

def test_crear_pago_valido(client, pago_valido):
    # Ruta feliz con datos válidos
    respuesta = client.post("/pagos", json=pago_valido)
    assert respuesta.status_code == 201

def test_crear_pago_monto_cero_rechazado(client, pago_valido):
    # Caso borde con monto en el límite inferior
    pago_valido["monto"] = 0
    respuesta = client.post("/pagos", json=pago_valido)
    assert respuesta.status_code == 422

def test_crear_pago_sin_auth_rechazado(client_sin_token, pago_valido):
    # Error de autorización con token ausente
    respuesta = client_sin_token.post("/pagos", json=pago_valido)
    assert respuesta.status_code == 401
```

Ejemplo correcto en Vitest:

```typescript
// pagos.test.ts
// Suite con casos feliz, borde y error, sin estado compartido
import { describe, it, expect } from "vitest";

describe("POST /pagos", () => {
  it("crea un pago con datos válidos", async () => {
    // Ruta feliz con monto válido
    const respuesta = await crearPago({ monto: 100, moneda: "CLP" });
    expect(respuesta.status).toBe(201);
  });

  it("rechaza el monto cero con 422", async () => {
    // Caso borde en el límite inferior
    const respuesta = await crearPago({ monto: 0, moneda: "CLP" });
    expect(respuesta.status).toBe(422);
  });
});
```

## Niveles de aplicación

- Nivel básico: pruebas de ruta feliz y de error para cada endpoint nuevo.
- Nivel intermedio: matriz completa con bordes, auth y cobertura sobre el umbral del proyecto.
- Nivel avanzado: suites con contratos OpenAPI, pruebas de regresión y datos semilla versionados.

## Reglas estrictas

- Nunca compartas estado entre pruebas, cada prueba crea y limpia sus datos.
- Nunca uses datos de producción ni secretos reales en las pruebas.
- Nunca marques una prueba como aprobada si depende del orden de ejecución.
- Nunca generes pruebas sin ejecutarlas, toda suite se entrega en verde.
- Nunca omitas los casos de autorización en endpoints protegidos.

## Checklist aplicable

- [ ] Inventario de rutas con método, parámetros y códigos esperados.
- [ ] Matriz de casos feliz, bordes, errores y autorización por endpoint.
- [ ] Suite generada en Vitest o Pytest según el stack del proyecto.
- [ ] Datos aislados por prueba con fixtures y limpieza posterior.
- [ ] Ejecución completa en verde con comando y exit code registrados.
- [ ] Cobertura del módulo sobre el umbral con tabla de reporte adjunta.
- [ ] Instrucciones de ejecución con variables de entorno documentadas.

## Output Contract

Entrega la suite en este orden y con oraciones completas:

- **Inventario**: tabla de rutas cubiertas con método y códigos esperados.
- **Archivos**: lista de archivos creados con ruta exacta y casos incluidos.
- **Evidencia**: comando ejecutado, conteo de pruebas, duración y exit code.
- **Cobertura**: tabla por archivo con porcentaje y comparación contra el umbral.
- **Pendientes**: casos no cubiertos con motivo y propuesta de seguimiento.
- **Estado final**: `pass`, `fail` o `partial` con el próximo paso y su responsable.

## Referencias oficiales

1. Documentación de Vitest: https://vitest.dev/guide/
2. Documentación de Pytest: https://docs.pytest.org/en/stable/
3. Especificación OpenAPI: https://spec.openapis.org/oas/latest.html
4. Documentación de Supertest para pruebas HTTP en Node: https://github.com/ladjs/supertest
