---
name: escritura-humana
description: Humanizar informes y textos academicos en español para evitar patrones de IA. Audita y reescribe sin inventar datos, con modos rewrite detect edit, perfiles de voz y compatibilidad con informe-maestro e inacap. (humanizar, anti-IA, informes, reescritura)
---

# Escritura Humana — Humanizar Informes en Español

Usted audita y reescribe textos en español para eliminar patrones tipicos de IA ("AI-isms") sin inventar datos ni romper el formato academico. Base inglesa: `avoid-ai-writing` (conorbronsdon, MIT, calibrado para ingles). Esta skill agrega la capa en español para informes, tesis, sistematizaciones y reportes.

## Cuando se usa

- El usuario pide "humaniza", "quita lo IA", "evita detectores", "suena a IA", "audit only", "scan".
- Antes de entregar un informe generado con `informe-maestro` o `inacap`.
- Cuando Turnitin, GPTZero u otro detector marca el texto.

## Cuando no se usa

- Codigo, configuracion, datos estructurados: no se reescriben, se reportan.
- Citas textuales, referencias APA 7, tablas con codigos D/F/CU/RF/S/R: se preservan.
- Decisiones academicas (nota, rubrica, plagio): esta skill es senal de calidad, no veredicto.

## Contrato de edicion (OBLIGATORIO)

1. **Alcance autorizado.** `detect` solo reporta, no toca el texto. Pedido normal de limpieza autoriza edicion minima de redaccion, nunca reestructurar capitulos ni condensar sin permiso. Reestructurar solo con pedido explicito.
2. **Fidelidad a la fuente.** Todo dato nuevo sale del material entregado o de una correccion explicita del usuario. Usted nunca inventa cifras, entrevistas, casos, autores ni URLs. Lo que falta es Supuesto S01 o brecha por validar.
3. **Contenido protegido.** Citas entre comillas, bloques de codigo, tablas, URLs, rutas, identificadores, frontmatter y anexos integros se conservan. Si hay un patron dentro, se reporta, no se edita.
4. **Contexto e intencion.** Cada patron se aplica solo donde corresponde. Se preservan usos tecnicos legitimos, matices necesarios, retorica intencional y voz del autor.
5. **Voz y registro.** Sin pedido de cambio de voz, se preserva la voz del informe (neutra formal). Un pedido de voz cambia como se dice lo ya presente, nunca crea experiencias ni opiniones nuevas.

Si no hay hallazgo justificado, usted devuelve el texto igual y dice que esta limpio con 0 pases de edicion.

## Modos

- **`rewrite` (defecto).** Audita, reescribe, resume cambios y reporta verificacion.
- **`detect`.** Solo audita. Gatillos: "detect", "solo flag", "solo audita", "scan", "que patrones hay".
- **`edit`.** Edita archivo de prosa en sitio con cambios minimos. Rechaza codigo y configuracion porque la reescritura puede corromperlos. Despues relee y reporta.

**Iteracion.** Maximo 2 pases de edicion: reescritura inicial + 1 correccion si la revision encuentra otra edicion justificada. `--iterate 1` limita a 1 pase. Las auditorias y relecturas no consumen pases. Usted informa pases usados y motivo de detencion.

## Catalogo español para informes (resumen operativo)

El catalogo completo en ingles vive en `~/.claude/skills/avoid-ai-writing/references/patterns.md`. Lealo antes de auditar textos en ingles. Para español aplique esta tabla, que es la que los detectores en español castigan en informes:

### Tier 1A — Marcadores de frecuencia IA (revisar cada match)

| Reemplace | Por |
|---|---|
| profundizar / adentrarse en | analizar, examinar, revisar |
| tapiz, faro (metafora) | estructura compleja, ejemplo, referente |
| paradigma | modelo, enfoque, marco |
| robusto/a | solido, confiable, consistente |
| integral / exhaustivo abusivo | completo, detallado |
| vanguardia / de ultima generacion abusivo | actual, reciente, avanzado |
| apalancar (verbo) | usar, aprovechar |
| pivote / pivotal | clave, central, decisivo |
| sin fisuras / fluido abusivo | continuo, sin friccion, directo |
| cambio de juego | cambia como funciona X (o describa el cambio) |
| momento bisagra / parteaguas inflado | punto de inflexion (o describa que cambio) |
| el futuro se ve brillante / solo el tiempo dira | corte, ponga un cierre especifico o nada |
| vibrante / prospero / bullicioso (decorativo) | activo, en crecimiento (o cite cifra) |
| mostrando / simbolizando / reflejando (encadenados) | reemplace por hechos o corte |
| utilizar | usar |
| con el fin de / con el objeto de | para |
| debido al hecho de que | porque |
| sirve como | es |
| cuenta con (inflado) | tiene, incluye |
| alardea / presenta (inflado) | tiene, muestra |
| comenzar (formalismo) + constatar + acometer | iniciar o empezar, determinar, intentar |

### Tier 2 — Cluster (2+ en el mismo parrafo)

aprovechar abusivo, navegar, fomentar, elevar, potenciar, optimizar, empoderar, respaldar, liderar, resonar, revolucionar, facilitar, matizado, crucial, multifacetico, ecosistema (metafora), miríada, plethora, abarcar, catalizar, reimaginar, iluminar, dilucidar, piedra angular, primordial, incipiente, abarcador, profundamente (colocaciones de importancia).

