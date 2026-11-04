---
name: gsap-rendimiento
description: Optimizacion de animaciones GSAP para 60fps fluidos, con transforms, will-change y batching, sin jank. (GSAP, performance, FPS, 60fps)
license: MIT
---

# GSAP Performance

## Version e instalacion

Version de referencia: **GSAP 3.12**. Instalar con:

```bash
npm install gsap
```

Documentacion oficial: https://gsap.com/docs/v3/
Repositorio: https://github.com/greensock/gsap

Las pautas de esta skill aplican a cualquier proyecto GSAP 3.12, con o sin plugins.

## When to Use This Skill

Apply when optimizing GSAP animations for smooth 60fps, reducing layout/paint cost, or when the user asks about performance, jank, or best practices for fast animations.

**Related skills:** Build animations with **gsap-basico** (transforms, autoAlpha) and **gsap-linea-tiempo**; for ScrollTrigger performance see **gsap-animacion-scroll**.

## Prefer Transform and Opacity

Animating **transform** (`x`, `y`, `scaleX`, `scaleY`, `rotation`, `rotationX`, `rotationY`, `skewX`, `skewY`) and **opacity** keeps work on the compositor and avoids layout and most paint. Avoid animating layout-heavy properties when a transform can achieve the same effect.

- ✅ Prefer: **x**, **y**, **scale**, **rotation**, **opacity**.
- ❌ Avoid when possible: **width**, **height**, **top**, **left**, **margin**, **padding** (they trigger layout and can cause jank).

