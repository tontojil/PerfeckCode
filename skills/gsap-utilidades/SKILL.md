---
name: gsap-utilidades
description: Utilidades gsap.utils como clamp, mapRange, random, snap, toArray y wrap para calculos de animacion. (GSAP, utils, clamp, mapRange)
license: MIT
---

# gsap.utils

## When to Use This Skill

Apply when writing or reviewing code that uses **gsap.utils** for math, array/collection handling, unit parsing, or value mapping in animations (e.g. mapping scroll to a value, randomizing, snapping to a grid, or normalizing inputs).

**Related skills:** Use with **gsap-basico**, **gsap-linea-tiempo**, and **gsap-animacion-scroll** when building animations; CustomEase and other easing utilities are in **gsap-complementos**.

## Overview

**gsap.utils** son helpers puros, sin `gsap.registerPlugin()`. Usalos en `vars` de tweens (valores por funcion), callbacks de ScrollTrigger u Observer, o cualquier JS que maneje GSAP. Todos cuelgan de **gsap.utils** (ej. `gsap.utils.clamp()`).

**Forma funcion:** muchos utils aceptan el valor a transformar como **ultimo** argumento. Si lo omitis, devuelven una **funcion** reutilizable con esa config. Ideal en handlers (mousemove, scroll) o callbacks de tween donde el mismo rango se aplica muchas veces. Excepcion: **random()** usa `true` final para la forma funcion.

```javascript
// Con valor: devuelve el resultado
gsap.utils.clamp(0, 100, 150); // 100

// Sin valor: devuelve funcion reutilizable
const clampFn = gsap.utils.clamp(0, 100);
clampFn(150); // 100
clampFn(-10); // 0
```

## Top 3 helpers

Los 3 que cubren la mayoria de los casos. El resto vive en el catalogo.

### clamp(min, max, value?)

Limita un valor entre `min` y `max`. El mas usado para drag, scroll y progress.

```javascript
gsap.utils.clamp(0, 100, 150); // 100
const clampX = gsap.utils.clamp(0, 500); // forma funcion
clampX(750); // 500
```

### mapRange(inMin, inMax, outMin, outMax, value?)

Convierte scroll, progress (0-1) o un input a otro rango de animacion.

```javascript
gsap.utils.mapRange(0, 1, 0, 360, 0.5); // 180 (progress a grados)
const mapY = gsap.utils.mapRange(0, 100, 0, 500); // forma funcion
mapY(50); // 250
```

### snap(snapTo, value?)

Redondea al multiplo o valor permitido mas cercano. Ideal para grids y steps.

```javascript
gsap.utils.snap(10, 23); // 20
gsap.utils.snap([0, 100, 200], 150); // 100 o 200 (mas cercano)
gsap.to(".x", { x: 200, snap: { x: 20 } }); // grid directo en tween
```

## Patrones comunes

```javascript
// Scroll -> valor acotado: mapear y luego limitar
const map = gsap.utils.mapRange(0, 500, 0, 360);
const clampDeg = gsap.utils.clamp(0, 360);
const deg = clampDeg(map(scrollY)); // siempre 0-360

// Cadena normalize -> snap con pipe (ej. steps de 10%)
const toStep = gsap.utils.pipe(
  (v) => gsap.utils.normalize(0, 100, v),
  (v) => gsap.utils.snap(0.1, v)
);
toStep(55); // 0.6 (0.55 normalizado, snapeado a 0.6)

// Random por target con forma string (GSAP evalua por elemento)
gsap.to(".box", { x: "random(-100, 100, 5)", duration: 1 });
```

## Decision rapida

| Necesitai... | Familia | Helpers | Ejemplo tipico |
|---|---|---|---|
| Limitar un valor | Clamp | `clamp` | Acotar drag o scroll a 0-500 |
| Convertir rangos | Mapeo | `mapRange`, `normalize`, `interpolate` | Progress 0-1 a grados 0-360 |
| Azar u orden | Random | `random`, `shuffle`, `distribute` | Posiciones o staggers aleatorios |
| Alinear o ciclar | Snap / wrap | `snap`, `wrap`, `wrapYoyo` | Grid de 20px, scroll infinito |
| Arrays y DOM | Colecciones | `toArray`, `selector`, `pipe` | Scoping en componentes, cadenas |
| Unidades y color | Parsing | `getUnit`, `unitize`, `splitColor` | Normalizar `px`/`%`, canales RGB |

Si dudai entre `normalize` e `interpolate`: `normalize` lleva un valor a 0-1 (entrada -> progreso), `interpolate` lleva un progreso 0-1 a valores (progreso -> salida). Son inversos.

Si dudai entre `wrap` y `clamp`: `clamp` frena en los bordes (drag acotado), `wrap` sigue ciclando (carrusel infinito).

## Profundizar

Catalogo completo con firma + ejemplo por helper en [references/helpers.md](references/helpers.md): `clamp`, `mapRange`, `normalize`, `interpolate`, `random`, `snap`, `toArray`, `wrap`, `pipe`, `selector`, mas `shuffle`, `distribute`, `getUnit`, `unitize`, `splitColor`, `wrapYoyo`.

Regla: si el helper no esta en el Top 3, abri el catalogo antes de usarlo.

## Best practices

- ✅ Omiti el valor para forma funcion reutilizable en handlers y callbacks: `const mapFn = gsap.utils.mapRange(0, 1, 0, 360); mapFn(progress)`.
- ✅ `snap` para grids y steps; `toArray` cuando necesitai un array real desde selector o NodeList.
- ✅ `gsap.utils.selector(scope)` en componentes para acotar queries al contenedor.
- ✅ `pipe` para encadenar transforms (normalize -> mapRange -> snap) en un solo callable.

## Do Not

- ❌ `mapRange` / `normalize` trabajan con numeros, no unidades. Usa `getUnit` / `unitize` si hay `px`, `%`, `deg`.
- ❌ No uses comportamiento no documentado; apegarte a la API oficial.

### Learn More

https://gsap.com/docs/v3/HelperFunctions

https://gsap.com/docs/v3/GSAP/UtilityMethods/

---

## Anexo 2026 - Referencias oficiales y checklist

Fuentes oficiales:

- HelperFunctions: https://gsap.com/docs/v3/HelperFunctions
- UtilityMethods: https://gsap.com/docs/v3/GSAP/UtilityMethods
- GSAP docs: https://www.gsap.com/docs/v3/
- GSAP skills: https://github.com/greensock/gsap-skills

Repos famosos:

- https://github.com/greensock/gsap-skills
- https://github.com/facebook/react
- https://github.com/vercel/next.js

Checklist:

- [ ] clamp para drag y scroll acotados. wrap para carrusel infinito.
- [ ] mapRange para convertir progreso en valores. normalize e interpolate sin confundir.
- [ ] snap para grids y steps. toArray para arrays reales.
- [ ] Forma funcion reutilizable en handlers frecuentes.
- [ ] pipe para cadenas normalize a snap en un callable.
- [ ] Unidades con getUnit y unitize cuando hay px o porcentajes.
- [ ] Sin APIs no documentadas. Catalogo revisado si no es Top 3.
