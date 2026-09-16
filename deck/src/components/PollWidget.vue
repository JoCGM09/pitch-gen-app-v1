<template>
  <div class="glass-card rounded-2xl p-6 border border-slate-800/80 shadow-2xl space-y-6 relative overflow-hidden my-4 bg-slate-950/80">
    <!-- Ambient Glow background -->
    <div class="absolute -top-24 -right-24 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>

    <!-- Header Section -->
    <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
      <div class="space-y-1">
        <div class="flex items-center gap-2">
          <span class="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
          <span class="font-mono text-xs font-bold text-rose-400 uppercase tracking-wider">Encuesta en Tiempo Real</span>
        </div>
        <h3 class="text-xl md:text-2xl font-sans font-bold text-slate-100 leading-snug">
          {{ pollData.question }}
        </h3>
      </div>

      <!-- Stats Badge -->
      <div class="flex items-center gap-3 shrink-0 bg-slate-900/90 px-4 py-2 rounded-xl border border-slate-800">
        <div class="text-right">
          <p class="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Total Votos</p>
          <p class="text-2xl font-mono font-extrabold text-blue-400 leading-none">{{ totalVotes }}</p>
        </div>
      </div>
    </div>

    <!-- Options & Progress Bars -->
    <div class="space-y-4">
      <div 
        v-for="(option, index) in pollData.options" 
        :key="option"
        class="space-y-1.5"
      >
        <div class="flex items-center justify-between text-sm font-medium">
          <span class="text-slate-200 font-sans flex items-center gap-2">
            <span class="w-6 h-6 rounded-md bg-slate-800 text-slate-400 font-mono text-xs font-bold flex items-center justify-center">
              {{ String.fromCharCode(65 + index) }}
            </span>
            {{ option }}
          </span>

          <div class="flex items-center gap-3 font-mono text-xs">
            <span class="text-slate-400">{{ getVotes(option) }} votos</span>
            <span class="font-bold text-blue-400 text-sm w-12 text-right">{{ getPercentage(option) }}%</span>
          </div>
        </div>

        <!-- Progress Bar Container -->
        <div class="w-full h-3 bg-slate-950/80 rounded-full overflow-hidden p-0.5 border border-slate-800/80 relative">
          <div 
            class="h-full rounded-full transition-all duration-700 ease-out bg-gradient-to-r"
            :class="barColorClass(index)"
            :style="{ width: `${getPercentage(option)}%` }"
          ></div>
        </div>
      </div>
    </div>

    <!-- Presenter Quick Simulation Bar -->
    <div class="pt-3 border-t border-slate-800/60 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
      <span class="text-slate-500 flex items-center gap-1.5">
        <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
        Audiencia respondiendo desde sus móviles
      </span>

      <!-- Simulation buttons for offline/demo -->
      <div class="flex items-center gap-2">
        <span class="text-slate-500">Simular voto:</span>
        <button 
          v-for="(option, index) in pollData.options" 
          :key="'btn-' + option"
          @click.stop="onSimulate(option)"
          class="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-colors"
        >
          +1 Opción {{ String.fromCharCode(65 + index) }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useSocket } from '../composables/useSocket';

const props = defineProps<{
  triggerId: string;
}>();

const socketComposable = useSocket();
const activePollResults = socketComposable?.activePollResults || ref({});
const simulateVote = socketComposable?.simulateVote || (() => {});

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

const currentResults = computed(() => {
  return activePollResults.value[props.triggerId] || {};
});

const totalVotes = computed(() => {
  let count = 0;
  Object.values(currentResults.value).forEach(v => {
    count += v;
  });
  return count;
});

function getVotes(option: string): number {
  return currentResults.value[option] || 0;
}

function getPercentage(option: string): number {
  if (totalVotes.value === 0) return 0;
  const votes = getVotes(option);
  return Math.round((votes / totalVotes.value) * 100);
}

function barColorClass(index: number): string {
  const colors = [
    'from-blue-600 to-cyan-500',
    'from-purple-600 to-indigo-500',
    'from-emerald-600 to-teal-500',
    'from-amber-600 to-orange-500'
  ];
  return colors[index % colors.length];
}

function onSimulate(option: string) {
  simulateVote(props.triggerId, option);
}
</script>