<template>
  <div class="bg-background-card rounded-2xl p-6 border border-brand-primary/30 shadow-lg space-y-6 animate-fade-in relative overflow-hidden">
    <!-- Active Poll Header -->
    <div class="space-y-2 border-b border-background-surface pb-4">
      <div class="flex items-center gap-2">
        <span class="w-2.5 h-2.5 rounded-full bg-semantic-error animate-ping"></span>
        <span class="font-sans text-xs font-bold text-semantic-error uppercase tracking-wider">Encuesta en Vivo</span>
      </div>

      <h2 class="text-lg md:text-xl font-sans font-bold text-text-main leading-snug">
        {{ pollData.question }}
      </h2>
    </div>

    <!-- State 1: Voting Options -->
    <div v-if="!hasVoted" class="space-y-3">
      <button
        v-for="(option, idx) in pollData.options"
        :key="option"
        @click="onSelectOption(option)"
        class="w-full p-4 rounded-xl bg-background-main hover:bg-background-surface border border-background-surface active:scale-95 transition-all flex items-center justify-between text-left group"
      >
        <div class="flex items-center gap-3">
          <span class="w-7 h-7 rounded-lg bg-brand-primary/10 border border-brand-primary/30 text-brand-primary font-sans font-bold text-xs flex items-center justify-center group-hover:bg-brand-primary group-hover:text-white transition-colors">
            {{ String.fromCharCode(65 + idx) }}
          </span>
          <span class="font-sans font-semibold text-sm text-text-main">{{ option }}</span>
        </div>
      </button>
    </div>

    <!-- State 2: Post-Vote Confirmation -->
    <div v-else class="p-6 rounded-xl bg-semantic-success/10 border border-semantic-success/30 text-center space-y-3 animate-fade-in">
      <div class="w-12 h-12 rounded-full bg-semantic-success/20 border border-semantic-success/40 text-semantic-success text-2xl flex items-center justify-center mx-auto shadow-lg">
        ✓
      </div>
      <h3 class="font-sans font-bold text-lg text-text-main">¡Voto registrado con éxito!</h3>
      <p class="text-xs text-text-muted max-w-xs mx-auto leading-relaxed">
        Mira la pantalla principal para ver los resultados agregados en tiempo real.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';

const props = defineProps<{
  triggerId: string;
  uuid: string;
}>();

const emit = defineEmits<{
  (e: 'vote', option: string): void;
}>();

const hasVoted = ref(false);

// Reset vote state when triggerId changes
watch(() => props.triggerId, () => {
  hasVoted.value = false;
});

const pollDefinitions: Record<string, { question: string; options: string[] }> = {
  'poll-apertura': {
    question: '¿Tienes hoy un Agente de IA o Chatbot conectado a datos de tu empresa?',
    options: ['Sí, en producción', 'Sí, en pruebas / PoC', 'No aún']
  },
  'poll-pulso': {
    question: 'Si un agente genera una orden o reporte erróneo, ¿cuánto tardas en hallar la causa raíz?',
    options: ['Minutos (Automatizado)', 'Horas (Investigación SQL)', 'Días / No con certeza']
  },
  'poll-cierre': {
    question: '¿Cuál es la prioridad inmediata para escalar IA segura en tu organización?',
    options: ['Piloto dbt + Linaje', 'Auditoría de Datos', 'Catálogo Unificado']
  }
};

const pollData = computed(() => {
  return pollDefinitions[props.triggerId] || {
    question: 'Pregunta Interactiva para la Audiencia',
    options: ['Opción A', 'Opción B', 'Opción C']
  };
});

function onSelectOption(option: string) {
  hasVoted.value = true;
  emit('vote', option);
}
</script>