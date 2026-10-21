# VENDOR — avoid-ai-writing (subset)

Fuente: https://github.com/conorbronsdon/avoid-ai-writing (MIT, ver `LICENSE`).
Version vendoreada: 3.38.0 (campo `version` de `SKILL.md` upstream).
Fecha de sync: 2026-10-21.

## Que incluye este subset

Solo lo necesario para auditar y verificar sin dependencias externas:

```
SKILL.md                  entrada original (calibrada para ingles)
GLOSSARY.md               definiciones (tiers, severidades, modos)
references/patterns.md    catalogo completo de patrones en ingles
detector/patterns.js      motor determinista (score 0-100, cero dependencias)
detector/validate.js      validacion de preservacion original vs reescrito
detector/CATEGORIES.md    mapa skill <-> detector (contrato anti-drift)
detector/README.md        documentacion del motor
scripts/normalize-quotes.js   normalizacion de comillas
scripts/markdown-prose.js     dependencia de normalize-quotes.js
```

## Que se omitio (a proposito)

`.git/`, `docs/`, `evals/`, `corpus/`, `plugins/`, `cursor-rules/`, `bin/`,
`dist/`, `examples/`, `assets/`, `submission/`, tests (`*.test.js`) y
utilidades de publicacion. El clon completo pesa ~8.5 MB; este subset ~0.4 MB.
La capa en español vive en las skills hermanas `escritura-humana` y
`detector-ia`, no aqui: este directorio conserva el upstream intacto.

## Actualizar

```bash
git clone --depth 1 https://github.com/conorbronsdon/avoid-ai-writing /tmp/aaw
cp /tmp/aaw/SKILL.md skills/avoid-ai-writing/SKILL.md
cp /tmp/aaw/references/patterns.md skills/avoid-ai-writing/references/
cp /tmp/aaw/detector/{patterns.js,validate.js,CATEGORIES.md,README.md} skills/avoid-ai-writing/detector/
cp /tmp/aaw/scripts/{normalize-quotes.js,markdown-prose.js} skills/avoid-ai-writing/scripts/
```

Luego actualice version y fecha arriba, verifique con
`node skills/avoid-ai-writing/detector/validate.js --help` (exit 2 esperado,
es uso incorrecto sin archivos) y con un `analyzeText` de prueba, y registre
el cambio con Conventional Commits.
