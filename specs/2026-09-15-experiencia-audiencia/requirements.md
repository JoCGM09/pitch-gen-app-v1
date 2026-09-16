# Requirements — Experiencia de Audiencia (Móvil)

<!-- Generado/actualizado por /feature -->

## Alcance
- Aplicación web (vista móvil) para la interacción de la audiencia en tiempo real.
- Interacciones sincronizadas con el presentador: Polls binarios, pulso de opciones y Q&A abierto.
- UX/UI: Modo oscuro forzado (Dark Mode) en celulares.
- Animación: Transiciones de 'Fade Simple' al mostrar u ocultar encuestas.
- Ingreso del usuario mediante acceso directo por URL (vía código QR), sin pantalla intermedia para poner código manual.

## Fuera de alcance
- Generación y entrega de apuntes de resumen progresivo (se excluye de esta fase y del alcance por solicitud del usuario).
- Prevención de doble voto sofisticada (se usará sólo Socket ID, por lo que un refresh limpia la sesión, priorizando velocidad sobre unicidad absoluta).
- Pantalla manual de ingreso de sesión.
- Feed público de preguntas (el Q&A será privado y sólo el servidor/presentador lo verá).
- Opciones de encuestas dinámicas desde DB o configuraciones externas (serán opciones estáticas en el código para la V1).

## Decisiones tomadas
- **UX/UI Móvil:** Dark Mode (Forzado).
- **Animación Polls:** Fade Simple.
- **Opciones de Polls:** Estáticas definidas en el frontend (código).
- **Visibilidad Q&A:** Privada (solo presentador/servidor).
- **Acceso:** URL directa /join/<session_id>.
- **Prevención de Voto:** Basada únicamente en Socket ID, descartando localStorage para simplificar esta etapa.

## Contexto relevante
- Depende de `mission.md` y `tech-stack.md`. Vue para la SPA sin dependencias externas pesadas, Socket.io para el canal en tiempo real en la infraestructura actual.
- Tolerancia a fallos: La caída del servidor realtime afectará la encuesta, pero no la vista del presentador. Se requiere implementar un patrón robusto de reconexión Vue + Socket.io.

## Consideraciones de seguridad de esta feature
- Prevención básica (rate limit/debounce) al enviar preguntas al Q&A privado para evitar flooding.
- Sanitización de entradas del Q&A para prevenir inyecciones XSS (aunque sólo el presentador las vea, el servidor no debe procesar HTML crudo).
