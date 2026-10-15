---
name: gsap-vue-svelte
description: Animaciones GSAP en Vue, Nuxt, Svelte y SvelteKit, con ciclo de vida, selectores acotados y limpieza al desmontar. Para React usar gsap-react. (GSAP, Vue, Svelte, animation)
license: MIT
metadata:
  version: "1.1.0"
---

# GSAP with Vue, Svelte, and Other Frameworks

## Cuando usar esta skill

Usar esta skill cuando escribes o revisas codigo GSAP en Vue (o Nuxt), Svelte (o SvelteKit) u otro framework con ciclo de vida (montaje y desmontaje). Para **React**, usar **gsap-react** (hook useGSAP, gsap.context()).

**Skills relacionadas:** para tweens y timelines usar **gsap-basico** y **gsap-linea-tiempo**; para animacion basada en scroll usar **gsap-animacion-scroll**; para React usar **gsap-react**.

## Principios (todos los frameworks)

- **Crear** tweens y ScrollTriggers **despues** de que el DOM del componente este disponible (por ejemplo en onMounted u onMount).
- **Eliminar o revertir** esas animaciones en la fase de **desmontaje** para evitar fugas y ejecucion sobre nodos desconectados.
- **Acotar selectores** a la raiz del componente, de modo que `.box` solo busque dentro de ese componente y no en toda la pagina.

## Ejemplo minimo (Vue 3 Composition API)

Patron minimo, runnable con Vite + Vue 3, sin proyecto adicional:

```javascript
import { onMounted, onUnmounted, ref } from "vue";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger); // una vez por app, por ejemplo en main.js

export default {
  setup() {
    const container = ref(null);
    let ctx;

    onMounted(() => {
      if (!container.value) return;
      ctx = gsap.context(() => {
        gsap.to(".box", { x: 100, duration: 0.6 });
        gsap.from(".item", { autoAlpha: 0, y: 20, stagger: 0.1 });
      }, container.value);
    });

    onUnmounted(() => {
      ctx?.revert();
    });

    return { container };
  },
};
```

Reglas del ejemplo:

- **gsap.context(scope)** — pasar el ref del contenedor (por ejemplo `container.value`) como segundo argumento para acotar selectores como `.item` a esa raiz. Todas las animaciones y ScrollTriggers creados dentro se registran y se revierten con **ctx.revert()**.
- **onUnmounted** — llamar siempre a **ctx.revert()** para eliminar tweens y ScrollTriggers y revertir estilos en linea.

## Ejemplo minimo (Svelte)

```javascript
<script>
  import { onMount } from "svelte";
  import { gsap } from "gsap";
  import { ScrollTrigger } from "gsap/ScrollTrigger";

  let container;

  onMount(() => {
    if (!container) return;
    const ctx = gsap.context(() => {
      gsap.to(".box", { x: 100 });
      gsap.from(".item", { autoAlpha: 0, stagger: 0.1 });
    }, container);
    return () => ctx.revert();
  });
</script>

<div bind:this={container}>
  <div class="box">Box</div>
  <div class="item">Item</div>
</div>
```

Reglas del ejemplo:

- **bind:this={container}** — obtener referencia al elemento raiz para pasarla a **gsap.context(scope)**.
- **return () => ctx.revert()** — onMount puede devolver una funcion de limpieza; llamar a **ctx.revert()** ahi para limpiar al destruir el componente.

## Vue 3 (script setup)

Misma idea con `<script setup>` y refs:

```javascript
<script setup>
import { onMounted, onUnmounted, ref } from "vue";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const container = ref(null);
let ctx;

onMounted(() => {
  if (!container.value) return;
  ctx = gsap.context(() => {
    gsap.to(".box", { x: 100 });
    gsap.from(".item", { autoAlpha: 0, stagger: 0.1 });
  }, container.value);
});

onUnmounted(() => {
  ctx?.revert();
});
</script>

<template>
  <div ref="container">
    <div class="box">Box</div>
    <div class="item">Item</div>
  </div>
</template>
```

