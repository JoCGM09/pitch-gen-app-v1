<template>
  <div class="glass-card rounded-2xl p-6 border border-slate-800/80 shadow-2xl space-y-6 my-2">
    <!-- Header -->
    <div class="flex items-center justify-between border-b border-slate-800/80 pb-3">
      <div class="flex items-center gap-3">
        <span class="px-2.5 py-1 rounded bg-purple-500/10 border border-purple-500/30 text-purple-400 font-mono text-xs font-bold uppercase">
          Grafo de Linaje Interactivo
        </span>
        <h3 class="font-display font-bold text-slate-100 text-lg">Trazabilidad End-to-End & Linaje a Nivel de Columna</h3>
      </div>
      <span class="font-mono text-xs text-slate-400">Paso {{ Math.max(1, currentStep + 1) }} / 3</span>
    </div>

    <!-- Main Lineage SVG Tree -->
    <div class="relative w-full h-[320px] bg-slate-950/80 rounded-xl border border-slate-900 p-4 flex items-center justify-center overflow-hidden">
      <!-- Ambient Glows -->
      <div class="absolute -top-10 -left-10 w-48 h-48 bg-purple-600/10 rounded-full blur-2xl pointer-events-none"></div>
      <div class="absolute -bottom-10 -right-10 w-48 h-48 bg-blue-600/10 rounded-full blur-2xl pointer-events-none"></div>

      <svg viewBox="0 0 900 280" class="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <marker id="lineage-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#8B5CF6" />
          </marker>
          <marker id="lineage-arrow-blue" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#3B82F6" />
          </marker>
        </defs>

        <!-- LAYER 1: UPSTREAM SOURCES (Step >= 0) -->
        <g :class="{'opacity-100 translate-x-0': currentStep >= 0, 'opacity-30 -translate-x-4': currentStep < 0}" class="transition-all duration-500">
          <rect x="20" y="30" width="200" height="90" rx="10" fill="#0F172A" 
                :stroke="currentStep === 0 ? '#10B981' : '#334155'" 
                :stroke-width="currentStep === 0 ? '2.5' : '1.5'" />
          <text x="120" y="55" text-anchor="middle" fill="#10B981" class="font-mono text-xs font-bold uppercase">1. Upstream Source</text>
          <text x="120" y="78" text-anchor="middle" fill="#F8FAFC" class="font-display font-semibold text-xs">postgres.raw_transactions</text>
          <text x="120" y="98" text-anchor="middle" fill="#64748B" class="font-mono text-[10px]">Columna: amount, region</text>

          <rect x="20" y="150" width="200" height="90" rx="10" fill="#0F172A" 
                :stroke="currentStep === 0 ? '#10B981' : '#334155'" 
                :stroke-width="currentStep === 0 ? '2.5' : '1.5'" />
          <text x="120" y="175" text-anchor="middle" fill="#10B981" class="font-mono text-xs font-bold uppercase">1. Upstream Source</text>
          <text x="120" y="198" text-anchor="middle" fill="#F8FAFC" class="font-display font-semibold text-xs">s3.user_activity_logs</text>
          <text x="120" y="218" text-anchor="middle" fill="#64748B" class="font-mono text-[10px]">Columna: session_id, user_id</text>
        </g>

        <!-- CONNECTORS 1 -> 2 -->
        <path d="M 220 75 L 340 100" stroke="#8B5CF6" stroke-width="2" stroke-dasharray="6 4" marker-end="url(#lineage-arrow)" 
              :class="{'opacity-100 animate-dash-flow': currentStep >= 1, 'opacity-20': currentStep < 1}" class="transition-opacity duration-500" />
        <path d="M 220 195 L 340 170" stroke="#8B5CF6" stroke-width="2" stroke-dasharray="6 4" marker-end="url(#lineage-arrow)" 
              :class="{'opacity-100 animate-dash-flow': currentStep >= 1, 'opacity-20': currentStep < 1}" class="transition-opacity duration-500" />

        <!-- LAYER 2: DBT TRANSFORMATIONS (Step >= 1) -->
        <g :class="{'opacity-100 scale-100': currentStep >= 1, 'opacity-30 scale-95': currentStep < 1}" class="transition-all duration-500">
          <rect x="340" y="70" width="220" height="130" rx="12" fill="#1E293B" 
                :stroke="currentStep === 1 ? '#8B5CF6' : '#334155'" 
                :stroke-width="currentStep === 1 ? '3' : '1.5'" />
          <text x="450" y="95" text-anchor="middle" fill="#8B5CF6" class="font-mono text-xs font-bold uppercase">2. Transformación dbt</text>
          <text x="450" y="120" text-anchor="middle" fill="#F8FAFC" class="font-display font-bold text-sm">fct_daily_revenue.sql</text>

          <rect x="360" y="135" width="180" height="48" rx="6" fill="#0F172A" stroke="#8B5CF6" stroke-width="1" />
          <text x="450" y="153" text-anchor="middle" fill="#C084FC" class="font-mono text-[10px]">dbt-athena materialization</text>
          <text x="450" y="170" text-anchor="middle" fill="#94A3B8" class="font-mono text-[10px]">sum(amount) BY region</text>
        </g>

        <!-- CONNECTORS 2 -> 3 -->
        <path d="M 560 115 L 680 85" stroke="#3B82F6" stroke-width="2.5" stroke-dasharray="6 4" marker-end="url(#lineage-arrow-blue)" 
              :class="{'opacity-100 animate-dash-flow': currentStep >= 2, 'opacity-20': currentStep < 2}" class="transition-opacity duration-500" />
        <path d="M 560 155 L 680 185" stroke="#3B82F6" stroke-width="2.5" stroke-dasharray="6 4" marker-end="url(#lineage-arrow-blue)" 
              :class="{'opacity-100 animate-dash-flow': currentStep >= 2, 'opacity-20': currentStep < 2}" class="transition-opacity duration-500" />

        <!-- LAYER 3: DOWNSTREAM CONSUMERS (Step >= 2) -->
        <g :class="{'opacity-100 translate-x-0': currentStep >= 2, 'opacity-30 translate-x-4': currentStep < 2}" class="transition-all duration-500">
          <rect x="680" y="40" width="200" height="90" rx="10" fill="#0F172A" 
                :stroke="currentStep === 2 ? '#3B82F6' : '#334155'" 
                :stroke-width="currentStep === 2 ? '2.5' : '1.5'" />
          <text x="780" y="65" text-anchor="middle" fill="#3B82F6" class="font-mono text-xs font-bold uppercase">3. Downstream</text>
          <text x="780" y="88" text-anchor="middle" fill="#F8FAFC" class="font-display font-semibold text-xs">Executive Dashboard</text>
          <text x="780" y="108" text-anchor="middle" fill="#64748B" class="font-mono text-[10px]">BI Reportes Junta</text>

          <rect x="680" y="150" width="200" height="90" rx="10" fill="#0F172A" 
                :stroke="currentStep === 2 ? '#06B6D4' : '#334155'" 
                :stroke-width="currentStep === 2 ? '2.5' : '1.5'" />
          <text x="780" y="175" text-anchor="middle" fill="#06B6D4" class="font-mono text-xs font-bold uppercase">3. Downstream</text>
          <text x="780" y="198" text-anchor="middle" fill="#F8FAFC" class="font-display font-semibold text-xs">Inventory Agent AI</text>
          <text x="780" y="218" text-anchor="middle" fill="#67E8F9" class="font-mono text-[10px]">Agente de Compras</text>
        </g>
      </svg>
    </div>

    <!-- Active Step Metadata Info -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-sans">
      <div class="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
        <span class="text-emerald-400 font-mono text-[10px] font-bold uppercase">1. Fuentes Crudas</span>
        <p class="text-slate-200 font-bold text-sm">Origen de los Datos</p>
        <p class="text-slate-400 text-xs leading-relaxed">Tablas de bases operacionales PostgreSQL y logs JSON en S3.</p>
      </div>

      <div class="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
        <span class="text-purple-400 font-mono text-[10px] font-bold uppercase">2. Transformaciones SQL</span>
        <p class="text-slate-200 font-bold text-sm">Receta dbt Auditada</p>
        <p class="text-slate-400 text-xs leading-relaxed">Modelos dbt que agregan y calculan ingresos por región.</p>
      </div>

      <div class="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
        <span class="text-blue-400 font-mono text-[10px] font-bold uppercase">3. Consumidores Finales</span>
        <p class="text-slate-200 font-bold text-sm">Dashboards & Agentes IA</p>
        <p class="text-slate-400 text-xs leading-relaxed">Sistemas que toman decisiones basadas en los modelos dbt.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  currentStep: number;
}>();
</script>
