<template>
  <div class="w-screen h-[100dvh] bg-background-main text-text-main font-sans p-4 flex flex-col justify-between max-w-md mx-auto relative select-none overflow-hidden">
    <!-- Reconnection Overlay -->
    <div v-if="!isConnected" class="fixed top-16 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
      <div class="px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-xs flex items-center gap-2 shadow-xl backdrop-blur-md">
        <svg class="animate-spin h-3 w-3 text-amber-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Reconectando...
      </div>
    </div>
    <header class="w-full flex items-center justify-between pb-4 border-b border-background-surface shrink-0">
      <div class="flex items-center gap-2">
        <span class="w-2.5 h-2.5 rounded-full" :class="isConnected ? 'bg-semantic-success shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-amber-400 animate-ping'"></span>
        <span class="font-sans font-extrabold text-sm tracking-wider uppercase text-text-main">Pitch Gen</span>
        <span class="text-text-muted text-xs">|</span>
        <span class="font-sans text-[10px] text-text-muted">Audiencia</span>
      </div>

      <div class="flex items-center gap-2 font-sans text-[10px] text-text-muted px-2 py-1 rounded bg-background-surface border border-background-surface">
        <span>Sala: {{ sessionId }}</span>
      </div>
    </header>

    <!-- Main Content Body -->
    <main class="flex-1 my-4 flex flex-col overflow-y-auto custom-scrollbar pr-1 relative z-0">
      <div class="h-full flex flex-col space-y-6" :class="!activeTrigger ? 'justify-start' : 'justify-center'">
        <!-- Final Quiz Mode -->
        <ActiveQuizMobile 
          v-if="activeTrigger === 'final-quiz'" 
          :uuid="userUuid" 
        />

        <!-- Active Poll Mode if Trigger Active -->
        <ActivePollMobile 
          v-else-if="activeTrigger" 
          :triggerId="activeTrigger" 
          :uuid="userUuid"
          @vote="onVote"
        />

        <!-- Idle Mode when No Active Poll -->
        <IdleScreen v-else />
      </div>
    </main>

    <!-- Bottom Q&A Box -->
    <footer class="w-full pt-3 pb-2 border-t border-background-surface shrink-0 bg-background-main z-10">
      <QABoxMobile @send-qa="onSendQA" />
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useSocket } from '../composables/useSocket';
import IdleScreen from '../components/IdleScreen.vue';
import ActivePollMobile from '../components/ActivePollMobile.vue';
import ActiveQuizMobile from '../components/ActiveQuizMobile.vue';
import QABoxMobile from '../components/QABoxMobile.vue';

const route = useRoute();
const sessionId = computed(() => route.params.sessionId as string || 'default');

const { socket, isConnected, audienceSnapshot, connect, submitAudienceVote, submitAudienceQA } = useSocket();

// In Phase 1 we use socket id as identity to avoid double voting (handled on server or implicitly via socket connection).
// So no localStorage is needed for uuid.
const userUuid = ref('');

const activeTrigger = computed(() => {
  return audienceSnapshot.value?.activeTrigger || null;
});

function getOrCreateUuid(): string {
  let saved = localStorage.getItem('pitchgen_audience_uuid');
  if (!saved) {
    saved = 'aud-' + Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
    localStorage.setItem('pitchgen_audience_uuid', saved);
  }
  return saved;
}

watch(isConnected, (connected) => {
  if (connected && socket.value) {
    // We retain the socket.id for transport connection awareness, 
    // but voting/QA identity relies on localStorage uuid for persistence
    console.log('Connected to socket', socket.value.id);
  }
});

onMounted(() => {
  userUuid.value = getOrCreateUuid();
  // Fallback to production Render URL if env var not set
  connect(import.meta.env.VITE_WS_URL || 'https://pitch-gen-realtime.onrender.com', sessionId.value);
});

function onVote(option: string) {
  if (activeTrigger.value && userUuid.value) {
    submitAudienceVote(activeTrigger.value, userUuid.value, option);
  }
}

function onSendQA(question: string) {
  if (userUuid.value && question) {
    submitAudienceQA(userUuid.value, question);
  }
}
</script>
