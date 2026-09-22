---
name: anuncios-pagos
description: "Para avisos pagados en Google, Meta, TikTok: revisar con datos, puntaje claro y cambios con permiso. (anuncios, ads, publicidad)"
---

# Anuncios Pagos

## Core Rule

**Primero se mira, después se toca: ningún cambio sin evidencia y sin su permiso.**

## When to Use

- Revisar si su inversión en Google, Instagram, TikTok o Facebook rinde.
- Planear campaña con presupuesto y meta medible.
- Crear textos e imágenes del aviso.

## Process

1. **Audite con datos (fuente: https://github.com/AgriciDaniel/claude-ads)**
   - Plataforma por plataforma con fechas: gasto, ventas, costo por venta. Cobertura: Google, Meta, YouTube, LinkedIn, TikTok, Microsoft, Apple, Amazon, Reddit, Pinterest, Snapchat, X.
   - Scoring separado: `health_score` 0-100, `evidence_coverage`, `regulatory_exposure`, `opportunities`. Estados: `pass`, `fail`, `unknown`, `not_applicable`.
   - Pesos por severidad: critical 5, high 3, medium 1, informational 0. Cobertura: 80-100% graded, 60-79% provisional, bajo 60% insufficient_evidence. Sin datos no se califica.
2. **Plan**
   - 1 meta por campaña, presupuesto diario tope y fecha de revisión.
   - Empiece con monto bajo: $5.000 CLP diarios por 7 días, tope $35.000 total antes de subir.
3. **Cambios con permiso (6 gates)**
   - Muestre antes y después con tope de gasto. Usted aprueba cada cambio.
   - Gates antes de aplicar: 1) capability exacta habilitada, 2) IDs de cuenta y objeto explícitos, 3) diff con blast radius, 4) aprobación del dueño dentro de topes, 5) idempotency key + destino de auditoría + rollback + ventana de verificación, 6) verificar estado remoto. Sin topes no hay escritura.
   - Nada de borrado permanente. Todo cambio se puede deshacer.
   - Comandos: `/ads setup`, `/ads audit`, `/ads plan`, `/ads create`, `/ads launch --draft`, `/ads monitor`, `/ads optimize --draft`, `/ads experiment`, `/ads report`, `/ads research refresh`, `/ads validate`, `/ads status`, `/ads next`. Atajos: `/ads google`, `/ads meta`, `/ads amazon`, `/ads reddit`. En plugin: `/claude-ads:ads`.
4. **Reporte**
   - Tabla semanal: gasto, ventas, costo por venta y decisión escrita: mantener, pausar o escalar.
   - No usar para venta orgánica por WhatsApp o Marketplace; en ese caso use `venta-redes-sociales`.

## Output Contract

Entregue: puntaje por plataforma, plan con topes y reporte semanal. Meta: 1 venta medible con costo objetivo antes de escalar.
