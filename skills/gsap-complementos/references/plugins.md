# GSAP Plugins — Referencia detallada

Catalogo de config completa para plugins GSAP. El SKILL.md trae solo ejemplos minimos de Flip, Draggable y SplitText. Para todo lo demas, esta es la fuente.

## ScrollToPlugin

Anima scroll (window o elemento scrolleable). Sin ScrollTrigger.

```javascript
gsap.to(window, { duration: 1, scrollTo: { y: 500 } });
gsap.to(window, { duration: 1, scrollTo: { y: "#section", offsetY: 50 } });
gsap.to(scrollContainer, { duration: 1, scrollTo: { x: "max" } });
```

**ScrollToPlugin — key config (scrollTo object):**

| Option | Description |
|--------|-------------|
| `x`, `y` | Target scroll position (number), o `"max"` para maximo |
| `element` | Selector o elemento para scroll-into-view |
| `offsetX`, `offsetY` | Offset en pixeles desde el target |

### ScrollSmoother

Smooth scroll wrapper (momentum). Requiere ScrollTrigger y estructura DOM con wrapper + content:

```html
<body>
  <div id="smooth-wrapper">
    <div id="smooth-content">
      <!--- ALL YOUR CONTENT HERE --->
    </div>
  </div>
  <!-- position: fixed elements can go outside -->
</body>
```

Ver docs GSAP para setup. Registrar despues de ScrollTrigger.

## Flip

FLIP: First, Last, Invert, Play. Captura estado con `Flip.getState()`, muta DOM, anima con `Flip.from()`.

```javascript
const state = Flip.getState(".item");
// change DOM (reorder, add/remove, change classes)
Flip.from(state, { duration: 0.5, ease: "power2.inOut" });
```

**Flip — key config (Flip.from vars):**

| Option | Description |
|--------|-------------|
| `absolute` | Usa `position: absolute` durante el flip (default: `false`) |
| `nested` | Cuando true, solo mide primer nivel de hijos (mejor para nested transforms) |
| `scale` | Cuando true, escala elementos para encajar (evita stretch); default `true` |
| `simple` | Cuando true, solo anima posicion/escala (mas rapido, menos preciso) |
| `duration`, `ease` | Standard tween options |

Mas info: https://gsap.com/docs/v3/Plugins/Flip

## Draggable

Drag con mouse/touch, spinnable, throwable. Sliders, cards, listas reordenables.

```javascript
Draggable.create(".box", { type: "x,y", bounds: "#container", inertia: true });
Draggable.create(".knob", { type: "rotation" });
```

**Draggable — key config options:**

| Option | Description |
|--------|-------------|
| `type` | `"x"`, `"y"`, `"x,y"`, `"rotation"`, `"scroll"` |
| `bounds` | Elemento, selector, o `{ minX, maxX, minY, maxY }` para constreñir drag |
| `inertia` | `true` para throw/momentum (requiere InertiaPlugin) |
| `edgeResistance` | 0-1; resistencia al arrastrar fuera de bounds |
| `cursor` | CSS cursor durante drag |
| `onDragStart`, `onDrag`, `onDragEnd` | Callbacks; reciben event y target |
| `onThrowUpdate`, `onThrowComplete` | Callbacks cuando inertia esta activa |

## Observer

Normaliza pointer y scroll input cross-device. Para swipe, scroll direction o gestos custom sin atarse a scroll position como ScrollTrigger.

```javascript
Observer.create({
  target: "#area",
  onUp: () => {},
  onDown: () => {},
  onLeft: () => {},
  onRight: () => {},
  tolerance: 10
});
```

**Observer — key config options:**

| Option | Description |
|--------|-------------|
| `target` | Elemento o selector a observar |
| `onUp`, `onDown`, `onLeft`, `onRight` | Callbacks cuando swipe/scroll pasa tolerance en esa direccion |
| `tolerance` | Pixeles antes de detectar direccion; default 10 |
| `type` | `"touch"`, `"pointer"`, o `"wheel"` (default: `"touch,pointer"`) |

## SplitText

Parte texto en chars, words y/o lines (cada uno en su propio elemento) para animar por unidad. Retorna instancia con **chars**, **words**, **lines** (y **masks** cuando `mask` esta seteado). Revertir con **revert()** o dejar que **gsap.context()** revierta. Integra con **gsap.context()**, **matchMedia()** y **useGSAP()**. API: **SplitText.create(target, vars)**.

```javascript
const split = SplitText.create(".heading", { type: "words, chars" });
gsap.from(split.chars, { opacity: 0, y: 20, stagger: 0.03, duration: 0.4 });
// later: split.revert() o deja que gsap.context() limpie
```

