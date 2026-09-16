<template>
  <div class="glass-card rounded-2xl p-6 border border-rose-900/60 shadow-glow-rose space-y-6 my-2 bg-slate-950/80">
    <!-- Header -->
    <div class="flex items-center justify-between border-b border-rose-900/60 pb-3">
      <div class="flex items-center gap-3">
        <span class="px-2.5 py-1 rounded bg-rose-500/10 border border-rose-500/30 text-rose-400 font-mono text-xs font-bold uppercase">
          Efecto Dominó en IA
        </span>
        <h3 class="font-display font-bold text-slate-100 text-lg">Simulación de Incidente por Falta de Linaje</h3>
      </div>
      <span class="font-mono text-xs text-rose-400 font-bold">Paso {{ Math.max(1, currentStep + 1) }} / 3</span>
    </div>

    <!-- Step Visual Chain Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
      <div 
        v-for="(step, idx) in dominoSteps" 
        :key="step.title"
        class="p-5 rounded-xl border transition-all duration-500 space-y-3 flex flex-col justify-between"
        :class="idx <= currentStep ? 'bg-slate-900 border-rose-500 shadow-glow-rose scale-[1.02]' : 'bg-slate-950/80 border-slate-800 opacity-40'"
      >
        <div class="flex items-center justify-between">
          <span class="px-2 py-0.5 rounded font-mono text-[10px] font-bold uppercase bg-rose-950 text-rose-300 border border-rose-800">
            Fase {{ idx + 1 }}
          </span>
          <span class="text-xs font-mono text-rose-400 font-bold">{{ step.statusBadge }}</span>
        </div>

        <div class="space-y-1">
          <h4 class="font-display font-bold text-slate-100 text-base leading-snug">{{ step.title }}</h4>
          <p class="text-xs text-slate-300 leading-relaxed">{{ step.description }}</p>
        </div>

        <div class="pt-2 border-t border-slate-800 font-mono text-[11px] text-rose-300 bg-slate-950 p-2.5 rounded-lg border border-slate-800">
          <span class="text-slate-500 block text-[9px] uppercase font-bold mb-0.5">Consecuencia Directa</span>
          {{ step.impactSnippet }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  currentStep: number;
}>();

const dominoSteps = [
  {
    statusBadge: '❌ Filtro SQL Omitido',
    title: '1. Error en la Receta dbt',
    description: 'Un desarrollador modifica stg_orders.sql y olvida un filtro de exclusión. Nadie lo nota porque la tabla "parece razonable".',
    impactSnippet: 'WHERE status != "test" (Omitido)'
  },
  {
    statusBadge: '⚠️ Tabla Corrupta en Warehouse',
    title: '2. Contaminación Silenciosa',
    description: 'La tabla fct_inventory.sql duplica artificialmente el conteo de desabastecimiento de la Región Norte.',
    impactSnippet: 'Inventario Falso: +40% Anómalo'
  },
  {
    statusBadge: '🚨 Ejecución Irreversible',
    title: '3. Agente Dispara la Acción',
    description: 'El Agente de IA lee la tabla corrupta, asume escasez y dispara automáticamente $50,000 en compras a proveedores.',
    impactSnippet: 'Ordenes de Compra Disparadas'
  }
];
</script>
