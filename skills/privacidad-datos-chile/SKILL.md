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

## Ejemplo deficiente contra ejemplo correcto

Ejemplo de aviso deficiente:

```text
Al usar esta tienda acepta nuestras politicas de privacidad.
```

Problema: no dice que datos guarda, para que los usa ni como pedir borrado. No sirve como consentimiento informado.

Ejemplo de aviso correcto:

```text
Aviso de privacidad: guardamos RUT, correo y direccion solo para
vender, facturar y despachar. No compartimos sus datos con fines
publicitarios. Puede pedir acceso, correccion o eliminacion en
contacto@mi-tienda.cl. Respondemos en 30 dias corridos.
En caso de incidente de seguridad avisamos en 72 horas.
Version del aviso: v1.2 del 2026-10-01.
```

Ejemplo de tabla de datos deficiente:

```text
Pedimos nombre, correo, telefono, direccion, fecha de nacimiento.
```

Problema: pide datos sin justificar cada uno ni marcar obligatorios contra opcionales.

Ejemplo de tabla de datos correcta:

```text
Dato solicitado | Para que se usa        | Obligatorio | Base
RUT             | Emitir boleta/factura | Si          | Obligacion legal SII
Correo          | Enviar comprobante    | Si          | Ejecucion de venta
Telefono        | Coordinar despacho    | Opcional    | Consentimiento
Direccion       | Despacho y facturacion| Solo si hay despacho | Ejecucion de venta
```

## Niveles de aplicacion

- Base o formulario simple: aviso visible, tabla de datos con motivo y registro de consentimiento con fecha.
- Intermedio o tienda con base de datos: lo anterior mas control de accesos por rol, respaldo cifrado y procedimiento escrito para responder derechos en 30 dias.
- Avanzado o app con volumen: todo lo anterior mas registro de actividades de tratamiento, evaluacion de impacto, contrato con proveedores que tratan datos y simulacro de aviso de brecha en 72 horas.

## Reglas estrictas

- Pida solo lo necesario para vender, facturar o despachar. Todo dato extra debe ser opcional y justificado.
- No exporte RUT, correo o telefono a planillas sin control ni los envie por chat, correo sin cifrado o ticket publico.
- No use datos de compra para publicidad sin consentimiento separado y revocable.
- Guarde evidencia de cada consentimiento: fecha, texto aceptado y version del aviso. Sin evidencia no hay consentimiento valido.
- Ante fuga o acceso no autorizado, avise a afectados y a la autoridad dentro de 72 horas y registre fecha, alcance y medidas.
- Valide cada caso con abogado. Esta skill orienta, no reemplaza asesoria legal.

### Checklist aplicable antes de publicar

- [ ] Solo pido lo necesario y separo obligatorios de opcionales en el formulario.
- [ ] Aviso visible junto al formulario con que guardo, para que y como pedir borrado.
- [ ] Registro de consentimiento con fecha, texto y version del aviso.
- [ ] Procedimiento para responder acceso, rectificacion, cancelacion y oposicion en 30 dias corridos.
- [ ] Accesos por rol, claves en vault y respaldo cifrado verificados.
- [ ] Plan de aviso de brecha en 72 horas con responsable definido.

## Output Contract

Entregue: aviso de privacidad en palabras simples, tabla de datos con motivo y base, version del aviso y lista de pendientes del checklist. Registre fecha y responsable sin copiar datos personales reales.
