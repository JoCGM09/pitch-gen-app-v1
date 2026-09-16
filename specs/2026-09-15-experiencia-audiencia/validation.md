# Validation — Experiencia de Audiencia (Móvil)

## Criterios de aceptación
- [ ] La aplicación se carga con estilo Dark Mode forzado independientemente de las preferencias del sistema del celular.
- [ ] Entrar a `/join/123` conecta automáticamente la aplicación web al servidor Socket.io en la sala "123".
- [ ] Las encuestas estáticas (Apertura y Pulso) aparecen en el celular con un "fade simple" cuando el servidor lo indica.
- [ ] Al seleccionar una opción en un poll, se bloquea la vista actual para que no se pueda volver a votar, pero un F5 vuelve a mostrar la opción (según decisión Socket ID).
- [ ] El envío del Q&A se realiza exitosamente con un rate limit preventivo.
- [ ] No existe vista pública o feed de las preguntas de otros.

## Cómo probarlo manualmente
1. Iniciar servidor frontend y backend.
2. Desde un móvil o usando herramientas de desarrollador, abrir `http://localhost:<puerto>/join/test-room`.
3. Verificar que la conexión de socket es exitosa.
4. Forzar el envío de un evento "activar poll de apertura" desde el backend (mock) y observar que aparece la encuesta en pantalla mediante un fade in.
5. Votar y comprobar la emisión del evento hacia el servidor.
6. Enviar preguntas al Q&A repetidamente para comprobar que el debounce o rate limit se activa.

## Checklist antes de mergear
- [ ] Tests pasando (Agent: test-writer - `/test`)
- [ ] Revisión de seguridad sin hallazgos critical/high (Agent: security-reviewer - `/security-review`)
- [ ] plan.md con todos los grupos marcados como hechos
