---
name: revision-codigo
description: "Revisa tu código en pasadas, que funcione, seguridad, rapidez y orden. Úsalo antes de mergear un PR, después de terminar algo o cuando pidas review. (code review, correctness, security, performance)"
---

# Revisión de código

Revisión sistemática de código. Una pasada por dimensión, no una lectura general. El objetivo es detectar defectos funcionales, riesgos de seguridad y problemas de mantenimiento antes de integrar el cambio.

## Cuándo usar

- Un pull request está listo para revisión.
- Una funcionalidad acaba de completarse.
- El usuario pide "revisa esto", "verifica mi código" o "code review".
- Antes de un commit significativo.

## Dimensiones de revisión

Revisa en este orden. Cada dimensión es una pasada independiente sobre el mismo diff. No mezcles dimensiones en una sola lectura.

### 1. Corrección funcional

Verifica que el código hace lo que debe hacer según los requisitos y maneja los casos límite.

Lista de verificación:
- El comportamiento coincide con los requisitos o la historia de usuario.
- Casos límite: nulo, vacío, bordes, tiempos de espera, errores de red.
- Condiciones invertidas y errores de desplazamiento en uno (off-by-one).
- Condiciones de carrera en código concurrente o asincrónico.

Ejemplo de diff deficiente:

```python
# usuarios.py
def obtener_usuario(user_id):
    return db.query("SELECT * FROM users WHERE id = " + user_id)
```

Problema: concatena la entrada sin validar y no maneja el caso de usuario inexistente.

Ejemplo de diff correcto:

```python
# usuarios.py
def obtener_usuario(user_id: int) -> Usuario | None:
    if user_id <= 0:
        raise ValueError("user_id debe ser positivo")
    return db.query("SELECT * FROM users WHERE id = %s", (user_id,))
```

### 2. Seguridad

Verifica que el cambio no introduce vulnerabilidades ni expone datos sensibles.

Lista de verificación:
- Entradas validadas y saneadas en el límite del sistema.
- Sin inyección SQL, XSS, ni recorrido de rutas (path traversal).
- Sin secretos, tokens ni claves en el diff.
- Autenticación y autorización en rutas nuevas.
- Límite de peticiones en endpoints públicos.
- Sin datos personales (PII) en registros ni respuestas.

Ejemplo de diff deficiente:

```javascript
// ruta.js
app.get("/archivos", (req, res) => {
  res.sendFile("/datos/" + req.query.nombre);
});
```

Problema: permite path traversal y no verifica autorización.

Ejemplo de diff correcto:

```javascript
// ruta.js
app.get("/archivos/:id", requerirAuth, (req, res) => {
  const archivo = validarIdArchivo(req.params.id);
  if (!usuarioPuedeLeer(req.user, archivo)) return res.status(403).end();
  res.sendFile(archivo.rutaSegura());
});
```

