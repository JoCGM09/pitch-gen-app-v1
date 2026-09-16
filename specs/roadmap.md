# Roadmap

<!-- Generado/actualizado por /constitution. Fases MUY pequeñas: cada fase debe ser demostrable de principio a fin, no una capa técnica aislada ("no: construir toda la capa de base de datos" / "sí: el usuario puede ver la lista de franjas horarias disponibles"). -->

- [x] Fase 1: **Motor Core Standalone.** Navegación base (teclado, clic, puntero), estructura de datos (slides y pasos internos/fragments) funcionando sin backend. Deep-linking por slide implementado.
- [x] Fase 2: **Contenido y Visuales.** Cargar el contenido de `pitch.md`, soporte de diagramas (Mermaid/SVG) mapeando a pasos internos y animaciones de transición (CSS).
- [x] Fase 3: **Servidor Realtime.** Implementación del backend (Supabase Realtime / Socket.io), tracking del estado de la presentación y broadcast de eventos.
- [x] Fase 4: **Experiencia de Audiencia (Móvil).** UI para la audiencia, lógica para recibir y responder polls activos (Sí/No, opción única, Q&amp;A).
- [ ] Fase 5: **Pulido, Q&A Directo y Deploy.** Eliminar vistas de presentador innecesarias, permitir gestión de preguntas directamente en la pantalla de proyección y desplegar la aplicación en Render y Vercel.

