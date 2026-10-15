---
name: privacidad-datos-chile
description: "Para tratar datos de clientes en Chile: consentimiento, derechos y avisos. Ley 19.628 y 21.719. (privacidad, datos-personales)"
---

# Privacidad Datos Chile

## Core Rule

**Pida solo los datos que necesita y diga para qué los usa.**

## When to Use

- Formularios que piden RUT, correo, teléfono o dirección.
- Guardar clientes en base de datos o planilla.
- Publicar app o tienda que trata datos.

## Base legal resumida

- Ley 19.628 sobre proteccion de la vida privada: regula autorizacion, derechos de acceso, rectificacion, cancelacion y oposicion, y plazo de respuesta.
- Ley 21.719 que modifica la Ley 19.628: crea la Agencia de Proteccion de Datos, refuerza consentimiento, deber de informar, medidas de seguridad y aviso de brechas.
- Ambas exigen validar cada caso con abogado. Esta skill orienta, no reemplaza asesoria legal.

## Process

1. **Mínimo necesario**
   - Si no lo necesita para vender o facturar, no lo pida.
   - Separe datos obligatorios de opcionales en el formulario.
2. **Aviso simple**
   - Texto corto junto al formulario: qué guarda, para qué y cómo pedir borrado.
   - Guarde evidencia del consentimiento: fecha, texto aceptado y version del aviso.
3. **Derechos**
   - Cliente puede pedir ver, corregir o borrar sus datos. Responda en 30 días corridos prorrogables (art. 11 Ley 19.628 mod. Ley 21.719).
   - Ante fuga: avise a afectados y a la autoridad dentro de 72 horas.
4. **Seguridad minima**
   - Acceso solo a personal autorizado, claves en vault, respaldo cifrado.
   - No exporte RUT, correo o telefono a planillas sin control ni los envie por chat.
5. **Valide**
   - Confirme reglas con abogado: esto orienta, no reemplaza.

## Ejemplo minimo: tabla de datos y aviso

```text
Dato solicitado | Para que se usa        | Obligatorio | Base
RUT             | Emitir boleta/factura | Si          | Obligacion legal SII
Correo          | Enviar comprobante    | Si          | Ejecucion de venta
Telefono        | Coordinar despacho    | Opcional    | Consentimiento
Direccion       | Despacho y facturacion| Solo si hay despacho | Ejecucion de venta
```

Texto modelo para pegar junto al formulario:

```text
Aviso de privacidad: guardamos RUT, correo y direccion solo para
vender, facturar y despachar. No compartimos sus datos con fines
publicitarios. Puede pedir acceso, correccion o eliminacion en
contacto@mi-tienda.cl. Respondemos en 30 dias corridos.
En caso de incidente de seguridad avisamos en 72 horas.
```

Checklist rapido antes de publicar:

```text
[ ] Solo pido lo necesario
[ ] Aviso visible junto al formulario
[ ] Registro de consentimiento con fecha
[ ] Procedimiento para responder derechos en 30 dias
[ ] Plan de aviso de brecha en 72 horas
```

## Repositorios

- Buenas practicas de seguridad: https://github.com/OWASP/CheatSheetSeries - coleccion de guias concisas de seguridad para proteger datos personales en aplicaciones.

## Referencias oficiales

- Ley 19.628 sobre proteccion de la vida privada: https://www.leychile.cl/Navegar?idLey=19628
- Ley 21.719 sobre proteccion de datos personales y Agencia: https://www.leychile.cl/Navegar?idLey=21719
- Buscador de normas LeyChile: https://www.leychile.cl
- SII sobre RUT en documentos tributarios: https://www.sii.cl
- Transbank Developers sobre datos de pago: https://www.transbankdevelopers.cl

## Output Contract

Entregue: aviso de privacidad en palabras simples y lista de datos que guarda con su motivo.
