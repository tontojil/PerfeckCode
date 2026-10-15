---
name: anuncios-pagos
description: "Para avisos pagados en Google, Meta, TikTok: revisar con datos, puntaje claro y cambios con permiso. (anuncios, ads, publicidad)"
---

# Anuncios Pagos

## Core Rule

**Primero se mira, después se toca: ningún cambio sin evidencia y sin su permiso.**

## When to Use

- Revisar si la inversión en Google, Instagram, Facebook, TikTok, YouTube o LinkedIn genera ventas con costo aceptable.
- Planificar una campaña nueva con presupuesto máximo, meta medible y fecha de revisión.
- Crear textos, imágenes y videos del aviso con propuesta de valor clara.
- No usar para venta orgánica por WhatsApp, Instagram orgánico o Mercado Libre; en ese caso use `venta-redes-sociales`.

## Process

1. **Audite con datos**
   - Pida por plataforma y por rango de fechas: gasto, impresiones, clics, conversiones, ventas, costo por venta, ROAS.
   - Fuente recomendada para auditoría estructurada: https://github.com/AgriciDaniel/claude-ads
   - Califique por separado: `health_score` 0-100, `evidence_coverage`, `regulatory_exposure`, `opportunities`. Estados: `pass`, `fail`, `unknown`, `not_applicable`.
   - Pesos por severidad: critical 5, high 3, medium 1, informational 0. Cobertura: 80-100% calificado, 60-79% provisional, bajo 60% `insufficient_evidence`. Sin datos no se califica.
   - Verifique conversion tracking, UTM y coincidencia de montos antes de opinar sobre rendimiento.

2. **Plan con topes**
   - Defina 1 meta por campaña, 1 audiencia, 1 oferta, presupuesto diario máximo y fecha de revisión.
   - Inicio sugerido para negocio pequeño en Chile: 5.000 CLP diarios por 7 días, tope total 35.000 CLP antes de escalar.
   - Defina criterio de decisión por escrito: mantener, pausar o escalar según costo por venta objetivo.

3. **Cambios con permiso (6 gates)**
   - Muestre antes y después con tope de gasto. La persona dueña aprueba cada cambio.
   - Gates antes de aplicar: 1) capacidad exacta habilitada, 2) IDs de cuenta y objeto explícitos, 3) diff con alcance de impacto, 4) aprobación dentro de topes, 5) clave de idempotencia + destino de auditoría + plan de reversión + ventana de verificación, 6) verificación de estado remoto. Sin topes no hay escritura.
   - No realice borrado permanente. Todo cambio debe ser reversible.
   - Comandos sugeridos: `/ads setup`, `/ads audit`, `/ads plan`, `/ads create`, `/ads launch --draft`, `/ads monitor`, `/ads optimize --draft`, `/ads experiment`, `/ads report`, `/ads validate`, `/ads status`, `/ads next`. Atajos: `/ads google`, `/ads meta`, `/ads tiktok`.

4. **Reporte semanal**
   - Tabla: gasto, ventas, costo por venta, ROAS y decisión escrita.
   - Incluya aprendizaje y siguiente paso concreto para la semana siguiente.

## Ejemplos mínimos

### Ejemplo 1: Tabla de auditoría

| Plataforma | Periodo | Gasto CLP | Ventas CLP | Costo/venta | ROAS | health_score | Decisión |
|---|---|---:|---:|---:|---:|---:|---|
| Google Search | 01-07 oct | 32.000 | 96.000 | 8.000 | 3,0 | 78 | mantener |
| Meta IG | 01-07 oct | 35.000 | 42.000 | 14.000 | 1,2 | 55 | pausar y revisar creativo |
| TikTok | 01-07 oct | 15.000 | sin datos | desconocido | desconocido | insufficient_evidence | corregir tracking |

### Ejemplo 2: Plan de campaña simple

```text
Campaña: Google Search - despacho Santiago
Meta: 10 ventas en 7 días con costo máximo 9.000 CLP por venta
Presupuesto: 5.000 CLP/día, tope 35.000 CLP total
Audiencia: búsqueda "flores a domicilio Santiago"
Revisión: día 7, 18:00. Si costo > 12.000, pausar. Si costo < 9.000, escalar 20%.
```

### Ejemplo 3: Copy base

```text
Titular: Despacho de flores en Santiago en 24 horas
Descripción: Precio con IVA desde 19.990 CLP. Pago con tarjeta y boleta electrónica.
Llamado: Cotice por WhatsApp hoy y reciba mañana.
UTM: ?utm_source=google&utm_medium=cpc&utm_campaign=flores_santiago
```

## Referencias oficiales

- Google Ads Ayuda: https://support.google.com/google-ads
- Google Política publicitaria: https://support.google.com/adspolicy
- Meta Blueprint (capacitación oficial): https://www.facebook.com/business/learn
- Meta Ayuda para anunciantes: https://www.facebook.com/business/help
- TikTok Business Help Center: https://ads.tiktok.com/help/
- LinkedIn Marketing Labs: https://www.linkedin.com/help/linkedin/answer/a424902

## Output Contract

Entregue: puntaje por plataforma, plan con topes y reporte semanal. Meta mínima: 1 venta medible con costo objetivo antes de escalar. Registre cuenta, campaña, gasto y decisión sin guardar claves ni tokens.
