# Validation — Experiencia de Audiencia Móvil (Fase 4)

<!-- Cómo sabemos que esto está listo para mergear. Concreto, no
     "funciona bien". -->

## Criterios de aceptación
- [ ] La UI móvil está accesible en `/audiencia`, muestra los colores asignados (Dark Mode DevTools) y ajusta correctamente su contenido al viewport de celular, sin barras horizontales.
- [ ] Un usuario nuevo obtiene un UUID automáticamente vía `localStorage` sin que medien formularios o logins.
- [ ] La pantalla inactiva ilustra el mensaje de "Esperando la siguiente pregunta..." y va listando los apuntes entregados desde el servidor.
- [ ] La llegada del evento de un poll entrante interrumpe y reemplaza momentáneamente la pantalla inactiva para mostrar la pregunta.
- [ ] Al seleccionar una opción, el poll desaparece en el móvil y se reemplaza exclusivamente con el texto "¡Voto registrado con éxito!". Los conteos/resultados generales no son devueltos a la interfaz.
- [ ] En el módulo de preguntas (Q&A), el input se bloquea exactamente a 250 caracteres.
- [ ] Después de enviar una pregunta al Q&A, no se puede enviar otra por 30 segundos, indicándose el tiempo restante o el estado de bloqueo en el propio botón de envío.

## Cómo probarlo manualmente
1. Abrir la herramienta de desarrollador del navegador en modo simulación de dispositivo móvil e ingresar a `/audiencia`.
2. Verificar los colores del tema y la correcta lectura del texto base (esperando).
3. Inspeccionar el `localStorage` en DevTools para asegurarse de que el identificador UUID está generado y guardado.
4. Simular la emisión de un apunte técnico desde el servidor y comprobar que una nueva tarjeta aparece sin necesidad de recargar la página.
5. Simular el disparo de un Poll (ej. "¿Construir In-house o Comprar SaaS?"). Verificar que las opciones del Poll tapen la pantalla inactiva. Votar, verificar la emisión de la data, y confirmar el mensaje "¡Voto registrado con éxito!".
6. Navegar a la caja de Q&A, redactar una pregunta superior a 250 caracteres y confirmar que se corta o no se permite seguir escribiendo.
7. Enviar la pregunta, e intentar enviar una segunda pregunta en menos de 30 segundos verificando que el botón se encuentra inhabilitado para evitar spam.
8. Cerrar la pestaña y reabrir (o desconectar la red y reconectar). El app debe inicializarse, re-usar el UUID e integrarse a la fase actual de la charla transparentemente.

## Checklist antes de mergear
- [ ] Tests pasando (Agent: test-writer - `/test`)
- [ ] Revisión de seguridad sin hallazgos critical/high (Agent: security-reviewer - `/security-review`)
- [ ] `plan.md` con todos los grupos marcados como hechos
