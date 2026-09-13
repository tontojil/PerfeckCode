---
name: pagos-webpay
description: "Para cobrar con tarjeta vía Webpay Plus: crear, confirmar y validar pagos sin fraude. (webpay, pagos, transbank)"
---

# Pagos Webpay

## Core Rule

**El pago solo vale si usted lo confirma en su servidor. Lo que diga el navegador no vale.**

## When to Use

- Cobrar con tarjeta débito o crédito en su página.
- Pasar de pruebas a producción con Transbank.
- Devoluciones y anulaciones.
- Cobros repetidos a clientes inscritos (OneClick) o varias tiendas a la vez (Mall).

## Camino sin programar (recomendado si parte de cero)

- WordPress + WooCommerce en pesos chilenos + plugin oficial "Transbank Webpay" (autor TransbankDevelopers) + SSL con candado.
- Pruebas con comercio 597055555532 y tarjeta VISA 4051885600446623, CVV 123, RUT 11.111.111-1.
- Producción: formulario de validación en Transbank Developers + compra real de $50. Sin validación no hay ventas reales.
- Localhost sirve para probar, producción exige dominio real con SSL.

## Process

1. **Crear**
   - Orden de compra única de máximo 26 caracteres, monto exacto, página de retorno HTTPS.
   - Guarde orden + token en su base antes de mandar al cliente a pagar.
2. **Confirmar**
   - Al volver el cliente, confirme con el token en su servidor.
   - Válido solo si: estado aprobado y código 0 y monto igual al de su base y orden igual a la guardada. Si algo difiere, rechace y no emita boleta.
   - El token se usa una sola vez: si llega repetido, devuelva el mismo resultado sin cobrar ni emitir de nuevo.
   - Si el pago queda abandonado o se acaban los 4 minutos, marque la orden pendiente-reintento con la misma orden, sin cobrar doble.
3. **Ambientes**
   - Pruebas: códigos de integración de Transbank, tarjetas de prueba.
   - Producción: afiliación en Transbank, validación con compra real de $50, llave secreta en servidor, nunca en la página.
4. **Devolver**
   - Tarjeta: anule en Webpay con el código de comercio original primero, luego nota de crédito 61 al folio. Efectivo o transferencia: solo nota 61. Prohibido devolver sin nota.
5. **Si algo falla**
   - Formulario Webpay dura 4 minutos: si se acaba, la orden queda pendiente y se reintenta sin cobrar doble.
   - Códigos -97/-98/-99 son límite del banco del cliente, no error suyo.
   - Webpay solo opera en pesos chilenos sin decimales.

## Output Contract

Entregue: estado (aprobado/rechazado/abandonado), monto verificado contra su base, y orden lista para boleta.
