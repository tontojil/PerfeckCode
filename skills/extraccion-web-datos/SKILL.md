---
name: extraccion-web-datos
description: "Para sacar datos públicos de páginas web con respeto: pausas, caché y selectores. (scraping, datos, automatización)"
---

# Extracción Web Datos

## Core Rule

**Respete la página: lea robots.txt, vaya despacio y guarde caché.**

## When to Use

- Precios, catálogos o avisos públicos para comparar o vigilar.
- Pasar una página a planilla o a texto limpio.
- Revisar su propia tienda como la ve Google.

## Process

1. **Permiso primero**
   - Lea `robots.txt` y términos del sitio. Si lo prohíbe, deténgase y pida autorización escrita.
   - Preséntese con nombre y contacto en el programa. Prohibido eludir login, CAPTCHA o límites.
   - No extraiga muros de pago ni datos personales; valide con `privacidad-datos-chile`.
2. **Vaya despacio**
   - 1 pedido por vez con pausas, más lento si el sitio responde lento.
   - Reutilice datos guardados al probar, no sobrecargue el servidor con pedidos repetidos.
3. **Seleccione bien**
   - CSS o XPath puntuales, guarde fecha y URL de cada dato.
   - Si la página cambia, reubique el selector, no adivine.
4. **Exporte**
   - Salida a JSON, CSV o planilla con columnas fijas.

## Output Contract

Entregue: datos con fecha y fuente, robots respetado y cómo repetirlo.