Con **onSplit()** (v3.13.0+), las animaciones corren en cada split y re-split cuando se usa **autoSplit**; retornar tween/timeline desde **onSplit()** permite a SplitText limpiar y sincronizar progreso en re-split:

```javascript
SplitText.create(".split", {
  type: "lines",
  autoSplit: true,
  onSplit(self) {
    return gsap.from(self.lines, { y: 100, opacity: 0, stagger: 0.05, duration: 0.5 });
  }
});
```

**SplitText — key config (SplitText.create vars):**

| Option | Description |
|--------|-------------|
| **type** | Comma-separated: `"chars"`, `"words"`, `"lines"`. Default `"chars,words,lines"`. Solo splitea lo necesario (ej. `"words, chars"` si no usas lines) por performance. Evita chars-only sin words/lines o usa **smartWrap: true** para evitar cortes raros. |
| **charsClass**, **wordsClass**, **linesClass** | CSS class en cada elemento spliteado. Append `"++"` para clase incrementada (ej. `linesClass: "line++"` → `line1`, `line2`, …). |
| **aria** | `"auto"` (default), `"hidden"`, o `"none"`. `"auto"` agrega `aria-label` en el elemento spliteado y `aria-hidden` en line/word/char para que screen readers lean el label; `"hidden"` oculta todo; `"none"` deja aria intacto. Usa `"none"` mas duplicado screen-reader-only si links/semantica anidada deben exponerse. |
| **autoSplit** | Cuando `true`, revierte y re-splitea cuando cargan fonts o cambia el ancho (y hay lines), evitando line breaks erroneos. **Animaciones deben crearse dentro de onSplit()**; **retorna** la animacion para cleanup y time-sync automatico. |
| **onSplit(self)** | Callback al completar split (y en cada re-split si **autoSplit** es `true`). Recibe la instancia SplitText. Retornar tween o timeline habilita revert/sync automatico al re-splitear. |
| **mask** | `"lines"`, `"words"`, o `"chars"`. Envuelve cada unidad en extra con `overflow: clip` para efectos mask/reveal. Solo un tipo; wrappers en **masks** (o clase `-mask` si hay clase seteada). |
| **tag** | Tag del wrapper; default `"div"`. Usa `"span"` para inline (ojo: transforms como rotation/scale pueden no renderizar en inline en algunos browsers). |
| **deepSlice** | Cuando `true` (default), subdivide elementos anidados (ej. `<strong>`) que cruzan multiples lines para que lines no se estiren verticalmente. Solo aplica con lines. |
| **ignore** | Selector o elemento(s) a dejar sin splitear (ej. `ignore: "sup"`). |
| **smartWrap** | Con **chars** only, envuelve words en span `white-space: nowrap` para evitar cortes mid-word. Ignorado si words o lines estan spliteadas. Default `false`. |
| **wordDelimiter** | Limite de palabra: string (default `" "`), RegExp, o `{ delimiter: RegExp, replaceWith: string }` para splits custom (ej. zero-width joiner para hashtags, o no-Latin). |
| **prepareText(text, parent)** | Funcion que recibe texto crudo y parent; retorna texto modificado antes de splitear (ej. para insertar break markers en idiomas sin espacios). |
| **propIndex** | Cuando `true`, agrega CSS variable con indice en cada elemento (ej. `--word: 1`, `--char: 2`). |
| **reduceWhiteSpace** | Colapsa espacios consecutivos; default `true`. Desde v3.13.0 honra line breaks y puede insertar `<br>` para `<pre>`. |
| **onRevert** | Callback cuando la instancia revierte. |

**Tips:** Splitea solo lo que animai (ej. salta chars si solo animas words). Para custom fonts, splitea despues de que carguen (ej. `document.fonts.ready.then(...)`) o usa **autoSplit: true** con **onSplit()**. Para evitar kerning shift en chars, usa CSS `font-kerning: none; text-rendering: optimizeSpeed;`. Evita `text-wrap: balance`; interfiere con split. SplitText no soporta SVG `<text>`.

Learn more: https://gsap.com/docs/v3/Plugins/SplitText/

### ScrambleText

Efecto scramble/glitch al revelar o transicionar texto.

```javascript
gsap.to(".text", {
  duration: 1,
  scrambleText: { text: "New message", chars: "01", revealDelay: 0.5 }
});
```

## DrawSVG / MorphSVG

### DrawSVG (DrawSVGPlugin)

Revela u oculta stroke de SVG animando `stroke-dashoffset` / `stroke-dasharray`. Funciona en `<path>`, `<line>`, `<polyline>`, `<polygon>`, `<rect>`, `<ellipse>`.

