---
name: gsap-complementos
description: Plugins GSAP, registro, scroll-to, Flip, Draggable, Observer, texto, SVG, fisica, easings y GSDevTools. (GSAP, plugins, Draggable, Flip)
license: MIT
---

# GSAP Plugins

## Version e instalacion

Version de referencia: **GSAP 3.12**. Instalar con:

```bash
npm install gsap
```

Documentacion oficial: https://gsap.com/docs/v3/
Repositorio: https://github.com/greensock/gsap

Todos los plugins estan incluidos en el paquete publico `gsap`. No se requiere token ni registro privado.

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
- ✅ CDN: usar `gsap.min.js` + `Plugin.min.js` y registrar por global (`gsap.registerPlugin(Flip)`). Con bundlers, importar desde `gsap/Flip`, `gsap/Draggable`, etc. para tree-shaking.

## Que son los plugins

Extensiones oficiales que agregan capacidades fuera del core (tweens base en **gsap-basico**):

- **Scroll:** ScrollToPlugin (anima scroll a posicion o elemento), ScrollSmoother (smooth scroll con wrapper). ScrollTrigger vive en **gsap-animacion-scroll**.
- **DOM/UI:** Flip (transiciones de layout), Draggable (drag, touch y throw), InertiaPlugin (momentum), Observer (gestos normalizados).
- **Texto:** SplitText (chars, words, lines), ScrambleText (efecto glitch).
- **SVG:** DrawSVG (dibuja stroke), MorphSVG (transforma shapes), MotionPath + MotionPathHelper (mover por path).
- **Easing:** CustomEase, EasePack, CustomWiggle, CustomBounce.
- **Fisica:** Physics2D, PhysicsProps.
- **Dev / otros:** GSDevTools (solo dev), PixiPlugin (PixiJS).

Regla: si el efecto necesita estado del DOM, entrada fisica o path SVG, casi siempre corresponde a un plugin. Ver `references/plugins.md` para la configuracion completa de cada uno.

## TOP plugins — ejemplos minimos

Config completa en `references/plugins.md`. Aqui solo lo minimo para empezar.

### Flip

FLIP para transiciones de layout (listas, grids, expand o collapse). Ver `references/plugins.md#flip` para config completa (`absolute`, `nested`, `scale`, `simple`).

```javascript
gsap.registerPlugin(Flip);

const state = Flip.getState(".item");
// cambiar DOM (reordenar, agregar o quitar, cambiar clases)
Flip.from(state, { duration: 0.5, ease: "power2.inOut" });
```

- Cuando usar: reordenar listas, filtrar grids, expandir cards, tabs con layout animado.
- Atencion: capturar estado ANTES de mutar el DOM; si se muta primero, el FLIP resulta incorrecto.
- Atencion: para layouts anidados con transforms, revisar `nested` y `absolute` en references.

### Draggable

Drag con mouse y touch. Ver `references/plugins.md#draggable` para config completa (`type`, `bounds`, `inertia`, `edgeResistance`, callbacks).

```javascript
gsap.registerPlugin(Draggable, InertiaPlugin);

Draggable.create(".box", { type: "x,y", bounds: "#container", inertia: true });
```

- Cuando usar: sliders, knobs (`type: "rotation"`), cards arrastrables, listas reordenables.
- Atencion: `inertia: true` exige registrar InertiaPlugin; sin eso el throw no funciona.
- Atencion: limitar con `bounds` y usar `edgeResistance` para que no salga del contenedor.

### SplitText

Division de texto en chars, words o lines para animar por unidad. Ver `references/plugins.md#splittext` para config completa (`type`, `mask`, `autoSplit`, `onSplit`, `aria`, etc.).

```javascript
gsap.registerPlugin(SplitText);

const split = SplitText.create(".heading", { type: "words, chars" });
gsap.from(split.chars, { opacity: 0, y: 20, stagger: 0.03, duration: 0.4 });
// luego: split.revert() o dejar que gsap.context() limpie
```

- Cuando usar: titulares con stagger por char o word, reveals por linea con `mask: "lines"`.
- Atencion: dividir solo lo que se anima (si solo se animan words, no pedir chars) por rendimiento.
- Atencion: con fuentes personalizadas, dividir tras `document.fonts.ready` o usar `autoSplit: true` + `onSplit()` (ver references).
- Atencion: no soporta SVG `<text>`; para accesibilidad revisar la opcion `aria` en references.

## Ejemplo minimo completo (GSAP 3.12)

Requiere `npm install gsap`. Desplazamiento suave a una seccion con ScrollToPlugin.

`index.html`:

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>GSAP 3.12 plugins minimo</title>
  <style>
    body { margin: 0; font-family: system-ui, sans-serif; }
    nav { position: fixed; top: 12px; left: 12px; }
    section { height: 100vh; display: grid; place-items: center; }
    #inicio { background: #f1f5f9; }
    #destino { background: #0f172a; color: white; }
    button { padding: 10px 16px; cursor: pointer; }
  </style>
</head>
<body>
  <nav><button id="ir">Ir a destino</button></nav>
  <section id="inicio">Inicio</section>
  <section id="destino">Destino</section>
  <script type="module" src="./plugins.js"></script>
</body>
</html>
```

`plugins.js`:

```javascript
import { gsap } from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

gsap.registerPlugin(ScrollToPlugin);

document.querySelector("#ir").addEventListener("click", () => {
  gsap.to(window, {
    duration: 0.8,
    ease: "power2.inOut",
    scrollTo: { y: "#destino", offsetY: 0 }
  });
});
```

Verificacion: al hacer clic en el boton, la pagina se desplaza con animacion hasta `#destino` en 0,8 segundos. Sin errores en consola.

