<template>
  <div class="glass-card rounded-2xl p-6 border border-slate-800/80 shadow-2xl space-y-6 my-2">
    <!-- Header -->
    <div class="flex items-center justify-between border-b border-slate-800/80 pb-3">
      <div class="flex items-center gap-3">
        <span class="px-2.5 py-1 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono text-xs font-bold uppercase">
          Agent-Catalog Flow
        </span>
        <h3 class="font-display font-bold text-slate-100 text-lg">Consulta Autónoma de IA al Catálogo de Datos</h3>
      </div>
      <span class="font-mono text-xs text-slate-400">
        Paso {{ activeStepDisplay }} / 4
      </span>
    </div>

    <!-- Step Pipeline Visual Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div 
        v-for="(step, idx) in steps" 
        :key="step.title"
        class="p-4 rounded-xl border transition-all duration-500 ease-out space-y-3 flex flex-col justify-between"
        :class="isStepActive(idx) ? 'bg-slate-900 border-cyan-400 shadow-glow-blue scale-[1.03] opacity-100' : 'bg-slate-950/60 border-slate-800 opacity-40 scale-95'"
      >
        <div class="flex items-center justify-between">
          <span 
            class="w-7 h-7 rounded-lg font-mono text-xs font-bold flex items-center justify-center transition-colors"
            :class="isStepActive(idx) ? 'bg-cyan-500 text-slate-950 font-extrabold' : 'bg-slate-800 text-slate-400'"
          >
            0{{ idx + 1 }}
          </span>
          <span class="text-[10px] font-mono text-slate-500 uppercase tracking-wider font-semibold">{{ step.tag }}</span>
        </div>

        <div class="space-y-1">
          <h4 class="font-display font-bold text-slate-100 text-sm leading-snug">{{ step.title }}</h4>
          <p class="text-xs text-slate-300 leading-relaxed">{{ step.description }}</p>
        </div>

        <div class="pt-2 border-t border-slate-800/80 font-mono text-[11px] text-cyan-300 bg-slate-950 p-2.5 rounded-lg border border-slate-800">
          <span class="text-slate-500 block text-[9px] uppercase font-bold mb-0.5">Comando / Evento</span>
          {{ step.detailSnippet }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  currentStep: number;
}>();

const activeStepDisplay = computed(() => {
  return Math.min(4, Math.max(1, props.currentStep + 1));
});

function isStepActive(idx: number): boolean {
  if (props.currentStep === -1) {
    return idx === 0;
  }
  return idx <= props.currentStep;
}

const steps = [
  {
    tag: '1. Entrada Usuario',
    title: 'Prompt de Negocio',
    description: 'El usuario pide al agente: "¿Cuáles fueron las ventas en la Región Norte este mes?"',
    detailSnippet: 'User: "Ventas Norte Q3"'
  },
  {
    tag: '2. Consulta Catálogo',
    title: 'Lectura de Metadata',
    description: 'El Agente consulta la API del Catálogo de Datos para leer esquemas, tipos y descripciones auditadas.',
    detailSnippet: 'GET /catalog/search?q=ventas'
  },
  {
    tag: '3. Compilación SQL',
    title: 'SQL Verificado',
    description: 'Con los nombres exactos de columnas y tipos de datos del catálogo, el agente genera la consulta SELECT.',
    detailSnippet: 'SELECT sum(amount) FROM fct_sales'
  },
  {
    tag: '4. Respuesta Auditable',
    title: 'Ejecución con Trazabilidad',
    description: 'Ejecuta en el warehouse y entrega el resultado adjuntando la fuente y el modelo dbt verificado.',
    detailSnippet: 'Data Source: fct_sales.sql (Verified)'
  }
];
</script>
