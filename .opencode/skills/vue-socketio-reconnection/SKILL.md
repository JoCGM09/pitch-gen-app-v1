---
name: vue-socketio-reconnection
description: "Implementa un patrón robusto de reconexión y manejo de estado para Socket.io dentro de Vue 3, ideal para entornos con conectividad inestable (redes de eventos). Úsala cuando necesites inicializar la conexión en tiempo real o manejar los eventos de desconexión."
---

# Patrón de Reconexión Vue 3 + Socket.io

## Cuándo usar esta skill
- Cuando se está configurando la capa de red/realtime en una SPA de Vue 3.
- Cuando se requiera manejar la caída del servidor o desconexiones del cliente de manera silenciosa y robusta.

## Contexto y Reglas
En escenarios de presentaciones en vivo, el WiFi puede fallar. El deck principal debe poder seguir funcionando incluso si el socket se desconecta, y los clientes móviles deben reconectar automáticamente y en silencio cuando la red vuelve. 
No debemos abrumar al usuario con alertas de "Se perdió la conexión" a menos que sea críticamente necesario para su interacción actual.

## Workflows

### 1. Configurar el composable `useSocket`
Usa el siguiente patrón para centralizar la conexión y el estado de reconexión usando Vue Composition API. Esto permite que cualquier componente sepa si está conectado o no, sin instanciar múltiples sockets.

```javascript
// src/composables/useSocket.ts
import { ref, onUnmounted } from 'vue';
import { io, Socket } from 'socket.io-client';

const socket = ref<Socket | null>(null);
const isConnected = ref(false);
const isReconnecting = ref(false);

export function useSocket(sessionId: string) {
  if (!socket.value) {
    // Configuración robusta de reconexión
    socket.value = io(import.meta.env.VITE_WS_URL || 'http://localhost:3000', {
      query: { sessionId },
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 10000,
    });

    socket.value.on('connect', () => {
      isConnected.value = true;
      isReconnecting.value = false;
      console.log('✅ Conectado al servidor realtime');
    });

    socket.value.on('disconnect', (reason) => {
      isConnected.value = false;
      console.warn('❌ Desconectado:', reason);
      if (reason === 'io server disconnect') {
        // La desconexión fue iniciada por el servidor, necesitas reconectar manualmente
        socket.value?.connect();
      }
    });

    socket.value.on('io.reconnect.attempt', () => {
      isReconnecting.value = true;
    });
  }

  // Cleanup automático solo si el componente dueño explícitamente lo quiere, 
  // pero generalmente en una SPA global como esta, mantenemos el socket vivo.
  // onUnmounted(() => { /* opcional: socket.value?.disconnect() */ });

  return {
    socket,
    isConnected,
    isReconnecting
  };
}
```

### 2. Consumir el Socket en Componentes
Cuando un componente necesite enviar información o reaccionar a un poll, simplemente importa y usa el composable.

```vue
<script setup lang="ts">
import { useSocket } from '../composables/useSocket';
import { useRoute } from 'vue-router';

const route = useRoute();
const sessionId = route.params.sessionId as string;

// Inicializa o recupera la conexión
const { socket, isConnected } = useSocket(sessionId);

const enviarVoto = (opcionId: string) => {
  if (isConnected.value && socket.value) {
    socket.value.emit('voto:registro', { opcionId });
  } else {
    // Podría guardarse en local temporalmente o simplemente ignorar
    console.warn('Voto no enviado: sin conexión');
  }
};
</script>
```

## Referencias
- Ver la documentación oficial de `socket.io-client` para más opciones del `Manager` en caso de requerir transporte exclusivo por websockets: `transports: ['websocket']`.