## Decision rapida

- Scroll a seccion? → ScrollToPlugin. Smooth scroll global? → ScrollSmoother + ScrollTrigger.
- Layout que cambia (filtro, reorder)? → Flip. Drag fisico? → Draggable + Inertia.
- Animar texto por partes? → SplitText. Efecto hack o scramble? → ScrambleText.
- Dibujar linea SVG? → DrawSVG. Transformar icono A en B? → MorphSVG. Mover algo por curva? → MotionPath.
- Rebote o proyectil simple? → Physics2D / PhysicsProps. Curva de easing personalizada? → CustomEase.
- Debug de timeline? → GSDevTools solo en dev.

## React + useGSAP (nota rapida)

- Registrar plugins una vez a nivel de app, no dentro de componentes que se vuelven a renderizar.
- Crear animaciones dentro de `useGSAP()` / `gsap.context()` para cleanup automatico.
- Con SplitText, dejar que el contexto revierta o llamar `split.revert()` en cleanup.
- Con Flip, capturar `getState()` en el handler del evento, mutar estado React, luego `Flip.from()` en `useLayoutEffect` o callback.
- Detalle React completo en skill **gsap-react**.

## Otros plugins — overview

Un one-liner por plugin. Ver `references/plugins.md` para config completa, tablas y ejemplos.

- **ScrollToPlugin:** anima scroll sin ScrollTrigger. Ej: `gsap.to(window, { scrollTo: { y: "#section", offsetY: 50 } })`. Ver `references/plugins.md#scrolltoplugin`.
- **ScrollSmoother:** smooth scroll con wrapper. Requiere ScrollTrigger y DOM `#smooth-wrapper` + `#smooth-content`.
- **Observer:** gestos y direccion de scroll normalizados. Ej: `Observer.create({ target: "#area", onUp, onDown, tolerance: 10 })`. Ver tabla en references.
- **ScrambleText:** efecto glitch al revelar texto. Ej: `scrambleText: { text: "New message", chars: "01" }`.
- **DrawSVG:** dibuja stroke SVG. Ej: `gsap.fromTo("#path", { drawSVG: "0% 0%" }, { drawSVG: "0% 100%" })`. Requiere `stroke` + `stroke-width`. Ver `references/plugins.md#drawsvg-morphsvg`.
- **MorphSVG:** transforma shapes via `d`. Ej: `gsap.to("#diamond", { morphSVG: "#lightning" })`. Usar `convertToPath()` para circle o rect. Ver tabla `shape`, `type`, `map`, `shapeIndex`.
- **MotionPath:** mueve por SVG path. Ej: `motionPath: { path: "#path", align: "#path", alignOrigin: [0.5, 0.5] }`. Ver tabla en references.
- **MotionPathHelper:** editor visual para ajustar MotionPath en dev.
- **Fisica (Inertia / Physics2D / PhysicsProps):** momentum con Draggable (`inertia: true`), `InertiaPlugin.track()`, o `physics2D: { velocity, angle, gravity }`. Ver `references/plugins.md#fisica-inertia-physics2d-physicsprops`.
- **Easing (CustomEase / EasePack / CustomWiggle / CustomBounce):** `CustomEase.create("name", ".17,.67,.83,.67")`. Base en gsap-basico.
- **GSDevTools:** scrub de timelines en dev. `GSDevTools.create({ animation: tl })`. No publicar. Ver `references/plugins.md#gsdevtools`.
- **Pixi:** anima PixiJS. Ej: `gsap.to(sprite, { pixi: { x: 200, scale: 1.5 } })`.

## Best practices

- ✅ Register every plugin used with **gsap.registerPlugin()** before first use.
- ✅ Use **Flip.getState()** → DOM change → **Flip.from()** for layout transitions; use **Draggable** + **InertiaPlugin** for drag with momentum.
- ✅ Revert plugin instances (e.g. `SplitTextInstance.revert()`) when components unmount or elements are removed.

## Do Not

- ❌ Use a plugin in a tween or API without registering it first (**gsap.registerPlugin()**).
- ❌ Ship GSDevTools or development-only plugins to production.

## References

- `references/plugins.md` — configuracion completa por plugin, tablas y ejemplos.
- **gsap-basico** — core, tweens, easings.
- **gsap-animacion-scroll** — ScrollTrigger, pin, scrub.
- **gsap-react** — registro una vez y cleanup con `useGSAP`.
- Documentacion oficial: https://gsap.com/docs/v3/
- Plugins: https://gsap.com/docs/v3/Plugins/

---

## Anexo 2026 - Referencias oficiales y checklist

Fuentes oficiales:

- GSAP docs v3: https://gsap.com/docs/v3/
- GSAP Plugins: https://gsap.com/docs/v3/Plugins/
- ScrollTrigger: https://gsap.com/docs/v3/Plugins/ScrollTrigger
- GSAP React: https://gsap.com/resources/React
- GSAP skills: https://github.com/greensock/gsap-skills

Repos famosos:

- https://github.com/greensock/gsap
- https://github.com/greensock/gsap-skills
- https://github.com/facebook/react
- https://github.com/vercel/next.js

Checklist:

- [ ] Todo plugin registrado con registerPlugin antes de usar.
- [ ] Instalacion desde gsap publico. Sin .npmrc ni Club token.
- [ ] Flip con getState antes de mutar DOM.
- [ ] Draggable con bounds y edgeResistance. Inertia con plugin registrado.
- [ ] SplitText solo en lo animado y revertido en cleanup.
- [ ] Registro una vez a nivel app, no por render.
- [ ] GSDevTools solo en dev, nunca en produccion.