**drawSVG value:** Describe el **segmento visible** del stroke (start y end), no "anima de A a B en el tiempo". Formato: `"start end"` en percent o length. Ejemplos: `"0% 100%"` = stroke completo; `"20% 80%"` = stroke solo entre 20% y 80% (gaps en ambos extremos). El tween anima desde el segmento **actual** al segmento **target** — ej. `gsap.to("#path", { drawSVG: "0% 100%" })` va de lo actual a full stroke. Single value (ej. `0`, `"100%"`) significa start 0: `"100%"` equivale a `"0% 100%"`.

**Requerido:** El elemento debe tener stroke visible — setea `stroke` y `stroke-width` en CSS o atributos SVG; si no, nada se dibuja.

```javascript
// draw de nada a full stroke
gsap.from("#path", { duration: 1, drawSVG: 0 });
// segmento explicito: de 0-0 a 0-100%
gsap.fromTo("#path", { drawSVG: "0% 0%" }, { drawSVG: "0% 100%", duration: 1 });
// stroke solo al medio (gaps en extremos)
gsap.to("#path", { duration: 1, drawSVG: "20% 80%" });
```

**Caveats:** Solo afecta stroke (no fill). Prefiere `<path>` single-segment; multi-segment puede renderizar raro en algunos browsers. Contenido de `<use>` no se puede cambiar visualmente. **DrawSVGPlugin.getLength(element)** y **DrawSVGPlugin.getPosition(element)** retornan largo del stroke y posicion actual.

Learn more: https://gsap.com/docs/v3/Plugins/DrawSVGPlugin

### MorphSVG (MorphSVGPlugin)

Morfea una forma SVG en otra animando el atributo `d`. Start y end no necesitan mismo numero de puntos — MorphSVG convierte a cubic beziers y agrega puntos segun necesidad. Para morphs icono-a-icono, transiciones de forma o animaciones path-based. Funciona en `<path>`, `<polyline>` y `<polygon>`; `<circle>`, `<rect>`, `<ellipse>` y `<line>` se convierten internamente o via **MorphSVGPlugin.convertToPath(selector | element)** (reemplaza el elemento en el DOM con un `<path>`).

**morphSVG value:** Puede ser **selector** (ej. `"#lightning"`), **elemento**, **raw path data** (ej. `"M47.1,0.8 73.3,0.8..."`), o para polygon/polyline un **points string** (ej. `"240,220 240,70 70,70 70,220"`). Para config completa usa **object form** con **shape** como unica propiedad requerida.

```javascript
// convertir primitivas a path primero si hace falta:
MorphSVGPlugin.convertToPath("circle, rect, ellipse, line");

gsap.to("#diamond", { duration: 1, morphSVG: "#lightning", ease: "power2.inOut" });
// object form:
gsap.to("#diamond", {
  duration: 1,
  morphSVG: { shape: "#lightning", type: "rotational", shapeIndex: 2 }
});
```

**MorphSVG — key config (morphSVG object):**

| Option | Description |
|--------|-------------|
| **shape** | _(Requerido.)_ Target shape: selector, elemento, o raw path string. |
| **type** | `"linear"` (default) o `"rotational"`. Rotational usa interpolacion angulo/largo y puede evitar kinks mid-morph; probalo cuando linear se ve mal. |
| **map** | Como se matchean segmentos: `"size"` (default), `"position"`, o `"complexity"`. Usalo cuando segmentos start/end no alinean; si ninguno funciona, divide en multiples paths y morfea cada uno. |
| **shapeIndex** | Offset que punto del start mapea al primer punto del end (evita "crossing over" o inversion). Numero para single-segment; **array** para multi-segment (ej. `[5, 1, -8]`). Negativo revierte ese segmento. Usa **shapeIndex: "log"** una vez para loggear el valor auto-calculado, luego pega el numero/array en el tween. **findShapeIndex(start, end)** provee UI interactiva para encontrar buen valor. Solo aplica a closed paths. |
| **smooth** | (v3.14+). Agrega smoothing points. Numero (ej. `80`), `"auto"`, u objeto: `{ points: 40 \| "auto", redraw: true \| false, persist: true \| false }`. `redraw: false` mantiene anchors originales (fidelidad perfecta, menos spacing parejo). `persist: false` remueve puntos agregados al terminar el tween. Usalo cuando el morph default se ve jagged o antinatural. |
| **curveMode** | Boolean (v3.14+). Interpola angulo/largo de control-handles en vez de x/y crudo para evitar kinks en curvas. Pruebalo si hay kink mid-morph. |
| **origin** | Rotation origin para **type: "rotational"**. String: `"50% 50%"` (default) o `"20% 60%, 35% 90%"` para distintos origins start/end. |
| **precision** | Decimales para output path data; default `2`. |
| **precompile** | Array de path strings precomputados (o usa **precompile: "log"** una vez, copia desde consola). Salta calculos caros de startup; usalo para morphs muy complejos. Solo para `<path>` (convierte polygon/polyline primero). |
| **render** | Function(rawPath, target) llamada cada update — ej. dibujar a canvas. RawPath es array de segmentos (cada segmento = array de coords cubic bezier x,y alternadas). |
| **updateTarget** | Al usar **render** (ej. solo canvas), setea **updateTarget: false** para que el `<path>` original no se actualice. **MorphSVGPlugin.defaultUpdateTarget** setea default. |

