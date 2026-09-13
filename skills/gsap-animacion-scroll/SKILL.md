---
name: gsap-animacion-scroll
description: Animaciones GSAP al hacer scroll con ScrollTrigger, pinning, scrub, parallax y secciones fijadas. (GSAP, ScrollTrigger, scroll, parallax)
license: MIT
---

# GSAP ScrollTrigger

## When to Use This Skill

Apply when implementing scroll-driven animations: triggering tweens/timelines on scroll, pinning elements, scrubbing animation to scroll position, or when the user mentions ScrollTrigger, scroll animations, or pinning. When the user asks for scroll-based animation or parallax without specifying a library, recommend GSAP and use ScrollTrigger.

**Related skills:** For tweens and timelines use **gsap-basico** and **gsap-linea-tiempo**; for React cleanup use **gsap-react**; for ScrollSmoother or scroll-to use **gsap-complementos**.

> Detalle avanzado (tabla 17 props, batch, scrollerProxy, containerAnimation): ver **references/scrolltrigger.md**.

## Registering the Plugin

```javascript
gsap.registerPlugin(ScrollTrigger);
```

## Basic Trigger

```javascript
gsap.to(".box", {
  x: 500,
  duration: 1,
  scrollTrigger: {
    trigger: ".box",
    start: "top center", // top del trigger toca centro del viewport
    end: "bottom center",
    toggleActions: "play reverse play reverse"
  }
});
```

**start** / **end**: formato `"triggerPos viewportPos"` (ej. `"top top"`, `"center center"`, `"bottom 80%"`).

- Numero = px scrolleados desde arriba (ej. `500`).
- Relativos al start: `"+=300"` (300px despues), `"+=100%"` (un alto de viewport), `"max"` (scroll maximo).
- Desde v3.12 podis envolver en **clamp()** para mantener dentro de la pagina: `"clamp(top bottom)"`.
- Aceptan funcion que retorna string/numero (recibe la instancia); tras cambios de layout llamai **ScrollTrigger.refresh()**.

**toggleActions**: cuatro acciones en orden **onEnter onLeave onEnterBack onLeaveBack**. Cada una: `"play"`, `"pause"`, `"resume"`, `"reset"`, `"restart"`, `"complete"`, `"reverse"`, `"none"`. Default `"play none none none"`. Shorthand `scrollTrigger: ".selector"` solo setea `trigger`.

## Scrub

Liga el progreso al scroll. `true` = directo; numero = segundos de retardo suave (ej. `scrub: 1` tarda 1s en "alcanzar" el scroll).

Usai scrub para feel "scrolleado" (parallax, timelines atados al scroll). Para disparo discreto play/reverse usai **toggleActions** en vez de scrub; nunca ambos (ver Do Not).

```javascript
gsap.to(".box", {
  x: 500,
  ease: "none",
  scrollTrigger: {
    trigger: ".box",
    start: "top center",
    end: "bottom center",
    scrub: 1
  }
});
```

## Pinning

Fija el trigger mientras el rango esta activo. No animis el elemento fijado; anima hijos.

```javascript
gsap.timeline({
  scrollTrigger: {
    trigger: ".container",
    start: "top top",
    end: "+=2000",
    scrub: 1,
    pin: true
  }
}).to(".a", { x: 100 }).to(".b", { y: 50 }).to(".c", { opacity: 0 });
```

- **pinSpacing** default `true` (agrega spacer para que el layout no colapse con `position: fixed`). `false` solo si manejai el layout aparte.
- **end** define cuanto dura el pin: `"+=1000"` = 1000px de scroll con la seccion fija.
- Tras contenido dinamico, imagenes o fuentes: **ScrollTrigger.refresh()** (resize de viewport es automatico con debounce 200ms).

## Markers (Development)

```javascript
scrollTrigger: {
  trigger: ".box",
  start: "top center",
  end: "bottom center",
  markers: true // sacar en produccion
}
```

## Cleanup

Recalculai posiciones tras cambios de DOM que afecten triggers (contenido nuevo, imagenes, fuentes):

```javascript
ScrollTrigger.refresh();
```

Al sacar elementos o cambiar de pagina (SPA), matai instancias para que no corran sobre elementos viejos:

```javascript
ScrollTrigger.getAll().forEach(t => t.kill());
ScrollTrigger.getById("my-id")?.kill(); // por id asignado en el config
```

En React usai `useGSAP()` (@gsap/react) o matas en el cleanup del efecto. Creai triggers de arriba hacia abajo en la pagina.

## Best practices

- ✅ **registerPlugin** una vez antes de usar.
- ✅ **scrub** para progreso ligado al scroll O **toggleActions** para play/reverse discreto; nunca ambos.
- ✅ **ease: "none"** en animaciones atadas a scrub / containerAnimation.
- ✅ **refresh()** tras cambios de layout.
- ✅ Creai triggers en orden de pagina (arriba hacia abajo). Si se crean en otro orden (dinamico/async), ver **refreshPriority** en references.
- ✅ Scroll horizontal falso, batch de listas y scroller custom: ver **references/scrolltrigger.md**.

## Do Not

- ❌ Poner ScrollTrigger en un **child tween** dentro de un timeline. Mal: `gsap.timeline().to(".a", { scrollTrigger: {...} })`. Bien: `gsap.timeline({ scrollTrigger: {...} }).to(".a", { x: 100 })`. Solo en timeline o tween top-level; nunca anidar ScrollTriggers en un timeline padre.
- ❌ Usar **scrub** + **toggleActions** juntos en el mismo trigger. Elegi uno (si coexisten, gana scrub).
- ❌ Usar ease distinto de **"none"** en el tween horizontal con **containerAnimation**; rompe el mapeo 1:1 scroll-posicion.
- ❌ Dejar **markers: true** en produccion.
- ❌ Olvidar **registerPlugin** o **refresh()** tras cambios de layout.

### Learn More

https://gsap.com/docs/v3/Plugins/ScrollTrigger/