GSAP’s **x** and **y** use transforms (translate) by default; use them instead of **left**/**top** for movement.

## will-change

Use **will-change** in CSS on elements that will animate. It hints the browser to promote the layer.

```css
.animar {
  will-change: transform;
}
```

Retirar despues de animar (ver seccion "will-change: Only While Animating").

## Batch Reads and Writes

GSAP batches updates internally. When mixing GSAP with direct DOM reads/writes or layout-dependent code, avoid interleaving reads and writes in a way that causes repeated layout thrashing. Prefer doing all reads first, then all writes (or let GSAP handle the writes in one go).

## Many Elements (Stagger, Lists)

- Use **stagger** instead of many separate tweens with manual delays when the animation is the same; it’s more efficient.
- For long lists, consider **virtualization** or animating only visible items; avoid creating hundreds of simultaneous tweens if it causes jank.
- Reuse timelines where possible; avoid creating new timelines every frame.

## Frequently updated properties (e.g. mouse followers)

Prefer **gsap.quickTo()** for properties that are updated often (e.g. mouse-follower x/y). It reuses a single tween instead of creating new tweens on each update.

```javascript
let xTo = gsap.quickTo("#id", "x", { duration: 0.4, ease: "power3" }),
    yTo = gsap.quickTo("#id", "y", { duration: 0.4, ease: "power3" });

document.querySelector("#container").addEventListener("mousemove", (e) => {
  xTo(e.pageX);
  yTo(e.pageY);
});
```

## Ejemplo minimo completo (GSAP 3.12)

Requiere `npm install gsap`. Compara animar con `x` (compositor) y usa `quickTo` para un follower con buena respuesta.

`index.html`:

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>GSAP 3.12 rendimiento minimo</title>
  <style>
    body { margin: 0; font-family: system-ui, sans-serif; }
    #area { height: 80vh; background: #f1f5f9; position: relative; overflow: hidden; }
    #punto { width: 40px; height: 40px; border-radius: 50%; background: #0ea5e9; will-change: transform; }
    .grid { display: grid; grid-template-columns: repeat(10, 40px); gap: 8px; padding: 16px; }
    .celda { width: 40px; height: 40px; background: #22c55e; border-radius: 8px; }
  </style>
</head>
<body>
  <div id="area"><div id="punto"></div></div>
  <div class="grid"></div>
  <script type="module" src="./perf.js"></script>
</body>
</html>
```

`perf.js`:

```javascript
import { gsap } from "gsap";

// Follower eficiente: un solo tween reutilizado.
const xTo = gsap.quickTo("#punto", "x", { duration: 0.4, ease: "power3" });
const yTo = gsap.quickTo("#punto", "y", { duration: 0.4, ease: "power3" });

document.querySelector("#area").addEventListener("mousemove", (e) => {
  const rect = e.currentTarget.getBoundingClientRect();
  xTo(e.clientX - rect.left);
  yTo(e.clientY - rect.top);
});

// Stagger con transform y opacity, no con width o top.
const grid = document.querySelector(".grid");
for (let i = 0; i < 40; i++) {
  const div = document.createElement("div");
  div.className = "celda";
  grid.appendChild(div);
}

gsap.from(".celda", {
  y: 20,
  autoAlpha: 0,
  duration: 0.4,
  ease: "power2.out",
  stagger: 0.02
});
```

Verificacion: el punto sigue el mouse sin saltos y las 40 celdas entran con stagger fluido. El medidor de FPS (ver abajo) se mantiene estable cerca de 60. Sin errores en consola.

## ScrollTrigger and Performance

- **pin: true** promotes the pinned element; pin only what’s needed.
- **scrub** with a small value (e.g. `scrub: 1`) can reduce work during scroll; test on low-end devices.
- Call **ScrollTrigger.refresh()** only when layout actually changes (e.g. after content load), not on every resize; debounce when possible.

## Reduce Simultaneous Work

- Pause or kill off-screen or inactive animations when they’re not visible (e.g. when the user navigates away).
- Avoid animating huge numbers of properties on many elements at once; simplify or sequence if needed.

## Property Cost Table

| Property | Pipeline stage | Animate? |
|----------|----------------|----------|
| `width`, `height` | layout | NO, triggers reflow |
| `top`, `left`, `margin`, `padding` | layout | NO, triggers reflow |
| `color`, `background`, `box-shadow`, `border-radius` | paint | Avoid in continuous animation |
| `transform` (`x`, `y`, `scale`, `rotation`) | composite | YES, stays on compositor |
| `opacity` | composite | YES, stays on compositor |

Rule: if you can do it with `x`/`y`/`scale`/`opacity`, never use `width`/`height`/`top`/`left`.

## FPS Meter

Use this snippet to check if an animation holds 60fps before optimizing blindly.

```javascript
let frames = 0, last = performance.now();
function fpsMeter(now) {
  frames++;
  if (now - last >= 1000) {
    console.log("fps:", frames);
    frames = 0;
    last = now;
  }
  requestAnimationFrame(fpsMeter);
}
requestAnimationFrame(fpsMeter);
```

Aim for a stable 60 (or the display refresh rate). Drops during a tween point to layout/paint properties or too many simultaneous tweens.

## ScrollTrigger.refresh() With Debounce

Never call `refresh()` on every resize or DOM mutation. Debounce it and call only when layout actually changes (fonts loaded, content injected, filters applied).

```javascript
let refreshTimer;
function debouncedRefresh(delay = 200) {
  clearTimeout(refreshTimer);
  refreshTimer = setTimeout(() => ScrollTrigger.refresh(), delay);
}

window.addEventListener("resize", () => debouncedRefresh(200));
document.fonts?.ready.then(() => ScrollTrigger.refresh());
```

## will-change: Only While Animating

Set `will-change` right before the animation starts and remove it in `onComplete`. Leaving it on wastes GPU memory and can slow the page.

```javascript
gsap.set(".card", { willChange: "transform" });
gsap.to(".card", {
  x: 200,
  duration: 0.6,
  ease: "power3.out",
  onComplete: () => gsap.set(".card", { clearProps: "willChange" }),
});
```

Same rule applies to `force3D`: let GSAP handle it, do not force it globally "just in case".

## Best practices

- ✅ Animate **transform** and **opacity**; use **will-change** in CSS only on elements that animate.
- ✅ Use **stagger** instead of many separate tweens with manual delays when the animation is the same.
- ✅ Use **gsap.quickTo()** for frequently updated properties (e.g. mouse followers).
- ✅ Clean up or kill off-screen animations; call **ScrollTrigger.refresh()** when layout changes, debounced when possible.

## Do Not

- ❌ Animate **width**/ **height**/ **top**/ **left** for movement when **x**/ **y**/ **scale** can achieve the same look.
- ❌ Set **will-change** or **force3D** on every element “just in case”; use for elements that are actually animating.
- ❌ Create hundreds of overlapping tweens or ScrollTriggers without testing on low-end devices.
- ❌ Ignore cleanup; stray tweens and ScrollTriggers keep running and can hurt performance and correctness.

## References

- **gsap-basico** — transforms, autoAlpha, stagger.
- **gsap-linea-tiempo** — reutilizar timelines en vez de crear uno por frame.
- **gsap-animacion-scroll** — pin, scrub y refresh con debounce.
- Documentacion oficial: https://gsap.com/docs/v3/
- ScrollTrigger: https://gsap.com/docs/v3/Plugins/ScrollTrigger

---

## Anexo 2026 - Referencias oficiales y checklist

Fuentes oficiales:

- GSAP docs v3: https://gsap.com/docs/v3/
- GSAP docs home: https://www.gsap.com/docs/v3/
- ScrollTrigger: https://gsap.com/docs/v3/Plugins/ScrollTrigger
- GSAP React: https://gsap.com/resources/React
- GSAP skills: https://github.com/greensock/gsap-skills

Repos famosos:

- https://github.com/greensock/gsap
- https://github.com/greensock/gsap-skills
- https://github.com/facebook/react
- https://github.com/vercel/next.js

Checklist:

- [ ] Solo transform y opacity en animacion continua.
- [ ] will-change solo mientras anima, luego clearProps.
- [ ] Stagger en vez de cientos de tweens manuales.
- [ ] quickTo para mouse followers y updates frecuentes.
- [ ] ScrollTrigger.refresh solo con cambio real de layout y con debounce.
- [ ] Animaciones off-screen pausadas o eliminadas.
- [ ] FPS medido con meter. Objetivo 60 estables en dispositivo medio.
