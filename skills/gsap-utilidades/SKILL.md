---
name: gsap-utilidades
description: Utilidades gsap.utils como clamp, mapRange, random, snap, toArray y wrap para calculos de animacion. (GSAP, utils, clamp, mapRange)
license: MIT
metadata:
  version: "1.1.0"
---

# gsap.utils

## Cuando usar esta skill

Aplica esta skill cuando escribes o revisas codigo que usa **gsap.utils** para calculos matematicos, manejo de arreglos y colecciones, analisis de unidades o mapeo de valores en animaciones. Casos tipicos: convertir scroll en un valor, aleatorizar posiciones, ajustar a una cuadricula o normalizar entradas.

**Skills relacionadas:** usar junto con **gsap-basico**, **gsap-linea-tiempo** y **gsap-animacion-scroll** para construir animaciones. Las utilidades de easing personalizado estan en **gsap-complementos**.

## Concepto base

**gsap.utils** son funciones puras, sin necesidad de `gsap.registerPlugin()`. Se pueden usar en `vars` de tweens (valores por funcion), en callbacks de ScrollTrigger u Observer, o en cualquier codigo JS que trabaje con GSAP. Todas cuelgan de **gsap.utils** (por ejemplo `gsap.utils.clamp()`).

**Forma funcion:** muchos utils aceptan el valor a transformar como **ultimo** argumento. Si se omite ese valor, devuelven una **funcion** reutilizable con esa configuracion. Esto resulta util en handlers frecuentes (mousemove, scroll) o en callbacks de tween donde se aplica el mismo rango muchas veces. Excepcion: **random()** usa `true` como argumento final para la forma funcion.

```javascript
// Con valor: devuelve el resultado
gsap.utils.clamp(0, 100, 150); // 100

// Sin valor: devuelve funcion reutilizable
const clampFn = gsap.utils.clamp(0, 100);
clampFn(150); // 100
clampFn(-10); // 0
```

## Ejemplo minimo

Ejemplo completo y ejecutable que combina los tres helpers mas usados:

```javascript
import { gsap } from "gsap";

// 1. Convertir scroll (0-500) a grados (0-360)
const mapScrollToDeg = gsap.utils.mapRange(0, 500, 0, 360);

// 2. Limitar el resultado al rango valido
const clampDeg = gsap.utils.clamp(0, 360);

// 3. Ajustar a pasos de 15 grados para un efecto por pasos
const snapDeg = gsap.utils.snap(15);

function onScroll() {
  const raw = mapScrollToDeg(window.scrollY);
  const safe = clampDeg(raw);
  const stepped = snapDeg(safe);
  gsap.set(".dial", { rotation: stepped });
}

window.addEventListener("scroll", onScroll, { passive: true });
```

## Top 3 helpers

Cubren la mayoria de los casos. El resto esta en el catalogo.

### clamp(min, max, value?)

Limita un valor entre `min` y `max`. Es el mas usado para drag, scroll y progress.

```javascript
gsap.utils.clamp(0, 100, 150); // 100
const clampX = gsap.utils.clamp(0, 500); // forma funcion
clampX(750); // 500
```

### mapRange(inMin, inMax, outMin, outMax, value?)

Convierte scroll, progress (0-1) o una entrada numerica a otro rango de animacion.

```javascript
gsap.utils.mapRange(0, 1, 0, 360, 0.5); // 180 (progress a grados)
const mapY = gsap.utils.mapRange(0, 100, 0, 500); // forma funcion
mapY(50); // 250
```

### snap(snapTo, value?)

Redondea al multiplo o al valor permitido mas cercano. Ideal para cuadriculas y pasos discretos.

```javascript
gsap.utils.snap(10, 23); // 20
gsap.utils.snap([0, 100, 200], 150); // 100 o 200 (el mas cercano)
gsap.to(".x", { x: 200, snap: { x: 20 } }); // cuadricula directa en tween
```

## Patrones comunes

