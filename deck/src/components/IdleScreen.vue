<template>
  <div class="w-full flex flex-col space-y-6">
    <!-- Status Indicator Card -->
    <div class="bg-background-card p-6 rounded-2xl border border-background-surface space-y-2 text-center relative overflow-hidden">
      
      <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/10 border border-brand-primary/30 text-brand-primary font-sans text-xs font-semibold">
        <span class="w-2 h-2 rounded-full bg-brand-primary animate-pulse"></span>
        En Vivo
      </div>

      <h2 class="text-xl font-sans font-bold text-text-main">Escuchando atentamente...</h2>
      <p class="text-xs text-text-muted font-light">
        El presentador lanzará encuestas dinámicas en tu celular durante la charla. También puedes dejar preguntas para el final.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>