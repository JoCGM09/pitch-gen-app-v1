<template>
  <div class="glass-card rounded-2xl p-6 border border-slate-800/80 shadow-2xl space-y-6 my-2 bg-slate-950/80">
    <!-- Header info -->
    <div class="flex items-center justify-between border-b border-slate-800/80 pb-3">
      <div class="flex items-center gap-3">
        <span class="px-2.5 py-1 rounded bg-orange-500/10 border border-orange-500/30 text-orange-400 font-mono text-xs font-bold uppercase">
          dbt DAG Visualizer
        </span>
        <h3 class="font-sans font-bold text-slate-100 text-lg">Grafo Dirigido Acíclico de Modelos SQL</h3>
      </div>
      <span class="font-mono text-xs text-slate-400">Paso {{ Math.max(1, currentStep + 1) }} / 2 — Modelo: {{ activeStepNode.name }}</span>
    </div>

    <!-- SVG Canvas for DAG -->
    <div class="relative w-full h-[280px] bg-slate-950/80 rounded-xl border border-slate-900 p-4 flex items-center justify-center overflow-hidden">
      <svg viewBox="0 0 800 240" class="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <marker id="arrow-dag" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#F97316" />
          </marker>
        </defs>

        <!-- Node 1: Raw Tables (Always Visible) -->
        <g class="transition-all duration-300">
          <rect x="30" y="40" width="160" height="60" rx="8" fill="#0F172A" stroke="#475569" stroke-width="1.5" />
          <text x="110" y="65" text-anchor="middle" fill="#94A3B8" class="font-mono text-xs">source.raw_orders</text>
          <text x="110" y="85" text-anchor="middle" fill="#64748B" class="font-mono text-[10px]">Tabla S3/Iceberg</text>
        </g>

        <g class="transition-all duration-300">
          <rect x="30" y="140" width="160" height="60" rx="8" fill="#0F172A" stroke="#475569" stroke-width="1.5" />
          <text x="110" y="165" text-anchor="middle" fill="#94A3B8" class="font-mono text-xs">source.raw_customers</text>
          <text x="110" y="185" text-anchor="middle" fill="#64748B" class="font-mono text-[10px]">Tabla S3/Iceberg</text>
        </g>

        <!-- Connector Raw -> Staging -->
        <path d="M 190 70 L 270 70" fill="none" stroke="#F97316" stroke-width="2" stroke-dasharray="4 4" marker-end="url(#arrow-dag)" 
              :class="{'animate-dash-flow opacity-100': currentStep >= 0, 'opacity-30': currentStep < 0}" class="transition-all duration-300" />
        <path d="M 190 170 L 270 170" fill="none" stroke="#F97316" stroke-width="2" stroke-dasharray="4 4" marker-end="url(#arrow-dag)" 
              :class="{'animate-dash-flow opacity-100': currentStep >= 0, 'opacity-30': currentStep < 0}" class="transition-all duration-300" />

        <!-- Node 2: Staging dbt Models (Step >= 0) -->
        <g :class="{'opacity-100 scale-100': currentStep >= 0, 'opacity-40 scale-95': currentStep < 0}" class="transition-all duration-300">
          <rect x="270" y="40" width="180" height="60" rx="8" fill="#1E293B" 
                :stroke="currentStep === 0 ? '#F97316' : '#334155'" 
                :stroke-width="currentStep === 0 ? '2.5' : '1.5'" />
          <text x="360" y="65" text-anchor="middle" fill="#F8FAFC" class="font-mono text-xs font-bold">stg_orders.sql</text>
          <text x="360" y="85" text-anchor="middle" fill="#F97316" class="font-mono text-[10px]">dbt staging model</text>
        </g>

        <g :class="{'opacity-100 scale-100': currentStep >= 0, 'opacity-40 scale-95': currentStep < 0}" class="transition-all duration-300">
          <rect x="270" y="140" width="180" height="60" rx="8" fill="#1E293B" 
                :stroke="currentStep === 0 ? '#F97316' : '#334155'" 
                :stroke-width="currentStep === 0 ? '2.5' : '1.5'" />
          <text x="360" y="165" text-anchor="middle" fill="#F8FAFC" class="font-mono text-xs font-bold">stg_customers.sql</text>
          <text x="360" y="185" text-anchor="middle" fill="#F97316" class="font-mono text-[10px]">dbt staging model</text>
        </g>

        <!-- Connector Staging -> Mart -->
        <path d="M 450 70 L 550 110" fill="none" stroke="#F97316" stroke-width="2" stroke-dasharray="4 4" marker-end="url(#arrow-dag)" 
              :class="{'animate-dash-flow opacity-100': currentStep >= 1, 'opacity-30': currentStep < 1}" class="transition-all duration-300" />
        <path d="M 450 170 L 550 130" fill="none" stroke="#F97316" stroke-width="2" stroke-dasharray="4 4" marker-end="url(#arrow-dag)" 
              :class="{'animate-dash-flow opacity-100': currentStep >= 1, 'opacity-30': currentStep < 1}" class="transition-all duration-300" />

        <!-- Node 3: Mart Model (fct_sales.sql) (Step >= 1) -->
        <g :class="{'opacity-100 scale-100': currentStep >= 1, 'opacity-30 scale-95': currentStep < 1}" class="transition-all duration-300">
          <rect x="550" y="85" width="200" height="70" rx="10" fill="#030712" 
                :stroke="currentStep >= 1 ? '#3B82F6' : '#334155'" 
                :stroke-width="currentStep >= 1 ? '3' : '1.5'" />
          <text x="650" y="115" text-anchor="middle" fill="#F8FAFC" class="font-sans font-bold text-sm">fct_sales.sql</text>
          <text x="650" y="135" text-anchor="middle" fill="#3B82F6" class="font-mono text-xs">dbt mart model (Iceberg)</text>
        </g>
      </svg>
    </div>

    <!-- Active Node Info Box -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono bg-slate-900/80 p-4 rounded-xl border border-slate-800">
      <div>
        <span class="text-slate-500 uppercase tracking-widest text-[10px] font-bold">Model SQL Snippet</span>
        <pre class="text-orange-300 mt-1 overflow-x-auto">{{ activeStepNode.sql }}</pre>
      </div>
      <div>
        <span class="text-slate-500 uppercase tracking-widest text-[10px] font-bold">Rol en la Arquitectura</span>
        <p class="text-slate-300 mt-1 font-sans text-xs leading-relaxed">{{ activeStepNode.description }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  currentStep: number;
}>();

const activeStepNode = computed(() => {
  if (props.currentStep <= 0) {
    return {
      name: 'stg_orders.sql',
      sql: `select id, order_date, status\nfrom {{ source('raw', 'orders') }}\nwhere status != 'cancelled'`,
      description: 'Capa Staging: Limpia tipos de datos, filtra registros inválidos y estandariza nombres de columna desde la fuente cruda S3.'
    };
  }
  return {
    name: 'fct_sales.sql',
    sql: `select o.id, c.customer_name, o.amount\nfrom {{ ref('stg_orders') }} o\njoin {{ ref('stg_customers') }} c on o.cust_id = c.id`,
    description: 'Capa Mart: Une los modelos staging limpios para crear la tabla fct_sales.sql que consumen los reportes de negocio y los agentes de IA.'
  };
});
</script>