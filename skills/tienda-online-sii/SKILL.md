---
name: tienda-online-sii
description: "Para vender online en Chile con boleta SII: tienda, voucher, RCV y F29 paso a paso. (tienda-online, ecommerce, boleta)"
---

# Tienda Online SII

## Core Rule

**Venda tranquilo: cada pago queda con su boleta al instante, sin multas.**

## When to Use

- Crear tienda online que venda con boleta electrónica válida en Chile.
- Conectar POS del local con la página web y mantener stock único.
- Realizar cierre diario, revisar Registro de Compras y Ventas (RCV) y declarar F29 mensual.

## Process

1. **Papeles primero**
   - RUT con inicio de actividades y giro de ventas al por menor. Sin esto no venda.
   - Certificado digital vigente para firmar documentos tributarios electrónicos.
   - Folios CAF autorizados por tipo de documento: boleta electrónica 39, factura electrónica 33, nota de crédito 61.
   - Verifique vigencia en sii.cl antes de emitir.

2. **Qué documento por cada pago**
   - Tarjeta aprobada en web o POS: el voucher de pago autorizado por el SII ya es válido como boleta. No emita una segunda boleta por la misma venta.
   - Efectivo, transferencia o pago no presencial sin voucher válido: boleta electrónica 39 obligatoria al momento de la venta.
   - Empresa que pide factura: factura electrónica 33, nunca boleta. Pida RUT, razón social y giro.
   - Devolución o anulación: nota de crédito electrónica 61 que referencia el folio original.
   - Si vende menos de 20 unidades al mes, parta en Mercado Libre antes de pagar hosting o Webpay.

3. **Flujo de venta web sin descuadres**
   - Orden: carrito -> crear pago -> cliente paga -> confirmar pago en su servidor -> recién entonces emitir boleta -> enviar por correo o QR.
   - Nunca emita la boleta antes de confirmar el pago con el proveedor.
   - Regla de montos: monto carrito = monto pago = monto boleta. Si difieren, frene, anote el descuadre y no emita.
   - Confirme pago, encole la emisión y responda de inmediato; no haga esperar al cliente por el SII.
   - Guarde: orden, folio, trackId, estado. No guarde RUT completo ni claves en texto plano.

4. **Local + web con stock único**
   - Un solo stock para ambos canales. Si llega a cero, la web bloquea la venta.
   - Cierre diario 23:59 obligatorio: suma local + suma web + cuadre de stock. Si no cuadra, frene ventas y revise.
   - Sin internet: venda solo con folio de reserva, anote folio, fecha y monto en cuaderno y sincronice antes de 24 horas.

5. **Mes a mes sin atraso**
   - Revise su RCV cada semana en sii.cl y corrija diferencias de folios.
   - F29 hasta el día 12, o 20 si es facturador electrónico, con IVA 19%. F22 anual hasta el 30 de abril.
   - Costo base mensual: contador + hosting + certificado prorrateado + patente. Sume comisión aproximada 3,5% por venta. Si su margen es menor a 30%, frene y revise precio con su contador.

## Ejemplo minimo

### Ejemplo 1: Decisión de documento

```text
Cliente paga 25.000 CLP con tarjeta Webpay aprobada -> voucher válido como boleta. NO emitir boleta 39 adicional.
Cliente transfiere 25.000 CLP -> emitir boleta electrónica 39 por 25.000 CLP, enviar PDF + QR.
Empresa pide factura por 100.000 CLP + IVA -> emitir factura 33 por 119.000 CLP total.
Cliente devuelve producto con boleta 45 -> emitir nota de crédito 61 que referencia folio 45.
```

### Ejemplo 2: Verificación de montos antes de emitir

```python
# Ejemplo mínimo: no emitir si hay descuadre
carrito = 25990
pago_confirmado = 25990
if carrito != pago_confirmado:
    raise ValueError("Descuadre: frenar y no emitir boleta")
# recién aquí emitir boleta 39 por 25990
emitir_boleta_39(monto=carrito, folio_caf=46)
```

### Ejemplo 3: Cierre diario

```text
Fecha: 2026-10-14, cierre 23:59
Local POS: 8 ventas, 184.000 CLP, folios 40-47
Web: 5 ventas, 129.950 CLP, folios 48-52 + 1 voucher Webpay 18.990 CLP
Total día: 332.940 CLP
Stock: mochila negra inicial 20 - vendidas 3 = 17, sistema muestra 17 -> cuadra
Folios restantes 39: 120. Si quedan < 20, solicitar nuevos CAF.
```

## Repositorios

- Plataforma ecommerce: https://github.com/woocommerce/woocommerce - plataforma abierta de comercio electronico sobre WordPress para tienda, catalogo y checkout.

## Referencias oficiales

- SII Factura Electrónica: https://www.sii.cl/factura_electronica/
- SII Servicios Online y RCV: https://www.sii.cl/servicios_online/
- SII Boleta Electrónica: https://www.sii.cl/factura_electronica/boleta_electronica/
- SII Formulario F29: https://www.sii.cl/formularios_electronicos/f29/
- SII Registro Compras y Ventas: https://www.sii.cl/servicios_online/rcv/
- Transbank Webpay para voucher válido: https://www.transbank.cl
- Google Ads y Meta Blueprint solo si hará pauta pagada: https://support.google.com/google-ads y https://www.facebook.com/business/learn

## Output Contract

Entregue: checklist marcado por paso, documentos emitidos con folio, reporte de ventas, conversión, rechazos y folios restantes, y qué falta para la primera venta real. Registre orden, folio, trackId y estado sin RUT completo ni claves.