```javascript
// Scroll -> valor acotado: mapear y luego limitar
const map = gsap.utils.mapRange(0, 500, 0, 360);
const clampDeg = gsap.utils.clamp(0, 360);
const deg = clampDeg(map(window.scrollY)); // siempre 0-360

// Cadena normalize -> snap con pipe (pasos de 10%)
const toStep = gsap.utils.pipe(
  (v) => gsap.utils.normalize(0, 100, v),
  (v) => gsap.utils.snap(0.1, v)
);
toStep(55); // 0.6 (0.55 normalizado, ajustado a 0.6)

// Random por target con forma string (GSAP lo evalua por elemento)
gsap.to(".box", { x: "random(-100, 100, 5)", duration: 1 });
```

## Decision rapida

| Si necesitas... | Familia | Helpers | Ejemplo tipico |
|---|---|---|---|
| Limitar un valor | Clamp | `clamp` | Acotar drag o scroll a 0-500 |
| Convertir rangos | Mapeo | `mapRange`, `normalize`, `interpolate` | Progress 0-1 a grados 0-360 |
| Azar u orden | Random | `random`, `shuffle`, `distribute` | Posiciones o staggers aleatorios |
| Alinear o ciclar | Snap / wrap | `snap`, `wrap`, `wrapYoyo` | Cuadricula de 20px, scroll infinito |
| Arreglos y DOM | Colecciones | `toArray`, `selector`, `pipe` | Scoping en componentes, cadenas |
| Unidades y color | Parsing | `getUnit`, `unitize`, `splitColor` | Normalizar `px`/`%`, canales RGB |

Si dudas entre `normalize` e `interpolate`: `normalize` lleva un valor a 0-1 (entrada -> progreso), `interpolate` lleva un progreso 0-1 a valores (progreso -> salida). Son inversos.

Si dudas entre `wrap` y `clamp`: `clamp` detiene en los bordes (drag acotado), `wrap` continua en ciclo (carrusel infinito).

## Profundizar

Catalogo completo con firma y ejemplo por helper en [references/helpers.md](references/helpers.md): `clamp`, `mapRange`, `normalize`, `interpolate`, `random`, `snap`, `toArray`, `wrap`, `pipe`, `selector`, ademas de `shuffle`, `distribute`, `getUnit`, `unitize`, `splitColor`, `wrapYoyo`.

Regla: si el helper no esta en el Top 3, abrir el catalogo antes de usarlo.

## Buenas practicas

- Omitir el valor para obtener forma funcion reutilizable en handlers y callbacks: `const mapFn = gsap.utils.mapRange(0, 1, 0, 360); mapFn(progress)`.
- Usar `snap` para cuadriculas y pasos; usar `toArray` cuando se necesita un arreglo real desde un selector o NodeList.
- Usar `gsap.utils.selector(scope)` en componentes para acotar las consultas al contenedor.
- Usar `pipe` para encadenar transformaciones (normalize -> mapRange -> snap) en una sola funcion.

## Errores comunes

- `mapRange` y `normalize` trabajan con numeros, no con unidades. Usar `getUnit` y `unitize` si hay `px`, `%` o `deg`.
- No usar comportamiento no documentado; mantenerse en la API oficial.

## Referencias oficiales

- HelperFunctions (referencia principal): https://gsap.com/docs/v3/HelperFunctions
- UtilityMethods (incluye `distribute`): https://gsap.com/docs/v3/GSAP/UtilityMethods/
- Documentacion general GSAP: https://gsap.com/docs/v3/
- Repositorio oficial de skills GSAP: https://github.com/greensock/gsap-skills

## Checklist de verificacion

- [ ] `clamp` para drag y scroll acotados; `wrap` para carrusel infinito.
- [ ] `mapRange` para convertir progreso en valores; `normalize` e `interpolate` sin confundir.
- [ ] `snap` para cuadriculas y pasos; `toArray` para arreglos reales.
- [ ] Forma funcion reutilizable en handlers frecuentes.
- [ ] `pipe` para cadenas normalize a snap en una sola funcion.
- [ ] Unidades con `getUnit` y `unitize` cuando hay px o porcentajes.
- [ ] Sin API no documentada; catalogo revisado si no es Top 3.
