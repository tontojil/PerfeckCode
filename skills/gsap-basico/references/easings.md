# Easings, stagger avanzado y responsive (GSAP)

Detalle extraido de `gsap-basico`. El hub trae solo lo esencial; aca esta el catalogo completo.

## Catalogo de easings

Usa strings salvo que necesites una curva a medida:

```javascript
ease: "power1.out"     // feel por defecto
ease: "power3.inOut"
ease: "back.out(1.7)"  // overshoot
ease: "elastic.out(1, 0.3)"
ease: "none"           // linear
```

Tabla completa (`base` = `.out`; `power` 1 gradual -> 4 pronunciado):

```
base (out)        .in                .out               .inOut
"none"
"power1"          "power1.in"        "power1.out"       "power1.inOut"
"power2"          "power2.in"        "power2.out"       "power2.inOut"
"power3"          "power3.in"        "power3.out"       "power3.inOut"
"power4"          "power4.in"        "power4.out"       "power4.inOut"
"back"            "back.in"          "back.out"         "back.inOut"
"bounce"          "bounce.in"        "bounce.out"       "bounce.inOut"
"circ"            "circ.in"          "circ.out"         "circ.inOut"
"elastic"         "elastic.in"       "elastic.out"      "elastic.inOut"
"expo"            "expo.in"          "expo.out"         "expo.inOut"
"sine"            "sine.in"          "sine.out"         "sine.inOut"
```

Guia rapida:

- Entradas/salidas UI: `power2.out`, `power3.out`.
- Transiciones ida+vuelta: `power3.inOut`, `sine.inOut`.
- Overshoot (botones, modales, tooltips): `back.out(1.7)`.
- Rebotes/elasticos (usar con moderacion): `bounce.out`, `elastic.out(1, 0.3)`.
- Movimiento constante (marquesinas, loops): `none`.

### CustomEase (plugin)

Solo cuando ningun ease built-in sirve. Curva tipo CSS:

```javascript
const myEase = CustomEase.create("my-ease", ".17,.67,.83,.67");
gsap.to(".item", { x: 100, ease: myEase, duration: 1 });
```

Curva compleja con path SVG normalizado (cualquier cantidad de puntos):

```javascript
const hop = CustomEase.create("hop", "M0,0 C0,0 0.056,0.442 0.175,0.442 0.294,0.442 0.332,0 0.332,0 0.332,0 0.414,1 0.671,1 0.991,1 1,0 1,0");
gsap.to(".item", { x: 100, ease: hop, duration: 1 });
```

## Stagger avanzado

Forma simple (offset en segundos):

```javascript
gsap.to(".item", { y: -20, stagger: 0.1 });
```

Forma objeto:

```javascript
gsap.to(".item", {
  y: -20,
  // total repartido entre todos:
  stagger: { amount: 0.3, from: "center" },
  // o fijo por elemento, orden aleatorio:
  // stagger: { each: 0.1, from: "random" }
});
```

Opciones de `from`: `"start" | "center" | "end" | "edges" | "random" | index (number)`.

Grid (galerias, tarjetas):

```javascript
gsap.to(".cell", {
  scale: 0,
  stagger: { grid: [7, 15], from: "center", amount: 0.4, axis: "x" }
});
```

Combinado con valores por funcion (se evalua una vez por target):

```javascript
gsap.to(".item", {
  x: (i) => i * 50, // primero -> 0, segundo -> 50, tercero -> 100...
  stagger: 0.1
});
```

Mas: https://gsap.com/resources/getting-started/Staggers

## Responsive con gsap.matchMedia()

GSAP 3.11+. El setup corre solo cuando el query matchea; al dejar de matchear, animaciones y ScrollTriggers creados ahi se revierten solos.

```javascript
let mm = gsap.matchMedia();

mm.add("(min-width: 800px)", () => {
  gsap.to(".box", { rotation: 360, duration: 2 });
  // return () => { /* cleanup propio opcional */ };
});

// revert global (ej. unmount): mm.revert();
```

Tercer argumento opcional para scoping de selectores: `mm.add(query, callback, containerRef)`.

### Multiples condiciones (evita codigo duplicado)

El handler recibe `context.conditions` con un booleano por condicion:

```javascript
mm.add(
  {
    isDesktop: "(min-width: 800px)",
    isMobile: "(max-width: 799px)",
    reduceMotion: "(prefers-reduced-motion: reduce)"
  },
  (context) => {
    const { isDesktop, reduceMotion } = context.conditions;
    gsap.to(".box", {
      rotation: isDesktop ? 360 : 180,
      duration: reduceMotion ? 0 : 2 // sin animacion si el usuario la reduce
    });
    // return () => { /* cleanup cuando nada matchea */ };
  }
);
```

### Reduced-motion (accesibilidad)

Respeta `prefers-reduced-motion: reduce` siempre: usuarios con desordenes vestibulares lo necesitan. Patron:

- `duration: 0` o salta la animacion cuando `reduceMotion` es `true`.
- No anides `gsap.context()` dentro de matchMedia (ya crea uno interno); usa `mm.revert()` nomas.
- Re-ejecuta handlers matcheados tras togglear un control propio: `gsap.matchMediaRefresh()`.

Docs: https://gsap.com/docs/v3/GSAP/gsap.matchMedia/
