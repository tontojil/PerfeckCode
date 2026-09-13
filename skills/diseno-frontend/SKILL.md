---
name: diseno-frontend
description: Direccion estetica para paginas distintivas sin look generico de IA. Usalo cuando disenai una landing o UI y queri que no parezca plantilla. (frontend design, UI, anti-slop)
license: Complete terms in LICENSE.txt
---

## Cuando usar
- Creai una página nueva o rediseñai una existente desde cero.
- Definí dirección estética, tipografía y layout.
- Querí evitar el look de plantilla genérica.
- NO la usai si ya hai un DESIGN.md o sistema Stitch definido -> andá a buen-gusto-diseno.

# Diseño Frontend

Trabajá como el líder de diseño de un estudio conocido por darle a cada cliente una identidad visual propia que no se confunde con ninguna otra. Este cliente ya rechazó propuestas que se veían cliché o de plantilla, y está pagando por un punto de vista distintivo: tomá decisiones deliberadas y con opinión sobre paleta, tipografía y layout, específicas para este brief, y tomá riesgos estéticos si se justifican.

## Basá tus diseños en la materia

Si el brief no identifica cuál es el producto o la materia, identificálo vos mismo antes de diseñar, y confirmálo con el cliente. Podí proponer un tema concreto, la audiencia del diseño y el trabajo principal del diseño, como propuesta. Si tení en tu memoria información sobre las preferencias del cliente o contexto sobre lo que está construyendo, usála como pista. La industria, la materia, los materiales y el lenguaje propio del tema son de donde salen las decisiones visuales distintivas — un diseño para un juguete para niñas de 8 a 11 años va a ser estéticamente muy distinto a un dashboard para analistas financieros. Construí con el contenido real y la materia del brief en todo el diseño.

## Principios de diseño

Para diseños web, el hero es lo primero que van a ver los visitantes. Partí con lo más característico del mundo del tema, en el formato más apropiado: un titular, una imagen, una animación, una demo en vivo, un momento interactivo u otros tratamientos. Elegí con intención: un número grande con una etiqueta pequeña, stats de apoyo y un acento en degradado es el tratamiento por defecto, así que usálo solo si de verdad es la mejor opción.

La tipografía lleva la personalidad de la página. No necesitái una tipografía distinta para display o titulares y para el contenido del cuerpo: usá una familia o dos, y si son dos, que se noten claramente distintas.

Elegí tus tipografías con intención, no las familias por defecto que usaríai en cualquier otro proyecto, y definí una escala tipográfica clara siguiendo la guía base de The Elements of Typographic Style con pesos, anchos y espaciados intencionales. Cuando usís el tipo como titular o elemento visual, usá el tratamiento tipográfico mismo como parte activa del diseño, no como un vehículo neutro para entregar el contenido.

Por defecto usá líneas de menos de 80 caracteres. Los serif pueden tener líneas un poco más largas; dale al cuerpo en serif un poco más de interlineado que a un sans-serif.

Evitá estos tratamientos tipográficos por defecto; son las señales más comunes de una página generada:
- Acentuar solo una palabra o frase en un titular, como poner una palabra en itálica/negrita o de otro color.
- Usar mayúsculas completas para etiquetas.
- Agregar etiquetas tipográficas innecesarias sobre el contenido.

La estructura visual es información. Los recursos estructurales como contornos, bordes, numeración, eyebrow, divisores, etiquetas, etc., codifican información útil sobre el contenido en vez de decorarlo. Muchos diseños genéricos usan marcadores numerados (01 / 02 / 03), pero eso solo corresponde si el contenido de verdad es una secuencia — como un proceso por pasos o una línea de tiempo. Antes de agregar marcadores numerados, revisá que el contenido sea realmente una secuencia.

Usá el movimiento no activado por el usuario con moderación y con intención, solo para llamar la atención. Un solo momento orquestado — una secuencia de carga o una aparición — funciona mejor que efectos repartidos por todos lados; las entradas con fade-and-slide-up en cada sección y las transiciones de hover en cada tarjeta son el default genérico y se leen como generado por IA. El movimiento que responde a una acción de la persona (abrir, expandir, confirmar) es bienvenido cuando muestra qué cambió.

Pensá bien el contenido escrito. Muchas veces un brief de diseño puede no traer contenido real, y te toca a ti crear el copy y el contenido placeholder. El copy puede hacer que un diseño se sienta tan de plantilla como el diseño mismo. Revisá la sección de abajo sobre escritura para más guía.

## Proceso: planificá, revisá contra el brief, construí, criticá

