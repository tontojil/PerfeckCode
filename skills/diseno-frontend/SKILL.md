---
name: diseno-frontend
description: "Direccion estetica para paginas distintivas sin look generico de IA. Usela cuando disene una landing o UI y quiera que no parezca plantilla. (frontend design, UI, anti-slop)"
license: Complete terms in LICENSE.txt
---

## Cuando usar
- Cree una página nueva o rediseñe una existente desde cero.
- Defina dirección estética, tipografía y layout.
- Quiere evitar el look de plantilla genérica.
- NO la use si ya hay un DESIGN.md o sistema Stitch definido -> vaya a buen-gusto-diseno.

# Diseño Frontend

Trabaje como el líder de diseño de un estudio conocido por darle a cada cliente una identidad visual propia que no se confunde con ninguna otra. Este cliente ya rechazó propuestas que se veían cliché o de plantilla, y está pagando por un punto de vista distintivo: tome decisiones deliberadas y con opinión sobre paleta, tipografía y layout, específicas para este brief, y tome riesgos estéticos si se justifican.

## Base sus diseños en la materia

Si el brief no identifica cuál es el producto o la materia, identifíquelo usted mismo antes de diseñar, y confírmelo con el cliente. Puede proponer un tema concreto, la audiencia del diseño y el trabajo principal del diseño, como propuesta. Si tiene en su memoria información sobre las preferencias del cliente o contexto sobre lo que está construyendo, úsela como pista. La industria, la materia, los materiales y el lenguaje propio del tema son de donde salen las decisiones visuales distintivas — un diseño para un juguete para niñas de 8 a 11 años va a ser estéticamente muy distinto a un dashboard para analistas financieros. Construya con el contenido real y la materia del brief en todo el diseño.

## Principios de diseño

Para diseños web, el hero es lo primero que van a ver los visitantes. Parta con lo más característico del mundo del tema, en el formato más apropiado: un titular, una imagen, una animación, una demo en vivo, un momento interactivo u otros tratamientos. Elija con intención: un número grande con una etiqueta pequeña, stats de apoyo y un acento en degradado es el tratamiento por defecto, así que úselo solo si de verdad es la mejor opción.

La tipografía lleva la personalidad de la página. No necesita una tipografía distinta para display o titulares y para el contenido del cuerpo: use una familia o dos, y si son dos, que se noten claramente distintas.

Elija sus tipografías con intención, no las familias por defecto que usaría en cualquier otro proyecto, y defina una escala tipográfica clara siguiendo la guía base de The Elements of Typographic Style con pesos, anchos y espaciados intencionales. Cuando usa el tipo como titular o elemento visual, use el tratamiento tipográfico mismo como parte activa del diseño, no como un vehículo neutro para entregar el contenido.

Por defecto use líneas de menos de 80 caracteres. Los serif pueden tener líneas un poco más largas; dé al cuerpo en serif un poco más de interlineado que a un sans-serif.

Evite estos tratamientos tipográficos por defecto; son las señales más comunes de una página generada:
- Acentuar solo una palabra o frase en un titular, como poner una palabra en itálica/negrita o de otro color.
- Usar mayúsculas completas para etiquetas.
- Agregar etiquetas tipográficas innecesarias sobre el contenido.

La estructura visual es información. Los recursos estructurales como contornos, bordes, numeración, eyebrow, divisores, etiquetas, etc., codifican información útil sobre el contenido en vez de decorarlo. Muchos diseños genéricos usan marcadores numerados (01 / 02 / 03), pero eso solo corresponde si el contenido de verdad es una secuencia — como un proceso por pasos o una línea de tiempo. Antes de agregar marcadores numerados, revise que el contenido sea realmente una secuencia.

Use el movimiento no activado por el usuario con moderación y con intención, solo para llamar la atención. Un solo momento orquestado — una secuencia de carga o una aparición — funciona mejor que efectos repartidos por todos lados; las entradas con fade-and-slide-up en cada sección y las transiciones de hover en cada tarjeta son el default genérico y se leen como generado por IA. El movimiento que responde a una acción de la persona (abrir, expandir, confirmar) es bienvenido cuando muestra qué cambió.

Piense bien el contenido escrito. Muchas veces un brief de diseño puede no traer contenido real, y le corresponde a usted crear el copy y el contenido placeholder. El copy puede hacer que un diseño se sienta tan de plantilla como el diseño mismo. Revise la sección de abajo sobre escritura para más guía.

## Proceso: planifique, revise contra el brief, construya, critique

