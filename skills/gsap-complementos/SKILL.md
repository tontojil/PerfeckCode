---
name: gsap-complementos
description: Plugins GSAP, registro, scroll-to, Flip, Draggable, Observer, texto, SVG, fisica, easings y GSDevTools. (GSAP, plugins, Draggable, Flip)
license: MIT
---

# GSAP Plugins

## When to Use This Skill

Apply when using or reviewing code that uses GSAP plugins: registering plugins, scroll-to, flip/FLIP animations, draggable elements, SVG (DrawSVG, MorphSVG, MotionPath), text (SplitText, ScrambleText), physics, easing plugins (CustomEase, EasePack, CustomWiggle, CustomBounce), or GSDevTools. ScrollTrigger has its own skill (gsap-animacion-scroll).

**Related skills:** For core tweens use **gsap-basico**; for ScrollTrigger use **gsap-animacion-scroll**; for React use **gsap-react**.

## Licensing & Install (important)

Every GSAP plugin is **free**, including for commercial use. Since [Webflow's acquisition of GSAP](https://gsap.com/blog/webflow-GSAP/), Club GSAP is no longer a paid tier and **no plugin requires a membership, license key, or auth token** — this includes formerly Club-only plugins (**SplitText**, **MorphSVG**, etc.).

- ✅ Install everything from the public `gsap` npm package: `npm install gsap`. All plugins are included — import them as `gsap/SplitText`, `gsap/MorphSVGPlugin`, etc.
- ❌ Do **not** generate an `.npmrc` with a GreenSock auth token, suggest the private `npm.greensock.com` registry, or tell users to sign up for Club GSAP to access a plugin. Those instructions are outdated.

## Registering Plugins

Register each plugin once so GSAP (and bundlers) know to include it. Use **gsap.registerPlugin()** with every plugin used in the project:

```javascript
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { Flip } from "gsap/Flip";
import { Draggable } from "gsap/Draggable";

gsap.registerPlugin(ScrollToPlugin, Flip, Draggable);
```

- ✅ Register before using the plugin in any tween or API call.
- ✅ In React, register at top level or once in the app (e.g. before first useGSAP); do not register inside a component that re-renders. useGSAP is a plugin that needs to be registered before use.
- ✅ CDN: usa `gsap.min.js` + `Plugin.min.js` y registra por global (`gsap.registerPlugin(Flip)`). Con bundlers, importa desde `gsap/Flip`, `gsap/Draggable`, etc. para tree-shaking.

## Que son los plugins

Extensiones oficiales que agregan capacidades fuera del core (tweens base en **gsap-basico**):

- **Scroll:** ScrollToPlugin (anima scroll a posicion/elemento), ScrollSmoother (smooth scroll con wrapper). ScrollTrigger vive en **gsap-animacion-scroll**.
- **DOM/UI:** Flip (transiciones de layout), Draggable (drag/touch/throw), InertiaPlugin (momentum), Observer (gestos normalizados).
- **Texto:** SplitText (chars/words/lines), ScrambleText (efecto glitch).
- **SVG:** DrawSVG (dibuja stroke), MorphSVG (morfea shapes), MotionPath + MotionPathHelper (mover por path).
- **Easing:** CustomEase, EasePack, CustomWiggle, CustomBounce.
- **Fisica:** Physics2D, PhysicsProps.
- **Dev / otros:** GSDevTools (solo dev), PixiPlugin (PixiJS).

Regla: si el efecto necesita DOM-state, input fisico o path SVG, casi seguro es un plugin. Ver `references/plugins.md` para config completa de cada uno.

## TOP plugins — ejemplos minimos

Config completa en `references/plugins.md`. Aqui solo lo minimo para arrancar.

### Flip

FLIP para transiciones de layout (listas, grids, expand/collapse). Ver `references/plugins.md#flip` para config completa (`absolute`, `nested`, `scale`, `simple`).

```javascript
gsap.registerPlugin(Flip);

const state = Flip.getState(".item");
// change DOM (reorder, add/remove, change classes)
Flip.from(state, { duration: 0.5, ease: "power2.inOut" });
```

- Cuando usar: reordenar listas, filtrar grids, expandir cards, tabs con layout animado.
- Ojo: captura estado ANTES de mutar DOM; si mutai primero, el FLIP sale mal.
- Ojo: para layouts anidados con transforms, revisa `nested` y `absolute` en references.

### Draggable

Drag con mouse/touch. Ver `references/plugins.md#draggable` para config completa (`type`, `bounds`, `inertia`, `edgeResistance`, callbacks).

```javascript
gsap.registerPlugin(Draggable, InertiaPlugin);

Draggable.create(".box", { type: "x,y", bounds: "#container", inertia: true });
```

- Cuando usar: sliders, knobs (`type: "rotation"`), cards arrastrables, listas reordenables.
- Ojo: `inertia: true` exige registrar InertiaPlugin; sin eso el throw no anda.
- Ojo: limita con `bounds` y usa `edgeResistance` para que no se escape del container.

### SplitText

Split de texto en chars/words/lines para animar por unidad. Ver `references/plugins.md#splittext` para config completa (`type`, `mask`, `autoSplit`, `onSplit`, `aria`, etc.).

```javascript
gsap.registerPlugin(SplitText);

const split = SplitText.create(".heading", { type: "words, chars" });
gsap.from(split.chars, { opacity: 0, y: 20, stagger: 0.03, duration: 0.4 });
// later: split.revert() o deja que gsap.context() limpie
```

- Cuando usar: headlines con stagger por char/word, reveals por linea con `mask: "lines"`.
- Ojo: splitea solo lo que animai (si solo animas words, no pidas chars) por performance.
- Ojo: con custom fonts, splitea tras `document.fonts.ready` o usa `autoSplit: true` + `onSplit()` (ver references).
- Ojo: no soporta SVG `<text>`; para accesibilidad revisa opcion `aria` en references.

## Decision rapida

- Necesitai scroll a seccion? → ScrollToPlugin. Smooth scroll global? → ScrollSmoother + ScrollTrigger.
- Layout que cambia (filtro, reorder)? → Flip. Drag fisico? → Draggable + Inertia.
- Animar texto por partes? → SplitText. Efecto hack/scramble? → ScrambleText.
- Dibujar linea SVG? → DrawSVG. Transformar icono A en B? → MorphSVG. Mover algo por curva? → MotionPath.
- Rebote/proyectil simple? → Physics2D / PhysicsProps. Curva de easing custom? → CustomEase.
- Debug de timeline? → GSDevTools solo en dev.

## React + useGSAP (nota rapida)

- Registra plugins una vez a nivel app, no dentro de componentes que re-renderizan.
- Crea animaciones dentro de `useGSAP()` / `gsap.context()` para cleanup automatico.
- Con SplitText, deja que el contexto revierta o llama `split.revert()` en cleanup.
- Con Flip, captura `getState()` en el handler del evento, muta estado React, luego `Flip.from()` en `useLayoutEffect` o callback.
- Detalle React completo en skill **gsap-react**.

## Otros plugins — overview

Un one-liner por plugin. Ver `references/plugins.md` para config completa, tablas y ejemplos.

- **ScrollToPlugin:** anima scroll sin ScrollTrigger. Ej: `gsap.to(window, { scrollTo: { y: "#section", offsetY: 50 } })`. Ver `references/plugins.md#scrolltoplugin`.
- **ScrollSmoother:** smooth scroll con wrapper. Requiere ScrollTrigger y DOM `#smooth-wrapper` + `#smooth-content`.
- **Observer:** gestos y scroll-direction normalizados. Ej: `Observer.create({ target: "#area", onUp, onDown, tolerance: 10 })`. Ver tabla en references.
- **ScrambleText:** efecto glitch al revelar texto. Ej: `scrambleText: { text: "New message", chars: "01" }`.
- **DrawSVG:** dibuja stroke SVG. Ej: `gsap.fromTo("#path", { drawSVG: "0% 0%" }, { drawSVG: "0% 100%" })`. Requiere `stroke` + `stroke-width`. Ver `references/plugins.md#drawsvg-morphsvg`.
- **MorphSVG:** morfea shapes via `d`. Ej: `gsap.to("#diamond", { morphSVG: "#lightning" })`. Usa `convertToPath()` para circle/rect. Ver tabla `shape`, `type`, `map`, `shapeIndex`.
- **MotionPath:** mueve por SVG path. Ej: `motionPath: { path: "#path", align: "#path", alignOrigin: [0.5, 0.5] }`. Ver tabla en references.
- **MotionPathHelper:** editor visual para tunear MotionPath en dev.
- **Fisica (Inertia / Physics2D / PhysicsProps):** momentum con Draggable (`inertia: true`), `InertiaPlugin.track()`, o `physics2D: { velocity, angle, gravity }`. Ver `references/plugins.md#fisica-inertia-physics2d-physicsprops`.
- **Easing (CustomEase / EasePack / CustomWiggle / CustomBounce):** `CustomEase.create("name", ".17,.67,.83,.67")`. Base en gsap-basico.
- **GSDevTools:** scrub timelines en dev. `GSDevTools.create({ animation: tl })`. No shippear. Ver `references/plugins.md#gsdevtools`.
- **Pixi:** anima PixiJS. Ej: `gsap.to(sprite, { pixi: { x: 200, scale: 1.5 } })`.

## Best practices

- ✅ Register every plugin used with **gsap.registerPlugin()** before first use.
- ✅ Use **Flip.getState()** → DOM change → **Flip.from()** for layout transitions; use **Draggable** + **InertiaPlugin** for drag with momentum.
- ✅ Revert plugin instances (e.g. `SplitTextInstance.revert()`) when components unmount or elements are removed.

## Do Not

- ❌ Use a plugin in a tween or API without registering it first (**gsap.registerPlugin()**).
- ❌ Ship GSDevTools or development-only plugins to production.

### Learn More

https://gsap.com/docs/v3/Plugins/
