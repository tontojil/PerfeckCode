# gsap.utils - Catalogo de helpers

Detalle de firmas y ejemplos. Resumen y decision rapida en `../SKILL.md`.

> Todos cuelgan de `gsap.utils` (ej. `gsap.utils.clamp()`). Son puros, sin `registerPlugin()`.

## Forma funcion

Muchos utils aceptan el valor a transformar como **ultimo** argumento. Si lo omitis, devuelven una **funcion** reutilizable. Excepcion: **random()** usa `true` final.

```javascript
// Con valor: devuelve el resultado
gsap.utils.clamp(0, 100, 150); // 100

// Sin valor: devuelve funcion reutilizable
const c = gsap.utils.clamp(0, 100);
c(150); // 100
c(-10); // 0
```

## Clamp y mapeo

### clamp(min, max, value?)

```javascript
gsap.utils.clamp(0, 100, 150); // 100
```

Limita un valor entre `min` y `max`. Omiti `value` para forma funcion: `clamp(min, max)(value)`. Uso tipico: drag, scroll, progress.

### mapRange(inMin, inMax, outMin, outMax, value?)

```javascript
gsap.utils.mapRange(0, 100, 0, 500, 50); // 250
```

Convierte un rango a otro (scroll, progress 0-1, input). Omiti `value` para forma funcion: `mapRange(inMin, inMax, outMin, outMax)(value)`.

### normalize(min, max, value?)

```javascript
gsap.utils.normalize(0, 100, 50); // 0.5
```

Normaliza a 0-1 dentro del rango. Inverso del mapeo cuando el destino es 0-1. Omiti `value` para forma funcion: `normalize(min, max)(value)`.

### interpolate(start, end, progress?)

```javascript
gsap.utils.interpolate(0, 100, 0.5); // 50
```

Interpola entre dos valores con `progress` 0-1. Acepta numeros, colores y objetos con mismas keys. Omiti `progress` para forma funcion: `interpolate(start, end)(progress)`.

```javascript
gsap.utils.interpolate("#ff0000", "#0000ff", 0.5); // color intermedio
gsap.utils.interpolate({ x: 0, y: 0 }, { x: 100, y: 50 }, 0.5); // { x: 50, y: 25 }
```

## Azar y snap

### random(minimum, maximum[, snapIncrement, returnFunction]) / random(array[, returnFunction])

```javascript
gsap.utils.random(-100, 100); // ej. 42.7
```

Numero aleatorio en el rango, o elemento aleatorio de un array. `snapIncrement` opcional redondea al multiplo mas cercano. Para forma funcion pasa `true` como ultimo argumento (unico util que lo hace asi).

```javascript
gsap.utils.random(0, 500, 5); // 0-500, multiplos de 5
const randomFn = gsap.utils.random(-200, 500, 10, true);
randomFn(); // nuevo valor por llamada
gsap.utils.random(["red", "blue", "green"]); // una de ellas
```

**Forma string en tween vars** (GSAP la evalua por target):

```javascript
gsap.to(".box", { x: "random(-100, 100, 5)", duration: 1 });
gsap.to(".item", { backgroundColor: "random([red, blue, green])" });
```

### snap(snapTo, value?)

```javascript
gsap.utils.snap(10, 23); // 20
```

Redondea al multiplo de `snapTo` o al valor mas cercano de un array. Omiti `value` para forma funcion: `snap(snapTo)(value)`.

```javascript
gsap.utils.snap([0, 100, 200], 150); // 100 o 200 (mas cercano)
gsap.to(".x", { x: 200, snap: { x: 20 } }); // grid en tween
```

### shuffle(array)

```javascript
gsap.utils.shuffle([1, 2, 3, 4]); // ej. [3, 1, 4, 2]
```

Devuelve un array nuevo con los mismos elementos en orden aleatorio.

### distribute(config)

```javascript
gsap.to(".class", { scale: gsap.utils.distribute({ base: 0.5, amount: 2.5, from: "center" }) });
```

Devuelve una funcion `(index, target, targets)` que reparte valores segun posicion (o grid). Pasala directo como valor de tween; GSAP la llama por target.

| Propiedad | Tipo | Descripcion |
|---|---|---|
| `base` | Number | Valor inicial. Default `0`. |
| `amount` | Number | Total a repartir entre todos (sumado a base). Alternativa a `each`. |
| `each` | Number | Paso fijo entre targets (sumado a base). Alternativa a `amount`. |
| `from` | Number \| String \| Array | Origen: indice, `"start"`, `"center"`, `"edges"`, `"random"`, `"end"` o ratios `[0.25, 0.75]`. Default `0`. |
| `grid` | String \| Array | `[filas, columnas]` o `"auto"`. Omitir para array plano. |
| `axis` | String | En grid: `"x"` o `"y"`. |
| `ease` | Ease | Curva de reparto (ej. `"power1.inOut"`). Default `"none"`. |

Ver [distribute()](https://gsap.com/docs/v3/GSAP/UtilityMethods/distribute/).

## Unidades y color

### getUnit(value)

```javascript
gsap.utils.getUnit("100px"); // "px"
```

Devuelve la unidad (`"px"`, `"%"`, `"deg"`, `""` si no tiene).

### unitize(value, unit)

```javascript
gsap.utils.unitize(100, "px"); // "100px"
```

Agrega unidad al numero, o deja el valor si ya trae una (`unitize("2rem", "px")` queda `"2rem"`).

### splitColor(color, returnHSL?)

```javascript
gsap.utils.splitColor("#6fb936"); // [111, 185, 54]
```

Convierte color a array **[r, g, b]** (0-255) o **[r, g, b, a]** si hay alfa. Con `true` devuelve **[h, s, l]** o **[h, s, l, a]**. Acepta `rgb()`, `rgba()`, `hsl()`, `hsla()`, hex y nombres (`"red"`).

## Arrays y colecciones

### toArray(value, scope?)

```javascript
gsap.utils.toArray(".item"); // array de elementos
```

Convierte a array: selector string, NodeList, HTMLCollection, elemento unico o array. `scope` opcional acota el selector a un contenedor.

### selector(scope)

```javascript
const q = gsap.utils.selector(containerRef);
q(".box"); // .box solo dentro del contenedor
```

Devuelve un selector acotado al elemento o ref dado. Usalo en componentes para no matchear todo el documento.

### pipe(...functions)

```javascript
const fn = gsap.utils.pipe(
  (v) => gsap.utils.normalize(0, 100, v),
  (v) => gsap.utils.snap(0.1, v)
);
fn(50); // normalizado y luego snapeado
```

Compone funciones: `pipe(f1, f2, f3)(value)` = `f3(f2(f1(value)))`. Ideal para cadenas normalize -> mapRange -> snap en tweens o callbacks.

### wrap(min, max, value?)

```javascript
gsap.utils.wrap(0, 360, 370); // 10
```

Envuelve el valor en el rango (min inclusivo, max exclusivo). Para scroll infinito o valores ciclicos. Omiti `value` para forma funcion: `wrap(min, max)(value)`.

### wrapYoyo(min, max, value?)

```javascript
gsap.utils.wrapYoyo(0, 100, 150); // 50 (rebota)
```

Como `wrap` pero con rebote en los extremos (ida y vuelta). Omiti `value` para forma funcion.
