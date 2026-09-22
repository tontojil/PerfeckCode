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

## Output Contract

Entregue: tabla antes | despues de LCP/INP/CLS y que cambio causo cada baja.

## Referencias oficiales y repositorios famosos

1. Web Vitals (LCP menor a 2.5s, INP menor a 200ms, CLS menor a 0.1 en p75): https://web.dev/articles/vitals
2. Defining Core Web Vitals thresholds (metodologia y achievability): https://web.dev/articles/defining-core-web-vitals-thresholds
3. Core Web Vitals en Google Search (Page Experience y ranking): https://developers.google.com/search/docs/appearance/core-web-vitals
4. Awesome WPO curaduria (imagenes, bundles, cache, CDN): https://github.com/davidsonfellipe/awesome-wpo

La documentacion oficial prevalece. Evalue en p75 de campo (CrUX o RUM), no solo en laboratorio.

### Checklist aplicable por pagina critica

- [ ] Linea base con `npx lighthouse` y `npx unlighthouse --site` en mismo dispositivo y red, commit registrado.
- [ ] Imagenes WebP o AVIF con `srcset`, `loading="lazy"` fuera de pantalla y dimensiones explicitas para CLS.
- [ ] JS por ruta con `import()` dinamico, CSS critico inline, bundle menor a 200 KB gzip y CSS menor a 50 KB.
- [ ] Cache con hash y `max-age=31536000, immutable`, hit-rate CDN mayor a 85 % verificado con `x-cache`.
- [ ] Tabla antes y despues con LCP, INP, CLS y comando exacto, presupuestos agregados a CI con `budget.json`.
