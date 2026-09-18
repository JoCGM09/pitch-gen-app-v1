<template>
  <div class="glass-card p-6 rounded-2xl border border-blue-500/30 bg-slate-950/60 backdrop-blur-md space-y-6 shadow-2xl max-w-2xl mx-auto my-auto animate-fade-in">
    <!-- Header -->
    <div class="flex items-center justify-between border-b border-slate-800/80 pb-4">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-xl">
          🧠
        </div>
        <div>
          <h2 class="text-xl font-display font-extrabold text-white">
            Resultados del Quiz Final en Tiempo Real
          </h2>
          <p class="text-xs text-slate-400 font-light">
            Monitoreo en vivo del dominio técnico de la audiencia (Racha de 4/4)
          </p>
        </div>
      </div>

      <div class="flex items-center gap-3 font-mono text-xs">
        <div class="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-blue-400 animate-ping"></span>
          <span>{{ stats.totalParticipants }} Participantes</span>
        </div>
      </div>
    </div>

    <!-- Main Chart Bars -->
    <div class="space-y-4">
      <div v-for="level in levels" :key="level.streak" class="space-y-1.5">
        <div class="flex justify-between text-xs font-mono">
          <span class="flex items-center gap-2 text-slate-300 font-medium">
            <span>{{ level.icon }}</span>
            <span>{{ level.label }}</span>
          </span>
          <span class="text-slate-400 font-bold">
            {{ getCount(level.streak) }} {{ getCount(level.streak) === 1 ? 'persona' : 'personas' }}
            ({{ getPercentage(level.streak) }}%)
          </span>
        </div>

        <!-- Bar Container -->
        <div class="h-4 bg-slate-900/90 rounded-full overflow-hidden border border-slate-800 p-0.5 relative">
          <div 
            class="h-full rounded-full transition-all duration-700 ease-out"
            :class="level.barColor"
            :style="{ width: `${getPercentage(level.streak)}%` }"
          ></div>
        </div>
      </div>
    </div>

    <!-- Bottom Highlights Cards -->
    <div class="grid grid-cols-2 gap-4 pt-2">
      <div class="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/30 flex items-center justify-between">
        <div>
          <div class="text-[10px] font-mono text-emerald-400 uppercase tracking-wider">Victorias Totales</div>
          <div class="text-2xl font-extrabold text-emerald-300 font-mono">
            {{ getCount(4) }}
          </div>
        </div>
        <div class="text-3xl">🏆</div>
      </div>

      <div class="p-4 rounded-xl bg-blue-950/30 border border-blue-500/30 flex items-center justify-between">
        <div>
          <div class="text-[10px] font-mono text-blue-400 uppercase tracking-wider">Tasa de Éxito</div>
          <div class="text-2xl font-extrabold text-blue-300 font-mono">
            {{ overallVictoryRate }}%
          </div>
        </div>
        <div class="text-3xl">📊</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useSocket } from '../composables/useSocket';

const { quizStats } = useSocket();

const stats = computed(() => quizStats.value || { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, totalParticipants: 0 });

const levels = [
  { streak: 4, label: 'Completado (Racha 4/4)', icon: '🏆', barColor: 'bg-gradient-to-r from-emerald-500 to-teal-400 shadow-[0_0_12px_rgba(16,185,129,0.5)]' },
  { streak: 3, label: 'A 1 paso (Racha 3/4)', icon: '🔥', barColor: 'bg-gradient-to-r from-purple-500 to-indigo-500' },
  { streak: 2, label: 'En camino (Racha 2/4)', icon: '⚡', barColor: 'bg-gradient-to-r from-blue-500 to-cyan-500' },
  { streak: 1, label: 'Iniciando (Racha 1/4)', icon: '🌱', barColor: 'bg-gradient-to-r from-amber-500 to-yellow-500' },
  { streak: 0, label: 'Inicio / Reiniciado (Racha 0/4)', icon: '🔄', barColor: 'bg-slate-700' }
];

function getCount(streak: number): number {
  return (stats.value as any)[streak] || 0;
}

function getPercentage(streak: number): number {
  const total = stats.value.totalParticipants || 0;
  if (total === 0) return 0;
  const count = getCount(streak);
  return Math.round((count / total) * 100);
}

const overallVictoryRate = computed(() => {
  const total = stats.value.totalParticipants || 0;
  if (total === 0) return 0;
  return Math.round((getCount(4) / total) * 100);
});
</script>
