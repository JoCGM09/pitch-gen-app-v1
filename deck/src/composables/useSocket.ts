import { io, Socket } from 'socket.io-client';
import { ref } from 'vue';

const socket = ref<Socket | null>(null);
const isConnected = ref(false);
const activePollResults = ref<Record<string, Record<string, number>>>({});
const audienceSnapshot = ref<{ currentSlideIndex: number; currentStepIndex: number; activeTrigger: string | null } | null>(null);
const qaQuestionsList = ref<{ id: string; uuid: string; question: string; timestamp: number }[]>([]);

export function useSocket() {
  const defaultUrl = import.meta.env.VITE_WS_URL || 'https://pitch-gen-realtime.onrender.com';
  const connect = (url: string = defaultUrl, sessionId: string = 'default') => {
    if (!socket.value) {
      socket.value = io(url, {
        query: { sessionId },
        reconnection: true,
        reconnectionAttempts: Infinity,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        timeout: 10000
      });

      socket.value.on('connect', () => {
        isConnected.value = true;
      });

      socket.value.on('disconnect', (reason) => {
        isConnected.value = false;
        console.warn('❌ Desconectado:', reason);
        if (reason === 'io server disconnect') {
          // La desconexión fue iniciada por el servidor, reconectar manualmente
          socket.value?.connect();
        }
      });

      socket.value.on('poll:results', (data: { triggerId: string; results: Record<string, number> }) => {
        if (data && data.triggerId) {
          activePollResults.value = {
            ...activePollResults.value,
            [data.triggerId]: data.results || {}
          };
        }
      });

      socket.value.on('audience:sync', (snapshot: any) => {
        audienceSnapshot.value = {
          currentSlideIndex: snapshot.currentSlideIndex,
          currentStepIndex: snapshot.currentStepIndex,
          activeTrigger: snapshot.activeTrigger
        };
      });

      socket.value.on('qa:list', (questions: any[]) => {
        qaQuestionsList.value = questions;
      });

      socket.value.on('qa:new', (question: any) => {
        qaQuestionsList.value.unshift(question);
      });

      socket.value.on('qa:remove', (id: string) => {
        qaQuestionsList.value = qaQuestionsList.value.filter(q => q.id !== id);
      });

      socket.value.on('session:reset', () => {
        activePollResults.value = {};
        qaQuestionsList.value = [];
      });
    }
  };

  const emitPresenterSync = (slideIndex: number, stepIndex: number, trigger: string | null = null, secret: string = '') => {
    if (socket.value && socket.value.connected) {
      socket.value.emit('presenter:sync', { slideIndex, stepIndex, trigger, secret });
    }
  };

  const emitPresenterReset = (secret: string = '') => {
    if (socket.value && socket.value.connected) {
      socket.value.emit('presenter:reset', { secret });
    }
  };

  const requestQAList = (secret: string = '') => {
    if (socket.value && socket.value.connected) {
      socket.value.emit('presenter:get-qa', { secret });
    }
  };

  const removeQA = (secret: string = '', id: string) => {
    if (socket.value && socket.value.connected) {
      socket.value.emit('presenter:remove-qa', { secret, id });
    }
  };

  const submitAudienceVote = (triggerId: string, uuid: string, option: string) => {
    if (socket.value && socket.value.connected) {
      socket.value.emit('audience:vote', { triggerId, uuid, option });
    }
  };

  const submitAudienceQA = (uuid: string, question: string) => {
    if (socket.value && socket.value.connected) {
      socket.value.emit('audience:qa', { uuid, question });
    }
  };

  const simulateVote = (triggerId: string, option: string) => {
    const current = activePollResults.value[triggerId] || {};
    const count = (current[option] || 0) + 1;
    activePollResults.value = {
      ...activePollResults.value,
      [triggerId]: {
        ...current,
        [option]: count
      }
    };

    if (socket.value && socket.value.connected) {
      const mockUuid = 'sim-' + Math.random().toString(36).substring(2, 9);
      socket.value.emit('audience:vote', { triggerId, uuid: mockUuid, option });
    }
  };

  return {
    socket,
    isConnected,
    activePollResults,
    audienceSnapshot,
    qaQuestionsList,
    connect,
    emitPresenterSync,
    emitPresenterReset,
    requestQAList,
    removeQA,
    submitAudienceVote,
    submitAudienceQA,
    simulateVote
  };
}
