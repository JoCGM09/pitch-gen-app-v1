# Requerimientos: Fase 3 - Servidor Realtime

## 1. Alcance
Construir e integrar el backend de Node.js + Socket.io responsable de sincronizar el estado del deck del presentador con los clientes de la audiencia y recopilar interacciones en tiempo real.

## 2. Decisiones Tomadas
*   **Estructura:** El servidor vivirá en un directorio separado (`/server`) en la raíz del proyecto, con su propio `package.json`.
*   **Stack:** Node.js, Express y Socket.io. 
*   **Base de datos / Persistencia:** **N/A**. Se ha decidido explícitamente descartar Supabase. Todo el estado de la presentación (polls activos, paso actual, sesión) vivirá en la memoria volátil de Node.js (usando Maps/Sets).
*   **Tolerancia a fallos:** Si el servidor se reinicia, arranca con estado efímero en blanco. El servidor se sincronizará y recuperará su contexto cuando el presentador avance de slide (Sincronización tardía).
*   **Identidad de Audiencia:** Para prevenir que una misma persona vote múltiples veces, los clientes web generarán un UUID aleatorio que guardarán en `localStorage` y lo enviarán como identificador único en los WebSockets.
*   **Puertos Locales:** `5173` para Deck (Vite) y `3001` para Server (Node.js).

## 3. Fuera de Alcance (Exclusiones explícitas)
*   **Vistas de la Audiencia (UI):** No se construirá la UI final de la audiencia móvil en esta fase, solo un script cliente simple (HTML/JS) de pruebas para verificar que los WebSockets envían y reciben datos.
*   **Persistencia de datos (BDD):** No se conectará a ninguna base de datos SQL o NoSQL. Los datos de la charla mueren al reiniciar el proceso de Node.
*   **Autenticación segura:** No habrá login ni validación estricta de usuarios más allá del UUID en localstorage.
