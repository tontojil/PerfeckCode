---
name: sii-chile
description: "Para facturación electrónica chilena ante el SII: tipos DTE, folios CAF, firma y estados. (sii, dte, factura-electronica)"
---

# SII Chile

## Core Rule

**El SII autoriza a su RUT, no al software. El comprobante inicial no es aprobación: pregunte al SII hasta ver aceptado o rechazado.**

## When to Use

- Emitir boleta 39/41, factura 33/34, notas 56/61, guia 52 o liquidacion 43.
- Folios CAF, certificado `.pfx`, estados `DOK/DNK/RCH/EPR`.
- Motores como ruraldte-engine o cualquier emision directa al SII.

## Process

1. **Separe piezas**
   - `.pfx` = su llave para firmar. CAF = permiso del SII para numerar. Folio = número único: si usa el 123, nunca vuelva a usar el 123.
   - Producción usa canal REST; certificación usa SOAP con número de resolución 0. No mezcle datos de un ambiente en el otro.
2. **Emita y pregunte hasta el final**
   - `emit` devuelve `trackId` (solo recibo, no aprobación).
   - Pregunte (`poll`) hasta `DOK` aceptado, `DNK` con reparos, `RCH` rechazado o `EPR` en proceso. Si queda en `EPR` más de 30 minutos, encole y reintente cada 5/30 minutos sin reutilizar folio.
3. **Cuide folios**
   - Asigne cada folio una sola vez con transacción (un candado por tipo). Si dos procesos toman el mismo, el SII rechaza el segundo.
   - Antes de firmar valide vigencia del `.pfx`, CAF disponible, XSD y tildes. Si rechazan por folio duplicado, tome uno nuevo, jamás reutilice.
4. **Custodie claves**
   - `.pfx` y su clave en caja fuerte digital (vault), nunca en `.env` ni en el chat. El motor no las guarda. Avise 15 días antes del vencimiento.
   - Aviso: no emitir o reutilizar folio se sanciona (art. 97). Confirme con su contador.

## Output Contract

Entregue: tipo DTE, folio, trackId, estado final del poll y archivos XML/PDF archivados.
