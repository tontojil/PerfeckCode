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
