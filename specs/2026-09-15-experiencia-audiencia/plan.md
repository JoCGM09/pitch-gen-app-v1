# Plan — Experiencia de Audiencia (Móvil)

<!-- Grupos de tareas numerados. Cada grupo: chico, verificable por separado, un commit lógico. /implement ejecuta un grupo a la vez. -->

## 1. Definición de Marca y Arquitectura Base
- [x] Aplicar skill `definicion-de-marca` para establecer las bases visuales del modo oscuro móvil, colores de encuestas y tipografías.
- [x] Crear el layout principal (SPA móvil) forzando el Dark Mode (Tailwind config y clases base) en la vista de audiencia.
- [x] Crear el router básico en Vue para capturar la URL `/join/:sessionId`.

## 2. Generación de Patrón de Reconexión (Skill)
- [x] Ejecutar el agente con la skill `generador-de-skills` para crear una skill de patrón estandarizado de reconexión robusta entre Vue 3 y Socket.io.
- [x] Implementar la conexión de Socket.io generada en el frontend de la audiencia usando la sesión de la URL.

## 3. Implementación de Vistas y Componentes Base (UI)
- [x] Implementar el estado en memoria (Store o ref global) para saber si hay un "poll activo", qué tipo es y sus resultados temporales.
- [x] Crear el componente `PollView` con animaciones CSS "Fade Simple".
- [x] Crear el componente `QAForm` (input de texto y botón) para el envío privado de preguntas.

## 4. Conexión Realtime (Sockets e Interacción)
- [x] Emitir evento al servidor desde `PollView` al seleccionar una opción estática y manejar el UI post-voto.
- [x] Emitir evento al servidor desde `QAForm` aplicando debounce básico para evitar flooding.
- [x] Escuchar eventos del servidor para activar o desactivar un poll en pantalla automáticamente.

## 5. Pulido y Preparación Final
- [x] Revisar el layout en modo responsivo móvil asegurándose de que la interfaz no es escalable ni dependiente del scroll innecesario.
- [x] Verificar que refrescar la página (cambio de Socket ID) reinicia el estado del votante como fue acordado (modificado por revisión de seguridad).

## 6. Correcciones de Seguridad (Post-Revisión)
- [x] Mover el uso del secret (`VITE_PRESENTER_SECRET` y hardcoded `'mi-clave-segura'`) a un input de UI en `DeckView.vue`.
- [x] Cambiar el limitador de rate y trackeo de doble voto para que confíe en la IP (`socket.handshake.address`) en el backend.
- [x] Generar un UUID en el cliente usando `localStorage` en `AudienceView.vue` para asegurar la permanencia en caso de refrescos.
- [x] Limitar el tamaño de las llaves que se guardan en el estado del servidor (`sessionState.ts`) para prevenir saturación.
