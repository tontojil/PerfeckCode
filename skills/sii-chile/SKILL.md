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

## Tipos DTE comunes

| Codigo | Documento | Uso tipico |
|---|---|---|
| 33 | Factura electronica | Venta con IVA a empresa |
| 34 | Factura exenta | Venta sin IVA |
| 39 | Boleta electronica | Venta con IVA a persona |
| 41 | Boleta exenta | Venta sin IVA a persona |
| 52 | Guia de despacho | Traslado de mercaderia |
| 56 | Nota de debito | Aumenta monto de factura |
| 61 | Nota de credito | Anula o rebaja factura o boleta |
| 43 | Liquidacion factura | Comisionistas o consignaciones |

Todos exigen folio autorizado por CAF del mismo tipo. No mezcle folios entre tipos.

## Process

1. **Separe piezas**
   - `.pfx` = su llave para firmar. CAF = permiso del SII para numerar. Folio = número único: si usa el 123, nunca vuelva a usar el 123.
   - Producción usa canal REST; certificación usa SOAP con número de resolución 0. No mezcle datos de un ambiente en el otro.
2. **Valide antes de firmar**
   - Certificado `.pfx` vigente y con RUT autorizado para facturar.
   - CAF vigente y con folios disponibles para el tipo DTE.
   - RUT receptor válido, montos con IVA calculado, formato XSD del SII sin errores.
3. **Emita y pregunte hasta el final**
   - `emit` devuelve `trackId` (solo recibo, no aprobación).
   - Pregunte (`poll`) hasta `DOK` aceptado, `DNK` con reparos, `RCH` rechazado o `EPR` en proceso. Si queda en `EPR` más de 30 minutos, encole y reintente cada 5/30 minutos sin reutilizar folio.
4. **Cuide folios**
   - Asigne cada folio una sola vez con transacción (un candado por tipo). Si dos procesos toman el mismo, el SII rechaza el segundo.
   - Si rechazan por folio duplicado, tome uno nuevo, jamás reutilice. Registre folio usado, fecha y estado final.
5. **Custodie claves**
   - `.pfx` y su clave en caja fuerte digital (vault), nunca en `.env` ni en el chat. El motor no las guarda. Avise 15 días antes del vencimiento.
   - Aviso: no emitir o reutilizar folio se sanciona (art. 97 Codigo Tributario). Confirme con su contador.

## Ejemplo minimo: emitir y consultar estado

```python
# Pseudocodigo valido para cualquier motor DTE
dte = {
    "tipo": 39,          # boleta electronica
    "folio": 124,        # tomado una sola vez desde CAF
    "receptor_rut": "66666666-6",
    "monto_neto": 8403,
    "monto_iva": 1597,
    "monto_total": 10000,
}
xml_firmado = firmar(dte, certificado_pfx="ruta/segura/cert.pfx")
track_id = sii.emit(xml_firmado)  # solo acuse de recibo

# Consultar hasta estado final, sin reutilizar folio
estado = sii.poll(track_id)  # DOK, DNK, RCH o EPR
while estado == "EPR":
    esperar(minutos=5)
    estado = sii.poll(track_id)
guardar(dte["tipo"], dte["folio"], track_id, estado)
```

Ejemplo de validacion previa, en una linea de control:

```text
pfx vigente: si | CAF tipo 39 con folios 124-200: si | XSD valido: si -> firmar
pfx vencido o sin folios -> detener y avisar, no firmar
```

## Errores frecuentes

- `RCH por folio duplicado`: tome folio nuevo, corrija y reemita.
- `DNK con reparos`: revise RUT, montos o fecha; el documento vale con observacion.
- `EPR prolongado`: no reemita con otro folio, siga consultando con el mismo `trackId`.
- Mezclar ambientes: timbrar en certificacion y consultar en produccion siempre falla.

## Repositorios

- Referencia de tooling publico chileno: https://github.com/gobcl - organizacion verificada en GitHub para integraciones con servicios del Estado. La emision DTE se valida siempre contra la documentacion tecnica del SII.

## Referencias oficiales

- SII Factura electronica: https://www.sii.cl/factura_electronica/factura_electronica.html
- Portal SII Mipyme y emision: https://www.sii.cl
- Documentacion tecnica de formatos XML y firma: sitio SII > Factura electronica > Documentacion tecnica
- Codigo Tributario art. 97 sobre sanciones: https://www.leychile.cl

## Output Contract

Entregue: tipo DTE, folio, trackId, estado final del poll y archivos XML/PDF archivados.
