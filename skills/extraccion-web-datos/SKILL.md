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

## Referencias oficiales y repositorios famosos

Esta sección amplía sin modificar el proceso existente. Agrega Playwright docs y profundiza Scrapling.

### Documentación oficial

- Scrapling: https://github.com/D4Vinci/Scrapling — `Fetcher`, `DynamicFetcher`, `StealthyFetcher` y `Spider`.
- Playwright Python: https://playwright.dev/python/docs/intro — instalación, navegadores y `page` API.
- Playwright Selectors: https://playwright.dev/python/docs/selectors — CSS, XPath, rol y `get_by_*`.
- Playwright Waiting: https://playwright.dev/python/docs/actionability — auto-wait, `network_idle` y reintentos.
- Robots Exclusion: https://developers.google.com/search/docs/crawling-indexing/robots/robots_txt — `Disallow`, `Crawl-delay` y `Request-rate`.
- careggi robots.txt: https://www.rfc-editor.org/rfc/rfc9309.html — estándar oficial de exclusión.
- Privacidad Chile: Ley 19.628 y 21.719; valide con skill `privacidad-datos-chile` antes de guardar personales.

### Repositorios famosos y listas curadas

- Awesome Web Scraping: https://github.com/lorien/awesome-web-scraping — herramientas, proxies y patrones.
- Scrapling Examples: https://github.com/D4Vinci/Scrapling/tree/main/examples — `Spider`, caché y exportes.
- Playwright: https://github.com/microsoft/playwright — navegadores, `screenshot` y trazabilidad.
- BeautifulSoup: https://github.com/wention/BeautifulSoup4 — parsing complementario para HTML simple.
- Scrapy: https://github.com/scrapy/scrapy — spiders a escala con `AutoThrottle` y `robots_txt_obey`.

### Playwright como complemento a Scrapling

- Utilice `DynamicFetcher` o Playwright solo cuando el contenido requiera JS; prefiera `Fetcher` HTTP para velocidad.
- Implemente esperas explícitas: `page.wait_for_load_state("networkidle")` antes de seleccionar.
- Capture evidencia con `page.screenshot(path="evidencia.png", full_page=True)` y guarde HTML para caché.
- Aisle selectores con `page.locator("css").all()` y valide conteo antes de exportar a CSV o JSON.
- Respete pausas entre páginas y reutilice contexto con caché en disco en modo dev.
- Ejemplo mínimo auditable:
- `from playwright.sync_api import sync_playwright`
- `with sync_playwright() as p: browser = p.chromium.launch(headless=True)`
- `page = browser.new_page(user_agent="MiProyecto contacto@example.com")`
- `page.goto("https://example.com", wait_until="domcontentloaded")`
- `items = page.locator(".product").all_text_contents()`
- `browser.close()`

### Checklist de verificación

- [ ] Se leyó `https://sitio/robots.txt` y términos; `Disallow` y `Crawl-delay` respetados.
- [ ] El programa se presenta con nombre y contacto; sin bypass de login, CAPTCHA o límites.
- [ ] No se extraen muros de pago ni datos personales sin base legal validada.
- [ ] Se utiliza 1 pedido por vez con pausas y caché en disco para pruebas.
- [ ] Cada dato guarda fecha, URL y selector utilizado para repetir la extracción.
- [ ] Si se utiliza Playwright, se documenta `wait_until`, selectores y screenshot de evidencia.
- [ ] La salida utiliza columnas fijas en JSON, CSV o planilla con fuente citada.
- [ ] Se consultó `playwright.dev/python/docs/intro` cuando la página requiere JS.