## Nuxt 4

Composable reutilizable (registro de plugins en Nuxt 4, carga diferida, seguro para SSR):

```typescript
// composables/useGSAP.ts
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const PLUGINS = [
  "CSSRulePlugin",
  "CustomBounce",
  "CustomEase",
  "CustomWiggle",
  "Draggable",
  "DrawSVGPlugin",
  "EaselPlugin",
  "EasePack",
  "Flip",
  "GSDevTools",
  "InertiaPlugin",
  "MorphSVGPlugin",
  "MotionPathHelper",
  "MotionPathPlugin",
  "Observer",
  "Physics2DPlugin",
  "PhysicsPropsPlugin",
  "PixiPlugin",
  "ScrambleTextPlugin",
  "ScrollSmoother",
  "ScrollToPlugin",
  "ScrollTrigger",
  "SplitText",
  "TextPlugin",
] as const;

// Carga dinamica de todos los plugins GSAP
const pluginMap = {
  CustomEase: () => import("gsap/CustomEase"),
  Draggable: () => import("gsap/Draggable"),
  CSSRulePlugin: () => import("gsap/CSSRulePlugin"),
  EaselPlugin: () => import("gsap/EaselPlugin"),
  EasePack: () => import("gsap/EasePack"),
  Flip: () => import("gsap/Flip"),
  MotionPathPlugin: () => import("gsap/MotionPathPlugin"),
  Observer: () => import("gsap/Observer"),
  PixiPlugin: () => import("gsap/PixiPlugin"),
  ScrollToPlugin: () => import("gsap/ScrollToPlugin"),
  ScrollTrigger: () => import("gsap/ScrollTrigger"),
  TextPlugin: () => import("gsap/TextPlugin"),
  DrawSVGPlugin: () => import("gsap/DrawSVGPlugin"),
  Physics2DPlugin: () => import("gsap/Physics2DPlugin"),
  PhysicsPropsPlugin: () => import("gsap/PhysicsPropsPlugin"),
  ScrambleTextPlugin: () => import("gsap/ScrambleTextPlugin"),
  CustomBounce: () => import("gsap/CustomBounce"),
  CustomWiggle: () => import("gsap/CustomWiggle"),
  GSDevTools: () => import("gsap/GSDevTools"),
  InertiaPlugin: () => import("gsap/InertiaPlugin"),
  MorphSVGPlugin: () => import("gsap/MorphSVGPlugin"),
  MotionPathHelper: () => import("gsap/MotionPathHelper"),
  ScrollSmoother: () => import("gsap/ScrollSmoother"),
  SplitText: () => import("gsap/SplitText"),
} as const;

type PluginMap = typeof pluginMap;
type Plugins = keyof PluginMap;

// Resuelve el tipo del modulo para una clave dada y toma el export con el mismo nombre
// Esto permite autocompletado de tipos en el editor
type PluginModule<K extends Plugins> = Awaited<ReturnType<PluginMap[K]>>;
type PluginExport<K extends Plugins> = PluginModule<K>[K & keyof PluginModule<K>];

export default function () {
  // Registrar los plugins GSAP necesarios en este punto
  gsap.registerPlugin(ScrollTrigger);

  /*
    Para carga diferida de plugins poco usados en la app
    (por ejemplo en un par de componentes o en una sola ruta),
    usar este metodo para reducir el bundle inicial
  */
  async function lazyLoadPlugin<K extends Plugins>(plugin: K): Promise<PluginExport<K>> {
    const loader = pluginMap[plugin];
    const m = await loader();
    const p = (m as any)[plugin];
    gsap.registerPlugin(p);
    return p;
  }

  return {
    gsap,
    ScrollTrigger,
    lazyLoadPlugin,
  };
}
```

Uso en componentes con `useGSAP()`:

```javascript
const { gsap, ScrollTrigger, lazyLoadPlugin } = useGSAP();
```