Para calibrar, el diseño generado por IA hoy se agrupa en torno a algunos rasgos:
1. un fondo crema cálido (cercano a #F4F1EA) con un display serif de alto contraste y un acento terracota o arcilla cálida (muchas veces cercano a #D97757 — el acento propio de interacción de Claude de Anthropic, así que en un brief de usuario se lee como señal);
2. un fondo casi negro con un solo acento verde ácido brillante o bermellón;
3. un layout estilo broadsheet con reglas finas, border-radius cero y columnas densas como de diario;
4. el kit SaaS-card: contenido picado en tarjetas redondeadas idénticas, un border-radius para todo sin importar jerarquía, la misma sombra gris suave (rgba(0,0,0,.1)) bajo cada una, y lavados en degradado como decoración;
5. chrome de plantilla que aparece sin importar el tema: una etiqueta eyebrow en ALL-CAPS con tracking amplio sobre cada título; meta strings unidos con punto medio ('A · B · C'); etiquetas armadas como 'PALABRA — fragmento' con em dash espaciado; negro casi negro tintado (#0B0B0B, #111) en vez de negro; una cara monospace para etiquetas pequeñas de datos; un '→' pegado al texto de links y botones.

Todos los rasgos son legítimos para algunos briefs, pero son defaults más que decisiones, y aparecen sin importar el tema. Donde el brief fija una dirección visual, sígala al pie de la letra — las palabras propias del brief siempre ganan, incluso cuando pide uno de estos looks. Donde deja un eje libre, no gaste esa libertad en uno de estos defaults. Como con un diseñador humano contratado, muchas veces hay un equilibrio cuidadoso entre hacer lo que hace bien y tomar cada proyecto como chance de experimentar y aprender.

Trabaje en dos pasadas. Primero, arme un plan de diseño corto basado en el brief de diseño del cliente: cree un sistema compacto de tokens con color, tipo, layout y principios.
- Color: describa la paleta base central como 4–6 valores hex con nombre.
- Tipo: las tipografías y sus roles.
- Layout: un concepto de layout, usando descripciones en prosa de una frase y wireframes ASCII para idear y comparar. Incluya guía de alineación; el contenido debe ir alineado a la izquierda, centrado, justificado?
- Principios: la guía de alto nivel de qué hace única a esta página.

Después revise ese plan contra el brief antes de construir: si alguna parte se lee como el default genérico que produciría para cualquier página parecida (pruebe con un prompt parecido para ver si llega a algo similar) en vez de una decisión tomada para este brief específico — corrija esa parte, diga qué cambió y por qué. Solo después de confirmar la unicidad relativa de su plan de diseño empiece a escribir el código, siguiendo el plan revisado.

Cuando escribe el código, tenga cuidado con la especificidad de sus selectores CSS. Es fácil generar clases CSS que se anulan entre sí (sobre todo con un selector basado en tipo como .section y un selector basado en elemento como .cta). Esto pasa seguido con padding/margin entre secciones.

## Contención y autocrítica

Gaste su audacia en un solo lugar. Deje que un elemento sea lo memorable, mantenga todo lo de alrededor callado y disciplinado, y corte cualquier decoración que no sirva al brief. Construya hasta un piso de calidad sin anunciarlo: responsive hasta móvil, foco de teclado visible, movimiento reducido respetado, visualmente accesible, paletas de color armoniosas. Critique su propio trabajo mientras construye, sacando screenshots para revisar si su entorno lo permite — una imagen vale 1000 tokens. Piense en el consejo de Chanel: antes de salir de la casa, mírese al espejo y quítese un accesorio. Los creativos humanos tienen memoria y siempre tratan de hacer algo nuevo, así que si tiene un espacio para anotar rápido lo que probó, le puede servir en futuras pasadas.

## Más sobre escribir en diseño

Las palabras aparecen en un diseño por una razón: hacer más fácil entender y usar. Son contenido de diseño, no decoración. Traiga la misma intencionalidad y minimalismo al copywriting que traería al espaciado y al color. Antes de escribir cualquier cosa, pregúntese qué necesita decir el diseño, y cómo se puede decir mejor para ayudar a la persona a navegar la experiencia.

Escriba desde la perspectiva del usuario final. Nombre las cosas por lo que los usuarios van a entender en lenguaje simple, no por cómo está construido el sistema. Un usuario gestiona notificaciones, no webhook config. Describa qué es o qué hace algo en términos simples en vez de venderlo. Ser específico y legible para usuarios nuevos siempre es mejor que ser ingenioso.

Use la voz activa por defecto. Un CTA dice exactamente qué pasa cuando se usa: "Save changes," no "Submit." Una acción mantiene el mismo nombre en todo el flujo, así el botón que dice "Publish" produce un toast que dice "Published." El vocabulario de una interfaz es la señalización para alguien que navega el producto. La cohesión y la consistencia son como las personas aprenden a moverse.

Trate el fallo y el vacío como momentos de dirección, no de ánimo. Explique qué salió mal y cómo arreglarlo, en la voz de la interfaz más que en la de una persona. Los errores no piden disculpas, y nunca son vagos sobre qué pasó. Una pantalla vacía es una invitación a actuar.

Mantenga el tono conversacional: verbos simples, sentence case, sin relleno, con tono ajustado a la marca y a la audiencia. Deje que cada elemento escrito haga exactamente un trabajo.

---

## Tokens base con CSS

Defina estos tokens antes de escribir componentes. Use escala 4/8pt para espaciado y tipografia fluida con `clamp()`.

```css
:root {
  /* Color: fondo claro con texto oscuro para contraste mayor a 7:1 */
  --color-fondo: #ffffff;
  --color-superficie: #f4f4f5;
  --color-texto: #1a1a1a;
  --color-texto-secundario: #404040;
  --color-primario: #1849a9;
  --color-primario-texto: #ffffff;
  --color-borde: #d4d4d4;
  --color-foco: #1a73e8;

  /* Tipografia: una familia para titulares y una para cuerpo */
  --fuente-titular: "Sora", system-ui, sans-serif;
  --fuente-cuerpo: "Inter", system-ui, sans-serif;

  /* Escala fluida: minimo legible de 16px en cuerpo */
  --texto-display: clamp(2.5rem, 1.8rem + 4vw, 4rem);
  --texto-h1: clamp(2rem, 1.5rem + 2.5vw, 3rem);
  --texto-h2: clamp(1.5rem, 1.25rem + 1.5vw, 2rem);
  --texto-cuerpo: clamp(1rem, 0.95rem + 0.25vw, 1.125rem);
  --texto-pequeno: 0.875rem;

  /* Espaciado en escala 4/8pt, sin valores arbitrarios */
  --espacio-1: 4px;
  --espacio-2: 8px;
  --espacio-3: 12px;
  --espacio-4: 16px;
  --espacio-6: 24px;
  --espacio-8: 32px;
  --espacio-12: 48px;
  --espacio-16: 64px;

  --radio-sm: 8px;
  --radio-md: 12px;
  --radio-lg: 16px;
}
```

Reglas de uso:

- Limite la paleta a 4 o 6 valores hex con nombre y rol definido.
- Verifique contraste 4.5:1 en texto normal y 3:1 en texto grande e interfaz.
- Mantenga el cuerpo en 16px o mas y lineas de menos de 80 caracteres.
- Use solo multiplos de 4px para margenes, rellenos y separaciones.

## Ejemplo HTML/CSS accesible

Este ejemplo cumple contraste 4.5:1, incluye foco visible y respeta `prefers-reduced-motion`.

```html
<main class="hero">
  <p class="hero-etiqueta">Guia de uso del producto</p>
  <h1 class="hero-titulo">Un titular claro para este brief especifico</h1>
  <p class="hero-texto">Texto de apoyo con una sola idea y una accion siguiente.</p>
  <a class="boton" href="#empezar">Empezar ahora</a>
</main>
```

```css
.hero {
  background: var(--color-fondo);
  color: var(--color-texto);
  padding: var(--espacio-16) var(--espacio-8);
  max-width: 72ch;
}

.hero-titulo {
  font-family: var(--fuente-titular);
  font-size: var(--texto-h1);
  line-height: 1.1;
  margin: 0 0 var(--espacio-4) 0;
}

.hero-texto {
  font-family: var(--fuente-cuerpo);
  font-size: var(--texto-cuerpo);
  line-height: 1.6;
  color: var(--color-texto);
  margin: 0 0 var(--espacio-6) 0;
}

/* Contraste: blanco #ffffff sobre azul #1849a9, relacion 8.6:1 */
.boton {
  display: inline-block;
  background: var(--color-primario);
  color: var(--color-primario-texto);
  padding: var(--espacio-3) var(--espacio-6);
  border-radius: var(--radio-md);
  font-size: var(--texto-cuerpo);
  text-decoration: none;
  transition: transform 200ms ease, background 200ms ease;
}

.boton:hover {
  transform: translateY(-1px);
}

/* Foco visible con anillo de 3px y desplazamiento */
.boton:focus-visible,
a:focus-visible,
button:focus-visible {
  outline: 3px solid var(--color-foco);
  outline-offset: 3px;
  border-radius: 4px;
}

/* Movimiento reducido: desactiva transiciones y animaciones */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

## Referencias oficiales

- Material 3: https://m3.material.io/
- Apple HIG: https://developer.apple.com/design/
- WCAG: https://www.w3.org/WAI/
- Sistemas de diseno curados: https://github.com/alexpate/awesome-design-systems — lista curada de sistemas de diseno para referencia.

## Checklist de verificacion

- [ ] Plan de tokens con 4 a 6 hex, tipos y layout antes de codificar.
- [ ] Tipografia fluida con `clamp()`. Cuerpo minimo 16px.
- [ ] Espaciado en escala 4/8pt. Sin valores arbitrarios.
- [ ] Contraste 4.5:1 en texto y 3:1 en texto grande e interfaz, verificado.
- [ ] Foco visible con `:focus-visible` en enlaces, botones e inputs.
- [ ] `prefers-reduced-motion` implementado para animaciones y transiciones.
- [ ] Un elemento memorable. Resto disciplinado y sin decoracion extra.
- [ ] Copy especifico: errores con solucion, estados vacios con accion.
- [ ] Responsive en movil sin desplazamiento horizontal.
