---
name: month-end-close
description: Cierra el mes con calendario, conciliacion y control de variaciones. Usala para dejar cifras cuadradas y auditables. (cierre mensual, conciliacion, contabilidad)
---

# Month End Close

Cierra el mes contable con cifras conciliadas y variaciones explicadas. El objetivo es dejar un balance de cierre que cuadra, con cada cuenta revisada y con toda variacion relevante justificada por escrito.

Esta skill complementa a finanzas sin duplicarla. Esta skill asegura que las cifras de entrada estan conciliadas y explicadas. Finanzas usa esas cifras para proyectar, valorar y decidir. Tambien complementa a informe-maestro porque aporta estados y conciliaciones verificadas para los capitulos financieros.

## Core Rule

Ningun mes se declara cerrado con cuentas sin conciliar o con variaciones relevantes sin explicacion escrita y responsable asignado.

## Cuándo usar

- Debes cerrar el mes de una pyme, proyecto o emprendimiento.
- Las cifras no cuadran y necesitas un proceso ordenado de conciliacion.
- El usuario pide "cierra el mes" o "concilia estas cuentas".
- Vas a incluir estados mensuales en un informe y necesitas que sean auditables.

## Process

1. Fija el calendario de cierre. Define dias para corte, conciliacion, ajustes, revision y firma, con responsable por tarea.
2. Aplica el corte. Registra ingresos y gastos del mes con fecha real, separa lo devengado de lo pagado y congela el periodo.
3. Concilia cada cuenta. Compara libro contra banco, contra facturas y contra inventario, y marca cada diferencia como timing, error o pendiente.
4. Registra ajustes con respaldo. Todo ajuste lleva folio, motivo, monto, cuenta afectada y documento de respaldo adjunto.
5. Aplica la compuerta de variacion. Compara cada cuenta contra el mes anterior y contra el presupuesto, y explica por escrito toda variacion que supere el umbral definido.
6. Revisa con checklist. Verifica IVA, retenciones, remuneraciones, depreciacion y provisiones antes de firmar el cierre.
7. Firma y congela. El responsable firma el balance de cierre, se bloquea el periodo y los cambios posteriores requieren asiento de ajuste.
8. Entrega el paquete segun el Output Contract de esta skill.

## Ejemplo deficiente contra ejemplo correcto

Ejemplo deficiente:

```markdown
<!-- Cierre sin conciliacion -->
Ventas de octubre: $3.500.000 aprox.
Gastos: varios. Diferencia con banco: se revisa despues.
```

Problema: hay aproximaciones, no hay conciliacion bancaria, no hay umbral de variacion y el mes queda abierto sin responsable.

Ejemplo correcto:

```markdown
<!-- Cierre con conciliacion y variacion -->
Ventas octubre: $3.542.000 neto, conciliado con 42 DTE del SII.
Banco: saldo libro $1.210.000 contra cartola $1.230.000.
Diferencia $20.000 por cheque no cobrado N 4521, clasificada como timing.
Variacion: gastos de software suben 12% por licencia anual, umbral 10%, explicado.
Estado: conciliado. Responsable: P. Soto. Periodo congelado.
```

Explicacion: cada cifra tiene respaldo, la diferencia bancaria queda clasificada y la variacion sobre el umbral queda explicada.

## Niveles de aplicación

- Nivel basico: caja y banco conciliados, ventas contra DTE, gastos con respaldo. Sirve para emprendimiento sin inventario.
- Nivel estandar: ademas inventario, remuneraciones, IVA y provisiones, con umbral de variacion de 10%. Sirve para pyme con informe mensual.
- Nivel auditable: ademas depreciacion, conciliacion completa por cuenta, papeles de trabajo foliados y firma dual. Sirve para cierre que alimenta auditoria o financiamiento.

## Reglas estrictas

- No cierres con diferencias sin clasificar. Toda diferencia es timing con documento, error corregido o pendiente con responsable y fecha.
- No registres ajustes sin respaldo. Ajuste sin folio y sin documento se rechaza en la revision.
- No ignores el umbral de variacion. Si defines 10%, toda cuenta que lo supere lleva explicacion escrita.
- No mezcles periodos. Gastos de noviembre no entran en octubre aunque la factura llegue tarde. Van como provision o al mes que corresponde.
- No reabras un periodo congelado sin asiento de ajuste. El cambio queda trazado con fecha, motivo y firma.

## Checklist aplicable

- [ ] Calendario de cierre con tareas, fechas y responsables cumplido.
- [ ] Corte aplicado con devengado separado de pagado.
- [ ] Banco conciliado con cada diferencia clasificada.
- [ ] Ventas conciliadas contra DTE del SII y compras con factura valida.
- [ ] Inventario contado o valorizado cuando aplica.
- [ ] IVA, retenciones y remuneraciones revisados con formularios.
- [ ] Variaciones sobre el umbral explicadas por escrito.
- [ ] Balance firmado, periodo congelado y paquete entregado.

## Output Contract

Entrega siempre en este orden:

```markdown
1. Calendario cumplido con responsables y fechas reales.
2. Balance de cierre del mes con comparativo contra mes anterior y presupuesto.
3. Conciliacion bancaria con saldo libro, saldo cartola y diferencias clasificadas.
4. Conciliacion de ventas contra DTE y de compras contra facturas.
5. Tabla de variaciones sobre el umbral con explicacion y responsable.
6. Ajustes foliados con motivo, monto y respaldo.
7. Declaracion de cierre con firma y periodo congelado.
```

Formato de linea de variacion:

```markdown
Software: $185.000 contra $165.000, mas 12%, umbral 10%. Motivo: licencia anual. Responsable: P. Soto.
```

## Referencias oficiales

- Servicio de Impuestos Internos, facturacion y RCV: https://www.sii.cl
- Comision para el Mercado Financiero, normas contables: https://www.cmfchile.cl
- NIIF para pymes del IFRS: https://www.ifrs.org
