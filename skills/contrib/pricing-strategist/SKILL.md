---
name: pricing-strategist
description: Disena precios por plan con costos, margen y valor percibido. Usala cuando definas precios de un producto o servicio. (precios, planes, margen)
---

# Pricing Strategist

Define precios que cubren costos, dejan margen y se entienden por plan. El objetivo es pasar de un precio intuitivo a una tabla de precios con costo unitario, margen declarado y regla de ajuste.

Esta skill complementa a finanzas sin duplicarla. Esta skill define la estrategia comercial por plan y el margen objetivo. Finanzas modela VAN, TIR y flujos con esos precios como insumo. Tambien complementa a informe-maestro porque aporta la tabla de precios con parametros justificados en vez de cifras sin origen.

## Core Rule

Ningun precio se publica sin costo unitario calculado, sin margen declarado y sin regla escrita de cuando se ajusta.

## Cuándo usar

- Debes fijar el precio de un producto, servicio o suscripcion por planes.
- Tienes costos claros pero no sabes que margen aplicar por plan.
- El usuario pide "define mis precios" o "arma los planes del servicio".
- Vas a incluir precios en un informe financiero y necesitas justificar cada cifra.

## Process

1. Calcula el costo unitario real. Suma costos directos, prorratea costos compartidos y registra cada supuesto con codigo S01.
2. Segmenta por valor. Define dos a tres planes con diferencias claras de alcance, limite y soporte, sin traslapes confusos.
3. Fija el margen objetivo por plan. Declara el porcentaje esperado y calcula el precio como costo dividido por uno menos margen.
4. Valida contra mercado. Compara con tres referencias reales y explica si quedas bajo, igual o sobre el mercado, con motivo.
5. Prueba la sensibilidad. Calcula que pasa si los costos suben 10% o si las ventas caen 15%, y registra el punto de equilibrio.
6. Escribe las reglas comerciales. Define descuento maximo, vigencia, medio de pago y condicion de reajuste por IPC o costos.
7. Arma la tabla final de precios. Incluye plan, alcance, limite, precio con IVA y sin IVA, margen y condicion.
8. Entrega segun el Output Contract de esta skill con todos los parametros a la vista.

## Ejemplo deficiente contra ejemplo correcto

Ejemplo deficiente:

```python
# precios.py
# Precio intuitivo sin calculo
precio_plan_pro = 9990  # parece buen numero
```

Problema: no hay costo, no hay margen, no hay IVA separado y no hay regla de ajuste.

Ejemplo correcto:

```python
# precios.py
# Precio con costo y margen declarados
costo_unitario = 5200  # incluye soporte y prorrateo de plataforma
margen_objetivo = 0.35  # 35% sobre precio sin IVA
precio_sin_iva = round(costo_unitario / (1 - margen_objetivo))  # 8000
precio_con_iva = round(precio_sin_iva * 1.19)  # 9520 con IVA 19%
# Regla: reajuste semestral por IPC si supera 3% acumulado.
```

Explicacion: el costo es explicito, el margen es declarado, el IVA queda separado y la regla de reajuste evita improvisar.

## Niveles de aplicación

- Nivel simple: un producto, costo directo, un margen unico, tabla de un plan. Sirve para un servicio puntual.
- Nivel estandar: dos a tres planes, costos prorrateados, sensibilidad basica y reglas comerciales. Sirve para suscripcion o servicio recurrente.
- Nivel portafolio: multiples productos, margenes diferenciados por segmento, punto de equilibrio por plan. Sirve para informe financiero con VAN y TIR.

## Reglas estrictas

- No fijes precios sin costo unitario escrito. El costo estimado se marca como supuesto S01 con fuente.
- No publiques precios con IVA incluido sin mostrar el neto. En Chile el 19% de IVA se separa siempre.
- No ofrezcas descuentos sin tope escrito. Todo descuento tiene maximo, vigencia y responsable que lo autoriza.
- No copies precios de la competencia sin explicar tu costo. El mercado referencia, tu costo decide.
- No dejes planes con traslape. Cada plan tiene un limite claro que justifica subir al siguiente.

## Checklist aplicable

- [ ] Costo unitario calculado con directos y prorrateo explicado.
- [ ] Dos a tres planes con alcance, limite y soporte diferenciados.
- [ ] Margen objetivo declarado por plan con formula visible.
- [ ] Precio sin IVA y con IVA calculados con 19% separado.
- [ ] Comparacion con tres referencias de mercado con posicion explicada.
- [ ] Sensibilidad con costos mas 10% y ventas menos 15%.
- [ ] Reglas de descuento, vigencia y reajuste escritas.
- [ ] Tabla final entregada segun el Output Contract.

## Output Contract

Entrega siempre en este orden:

```markdown
1. Tabla de costos: concepto, valor mensual, prorrateo y supuesto S01.
2. Tabla de planes: plan, alcance, limite, precio sin IVA, precio con IVA, margen.
3. Formula aplicada con valores: precio = costo / (1 - margen).
4. Comparacion de mercado con tres referencias y posicion.
5. Sensibilidad y punto de equilibrio por plan.
6. Reglas comerciales con descuentos y reajuste.
```

Formato de fila de plan:

```markdown
Plan Pro: hasta 100 clientes, soporte por correo, $8.000 sin IVA, $9.520 con IVA, margen 35%.
```

## Referencias oficiales

- Servicio de Impuestos Internos, IVA en Chile: https://www.sii.cl
- Banco Central de Chile, IPC y tasas: https://www.bcentral.cl
- Guia de precios de Stripe para SaaS: https://stripe.com/guides/pricing