Referencia normativa: verifica los controles aplicables de OWASP ASVS (https://owasp.org/www-project-application-security-verification-standard/), en especial las secciones de validación de entrada, autenticación, control de acceso y manejo de secretos. Complemento practico para correcciones: OWASP Cheat Sheet Series (https://github.com/OWASP/CheatSheetSeries).

### 3. Rendimiento

Verifica que el cambio no degrada el tiempo de respuesta ni el uso de recursos.

Lista de verificación:
- Sin consultas N+1: bucles que llaman a la base de datos.
- Sin operaciones bloqueantes en el bucle de eventos (E/S síncrona en Node o Python asincrónico).
- Sin copias innecesarias de arreglos u objetos grandes.
- Sin fugas por listeners de eventos no liberados.
- Índices necesarios para consultas nuevas.

Ejemplo de diff deficiente:

```python
# reporte.py
usuarios = db.obtener_usuarios()
for u in usuarios:
    u.pedidos = db.obtener_pedidos_por_usuario(u.id)  # N+1
```

Problema: una consulta por usuario dentro del bucle.

Ejemplo de diff correcto:

```python
# reporte.py
usuarios = db.obtener_usuarios_con_pedidos()  # una sola consulta con JOIN
```

### 4. Mantenibilidad y estilo

Verifica que el código es legible, consistente y fácil de modificar.

Lista de verificación:
- Nombres claros y consistentes para variables, funciones y archivos.
- Funciones con una sola responsabilidad y tamaño razonable.
- Sin abstracciones prematuras ni duplicación injustificada.
- Sin código comentado ni código muerto.
- El código es fácil de probar de forma aislada.

Ejemplo de diff deficiente:

```typescript
// calculo.ts
export function calc(a: number, b: number, f: boolean): number {
  // if (old logic) { return a; }
  if (f == true) return a * 0.19 + b;
  else return b;
}
```

Problema: nombre críptico, código comentado, comparación redundante.

Ejemplo de diff correcto:

```typescript
// calculo.ts
export function calcularTotalConImpuesto(base: number, impuesto: number): number {
  return base + impuesto;
}
```

Referencia normativa: aplica la guía de estilo de Google correspondiente al lenguaje (https://google.github.io/styleguide/). Si el proyecto define otra guía, esa guía tiene prioridad y debes indicarlo en el informe.

### 5. Pruebas

Verifica que el cambio está cubierto por pruebas útiles y deterministas.

Lista de verificación:
- Prueba para la ruta principal (happy path).
- Pruebas para al menos 2 casos límite.
- Pruebas para el comportamiento ante errores.
- Sin dependencia del orden de ejecución ni de estado global mutable.
- Las pruebas fallan sin el cambio y pasan con el cambio.

Ejemplo de diff deficiente:

```python
# test_pago.py
def test_pago():
    assert procesar_pago(100, "CLP") == True  # solo ruta principal
```

Problema: no cubre bordes ni errores.

Ejemplo de diff correcto:

```python
# test_pago.py
def test_pago_monto_valido():
    assert procesar_pago(100, "CLP") is True

def test_pago_monto_cero_rechazado():
    with pytest.raises(ValueError):
        procesar_pago(0, "CLP")

def test_pago_moneda_no_soportada():
    with pytest.raises(MonedaNoSoportada):
        procesar_pago(100, "XXX")
```

## Herramientas de lint

No comentes sobre formato si una herramienta automática lo cubre. Antes de reportar estilo, verifica si el proyecto ya usa alguna de estas herramientas y ejecuta la correspondiente:

- JavaScript y TypeScript: `ESLint` y `Prettier`.
- Python: `Ruff` para lint y `Black` o `Ruff format` para formato.
- Go: `gofmt` y `golangci-lint`.
- Java: `Checkstyle` o `Spotless` con la guía de Google.
- Ruby: `RuboCop`.
- Kotlin: `ktlint` o `detekt`.
- Swift: `SwiftLint`.
- Rust: `rustfmt` y `Clippy`.
- GitHub Actions: `actionlint`.

Si el repositorio incluye configuración de lint, cita la regla exacta en el hallazgo. Si no existe configuración, recomienda agregar la herramienta mínima para el lenguaje principal.

## Formato de salida

Emite cada hallazgo en una línea con este formato exacto:

```
path:line: [SEVERIDAD] Descripción del problema. Sugerencia de corrección.
```

Donde `path` es la ruta del archivo, `line` es el número de línea del diff y `SEVERIDAD` es una de:

- `CRITICAL`: vulnerabilidad explotable, pérdida de datos o caída del sistema.
- `HIGH`: defecto funcional, falta de autorización o degradación grave.
- `MEDIUM`: caso límite sin manejar, prueba faltante o deuda que afecta mantenimiento.
- `LOW`: nit de legibilidad o estilo no cubierto por el linter.

Ejemplo de salida válida:

```
src/rutas/archivos.js:12: [CRITICAL] Concatenación de entrada del usuario en ruta de archivo permite path traversal. Validar contra lista blanca y verificar autorización.
src/pagos/reporte.py:34: [HIGH] Consulta N+1 dentro del bucle de usuarios. Reemplazar por una sola consulta con JOIN.
src/pagos/calculo.ts:8: [MEDIUM] Falta prueba para monto cero y moneda no soportada. Agregar 2 casos de borde.
src/pagos/calculo.ts:3: [LOW] Nombre de función críptico `calc`. Renombrar a `calcularTotalConImpuesto`.
```

Reglas de salida:
- Solo hallazgos accionables. No emitas elogios.
- Una línea por hallazgo, ordenada por severidad y luego por archivo.
- Si una dimensión no tiene hallazgos, no la menciones.
- Cierra con una línea de veredicto: `Veredicto: APROBAR | COMENTAR | BLOQUEAR` según el hallazgo de mayor severidad.

## Niveles de revisión

- Borrador o avance: nivel LOW, solo bloqueantes y riesgos evidentes.
- Antes de integrar (merge): nivel HIGH, pasada completa de las 5 dimensiones.
- Cada push nuevo se revisa de nuevo: solo el diff nuevo, no todo el historial.

## Reglas estrictas

- Sin datos personales ni secretos en registros o respuestas; si existen, propone identificadores redactados.
- No rompas el contrato existente de API o eventos; propone un cambio aditivo y compatible.
- Nunca apruebes ni integres de forma automática; la decisión final es del humano.
- Cuando cites una norma externa, incluye el enlace a Google Style (https://google.github.io/styleguide/) o a OWASP ASVS (https://owasp.org/www-project-application-security-verification-standard/) según corresponda.