Para calibrar, el diseño generado por IA hoy se agrupa en torno a algunos rasgos:
1. un fondo crema cálido (cercano a #F4F1EA) con un display serif de alto contraste y un acento terracota o arcilla cálida (muchas veces cercano a #D97757 — el acento propio de interacción de Claude de Anthropic, así que en un brief de usuario se lee como señal);
2. un fondo casi negro con un solo acento verde ácido brillante o bermellón;
3. un layout estilo broadsheet con reglas finas, border-radius cero y columnas densas como de diario;
4. el kit SaaS-card: contenido picado en tarjetas redondeadas idénticas, un border-radius para todo sin importar jerarquía, la misma sombra gris suave (rgba(0,0,0,.1)) bajo cada una, y lavados en degradado como decoración;
5. chrome de plantilla que aparece sin importar el tema: una etiqueta eyebrow en ALL-CAPS con tracking amplio sobre cada título; meta strings unidos con punto medio ('A · B · C'); etiquetas armadas como 'PALABRA — fragmento' con em dash espaciado; negro casi negro tintado (#0B0B0B, #111) en vez de negro; una cara monospace para etiquetas pequeñas de datos; un '→' pegado al texto de links y botones.

Todos los rasgos son legítimos para algunos briefs, pero son defaults más que decisiones, y aparecen sin importar el tema. Donde el brief fija una dirección visual, seguíla al pie de la letra — las palabras propias del brief siempre ganan, incluso cuando pide uno de estos looks. Donde deja un eje libre, no gastís esa libertad en uno de estos defaults. Como con un diseñador humano contratado, muchas veces hai un equilibrio cuidadoso entre hacer lo que hacís bien y tomar cada proyecto como chance de experimentar y aprender.

Trabajá en dos pasadas. Primero, armá un plan de diseño corto basado en el brief de diseño del cliente: creá un sistema compacto de tokens con color, tipo, layout y principios.
- Color: describí la paleta base central como 4–6 valores hex con nombre.
- Tipo: las tipografías y sus roles.
- Layout: un concepto de layout, usando descripciones en prosa de una frase y wireframes ASCII para idear y comparar. Incluí guía de alineación; el contenido debe ir alineado a la izquierda, centrado, justificado?
- Principios: la guía de alto nivel de qué hace única a esta página.

Después revisá ese plan contra el brief antes de construir: si alguna parte se lee como el default genérico que produciríai para cualquier página parecida (probá con un prompt parecido para ver si llegai a algo similar) en vez de una decisión tomada para este brief específico — corregí esa parte, decí qué cambiaste y por qué. Solo después de confirmar la unicidad relativa de tu plan de diseño empezá a escribir el código, siguiendo el plan revisado.

Cuando escribís el código, tené cuidado con la especificidad de tus selectores CSS. Es fácil generar clases CSS que se anulan entre sí (sobre todo con un selector basado en tipo como .section y un selector basado en elemento como .cta). Esto pasa seguido con padding/margin entre secciones.

## Contención y autocrítica

Gastá tu audacia en un solo lugar. Dejá que un elemento sea lo memorable, mantené todo lo de alrededor callado y disciplinado, y cortá cualquier decoración que no sirva al brief. Construí hasta un piso de calidad sin anunciarlo: responsive hasta móvil, foco de teclado visible, movimiento reducido respetado, visualmente accesible, paletas de color armoniosas. Criticá tu propio trabajo mientras construís, sacando screenshots para revisar si tu entorno lo permite — una imagen vale 1000 tokens. Pensá en el consejo de Chanel: antes de salir de la casa, miráte al espejo y sacáte un accesorio. Los creativos humanos tienen memoria y siempre tratan de hacer algo nuevo, así que si tení un espacio para anotar rápido lo que probaste, te puede servir en futuras pasadas.

## Más sobre escribir en diseño

Las palabras aparecen en un diseño por una razón: hacer más fácil entender y usar. Son contenido de diseño, no decoración. Traé la misma intencionalidad y minimalismo al copywriting que traeríai al espaciado y al color. Antes de escribir cualquier cosa, preguntáte qué necesita decir el diseño, y cómo se puede decir mejor para ayudar a la persona a navegar la experiencia.

Escribí desde la perspectiva del usuario final. Nombrá las cosas por lo que los usuarios van a entender en lenguaje simple, no por cómo está construido el sistema. Un usuario gestiona notificaciones, no webhook config. Describí qué es o qué hace algo en términos simples en vez de venderlo. Ser específico y legible para usuarios nuevos siempre es mejor que ser ingenioso.

Usá la voz activa por defecto. Un CTA dice exactamente qué pasa cuando se usa: "Save changes," no "Submit." Una acción mantiene el mismo nombre en todo el flujo, así el botón que dice "Publish" produce un toast que dice "Published." El vocabulario de una interfaz es la señalización para alguien que navega el producto. La cohesión y la consistencia son como las personas aprenden a moverse.

Tratá el fallo y el vacío como momentos de dirección, no de ánimo. Explicá qué salió mal y cómo arreglarlo, en la voz de la interfaz más que en la de una persona. Los errores no piden disculpas, y nunca son vagos sobre qué pasó. Una pantalla vacía es una invitación a actuar.

Mantené el tono conversacional: verbos simples, sentence case, sin relleno, con tono ajustado a la marca y a la audiencia. Dejá que cada elemento escrito haga exactamente un trabajo.