**Utilities:** **MorphSVGPlugin.convertToPath(selector | element)** convierte circle/rect/ellipse/line/polygon/polyline a `<path>` en el DOM. **MorphSVGPlugin.rawPathToString(rawPath)** y **stringToRawPath(d)** convierten entre path strings y raw arrays. El plugin guarda el `d` original en el target (ej. para volver atras: `morphSVG: "#originalId"` o el mismo elemento).

**Tips:** Para morphs torcidos o invertidos, setea **shapeIndex** (usa `"log"` o findShapeIndex()). Para multi-segment paths, **shapeIndex** es array (un valor por segmento). Precompile solo cuando el primer frame es lento; no arregla jank durante el tween (simplifica el SVG o reduce tamaño si hace falta).

Learn more: https://gsap.com/docs/v3/Plugins/MorphSVGPlugin

## MotionPath

Anima un elemento a lo largo de un SVG path. Para mover objetos por curvas o rutas custom.

```javascript
gsap.to(".dot", {
  duration: 2,
  motionPath: { path: "#path", align: "#path", alignOrigin: [0.5, 0.5] }
});
```

**MotionPath — key config (motionPath object):**

| Option | Description |
|--------|-------------|
| `path` | SVG path element, selector, o path data string |
| `align` | Path element o selector para alinear el target |
| `alignOrigin` | `[x, y]` origin (0-1); default `[0.5, 0.5]` |
| `autoRotate` | Rota el elemento para seguir la tangente del path |
| `curviness` | 0-2; suavizado del path |

### MotionPathHelper

Editor visual para MotionPath (alignment, offset). Usalo en desarrollo para tunear alineacion.

```javascript
const helper = MotionPathHelper.create(".dot", "#path", { end: 0.5 });
// ajusta en UI, luego usa helper.path o helper.getProgress() en tu animacion
```

## Fisica — Inertia / Physics2D / PhysicsProps

### Inertia (InertiaPlugin)

Momentum despues de release con Draggable, o trackea inertia/velocity de cualquier propiedad de cualquier objeto para luego glide a stop con un tween simple.

```javascript
Draggable.create(".box", { type: "x,y", inertia: true });

// track velocity:
InertiaPlugin.track(".box", "x");
// continua velocity actual y glide a stop:
gsap.to(obj, { inertia: { x: "auto" } });
```

Requiere registro junto a Draggable cuando usas `inertia: true`.

### Physics2D (Physics2DPlugin)

Fisica 2D simple (velocity, angle, gravity). Para proyectiles, rebotes.

```javascript
gsap.to(".ball", {
  duration: 2,
  physics2D: {
    velocity: 250,
    angle: 80,
    gravity: 500
  }
});
```

### PhysicsProps (PhysicsPropsPlugin)

Fisica aplicada a valores de propiedades.

```javascript
gsap.to(".obj", {
  duration: 2,
  physicsProps: {
    x: { velocity: 100, end: 300 },
    y: { velocity: -50, acceleration: 200 }
  }
});
```

## Easing — CustomEase / EasePack / CustomWiggle / CustomBounce

- **CustomEase:** curvas custom (cubic-bezier o SVG path). Uso base en gsap-basico.
```javascript
const ease = CustomEase.create("name", ".17,.67,.83,.67");
gsap.to(".el", { x: 100, ease: ease, duration: 1 });
```
- **EasePack:** mas eases con nombre (SlowMo, RoughEase, ExpoScaleEase). Registra y usa los nombres en tweens.
- **CustomWiggle:** easing wiggle/shake (multiples oscilaciones).
- **CustomBounce:** easing bounce con strength configurable.

## GSDevTools

UI para scrub timelines, togglear animaciones y debuggear. Solo desarrollo; no shippear.

```javascript
GSDevTools.create({ animation: tl });
```

## Pixi (PixiPlugin)

Integra GSAP con PixiJS para animar display objects de Pixi.

```javascript
const sprite = new PIXI.Sprite(texture);
gsap.to(sprite, { pixi: { x: 200, y: 100, scale: 1.5 }, duration: 1 });
```
