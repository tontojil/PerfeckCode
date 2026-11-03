---
description: Equipo full de informes, tesis y documentos con calidad verificable
agent: tonto-jil
---

Ejecuta $ARGUMENTS con el equipo de informes. Eres tonto-jil, el primario orquestador. Delega con la herramienta Task y no redactes todo directo.

1. Alcance: define en HANDOFF.md tipo de documento, norma del docente, numero de paginas, indice y fuentes exigidas. Si es INACAP, Task a tutor-inacap para pauta y formato. Si es UC Trabajo Social personas mayores, Task a trabajo-social para estructura Jara o Martinic o Cifuentes.
2. Investigacion: Task a analista-datos para datos, metricas y tablas. Carga skill informe-maestro para estructura, skill inacap si es DOCX INACAP, skill sistematizacion-uc si es UC, skill pptx o xlsx si el entregable es presentacion o planilla.
3. Redaccion en paralelo: Task a redactor-tecnico para cuerpo completo con densidad 7.0, tablas y figuras numeradas, citas APA 7 y limites declarados. En paralelo, Task a analista-datos para verificar numeros contra fuentes.
4. Humanizado: Task a humanizador-informes para quitar patrones IA en 2 pases sin inventar datos. Luego Task con skill detector-ia para score local 0-100 con gate pass warn fail.
5. Loop hasta aprobar: si el score marca warn o fail, o el docente pide cambios, corrige con Task a redactor-tecnico y repite paso 4. Maximo 5 iteraciones. Guarda evidencias y conteo de paginas.
6. Cierre: abre el DOCX, PPTX o XLSX generado el dia de entrega y verifica que abre sin error. Termina solo con archivo verificable y <promise>DONE</promise>. En caso de conflicto, prevalece la indicacion del docente.
