import { io, Socket } from 'socket.io-client';
import { ref } from 'vue';

const socket = ref<Socket | null>(null);

export function useSocket() {
  const connect = (url: string = 'http://localhost:3001') => {
    if (!socket.value) {
      socket.value = io(url);
    }
  };

  const emitPresenterSync = (slideIndex: number, stepIndex: number, trigger: string | null = null) => {
    if (socket.value) {
      socket.value.emit('presenter:sync', { slideIndex, stepIndex, trigger });
    }
  };

  return {
    socket,
    connect,
    emitPresenterSync
  };
}
