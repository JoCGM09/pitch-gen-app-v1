# Requirements — Experiencia de Audiencia Móvil (Fase 4)

<!-- Generado/actualizado por /feature -->

## Alcance
- Interfaz web móvil (`/audiencia`) para que los asistentes interactúen durante la presentación.
- Pantalla de espera interactiva (estado inactivo): Muestra un mensaje de "Esperando la siguiente pregunta..." y expone tarjetas con apuntes/resúmenes técnicos clave de la charla acumulados hasta el momento.
- Recepción y visualización de encuestas interactivas (polls binarios o de opción múltiple) empujadas en tiempo real.
- Registro de voto con mensaje de éxito de confirmación ("¡Voto registrado con éxito!").
- Canal de Q&A (preguntas abiertas) disponible en todo momento.
- Autogeneración de UUID de sesión (almacenado en LocalStorage) al acceder por primera vez.

## Fuera de alcance
- Autenticación, login o recolección de correos de la audiencia.
- Persistencia de datos post-evento (todo reside de manera efímera en memoria en el servidor).
- Visualización de la presentación (slides, animaciones, diagramas) en los dispositivos móviles.
- Visualización de los resultados consolidados de las encuestas en los móviles de los participantes.
- Ingreso por medio de un PIN manual de sala (el acceso es directo vía URL/QR).

## Decisiones tomadas
- **Estilo Visual Móvil:** Uso de paleta Dark Mode DevTools (Fondo principal `#080C14`, Tarjetas `#1E293B`, Acentos en `#3B82F6` y `#8B5CF6`), consistente con el deck técnico.
- **Pantalla Inactiva:** La interfaz por defecto combina el mensaje de espera "Esperando la siguiente pregunta..." junto a la lista interactiva de apuntes/resúmenes de la charla acumulados en tiempo real.
- **Resultados de Polls:** Tras votar, la audiencia verá estrictamente un mensaje de éxito ("¡Voto registrado con éxito!"). Los resultados acumulados (conteo) se reflejan exclusivamente de cara al proyector/deck del presentador.
- **Ingreso de Audiencia:** Conexión y asignación de sesión en un solo paso al entrar a `/audiencia` o escaneando un código QR genérico (sin PIN adicional).
- **Anti-abuso Q&A:** Caja de texto libre para Q&A con un rate-limit estricto (1 pregunta cada 30 segundos validado por UUID de sesión) y un límite de 250 caracteres máximos.

## Contexto relevante
- Corresponde a la capa "Audiencia (móvil)" definida en `specs/mission.md` y depende de un servidor WebSockets (Socket.io + Vue) detallado en `specs/tech-stack.md`.
- El control de disparo del poll sigue recayendo en la navegación de la presentación (basado en `interactionTrigger`). El celular recibe estos eventos y altera la UI dinámicamente interrumpiendo la pantalla inactiva.
- Los apuntes (resúmenes) se mandan desde el servidor periódicamente y el cliente deberá unirlos al estado actual acumulándolos para la revisión libre de la audiencia.

## Consideraciones de seguridad de esta feature
- **Sanitización:** Todo el texto enviado mediante la caja Q&A debe sanitizarse tanto en el frontend como en el backend para prevenir XSS.
- **Spam / Rate-limiting:** El límite de 1 envío / 30s debe bloquearse en el frontend (deshabilitando el botón y mostrando un temporizador) y reforzarse en el backend apoyándose en el UUID (y potencialmente en la IP en nivel base) para mitigar floods en el sistema.
- **Privacidad:** No se capturará ninguna información de identificación personal (PII). El UUID generado es descartable y sólo útil para evitar que alguien vote más de una vez en el mismo poll o que sature el envío de Q&A.
