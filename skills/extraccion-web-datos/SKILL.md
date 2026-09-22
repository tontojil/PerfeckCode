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

1. **Permiso primero (checklist legal)**
   - Lea `https://sitio/robots.txt` y términos del sitio. Si lo prohíbe, deténgase y pida autorización escrita. Respete `Disallow`, `Crawl-delay`, `Request-rate`.
   - Preséntese con nombre y contacto en el programa. Prohibido eludir login, CAPTCHA o límites.
   - No extraiga muros de pago ni datos personales; valide con `privacidad-datos-chile`. Revise copyright y uso comercial.
2. **Vaya despacio (Scrapling: https://github.com/D4Vinci/Scrapling)**
   - 1 pedido por vez con pausas, más lento si el sitio responde lento. En `Spider` use AutoThrottle + `robots_txt_obey=true`.
   - Reutilice datos guardados al probar, no sobrecargue el servidor con pedidos repetidos. Modo dev con caché en disco.
3. **Seleccione bien (fetchers)**
   - `Fetcher` = HTTP rápido con TLS fingerprint y HTTP/3 (`FetcherSession`); `DynamicFetcher` = JS con Chromium/Chrome (`DynamicSession`); `StealthyFetcher` = anti-bot y Cloudflare Turnstile (`StealthySession`).
   - CSS o XPath puntuales, guarde fecha y URL de cada dato. `page.css('.product', auto_save=True)` sobrevive cambios; `adaptive=True` reubica.
   - `from scrapling.fetchers import Fetcher`: `page = Fetcher.get('https://quotes.toscrape.com/')`
   - `from scrapling.fetchers import StealthyFetcher`: `page = StealthyFetcher.fetch('https://example.com', headless=True, network_idle=True)`
   - `from scrapling.spiders import Spider`: `class MySpider(Spider): name="demo"; start_urls=["https://example.com/"]` con `async def parse`
   - Si la página cambia, reubique el selector, no adivine.
4. **Exporte + CLI + MCP**
   - Salida a JSON, CSV o planilla con columnas fijas. En `Spider`: `result.items.to_json()`, `to_jsonl()`, `to_csv()`, `to_xml()`.
   - Instalación por capas: `pip install scrapling` (solo parser); `pip install "scrapling[fetchers]"` + `scrapling install`; `pip install "scrapling[shell]"`; `pip install "scrapling[ai]"`; `pip install "scrapling[all]"`.
   - CLI: `scrapling shell`; `scrapling extract get 'https://example.com' content.md`; `scrapling extract fetch ... --no-headless`; `scrapling extract stealthy-fetch ... --solve-cloudflare`.
   - MCP: `pip install "scrapling[ai]"` + `scrapling-mcp` (stdio) o `scrapling-mcp --http --auth-token "<token>"`. Tools: `make_request`, `bulk_get`, `fetch`, `bulk_fetch`, `stealthy_fetch`, `bulk_stealthy_fetch`, `open_session`, `session_fetch`, `screenshot`.

## Output Contract

Entregue: datos con fecha y fuente, robots respetado y cómo repetirlo.
