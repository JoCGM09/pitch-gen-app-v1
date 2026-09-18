<template>
  <div class="glass-card p-6 rounded-2xl border border-emerald-500/40 bg-emerald-950/20 text-center space-y-5 animate-scale-in">
    <div class="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-3xl shadow-[0_0_20px_rgba(16,185,129,0.3)]">
      🏆
    </div>

    <div class="space-y-2">
      <span class="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-bold uppercase tracking-wider">
        ¡Misión Cumplida!
      </span>
      <h2 class="text-2xl font-extrabold text-white font-sans">
        ¡4 de 4 Correctas!
      </h2>
      <p class="text-xs text-slate-300 font-light leading-relaxed max-w-xs mx-auto">
        Has demostrado dominio total de la arquitectura de linaje de datos y orquestación con AWS y dbt.
      </p>
    </div>

    <div class="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-left space-y-2">
      <div class="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Resumen de Logros:</div>
      <ul class="text-xs text-slate-200 space-y-1 font-sans">
        <li class="flex items-center gap-2">
          <span class="text-emerald-400">✓</span> Linaje en tiempo real (OpenLineage)
        </li>
        <li class="flex items-center gap-2">
          <span class="text-emerald-400">✓</span> Cómputo Serverless con Fargate
        </li>
        <li class="flex items-center gap-2">
          <span class="text-emerald-400">✓</span> Tabla Transaccional S3 Iceberg
        </li>
        <li class="flex items-center gap-2">
          <span class="text-emerald-400">✓</span> Gobernanza Automatizada DataZone
        </li>
      </ul>
    </div>

    <button
      @click="$emit('restart')"
      class="w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-mono text-xs font-bold transition-all shadow-md active:scale-95"
    >
      🔄 Desafiar con otras 4 preguntas
    </button>
  </div>
</template>

<script setup lang="ts">
defineEmits(['restart']);
</script>
