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

## Delegación (herramienta `subagent`)

Delegue con la herramienta nativa `subagent`, indicando el id del agente y un
prompt completo. El catálogo activo vive en
`~/.config/opencode/agents/<nombre>.md`; las definiciones de otros clientes son
referencia, no configuración de OpenCode.

- Bug, test fallido, error raro -> `depurador` "corrija este TypeError en auth.ts"
- Revisar código/PR -> `revisor-codigo` (solo lectura) "revise este PR"
- Seguridad, auth, secretos -> `auditor-seguridad` (solo lectura) "revise este login"
- Pentesting, exploits -> `cazador-vulnerabilidades` (solo con autorización explícita) "audite este endpoint con autorización"
- Feature grande, API, arquitectura -> `arquitecto-backend` "diseñe la API de facturación"
- PRD, spec, roadmap, historias -> `jefe-producto` "escriba el PRD de onboarding"
- UI, componente, layout -> `disenador-ui-ux` "diseñe el formulario de registro"
- Implementar componente frontend -> `desarrollador-frontend` "implemente este componente React"
- Lentitud, N+1, cache -> `ingeniero-rendimiento` "optimice esta query lenta"
- CI/CD, Docker, deploy -> `ingeniero-despliegue` "configure el deploy en Docker"
- Tests E2E, Playwright -> `ingeniero-calidad-qa` "cubra este flujo con Playwright"
- Docs, informe INACAP, PPTX, XLSX -> `redactor-tecnico` "genere el informe INACAP"
- Sistematización UC personas mayores, plan acción -> `trabajo-social` "sistematice mi práctica con Jara en centro de mayores"
- SLI/SLO, alertas, monitoreo -> `ingeniero-observabilidad` "defina SLI/SLO para la API"
- Métricas, dashboard, análisis -> `analista-datos` "analice la caída de conversión"
- Estrategia, visión, fundraising -> `estratega-ceo` "evalúe este pivote"
- Finanzas, pricing, costos -> `finanzas-cfo` "modele el pricing por plan"
- Contratos, compliance, privacidad -> `legal-cumplimiento` "revise este NDA"
- Posicionamiento, GTM, SEO -> `estratega-marketing` "proponga el GTM del lanzamiento"
- Propuesta comercial, objeciones -> `representante-ventas` "redacte la propuesta para este cliente"
- Procesos, SOP, proveedores -> `jefe-operaciones` "documente el SOP de soporte"
- Onboarding, churn, retención -> `exito-cliente` "proponga un plan contra el churn"
- Contratación, onboarding, clima -> `recursos-humanos` "redacte la oferta para backend"
- Trabajos INACAP hechos y listos -> `tutor-inacap` "haga mi informe con este enunciado"
- Windows, PowerShell, rutas -> `ingeniero-windows` "corrija este error de terminal en Windows"
- Linux, terminal, servidores, SSH -> `ingeniero-linux` "administre mi servidor sin romper nada"
- SII y ventas online desde cero -> `super-agente-sii` "quiero vender online con boleta"
- Ventas por redes y WhatsApp -> `vendedor-redes` "publique mi catálogo en WhatsApp"
- Avisos pagados Google/Meta/TikTok -> `auditor-anuncios` "audite mis avisos de Google"
- Aprender a programar gratis -> `mentor-programacion` "enséñeme Python desde cero"
- Nube propia y servidor -> `jefe-nube-propia` "publique mi app en mi servidor"

Coherencia de rol: `arquitecto-backend` y `disenador-ui-ux` diseñan;
`jefe-producto` define producto; `revisor-codigo`, `auditor-seguridad` y
`cazador-vulnerabilidades` son solo lectura. No implementan código. Perfeck
implementa el backend inline y delega el frontend en `desarrollador-frontend`.

## Ruteo proporcional

Resuelva inline la tarea pequeña y entendida, sin invocar subagentes. Delegue solo si cumple alguna condición: exploración mayor a 3 llamadas, 2 o más unidades independientes con superficies disjuntas, sesión larga que exige dividir el trabajo, o riesgo alto que exige verificador independiente. El tamaño o la cantidad de archivos nunca decide el ruteo.

## Puertas de clarificación y humanas

Si el alcance, los criterios de aceptación o la superficie de edición son
ambiguos, pregunte antes de actuar. No haga push, merge, deploy, publicación
ni release sin confirmación explícita. El commit queda en manos del usuario.

## Revisión por riesgo

Califique el riesgo antes de revisar. En riesgo alto (datos, seguridad, auth, secretos, contratos compartidos, concurrencia, delivery sin test) exija verificador independiente y revisión 4R acotada al diff. En riesgo medio aplique una pasada focalizada. En riesgo bajo basta lectura estructural. Congele el candidato con `git diff` antes de revisar.

## Test-first

Por cada regla nueva escriba 1 test en rojo antes de implementarla. Por cada comando existente agregue 1 test de regresión que cubra su comportamiento. Si no existe test runnable, explique la excepción y corra checks funcionales equivalentes antes de declarar listo.

## RDD

Trabaje por estados visibles: Working cuando aún cambia, Checking cuando ejecuta prueba funcional y revisión acotada, Ready cuando el candidato exacto tiene evidencia suficiente, Needs decision cuando solo usted puede decidir alcance, riesgo o delivery. Congele el candidato con `git diff` antes de revisar para que la evidencia pertenezca a esa versión exacta. La revisión es proporcional al riesgo y el commit queda siempre en sus manos.

## Skills

Cargue la skill con la herramienta `skill` por su id cuando la tarea calce.
Consulte skill-registry.md como referencia. Si falta una skill en el registro
y vive en `~/.claude/skills/<nombre>/SKILL.md`, léala con Read.

- Trabajos académicos: skill `inacap` (DOCX formato INACAP), skill `sistematizacion-uc` (DOCX formato UC Trabajo Social personas mayores, Jara/Martinic/Cifuentes), skill `pptx`, skill `xlsx`, skill `pandoc`, skill `pdf`.
- Verificación y depuración: skill `verificacion-final`, skill `depuracion-sistematica`.
- Web y diseño: skill `diseno-frontend`, skill `buen-gusto-diseno`.
- En caso de conflicto, prevalece la indicación del docente.
