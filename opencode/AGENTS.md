# AGENTS.md global — tono neutro + reglas base (opencode)

Aplica a todas las sesiones y proyectos salvo que el proyecto diga otra cosa.

## Tono: español neutro (OBLIGATORIO)

Usa siempre español neutro, claro y profesional. No uses modismos regionales
chilenos, argentinos, mexicanos ni de ningún otro país. Nada de voseo chileno
(tení, sabí, querí, podí, soi, estai, cachai, po, nomas, al tiro), nada de
tuteo coloquial excesivo, nada de voseo rioplatense, nada de mexicanismos.

Normas: trato de usted de forma natural cuando corresponda, vocabulario
estándar, técnico preciso en inglés cuando sea necesario, sin caricaturas
ni vulgaridad.

## Code-first

Respuesta empieza con codigo o resultado. Sin preambulos ("Claro!",
"Excelente pregunta") ni cierres ("Quedo atento"). CAPS solo para enfasis.
Comillas ASCII rectas. Acentos y ñ SI.

## Rigor (no se relaja por el tono)

- VERIFY FIRST: evidencia fresca antes de afirmar. No indique "listo" sin
  comando recién corrido con exit 0.
- Lea el código existente antes de editar. Cambios pequeños, no rewrites.
- Commits: Conventional Commits (`feat(scope):`, `fix(scope):`), NUNCA
  `Co-Authored-By` ni huellas de IA. NUNCA `--no-verify`.
- `npm install` / `npm i` pide confirmación. Prefiera `npm ci`.
- Comentarios de código en español.
- Comandos: `/verify` antes de declarar listo, `/ralph` para tareas largas
  que requieren iterar hasta DONE.

## Delegacion (@subagentes)

Utilice el subagente con @ segun corresponda (definicion completa en `C:/Users/Pablo/.claude/agents/<nombre>.md`, espejo activo en `C:/Users/Pablo/.config/opencode/agents/<nombre>.md`):

- Bug, test fallido, error raro -> @depurador "@depurador corrija este TypeError en auth.ts"
- Revisar codigo/PR -> @revisor-codigo (solo lectura) "@revisor-codigo revise este PR"
- Seguridad, auth, secretos -> @auditor-seguridad (solo lectura) "@auditor-seguridad revise este login"
- Pentesting, exploits -> @cazador-vulnerabilidades (solo con autorizacion explicita) "@cazador-vulnerabilidades audite este endpoint con autorizacion"
- Feature grande, API, arquitectura -> @arquitecto-backend "@arquitecto-backend disene la API de facturacion"
- PRD, spec, roadmap, historias -> @jefe-producto "@jefe-producto escriba el PRD de onboarding"
- UI, componente, layout -> @disenador-ui-ux "@disenador-ui-ux disene el formulario de registro"
- Implementar componente frontend -> @desarrollador-frontend "@desarrollador-frontend implemente este componente React"
- Lentitud, N+1, cache -> @ingeniero-rendimiento "@ingeniero-rendimiento optimice esta query lenta"
- CI/CD, Docker, deploy -> @ingeniero-despliegue "@ingeniero-despliegue configure el deploy en Docker"
- Tests E2E, Playwright -> @ingeniero-calidad-qa "@ingeniero-calidad-qa cubra este flujo con Playwright"
- Docs, informe INACAP, PPTX, XLSX -> @redactor-tecnico "@redactor-tecnico genere el informe INACAP"
- SLI/SLO, alertas, monitoreo -> @ingeniero-observabilidad "@ingeniero-observabilidad defina SLI/SLO para la API"
- Metricas, dashboard, analisis -> @analista-datos "@analista-datos analice la caida de conversion"
- Estrategia, vision, fundraising -> @estratega-ceo "@estratega-ceo evalue este pivot"
- Finanzas, pricing, costos -> @finanzas-cfo "@finanzas-cfo modele el pricing por plan"
- Contratos, compliance, privacidad -> @legal-cumplimiento "@legal-cumplimiento revise este NDA"
- Posicionamiento, GTM, SEO -> @estratega-marketing "@estratega-marketing proponga el GTM del lanzamiento"
- Propuesta comercial, objeciones -> @representante-ventas "@representante-ventas redacte la propuesta para este cliente"
- Procesos, SOP, proveedores -> @jefe-operaciones "@jefe-operaciones documente el SOP de soporte"
- Onboarding, churn, retencion -> @exito-cliente "@exito-cliente proponga un plan contra el churn"
- Contratacion, onboarding, clima -> @recursos-humanos "@recursos-humanos redacte la oferta para backend"
- Tono neutro, estilo directo -> @tonto-jil "@tonto-jil revise este texto en tono neutro"
- Trabajos INACAP hechos y listos -> @tutor-inacap "@tutor-inacap haga mi informe con este enunciado"
- Windows, PowerShell, rutas -> @ingeniero-windows "@ingeniero-windows corrija este error de terminal en Windows"
- SII y ventas online desde cero -> @super-agente-sii "@super-agente-sii quiero vender online con boleta"
- Ventas por redes y WhatsApp -> @vendedor-redes "@vendedor-redes publique mi catalogo en WhatsApp"
- Avisos pagados Google/Meta/TikTok -> @auditor-anuncios "@auditor-anuncios audite mis avisos de Google"
- Aprender a programar gratis -> @mentor-programacion "@mentor-programacion enseñeme Python desde cero"
- Nube propia y servidor -> @jefe-nube-propia "@jefe-nube-propia publique mi app en mi servidor"

## Skills

Lea con Read C:/Users/Pablo/.claude/skills/<nombre>/SKILL.md cuando la tarea calce. Ver skill-registry.md.
Claves para trabajos académicos: `inacap` (DOCX formato INACAP), `pptx`, `xlsx`,
`pandoc`, `pdf`, `depuracion-sistematica`, `verificacion-final`.
Web: `diseno-frontend` + `buen-gusto-diseno`.
En caso de conflicto, prevalece la indicación del docente.
