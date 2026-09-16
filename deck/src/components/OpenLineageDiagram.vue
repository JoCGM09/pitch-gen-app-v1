<template>
  <div class="glass-card rounded-2xl p-6 border border-slate-800/80 shadow-2xl space-y-6 my-2">
    <!-- Header -->
    <div class="flex items-center justify-between border-b border-slate-800/80 pb-3">
      <div class="flex items-center gap-3">
        <span class="px-2.5 py-1 rounded bg-teal-500/10 border border-teal-500/30 text-teal-400 font-mono text-xs font-bold uppercase">
          OpenLineage Spec
        </span>
        <h3 class="font-display font-bold text-slate-100 text-lg">Emisión de Eventos & Facetas JSON en Tiempo de Ejecución</h3>
      </div>
      <span class="font-mono text-xs text-slate-400">Paso {{ Math.max(1, currentStep + 1) }} / 3</span>
    </div>

    <!-- Interactive Event Pipeline -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- 1. Event Types -->
      <div class="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
        <span class="text-teal-400 font-mono text-[10px] font-bold uppercase">1. Ciclo de Vida del Evento</span>
        <div class="space-y-2 font-mono text-xs">
          <div class="p-2.5 rounded-lg border transition-all flex items-center justify-between"
               :class="currentStep >= 0 ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300' : 'bg-slate-950 border-slate-800 text-slate-500'">
            <span>eventType: "START"</span>
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          </div>

          <div class="p-2.5 rounded-lg border transition-all flex items-center justify-between"
               :class="currentStep >= 1 ? 'bg-blue-950/80 border-blue-500 text-blue-300' : 'bg-slate-950 border-slate-800 text-slate-500'">
            <span>eventType: "RUNNING"</span>
            <span class="w-2 h-2 rounded-full bg-blue-400 animate-ping"></span>
          </div>

          <div class="p-2.5 rounded-lg border transition-all flex items-center justify-between"
               :class="currentStep >= 2 ? 'bg-purple-950/80 border-purple-500 text-purple-300' : 'bg-slate-950 border-slate-800 text-slate-500'">
            <span>eventType: "COMPLETE"</span>
            <span class="w-2 h-2 rounded-full bg-purple-400 animate-ping"></span>
          </div>
        </div>
      </div>

      <!-- 2. JSON Facet Payload Preview -->
      <div class="md:col-span-2 p-4 rounded-xl bg-slate-950 border border-slate-800/90 font-mono text-xs space-y-2 overflow-x-auto">
        <div class="flex items-center justify-between border-b border-slate-800 pb-2">
          <span class="text-slate-400 text-[10px] uppercase font-bold">OpenLineage Standard JSON Payload</span>
          <span class="text-teal-400 text-[10px]">openlineage.io v1.42.1</span>
        </div>
        <pre class="text-slate-300 leading-tight text-[11px] font-mono">{{ activeJsonPayload }}</pre>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  currentStep: number;
}>();

const activeJsonPayload = computed(() => {
  if (props.currentStep <= 0) {
    return `{
  "eventType": "START",
  "eventTime": "2026-09-14T20:30:00.102Z",
  "job": { "namespace": "prod_dbt", "name": "fct_daily_revenue" },
  "inputs": [{ "namespace": "s3://prod-bucket", "name": "stg_orders" }]
}`;
  } else if (props.currentStep === 1) {
    return `{
  "eventType": "RUNNING",
  "eventTime": "2026-09-14T20:30:05.410Z",
  "run": { "runId": "d4e2a1b3-8c9d-4e5f-b6a7" },
  "job": { "namespace": "prod_dbt", "name": "fct_daily_revenue" },
  "facets": { "columnLineage": { "fields": { "revenue": { "inputFields": [{ "name": "amount" }] } } } }
}`;
  }
  return `{
  "eventType": "COMPLETE",
  "eventTime": "2026-09-14T20:30:12.890Z",
  "job": { "namespace": "prod_dbt", "name": "fct_daily_revenue" },
  "outputs": [{ "namespace": "s3://prod-bucket", "name": "fct_daily_revenue" }]
}`;
});
</script>
