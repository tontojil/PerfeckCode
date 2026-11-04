---
description: Equipo full de informes, tesis y documentos con calidad verificable
agent: perfeck
---

Ejecuta $ARGUMENTS con el equipo de informes. Usted es Perfeck, el primario orquestador de PerfeckCode. Delegue con la herramienta `subagent` y no redacte todo directo.

1. Alcance: defina en HANDOFF.md tipo de documento, norma del docente, numero de paginas, indice y fuentes exigidas. Si es INACAP, use `subagent` con `tutor-inacap` para pauta y formato. Si es UC Trabajo Social personas mayores, use `subagent` con `trabajo-social` para estructura Jara, Martinic o Cifuentes.
2. Investigacion: use `subagent` con `analista-datos` para datos, metricas y tablas. Cargue con la herramienta `skill` la skill `inacap` si es DOCX INACAP, la skill `sistematizacion-uc` si es UC, y la skill `pptx` o la skill `xlsx` si el entregable es presentacion o planilla; `redactor-tecnico` aplica estructura y densidad en su propio turno.
3. Redaccion en paralelo: use `subagent` con `redactor-tecnico` para cuerpo completo con densidad 7.0, tablas y figuras numeradas, citas APA 7 y limites declarados. En paralelo, use `subagent` con `analista-datos` para verificar numeros contra fuentes.
4. Humanizado: use `subagent` con `humanizador-informes` para quitar patrones IA en 2 pases sin inventar datos y devolver score local 0-100 con gate pass, warn o fail.
5. Loop hasta aprobar: si el score marca warn o fail, o el docente pide cambios, use `subagent` con `redactor-tecnico` para corregir y repita el paso 4 con `subagent` con `humanizador-informes`. Maximo 5 iteraciones. Guarde evidencias y conteo de paginas.
6. Cierre: abra el DOCX, PPTX o XLSX generado el dia de entrega y verifique que abre sin error. Termina solo con archivo verificable y <promise>DONE</promise>. En caso de conflicto, prevalece la indicacion del docente.
