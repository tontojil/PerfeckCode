---
name: depuracion-sistematica
description: "Para bugs, tests fallidos, errores raros o lentitud. Exige buscar la causa raíz antes de proponer arreglos. (debugging, bugs, root-cause)"
---

# Depuración sistemática

## Regla central

**Sin causa raíz comprobada, no se propone ningún arreglo.**

Si la causa raíz es desconocida, no se deben crear parches especulativos. Primero se reproduce, se investiga y se valida con evidencia.

## Cuándo usar

- Fallos de pruebas automatizadas.
- Errores en tiempo de ejecución.
- Regresiones después de una integración.
- Degradación de rendimiento.
- Diferencias entre entornos con el mensaje típico "en mi equipo funciona".

## Proceso en 6 pasos

1. **Reproducir**
   - Registrar pasos exactos, entorno, comando y frecuencia del fallo.
   - Crear una reproducción mínima antes de cambiar código.
2. **Investigar**
   - Leer el mensaje de error completo, revisar cambios recientes y seguir el flujo de datos hacia atrás.
3. **Formular hipótesis**
   - Escribir una sola hipótesis concreta y explicar por qué es probable.
4. **Validar**
   - Hacer el cambio más pequeño posible para confirmar o descartar la hipótesis.
5. **Corregir en el origen**
   - Aplicar el arreglo mínimo en la causa raíz, no en el síntoma.
6. **Proteger**
   - Agregar o ajustar pruebas para evitar que el error vuelva a ocurrir.

## Método de causa raíz con git bisect

Use `git bisect` cuando un error apareció en un rango de commits y no es evidente cuál lo introdujo.

```bash
git bisect start
git bisect bad HEAD
git bisect good v1.4.0
git bisect run pytest tests/test_pagos.py -q
git bisect reset
```

Flujo manual si la prueba no es automática:

```bash
git bisect start
git bisect bad
git bisect good abc1234
# Git cambia a un commit intermedio. Ejecute la prueba y marque:
pytest tests/test_api.py -q
# Si falla:
git bisect bad
# Si pasa:
git bisect good
# Al final, Git muestra el primer commit defectuoso:
git bisect reset
```

Criterios para usarlo:

- El error es reproducible en commits anteriores.
- Existe un comando de verificación rápido con código de salida claro (0 = bueno, distinto de 0 = malo).
- Se conoce al menos un commit bueno y uno malo.

## Ejemplo de log y trace

Lea el trace desde abajo hacia arriba. La última línea indica el tipo de error, las líneas superiores muestran la ruta de llamadas.

```text
Traceback (most recent call last):
  File "/app/pagos.py", line 42, in cobrar
    resultado = pasarela.cobrar(monto)
  File "/app/pasarela.py", line 18, in cobrar
    raise ValueError("monto debe ser mayor que cero")
ValueError: monto debe ser mayor que cero
```

Lectura guiada:

1. Tipo y mensaje: `ValueError: monto debe ser mayor que cero`.
2. Origen: `pasarela.py`, línea 18, función `cobrar`.
3. Llamador: `pagos.py`, línea 42, valor de `monto`.
4. Acción: imprimir o registrar el valor de `monto` justo antes de la llamada, no cambiar la validación todavía.

Para logs de aplicación, conserve marca de tiempo, nivel y contexto:

```text
2026-10-15T14:02:11Z ERROR [api.pagos] order_id=881 monto=-120 mensaje="monto debe ser mayor que cero"
```

## Uso de rg y debugger

Use `rg` (ripgrep) para localizar el origen sin búsquedas lentas ni ruido de archivos ignorados.

```bash
# Buscar el mensaje exacto con contexto
rg -n -C 3 "monto debe ser mayor que cero"

# Buscar solo en Python en el directorio actual
rg --type py -n "def cobrar"

# Listar archivos que contienen el símbolo
rg -l "order_id"
```

Use el debugger para confirmar valores en lugar de suponerlos.

Python:

```python
def cobrar(monto):
    breakpoint()  # Inspeccione monto, tipo y llamador con p / where
    return pasarela.cobrar(monto)
```

Node.js y Vitest:

```bash
node --inspect-brk ./server.js
npx vitest run tests/pagos.test.ts --inspect-brk
```

Playwright con traza visual:

```bash
npx playwright test --trace on
npx playwright show-report
```

Regla práctica: primero `rg` para acotar archivos, después log con contexto, y solo al final debugger en el punto exacto.

## Plantilla de reproducción mínima

Copie esta plantilla en el reporte o en el caso de prueba antes de corregir.

```markdown
## Reproducción mínima

Entorno: Python 3.12 / Node 20 / Windows 11
Comando: pytest tests/test_pagos.py::test_cobrar_monto_negativo -q
Frecuencia: 5 de 5 intentos

Pasos:
1. Ejecutar `pytest tests/test_pagos.py -q`
2. Observar `ValueError: monto debe ser mayor que cero`

Esperado: la validación rechaza el monto con error controlado error 400.
Obtenido: excepción no controlada error 500.

Código mínimo:
```python
from pagos import cobrar
cobrar(-120)
```

Hipótesis actual: `cobrar` no valida el signo antes de llamar a la pasarela.
Evidencia: trace en `pasarela.py:18` y log con `order_id=881 monto=-120`.
```

## Contrato de salida

Devuelva el resultado con estas secciones:

1. **Síntoma** (qué falla, dónde y con qué frecuencia).
2. **Causa raíz** (por qué falla, en una frase verificable).
3. **Evidencia** (logs, pruebas o trace que lo demuestran).
4. **Arreglo** (cambio en el origen, mínimo y explicado).
5. **Protección contra regresión** (pruebas o controles agregados).

## Comandos útiles

```bash
# Historial reciente para correlacionar la regresión
git log --oneline -15

# Pruebas por framework
pytest tests/test_pagos.py -q
npx vitest run tests/pagos.test.ts
npx playwright test tests/checkout.spec.ts

# Búsqueda y estado
rg -n "TODO|FIXME|raise|throw" src
git status --short
```

## Referencias oficiales y repositorios relevantes

Documentación oficial:

- https://docs.pytest.org/
- https://vitest.dev/
- https://playwright.dev/
- https://git-scm.com/docs/git-bisect

Repositorios relevantes:

- https://github.com/pytest-dev/pytest
- https://github.com/vitest-dev/vitest
- https://github.com/microsoft/playwright