- **`useGSAP()`** entrega acceso tipado a la instancia gsap y al metodo de carga diferida.
- **Cargar por demanda** cualquier plugin poco usado (SplitText, MorphSVG, etc.) para reducir el bundle inicial.
- Usar **gsap.context(scope)** y **onUnmounted con ctx.revert()** en componentes, igual que en Vue 3.

## Acotar selectores

No usar selectores globales que puedan coincidir con elementos fuera del componente actual. Pasar siempre el **scope** (elemento contenedor o ref) como segundo argumento de **gsap.context(callback, scope)** para limitar la busqueda a ese subarbol.

- Correcto: **gsap.context(() => { gsap.to(".box", ...) }, containerRef)** — `.box` solo se busca dentro de `containerRef`.
- Incorrecto: ejecutar **gsap.to(".box", ...)** sin scope de contexto en un componente, porque puede afectar otras instancias o el resto de la pagina.

## Limpieza de ScrollTrigger

Las instancias de ScrollTrigger se crean al usar la config `scrollTrigger` en un tween o timeline, o con **ScrollTrigger.create()**. Quedan **incluidas** en **gsap.context()** y se revierten con **ctx.revert()**. Por lo tanto:

- Crear los ScrollTriggers dentro del mismo callback de **gsap.context()** que se usa para los tweens.
- Llamar a **ScrollTrigger.refresh()** despues de cambios de layout que afecten posiciones (por ejemplo despues de cargar datos); en Vue y Svelte esto suele ser despues de actualizar el DOM (nextTick en Vue, tick en Svelte, o tras carga asincrona).

## Cuando crear y cuando eliminar

| Ciclo de vida         | Accion                                                                                                       |
| --------------------- | ------------------------------------------------------------------------------------------------------------ |
| **Montaje**           | Crear tweens y ScrollTriggers dentro de **gsap.context(scope)**.                                             |
| **Desmontaje**        | Llamar a **ctx.revert()** para eliminar animaciones y ScrollTriggers y revertir estilos en linea.            |

No crear animaciones GSAP en el setup del componente ni en un script sincronico que corre antes de que exista el elemento raiz. Esperar a **onMounted** u **onMount** (o equivalente) para que el ref del contenedor ya este en el DOM.

## Errores comunes

- No crear tweens o ScrollTriggers antes del montaje (por ejemplo en setup sin onMounted); los nodos DOM pueden no existir todavia.
- No usar strings de selector sin **scope**; pasar el contenedor a gsap.context() como segundo argumento.
- No omitir la limpieza; llamar siempre a **ctx.revert()** en onUnmounted o en el retorno de onMount.
- No registrar plugins dentro del cuerpo de un componente que corre en cada render; registrar una vez a nivel de app.

## Referencias oficiales

- Documentacion general GSAP: https://gsap.com/docs/v3/
- Guia GSAP para frameworks (base React, aplica el patron context): https://gsap.com/resources/React
- ScrollTrigger: https://gsap.com/docs/v3/Plugins/ScrollTrigger
- Repositorio oficial de skills GSAP: https://github.com/greensock/gsap-skills
- Guia Vue 3 (Composition API y ciclo de vida): https://vuejs.org/guide/
- Nuxt (composables y plugins): https://nuxt.com/docs
- Svelte (onMount y ciclo de vida): https://svelte.dev/docs/svelte/overview
- SvelteKit (estructura y carga de componentes): https://kit.svelte.dev/docs

## Checklist de verificacion

- [ ] Tweens creados en onMounted u onMount, nunca antes.
- [ ] Selectores acotados con gsap.context y scope a la raiz.
- [ ] ctx.revert en onUnmounted o en limpieza de onMount.
- [ ] Plugins registrados una vez a nivel de app.
- [ ] ScrollTrigger dentro del mismo contexto y refresh tras tick.
- [ ] Carga diferida de plugins poco usados en Nuxt para un bundle pequeno.
- [ ] Sin animaciones en setup sincrono sin DOM listo.
