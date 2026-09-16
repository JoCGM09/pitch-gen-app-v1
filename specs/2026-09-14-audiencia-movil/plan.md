# Plan — Experiencia de Audiencia Móvil (Fase 4)

<!-- Grupos de tareas numerados. Cada grupo: chico, verificable por separado, un commit lógico. /implement ejecuta un grupo a la vez. -->

## 1. Configuración de Ruta y Estado Base
- [x] Configurar el layout base de `AudienceView.vue` en la ruta `/audiencia`.
- [x] Aplicar los Design Tokens del estilo Dark Mode DevTools (`#080C14`, `#1E293B`, `#3B82F6`, `#8B5CF6`) configurando un fondo base adecuado para móviles.
- [x] Implementar función para generar un UUID de sesión (si no existe) y persistirlo localmente (`localStorage`).
- [x] Inicializar el socket con el backend y establecer el estado de conexión (`isConnected`).

## 2. Pantalla Inactiva (Idle State) y Apuntes
- [x] Crear el componente `IdleScreen.vue` o sección predeterminada que muestre el estado de espera.
- [x] Renderizar el mensaje "Esperando la siguiente pregunta...".
- [x] Implementar un manejador de estado (composable o ref reactiva) para los `apuntes` recibidos desde el servidor.
- [x] Mostrar en una lista/grid de tarjetas con fondo `#1E293B` los puntos clave que se vayan acumulando.
- [x] Añadir transiciones suaves (fade-in, slide-up) al renderizar una nueva tarjeta de apunte.

## 3. Flujo de Poll y Votación
- [x] Crear un componente `ActivePoll.vue` para mostrar el poll disparado desde la presentación (sobrepone la vista inactiva).
- [x] Generar la lista de opciones (botones en acento `#3B82F6` / `#8B5CF6`) a partir de la carga útil del evento de WebSocket.
- [x] Implementar método de selección: emitir evento `submitVote` hacia el socket con el UUID de sesión y la opción elegida.
- [x] Implementar el estado "Post-Votación": al registrar el voto, reemplazar las opciones y el poll con el estado de éxito y el texto "¡Voto registrado con éxito!".

## 4. Funcionalidad del Q&A Abierto
- [x] Crear componente `QABox.vue` disponible o abrible desde la vista de Audiencia en todo momento (ej. un input persistente abajo o un Floating Action Button).
- [x] Incorporar el campo de texto con longitud máxima de 250 caracteres e indicador de caracteres restantes.
- [x] Implementar el botón de "Enviar" y emitir el evento `submitQA` sanitizando el contenido.
- [x] Aplicar el cooldown local: deshabilitar el botón y el input por 30 segundos tras enviar, agregando una pista visual (temporizador/cuenta atrás) indicando cuándo estará disponible de nuevo.

## 5. Manejo de Fallos y Reconexión
- [x] Agregar validaciones para que la UI se auto-recupere tras un re-conexionado con Socket.io (ej., consultar poll activo actual al conectarse).
- [x] Mostrar un pequeño y no intrusivo indicador visual ("Reconectando...") si hay pérdida de websocket, manteniendo la experiencia ininterrumpida.
