---
name: detector-ia
description: Auditar textos e informes con detector local avoid-ai-writing mas checklist en español. Score 0-100, severidad P0/P1/P2, validacion de preservacion y gate antes de entregar. (detector, auditoria, score, Turnitin, GPTZero)
---

# Detector IA — Auditoria Local para Informes

Usted audita textos en español e ingles con el motor determinista de `avoid-ai-writing` mas un checklist en español para informes. Entrega score, hallazgos por severidad y decision de gate. No emite veredictos academicos: es senal de calidad, no prueba de autoria.

## Cuando se usa

- Antes de declarar listo un informe, tesis, sistematizacion o reporte.
- Cuando el usuario pide "audita", "score", "pasa el detector", "revisa si suena a IA".
- Como gate en `verificacion-final` para documentos.

## Motor y rutas

Motor clonado en `~/.claude/skills/avoid-ai-writing/`:

```
detector/patterns.js      motor principal (54 types, scoring 0-100)
detector/validate.js      validacion de preservacion original vs reescrito
detector/CATEGORIES.md    mapa skill <-> detector (contrato anti-drift)
scripts/normalize-quotes.js  normalizacion de comillas
references/patterns.md    catalogo completo en ingles (112 entradas + 10 frases Tier 3)
```

Comandos (proponer y esperar aprobacion si bash es ask):

```bash
node ~/.claude/skills/avoid-ai-writing/detector/validate.js --residual-policy warn original.txt reescrito.txt
node -e "const D=require('~/.claude/skills/avoid-ai-writing/detector/patterns.js'); const r=D.analyzeText('texto'); console.log(r.score, r.label, r.issues.length)"
```

Paquete npm alternativo (solo runtime, sin scripts del repo):

```bash
npm install avoid-ai-writing-detector
npx --package avoid-ai-writing-detector avoid-ai-writing draft.md
```

## Flujo de auditoria (5 pasos)

1. **Preparar.** Copie el texto a un archivo temporal o lea el archivo indicado. Detecte idioma. Si es ingles, lea `references/patterns.md` completo antes de auditar.
2. **Correr motor.** Ejecute el detector si esta disponible. Registre score 0-100, label y conteo por tipo. Si no corre (sin node, sin archivos), declare `model-only` y siga con checklist manual.
3. **Checklist español.** Aplique el checklist de abajo, que cubre lo que el motor en ingles no ve en español (muletillas, tildes, conectores repetidos, promocional academico).
4. **Clasificar P0/P1/P2.** Agrupe hallazgos. Separe Tier 1A (marcador de produccion) de Tier 1B (claridad, no es evidencia de autoria). Un Tier 2 aislado o un Tier 3 bajo umbral va a Evaluacion como juicio, no a Hallazgos.
5. **Gate y reporte.** Decida pass / warn / fail segun umbrales y entregue el formato de salida.

## Checklist español para informes (manual, 12 puntos)

1. [ ] Sin artefactos de chatbot ("Espero que ayude", "Gran pregunta", "Claro!").
2. [ ] Sin atribucion vaga sin fuente ("expertos", "estudios" sin cita).
3. [ ] Sin inflacion ("hito historico", "cambio de juego", "revolucionara").
4. [ ] Tier 1A/1B en español revisados con tabla de `escritura-humana`.
5. [ ] Cluster Tier 2: ningun parrafo con 2+ marcadores juntos.
6. [ ] Densidad Tier 3: ninguna palabra vaga repetida 3+ veces sin especificar.
7. [ ] Transiciones variadas: no repite "Ademas" / "Asimismo" / "Por otro lado" en cada parrafo.
8. [ ] Ritmo: mezcla oraciones cortas (10-15 palabras) y largas (25-35), parrafos de distinto largo.
9. [ ] Em dash maximo 1 cada 1000 palabras, sin emoji en titulos, maximo 1 negrita por seccion.
10. [ ] Sin conclusion generica ("el futuro es prometedor", "solo el tiempo dira").
11. [ ] Citas APA 7 con URL verificada el dia de entrega, sin fuentes inventadas.
12. [ ] Tablas y figuras con titulo "Tabla N." / "Figura N." mas Nota y Fuente; codigos D/F/CU/RF/S/R intactos.

## Umbrales de gate

| Score motor | Hallazgos | Decision | Accion |
|---|---|---|---|
| 0-20 | sin P0, max 2 P1 menores | **pass** | entregar, informar score |
| 21-50 | 1+ P1 o 3+ P2 | **warn** | humanizar con `escritura-humana` (1 pase), re-auditar |
| 51-100 | 1+ P0 o 5+ P1 | **fail** | reescribir, no entregar hasta nuevo gate en verde |

Score alto con texto academico formal puede ser falso positivo: los Tier 1B (`utilizar`, `con el fin de`) disparan en prosa profesional humana. Usted lo declara y no lo cuenta como evidencia de autoria. Falsos positivos conocidos: escritores no nativos, prosa bajo presion, generos tecnicos que comprimen vocabulario.

## Preservacion

Despues de humanizar, corra si puede:

```bash
node ~/.claude/skills/avoid-ai-writing/detector/validate.js --residual-policy warn original.txt reescrito.txt
```

Politica: errores mecanicos de preservacion bloquean (fail). Crecimiento residual de patrones es advertencia (warn), no autoriza otro pase fuera de presupuesto. Usted revisa hechos, cantidades, negacion, causalidad y nivel de certeza por separado: el validador no verifica significado.

## Formato de salida

1. **Score.** Numero 0-100 + label + motor o model-only + fecha.
2. **Hallazgos.** Lista con cita exacta, agrupada P0/P1/P2, con tipo de detector cuando aplica (`tier1`, `transition`, `vague-attribution`, etc.).
3. **Evaluacion.** Problema claro vs juicio de contexto. Sub-umbrales aqui, no en Hallazgos.
4. **Gate.** pass / warn / fail + proximo paso concreto (ej. "humanizar seccion 3 con escritura-humana, re-auditar").
5. **Evidencia.** Comando exacto ejecutado + fragmento de salida + exit code.

Ejemplo:

```text
Score: 34 (warn, motor avoid-ai-writing, 2026-10-21)
Hallazgos P1: "apalancar sinergias" (tier1), "Ademas" x4 en 300 palabras (transition)
Evaluacion: "robusto" en contexto estadistico es uso legitimo, se conserva.
Gate: warn - 1 pase de escritura-humana en introduccion, re-auditar.
Comando: node detector/validate.js --residual-policy warn orig.txt nuevo.txt
Salida: 0 errores mecanicos, 2 residuales P2. Exit code: 0
```

## Limites honestos

- El motor y las reglas estan calibrados para ingles; en español esta skill es adaptacion practica, no validacion estadistica propia.
- Detectores comerciales tienen falsos positivos sobre 60% en no nativos y sobre 70% en open-source segun estudios citados en el repo base. Parafrasis adversaria baja la precision ~88%.
- Usted nunca acusa de fraude academico con solo este score. Para integridad academica pida contexto: quien escribio, genero, voz normal del autor, otras evidencias.

## Archivos

```
~/.claude/skills/detector-ia/
└── SKILL.md
Motor: ~/.claude/skills/avoid-ai-writing/detector/
Hermana: escritura-humana (reescritura), verificacion-final (gate final), informe-maestro (densidad)
```
