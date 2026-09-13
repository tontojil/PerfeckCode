# ScrollTrigger - Referencia detallada

Detalle de config avanzada de ScrollTrigger. El SKILL.md trae lo basico (trigger / scrub / pin); aca esta lo que solo necesitai para casos avanzados.

## Tabla de config (17 props)

Shorthand: `scrollTrigger: ".selector"` solo setea `trigger`. Ver [docs oficiales](https://gsap.com/docs/v3/Plugins/ScrollTrigger/).

| Prop | Tipo | Descripcion |
|------|------|-------------|
| **trigger** | String \| Element | Elemento cuya posicion define el inicio. Requerido (o shorthand). |
| **start** | String \| Number \| Function | Cuando se activa. Default `"top bottom"` (o `"top top"` si `pin: true`). Formato `"triggerPos viewportPos"`, ej. `"top center"`, `"bottom 80%"`. Numero = px scrolleados. Relativos: `"+=300"`, `"+=100%"`, `"max"`. Funcion recibe la instancia. |
| **end** | String \| Number \| Function | Cuando termina. Default `"bottom top"`. Mismos formatos que `start`. |
| **endTrigger** | String \| Element | Elemento base para **end** cuando difiere de trigger. |
| **scrub** | Boolean \| Number | Liga progreso al scroll. `true` = directo; numero = segundos de "catch up" (ej. `scrub: 1`). |
| **toggleActions** | String | Cuatro acciones: **onEnter onLeave onEnterBack onLeaveBack**. Cada una: `"play"`, `"pause"`, `"resume"`, `"reset"`, `"restart"`, `"complete"`, `"reverse"`, `"none"`. Default `"play none none none"`. |
| **pin** | Boolean \| String \| Element | Fija elemento mientras esta activo. `true` = fija el trigger. No animis el elemento fijado; anima hijos. |
| **pinSpacing** | Boolean \| String | Default `true` (agrega spacer). `false` o `"margin"`. |
| **scroller** | String \| Element | Contenedor de scroll (default: viewport). Selector o elemento para div scrolleable. |
| **horizontal** | Boolean | `true` para scroll horizontal. |
| **markers** | Boolean \| Object | `true` para marcadores dev; u objeto `{ startColor, endColor, fontSize }`. Sacar en produccion. |
| **once** | Boolean | Si `true`, mata el ScrollTrigger tras llegar a end una vez (la animacion sigue). |
| **id** | String | Id unico para **ScrollTrigger.getById(id)**. |
| **refreshPriority** | Number | Menor = se refresca antes. Usalo si creai triggers fuera de orden top-to-bottom para que refresquen en orden de pagina. |
| **toggleClass** | String \| Object | Agrega/saca clase al activarse. String = sobre trigger; u objeto `{ targets: ".x", className: "active" }`. |
| **snap** | Number \| Array \| Function \| "labels" \| Object | Snap a valores de progreso. Numero = incrementos (ej. `0.25`); array = valores; `"labels"` = labels del timeline; objeto `{ snapTo, duration, delay, ease }`. |
| **containerAnimation** | Tween \| Timeline | Para "fake" horizontal scroll: tween/timeline que mueve contenido en X. El ScrollTrigger ata el scroll vertical a su progreso. Sin pin ni snap en triggers que lo usan. |

Callbacks (no cuentan como props): **onEnter / onLeave / onEnterBack / onLeaveBack** reciben la instancia (`progress`, `direction`, `isActive`, `getVelocity()`). **onUpdate / onToggle / onRefresh / onScrubComplete** para progreso, cambio de estado, recalculo y fin de scrub numerico.

Standalone sin tween (custom behavior desde `self.progress`):

```javascript
ScrollTrigger.create({
  trigger: "#id",
  start: "top top",
  end: "bottom 50%+=100px",
  onUpdate: (self) => console.log(self.progress.toFixed(3), self.direction)
});
```

## batch()

Firma:

```javascript
ScrollTrigger.batch(triggers, vars) // retorna Array de ScrollTriggers
```

- **triggers**: selector (ej. `".box"`) o Array de elementos.
- **vars**: config ScrollTrigger estandar (start, end, once, callbacks, etc.). NO pasar `trigger` ni opciones de animacion: `animation`, `invalidateOnRefresh`, `onSnapComplete`, `onScrubComplete`, `scrub`, `snap`, `toggleActions`.

Firma de callbacks batcheados (2 params, distinto al callback normal que recibe 1 instancia):

```javascript
onEnter: (targets, scrollTriggers) => { /* targets: Array elementos, scrollTriggers: Array instancias */ }
```

- **targets** — Array de elementos que dispararon el callback en el intervalo.
- **scrollTriggers** — Array de instancias (para progress, direction, `kill()`).

Opciones de batch en vars:

- **interval** (Number) — segundos maximos para juntar cada batch. Default ~1 requestAnimationFrame. Al disparar el primer callback arranca el timer; se entrega al cumplirse el intervalo o **batchMax**.
- **batchMax** (Number | Function) — maximo por batch. Al llenarse dispara y arranca el siguiente. Funcion que retorna numero para layouts responsive (corre en refresh).

```javascript
ScrollTrigger.batch(".box", {
  onEnter: (elements, triggers) => {
    gsap.to(elements, { opacity: 1, y: 0, stagger: 0.15 });
  },
  onLeave: (elements, triggers) => {
    gsap.to(elements, { opacity: 0, y: 100 });
  },
  start: "top 80%",
  end: "bottom 20%"
});
```

Con control fino:

```javascript
ScrollTrigger.batch(".card", {
  interval: 0.1,
  batchMax: 4,
  onEnter: (batch) => gsap.to(batch, { opacity: 1, y: 0, stagger: 0.1, overwrite: true }),
  onLeaveBack: (batch) => gsap.set(batch, { opacity: 0, y: 50, overwrite: true })
});
```

Ver [batch()](https://gsap.com/docs/v3/Plugins/ScrollTrigger/static.batch/).

## scrollerProxy()

Para integrar libs de smooth-scroll de terceros (ScrollSmoother nativo no lo necesita). Overridea como ScrollTrigger lee/escribe la posicion.

Firma:

```javascript
ScrollTrigger.scrollerProxy(scroller, vars)
```

- **scroller**: selector o elemento (ej. `"body"`, `".container"`).
- **vars**: objeto con **scrollTop** y/o **scrollLeft** (al menos uno requerido). Cada una es getter + setter: con argumento = setter, sin argumento = getter (retorna valor actual).

Opcionales en vars:

- **getBoundingClientRect** — funcion que retorna `{ top, left, width, height }`. Necesaria si el rect real del scroller no es el default.
- **scrollWidth** / **scrollHeight** — getter/setter mismo patron, si la lib expone otras dimensiones.
- **fixedMarkers** (Boolean) — `true` trata markers como `position: fixed`. Util si el scroller se traslada y los markers se mueven mal.
- **pinType** — `"fixed"` o `"transform"`. `"fixed"` si los pins tiemblan; `"transform"` si no se pegan.

Critico: avisar a ScrollTrigger cuando el scroller externo se mueve:

```javascript
ScrollTrigger.scrollerProxy(document.body, {
  scrollTop(value) {
    if (arguments.length) scrollbar.scrollTop = value;
    return scrollbar.scrollTop;
  },
  getBoundingClientRect() {
    return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
  }
});
scrollbar.addListener(ScrollTrigger.update);
```

Sin ese listener los calculos quedan desfasados. Ver [scrollerProxy()](https://gsap.com/docs/v3/Plugins/ScrollTrigger/static.scrollerProxy/).

## containerAnimation (scroll horizontal)

Patron: fijai una seccion y con scroll **vertical** el contenido se mueve en **horizontal** ("fake" horizontal scroll). Fijai el panel, animai **x** / **xPercent** de un hijo (wrapper con el contenido), y atai esa animacion al scroll vertical. Otros tweens que reaccionen al movimiento horizontal usan **containerAnimation**.

Regla: el tween horizontal **debe** usar **ease: "none"**, si no el scroll y la posicion no calzan.

1. Fijai la seccion (trigger = panel tamaño viewport).
2. Tween del contenido interno en **x** / **xPercent** con **ease: "none"**.
3. Ese tween lleva ScrollTrigger con **pin: true**, **scrub: true**. Pinea el wrapper, no el elemento animado.
4. Tweens que dependen del movimiento horizontal setean **containerAnimation** a ese tween, con `start` tipo `"left center"`.

```javascript
const scrollingEl = document.querySelector(".horizontal-el");
// Panel = seccion fijada tamaño viewport. .horizontal-el = contenido interno que se mueve a la izquierda.
const scrollTween = gsap.to(scrollingEl, {
  xPercent: () => Math.max(0, window.innerWidth - scrollingEl.offsetWidth),
  ease: "none", // requerido
  scrollTrigger: {
    trigger: scrollingEl,
    pin: scrollingEl.parentNode, // wrapper, para no animar el elemento fijado
    start: "top top",
    end: "+=1000"
  }
});

// Tweens que disparan segun movimiento horizontal:
gsap.to(".nested-el-1", {
  y: 100,
  scrollTrigger: {
    containerAnimation: scrollTween, // IMPORTANTE
    trigger: ".nested-wrapper-1",
    start: "left center",
    toggleActions: "play none none reset"
  }
});
```

Caveats: sin pin ni snap en ScrollTriggers con **containerAnimation**. No animis el trigger mismo en horizontal; anima un hijo. Si el trigger se mueve, **start**/**end** se offsetean.

## Ejemplo scrub + pin

```javascript
const tl = gsap.timeline({
  scrollTrigger: {
    trigger: ".container",
    start: "top top",
    end: "+=2000",
    scrub: 1, // lag suave de 1s
    pin: true
  }
});
tl.to(".a", { x: 100 }).to(".b", { y: 50 }).to(".c", { opacity: 0 });
```

El progreso del timeline se ata al rango start/end. Llamai **ScrollTrigger.refresh()** tras cambios de layout (contenido dinamico, imagenes, fuentes); resize de viewport es automatico (debounce 200ms).
