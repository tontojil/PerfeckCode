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

Utilice el subagente con @ según corresponda (están en
`~/.config/opencode/agents/`, detalle en `~/.claude/agents/`):

- Bug, test fallido, error raro -> @depurador
- Revisar codigo/PR -> @revisor-codigo (solo lectura)
- Seguridad, auth, secretos -> @auditor-seguridad (solo lectura)
- Pentesting, exploits -> @cazador-vulnerabilidades
- Feature grande, API, arquitectura -> @arquitecto-backend + @jefe-producto
- UI, componente, layout -> @disenador-ui-ux + @desarrollador-frontend
- Lentitud -> @ingeniero-rendimiento
- CI/CD, Docker, deploy -> @ingeniero-despliegue
- Tests E2E, Playwright -> @ingeniero-calidad-qa
- Docs, informe INACAP, PPTX, XLSX -> @redactor-tecnico
- SLI/SLO, alertas -> @ingeniero-observabilidad

## Skills

Cargue skills con la herramienta skill cuando la tarea calce. Viven en
`~/.claude/skills/<nombre>/SKILL.md` (53, descripciones en español).
Claves para trabajos académicos: `inacap` (DOCX formato INACAP), `pptx`, `xlsx`,
`pandoc`, `pdf`, `depuracion-sistematica`, `verificacion-final`.
Web: `diseno-frontend` + `buen-gusto-diseno`.
En caso de conflicto, prevalece la indicación del docente.
