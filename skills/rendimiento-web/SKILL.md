---
name: rendimiento-web
description: "Para páginas rápidas en celular y datos móviles. Mide antes y después con Core Web Vitals. (performance, web-vitals, velocidad)"
---

# Rendimiento Web

## Core Rule

**Sin numero no hay mejora. Mida antes, cambie una cosa, mida despues.**

## When to Use

- Pagina lenta, fotos pesadas, puntaje bajo en PageSpeed.
- Mucho JavaScript inicial o layout que salta al cargar.

## Process

1. **Mida base**
   - LCP (carga) objetivo < 2.5s, INP (respuesta) < 200ms, CLS (saltos) < 0.1.
2. **Ataque en orden**
   - Fotos: formato WebP/AVIF, tamaño real, `loading="lazy"` fuera de pantalla.
   - JavaScript: parta por ruta, difiera lo no critico, evite librerias duplicadas.
   - Caché: estaticos con hash y larga duracion.
3. **Verifique**
   - Mismo dispositivo y red antes y despues. Reporte los 3 numeros.

## Comandos Lighthouse y Core Web Vitals

Mida siempre en las mismas condiciones. Mismo dispositivo, misma red y misma URL antes y despues. Registre el comando exacto.

1. **Umbrales oficiales (p75 de datos de campo)**
   - LCP (Largest Contentful Paint) menor a 2.5 s. Bueno menor a 2.5 s, mejorar de 2.5 s a 4.0 s, deficiente mayor a 4.0 s.
   - INP (Interaction to Next Paint) menor a 200 ms. Bueno menor a 200 ms, mejorar de 200 ms a 500 ms, deficiente mayor a 500 ms.
   - CLS (Cumulative Layout Shift) menor a 0.1. Bueno menor a 0.1, mejorar de 0.1 a 0.25, deficiente mayor a 0.25.
   - Fuente: https://web.dev/articles/vitals y https://web.dev/articles/defining-core-web-vitals-thresholds
2. **Auditoria rapida en CLI**
   - `npx -y lighthouse https://ejemplo.com --preset=desktop --only-categories=performance --view`
   - `npx -y lighthouse https://ejemplo.com --preset=desktop --only-categories=performance --output=json --output-path=./lighthouse-base.json --chrome-flags="--headless"`
   - Solo movil con limitacion de red: `npx -y lighthouse https://ejemplo.com --form-factor=mobile --throttling-method=devtools --throttling.cpuSlowdownMultiplier=4 --only-categories=performance --view`
3. **Comparacion antes y despues**
   - Base: `npx -y lighthouse https://ejemplo.com --preset=desktop --output=json --output-path=./antes.json --chrome-flags="--headless"`
   - Despues del cambio: `npx -y lighthouse https://ejemplo.com --preset=desktop --output=json --output-path=./despues.json --chrome-flags="--headless"`
   - Extraiga LCP, INP y CLS:
   ```bash
   node -e "const a=require('./antes.json'); console.log(a.audits['largest-contentful-paint'].displayValue, a.audits['cumulative-layout-shift'].displayValue)"
   ```
4. **Presupuesto en CI con budget.json**
   - Archivo `budget.json`:
   ```json
   [
     {
       "path": "/*",
       "timings": [
         { "metric": "largest-contentful-paint", "budget": 2500 },
         { "metric": "cumulative-layout-shift", "budget": 100 },
         { "metric": "interactive", "budget": 3500 }
       ],
       "resourceSizes": [
         { "resourceType": "script", "budget": 200 },
         { "resourceType": "stylesheet", "budget": 50 },
         { "resourceType": "image", "budget": 500 }
       ],
       "resourceCounts": [
         { "resourceType": "third-party", "budget": 10 }
       ]
     }
   ]
   ```
   - Ejecucion con presupuesto: `npx -y lighthouse https://ejemplo.com --preset=desktop --budget-path=./budget.json --view`
5. **Datos de campo (no solo laboratorio)**
   - Instale la libreria en produccion: `npm install web-vitals`
   - Envio a RUM segun https://web.dev/articles/vitals:
   ```js
   import { onLCP, onINP, onCLS } from "web-vitals";
   onLCP(console.log);
   onINP(console.log);
   onCLS(console.log);
   ```
   - La documentacion oficial prevalece. Evalue en p75 de campo (CrUX o RUM), no solo en laboratorio.

## Output Contract

Entregue: tabla antes | despues de LCP/INP/CLS con comando exacto, captura o JSON, y que cambio causo cada mejora.

## Referencias oficiales y repositorios famosos

1. Web Vitals (LCP menor a 2.5s, INP menor a 200ms, CLS menor a 0.1 en p75): https://web.dev/articles/vitals
2. Defining Core Web Vitals thresholds (metodologia y achievability): https://web.dev/articles/defining-core-web-vitals-thresholds
3. Learn Performance web.dev (imagenes, JS, CSS, cache): https://web.dev/learn/performance/welcome
4. Lighthouse oficial (CLI, budgets y throttling): https://developer.chrome.com/docs/lighthouse/overview
5. Core Web Vitals en Google Search (Page Experience y ranking): https://developers.google.com/search/docs/appearance/core-web-vitals
6. Awesome WPO curaduria (imagenes, bundles, cache, CDN): https://github.com/davidsonfellipe/awesome-wpo

La documentacion oficial prevalece. Evalue en p75 de campo (CrUX o RUM), no solo en laboratorio.

### Checklist aplicable por pagina critica

- [ ] Linea base con `npx lighthouse` y `npx unlighthouse --site` en mismo dispositivo y red, commit registrado.
- [ ] Imagenes WebP o AVIF con `srcset`, `loading="lazy"` fuera de pantalla y dimensiones explicitas para CLS.
- [ ] JS por ruta con `import()` dinamico, CSS critico inline, bundle menor a 200 KB gzip y CSS menor a 50 KB.
- [ ] Cache con hash y `max-age=31536000, immutable`, hit-rate CDN mayor a 85 % verificado con `x-cache`.
- [ ] Tabla antes y despues con LCP, INP, CLS y comando exacto, presupuestos agregados a CI con `budget.json`.
