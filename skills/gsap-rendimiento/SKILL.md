---
name: gsap-rendimiento
description: Optimizacion de animaciones GSAP para 60fps fluidos, con transforms, will-change y batching, sin jank. (GSAP, performance, FPS, 60fps)
license: MIT
---

# GSAP Performance

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
will-change: transform;
```

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

---

## Anexo 2026 - Referencias oficiales y checklist

Fuentes oficiales:

- GSAP docs: https://www.gsap.com/docs/v3/
- ScrollTrigger: https://gsap.com/docs/v3/Plugins/ScrollTrigger
- GSAP React: https://gsap.com/resources/React
- GSAP skills: https://github.com/greensock/gsap-skills

Repos famosos:

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
