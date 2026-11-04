---
name: gsap-linea-tiempo
description: Secuencias de animacion GSAP con timeline, orden, posicion, anidado y control de reproduccion. (GSAP, timeline, sequencing, keyframes)
license: MIT
---

# GSAP Timeline

## Version e instalacion

Version de referencia: **GSAP 3.12**. Instalar con:

```bash
npm install gsap
```

Documentacion oficial: https://gsap.com/docs/v3/
Repositorio: https://github.com/greensock/gsap

## When to Use This Skill

Apply when building multi-step animations, coordinating several tweens in sequence or parallel, or when the user asks about timelines, sequencing, or keyframe-style animation in GSAP.

**Related skills:** For single tweens and eases use **gsap-basico**; for scroll-driven timelines use **gsap-animacion-scroll**; for React use **gsap-react**.

## Creating a Timeline

```javascript
const tl = gsap.timeline();
tl.to(".a", { x: 100, duration: 1 })
  .to(".b", { y: 50, duration: 0.5 })
  .to(".c", { opacity: 0, duration: 0.3 });
```

By default, tweens are **appended** one after another. Use the **position parameter** to place tweens at specific times or relative to other tweens.

## Position Parameter

Third argument (or position property in vars) controls placement:

- **Absolute**: `1` — start at 1 second.
- **Relative (default)**: `"+=0.5"` — 0.5s after end; `"-=0.2"` — 0.2s before end.
- **Label**: `"labelName"` — at that label; `"labelName+=0.3"` — 0.3s after label.
- **Placement**: `"<"` — start when recently-added animation starts; `">"` — start when recently-added animation ends (default); `"<0.2"` — 0.2s after recently-added animation start.

Examples:

```javascript
tl.to(".a", { x: 100 }, 0);           // at 0
tl.to(".b", { y: 50 }, "+=0.5");      // 0.5s after last end
tl.to(".c", { opacity: 0 }, "<");     // same start as previous
tl.to(".d", { scale: 2 }, "<0.2");    // 0.2s after previous start
```

## Timeline Defaults

Pass defaults into the timeline so all child tweens inherit:

```javascript
const tl = gsap.timeline({ defaults: { duration: 0.5, ease: "power2.out" } });
tl.to(".a", { x: 100 }).to(".b", { y: 50 }); // both use 0.5s and power2.out
```

## Timeline Options (constructor)

- **paused: true** — create paused; call `.play()` to start.
- **repeat**, **yoyo** — same as tweens; apply to whole timeline.
- **onComplete**, **onStart**, **onUpdate** — timeline-level callbacks.
- **defaults** — vars merged into every child tween.

## Labels

Add and use labels for readable, maintainable sequencing:

```javascript
tl.addLabel("intro", 0);
tl.to(".a", { x: 100 }, "intro");
tl.addLabel("outro", "+=0.5");
tl.to(".b", { opacity: 0 }, "outro");
tl.play("outro");  // start from "outro"
tl.tweenFromTo("intro", "outro"); // pauses the timeline and returns a new Tween that animates the timeline's playhead from intro to outro with no ease.
```

## Nesting Timelines

Timelines can contain other timelines.

```javascript
const master = gsap.timeline();
const child = gsap.timeline();
child.to(".a", { x: 100 }).to(".b", { y: 50 });
master.add(child, 0);
master.to(".c", { opacity: 0 }, "+=0.2");
```

## Ejemplo minimo completo (GSAP 3.12)

Requiere `npm install gsap`.

`index.html`:

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>GSAP 3.12 timeline minimo</title>
  <style>
    .a, .b, .c { width: 80px; height: 80px; margin: 8px; border-radius: 12px; }
    .a { background: #0ea5e9; }
    .b { background: #22c55e; }
    .c { background: #f59e0b; }
  </style>
</head>
<body>
  <div class="a"></div>
  <div class="b"></div>
  <div class="c"></div>
  <script type="module" src="./timeline.js"></script>
</body>
</html>
```

`timeline.js`:

```javascript
import { gsap } from "gsap";

const tl = gsap.timeline({ defaults: { duration: 0.5, ease: "power2.out" } });

tl.addLabel("inicio", 0);
tl.to(".a", { x: 200 }, "inicio");
tl.to(".b", { x: 200 }, "<0.15");
tl.to(".c", { x: 200 }, "-=0.2");
```

Verificacion: las tres cajas se desplazan a la derecha en secuencia solapada, con duracion y easing compartidos. Sin errores en consola.

## Controlling Playback

- **tl.play()** / **tl.pause()**
- **tl.reverse()** / **tl.progress(1)** then **tl.reverse()**
- **tl.restart()** — from start.
- **tl.time(2)** — seek to 2 seconds.
- **tl.progress(0.5)** — seek to 50%.
- **tl.kill()** — kill timeline and (by default) its children.

## Official GSAP Best practices

- ✅ Prefer timelines for sequencing
- ✅ Use the **position parameter** (third argument) to place tweens at specific times or relative to labels.
- ✅ Add **labels** with `addLabel()` for readable, maintainable sequencing.
- ✅ Pass **defaults** into the timeline constructor so child tweens inherit duration, ease, etc.
- ✅ Put ScrollTrigger on the timeline (or top-level tween), not on tweens inside a timeline.

## Do Not

- ❌ Chain animations with **delay** when a **timeline** can sequence them; prefer `gsap.timeline()` and the position parameter for multi-step animation.
- ❌ Forget to pass **defaults** (e.g. `defaults: { duration: 0.5, ease: "power2.out" }`) when many child tweens share the same duration or ease.
- ❌ Forget that **duration** on the timeline constructor is not the same as tween duration; timeline “duration” is determined by its children.
- ❌ Nest animations that contain a ScrollTrigger; ScrollTriggers should only be on top-level Tweens/Timelines.

---

## Anexo 2026 - Referencias oficiales y checklist

Fuentes oficiales:

- GSAP docs v3: https://gsap.com/docs/v3/
- GSAP Timeline: https://www.gsap.com/docs/v3/
- Timeline scrollTrigger: https://gsap.com/docs/v3/GSAP/Timeline/scrollTrigger
- GSAP skills: https://github.com/greensock/gsap-skills
- React GSAP: https://gsap.com/resources/React

Repos famosos:

- https://github.com/greensock/gsap
- https://github.com/greensock/gsap-skills
- https://github.com/facebook/react
- https://github.com/vercel/next.js

Checklist:

- [ ] Secuencias con timeline y position parameter, no delay.
- [ ] Labels con addLabel para navegacion y tweenFromTo.
- [ ] defaults con duration y ease compartidos.
- [ ] Timelines anidados con add en posicion explicita.
- [ ] ScrollTrigger solo en top-level, nunca anidado.
- [ ] Control de playback probado: play, pause, reverse, progress.
- [ ] Duracion del timeline derivada de hijos, no seteada manual.
