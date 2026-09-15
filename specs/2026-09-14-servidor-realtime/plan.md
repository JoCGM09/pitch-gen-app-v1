# Plan: Fase 3 - Servidor Realtime

## 1. Setup del Servidor (Node + Express + Socket.io)
[x] 1. Crear directorio `/server` y hacer `npm init -y`.
[x] 2. Instalar dependencias: `express`, `socket.io`, `cors`, `typescript`, `ts-node`, y los tipos necesarios.
[x] 3. Configurar `tsconfig.json` básico para backend.
[x] 4. Crear archivo `index.ts` levantando un servidor HTTP Express en el puerto 3001, con CORS habilitado para todos los orígenes, adjuntando la instancia de Socket.io.

## 2. Modelo de Estado en Memoria
[x] 1. En `/server`, crear una estructura (ej. clase o servicio) para gestionar el estado de la sesión actual en memoria.
[x] 2. El estado debe almacenar:
    - ID de la slide y step actual.
    - ID del trigger activo (si lo hay).
    - Objeto de agregación de resultados de encuestas (ej. `Map<TriggerID, Set<VoterUUID>>` o similar para contar votos de Sí/No sin duplicar).

## 3. Emisión desde el Deck (Presentador -> Servidor)
[x] 1. En la carpeta `/deck` (front-end de Fase 1 y 2), instalar `socket.io-client`.
[x] 2. Crear un composable `useSocket.ts` que se conecte a `http://localhost:3001`.
[x] 3. Modificar el watcher del `currentSlideIndex` y `currentStepIndex` en `DeckView.vue` para que emita un evento Socket.io (ej. `presenter:sync`) al servidor con el estado actual y el `interactionTrigger` si existe.

## 4. Recepción y Broadcasting (Servidor -> Audiencia)
[x] 1. En el backend, escuchar el evento `presenter:sync`.
[x] 2. Actualizar el estado en memoria.
[x] 3. Hacer un *broadcast* (ej. `audience:sync`) a todos los clientes conectados notificándoles del nuevo estado y trigger activo.
[x] 4. Escuchar un evento `audience:vote` (que contenga el UUID y la respuesta).
[x] 5. Validar el UUID en memoria, registrar el voto, y hacer *broadcast* de los resultados agregados (ej. `poll:results`) para que el deck u otros clientes puedan actualizar sus gráficos en vivo.

## 5. Validación y Script de Prueba Cliente
[x] 1. Crear un archivo `/server/public/test-client.html` (servido estáticamente por Express) que se conecte por Socket.io.
[x] 2. El cliente debe generar su propio UUID en localstorage (o simularlo), escuchar el evento `audience:sync` imprimiéndolo en consola, y tener botones para emitir `audience:vote`.
[x] 3. Verificar que el ciclo completo funciona: El deck avanza -> emite al server -> server transmite al test-client -> test-client vota -> server agrupa -> server emite resultados al deck.
