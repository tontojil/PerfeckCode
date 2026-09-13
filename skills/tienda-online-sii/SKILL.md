---
name: tienda-online-sii
description: "Para vender online en Chile con boleta SII: tienda, voucher, RCV y F29 paso a paso. (tienda-online, ecommerce, boleta)"
---

# Tienda Online SII

## Core Rule

**Venda tranquilo: cada pago queda con su boleta al instante, sin multas.**

## When to Use

- Crear tienda online que venda de verdad con boleta.
- Conectar maquina POS del local con la pagina web y stock unico.
- Cierre diario, RCV y declaracion F29 mensual.

## Process

1. **Papeles primero**
   - RUT con inicio de actividades y giro de ventas. Sin esto no venda.
   - Certificado digital vigente para firmar. Folios CAF por tipo de documento.
2. **Que documento por pago**
   - Si el cliente paga con tarjeta aprobada, el comprobante del pago ya es su boleta. No emita otra.
   - Efectivo o transferencia: boleta electrónica 39 obligatoria al momento.
   - Empresa que pide factura: factura 33, nunca boleta.
   - Si vende menos de 20 al mes, parta en Mercado Libre antes de pagar hosting o Webpay.
3. **Flujo de venta web**
   - Carrito -> crear pago -> cliente paga -> confirmar pago en su servidor -> recién entonces emita la boleta -> enviar por email o QR.
   - Nunca emita la boleta antes de confirmar el pago.
   - Monto carrito = monto pago = monto boleta. Si difieren, frene y anote el descuadre, prohibido emitir.
   - Confirme el pago, encole la boleta y responda de inmediato; no haga esperar al cliente por el SII.
4. **Local + web juntos**
   - Un solo stock para ambos. Si queda cero, la web bloquea la venta.
   - Cierre diario 23:59 obligatorio: suma local + suma web + cuadre de stock a cero. Si no cuadra, frene ventas.
   - Sin internet: venda solo con folio de reserva, anote folio-fecha-monto en cuaderno y sincronice antes de 24 horas.
5. **Mes a mes**
   - Revise su Registro de Compras y Ventas cada semana.
   - F29 hasta el 12, o 20 si es facturador electrónico, con IVA 19%. F22 anual hasta el 30 de abril. Nota de crédito 61 para anular o devolver.
   - Costo base mensual: contador + hosting + certificado prorrateado + patente. Sume ~3.5% de comisión por venta. Si su margen es menor a 30%, frene y revise precio con su contador.

## Output Contract

Entregue: checklist marcado por paso, documentos emitidos con folio, reporte de ventas-conversión-rechazos-folios restantes, y que falta para la primera venta real. Registre orden-folio-trackId-estado sin RUT ni claves.