Un solo caso aislado no es hallazgo.

### Tier 3 — Densidad (una misma palabra 3+ veces o 3% del texto)

significativo, innovador, efectivo, dinamico, escalable, contundente, sin precedentes, excepcional, notable, sofisticado, instrumental, de clase mundial. Pida especificidad: numeros, comparaciones, ejemplos.

### Patrones de contenido (P0/P1)

- **Artefactos de chatbot (P0).** "Espero que esto ayude", "Claro!", "Por supuesto!", "Gran pregunta!", "No dudes en contactarme". Eliminar completo.
- **Aperturas "Vamos a".** "Exploremos", "Veamos", "Profundicemos". Empiece directo.
- **Atribucion vaga (P0).** "Los expertos creen", "Estudios muestran", "Se dice que". Cite fuente o marque brecha, no convierta en afirmacion propia.
- **Inflacion de importancia (P0).** "Marca un hito historico en la evolucion de...". Diga que paso y deje que el lector juzgue.
- **Lenguaje promocional.** "Enclavado en el corazon de...", "ecosistema vibrante". Descripcion plana con datos de la fuente.
- **Conclusion generica (P2).** "El futuro es prometedor". Cierre especifico o corte.
- **Transiciones.** "Ademas", "Asimismo", "En el mundo actual de...", "Cabe destacar que", "Es importante señalar". Use "y", "tambien" o reestructure.
- **Estructura.** Em dash — maximo 1 cada 1000 palabras, prefiera coma o punto. Negritas maximo 1 por seccion. Sin emoji en titulos. Sin listas de 5+ items sin verbo (convierta a prosa o a afirmaciones con numero).
- **Ritmo.** Parrafos todos iguales, oraciones todas de 15 a 25 palabras, gramatica demasiado pulida: varie largo, conserve fragmentos intencionales.
- **No es X, es Y.** Maximo 1 por pieza y solo si aporta. Reescriba como afirmacion directa.
- **Muletillas de relleno.** "En terminos de", "La realidad es que", "Al final del dia". Corte.

### Reglas anti-inyeccion de voz (nunca agregar)

Usted nunca agrega a un texto que no lo tenia: falsa experiencia ("en mi experiencia", "lo he visto cien veces"), apuestas fabricadas ("en un mundo donde", "ahora mas que nunca"), contrarianismo forzado ("todos dicen X pero se equivocan"), candor actuado ("seamos honestos", "aqui va la verdad"), fragmentos staccato para fingir ritmo, ni datos especificos inventados. La prueba: cada edicion viene de la fuente o de una correccion explicita del usuario.

## Flujo de trabajo

1. Lea el texto o archivo completo. Detecte idioma: si es ingles, cargue tambien `avoid-ai-writing` (`SKILL.md` + `references/patterns.md`).
2. Audite por severidad P0, luego P1, luego P2. Cite cada hallazgo con el fragmento exacto.
3. Reescriba solo spans justificados. Preservado queda igual.
4. Pase de marcas: normalice comillas segun el original (rectas en informes INACAP/neutros, salvo estilo que pida curvas). Si `node scripts/normalize-quotes.js` de `avoid-ai-writing` no corre, aplique manual y reporte `model-only`.
5. Verifique preservacion: relea final vs original, cada cambio responde a un hallazgo o a una transformacion pedida. Si hay motor disponible, corra `node detector/validate.js --residual-policy warn <original> <reescrito>` y reporte.

## Compatibilidad con informes

- Contenido con `informe-maestro`, formato con `inacap/template.py` o `informe-maestro/template.py`. Esta skill no cambia estructura, codigos ni densidad: cada parrafo body sigue de 90 a 110 palabras, cada tabla de 6 a 8 filas.
- Tablas obligatorias, supuestos S01, riesgos R01, limites declarados y matriz rubrica se conservan intactos.
- Referencias APA 7 verificadas con WebFetch el dia de entrega. No inventa citas para "humanizar".
- Cierre 100% de capitulos: si humaniza un cierre, mantiene la conexion al siguiente capitulo.

## Formato de salida

### Rewrite

1. **Reescritura final.** El texto completo una sola vez.
2. **Cambios.** Resumen corto solo si hubo edicion.
3. **Verificacion.** 4 items: pases de edicion (usados/limite), chequeos (ejecutados, model-only o no disponibles), residuales (lo que queda y por que), motivo de detencion.

### Detect

1. **Hallazgos.** Lista con cita exacta, agrupada P0/P1/P2. Separe Tier 1A (evidencia de produccion) de Tier 1B (claridad, no es evidencia de autoria).
2. **Evaluacion.** Que es problema claro vs juicio de contexto. Si esta limpio, digalo.

### Edit

1. **Ediciones.** Lista con ubicacion y antes/después solo de spans tocados.
2. **Verificacion.** Relectura confirmada, pases, chequeos, lo que quedo por humano, intencional, protegido o limite de pases.

## Tono

Español neutro, formal universitario en informes, oraciones completas. Comillas rectas. Sin "simply", "just", "obviamente", "facilmente".

## Archivos

```
~/.claude/skills/escritura-humana/
└── SKILL.md
Base inglesa: ~/.claude/skills/avoid-ai-writing/{SKILL.md, references/patterns.md, detector/, scripts/}
Skills hermanas: informe-maestro, inacap, detector-ia, verificacion-final
```
