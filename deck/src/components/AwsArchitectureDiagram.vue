<template>
  <div class="w-full flex flex-col gap-4 my-1">
    <!-- Main SVG Diagram Canvas - Official AWS Architecture Replica -->
    <div class="glass-card relative w-full h-[400px] rounded-2xl p-5 flex flex-col items-center justify-center overflow-hidden border border-slate-800/80 shadow-2xl bg-slate-950/90">
      <!-- Ambient Glows -->
      <div class="absolute -top-24 -left-24 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div class="absolute -bottom-24 -right-24 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <svg viewBox="0 0 800 360" class="w-full h-full text-slate-100" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <!-- Arrow Markers -->
          <marker id="arrow-purple" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#8B5CF6" />
          </marker>
          <marker id="arrow-blue" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#3B82F6" />
          </marker>
          <marker id="arrow-emerald" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#10B981" />
          </marker>
          <marker id="arrow-rose" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#F43F5E" />
          </marker>

          <!-- Gradients -->
          <linearGradient id="nodeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#0F172A" stop-opacity="0.98" />
            <stop offset="100%" stop-color="#1E293B" stop-opacity="0.95" />
          </linearGradient>

          <linearGradient id="activeNodeGlow" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#3B82F6" stop-opacity="0.4" />
            <stop offset="100%" stop-color="#8B5CF6" stop-opacity="0.4" />
          </linearGradient>
        </defs>

        <!-- LANE 1: ORQUESTACIÓN (Left x=30..190) -->
        <!-- NODE 0: EventBridge Scheduler -->
        <g @click="selectService(0)" class="cursor-pointer transition-all duration-500" :class="getNodeOpacityClass(0)">
          <rect x="30" y="25" width="160" height="70" rx="10" fill="url(#nodeGrad)" 
                :stroke="getNodeStroke(0)" 
                :stroke-width="isNodeActive(0) ? '3' : '1.5'" />
          <rect v-if="isNodeActive(0)" x="30" y="25" width="160" height="70" rx="10" fill="url(#activeNodeGlow)" class="pointer-events-none" />
          <text x="110" y="45" text-anchor="middle" fill="#8B5CF6" class="font-mono text-[10px] font-bold uppercase">1. Disparador</text>
          <text x="110" y="68" text-anchor="middle" fill="#F8FAFC" class="font-sans font-bold text-sm">EventBridge</text>
          <text x="110" y="83" text-anchor="middle" fill="#94A3B8" class="font-mono text-[10px]">Cron Scheduler</text>
        </g>

        <!-- Connector 0 -> 1 (Vertical Down) -->
        <path d="M 110 95 L 110 135" fill="none" stroke="#8B5CF6" stroke-width="2" stroke-dasharray="4 4" marker-end="url(#arrow-purple)" 
              :class="getConnectorClass(0)" class="transition-all duration-500" />

        <!-- NODE 1: Step Functions -->
        <g @click="selectService(1)" class="cursor-pointer transition-all duration-500" :class="getNodeOpacityClass(1)">
          <rect x="30" y="135" width="160" height="70" rx="10" fill="url(#nodeGrad)" 
                :stroke="getNodeStroke(1)" 
                :stroke-width="isNodeActive(1) ? '3' : '1.5'" />
          <rect v-if="isNodeActive(1)" x="30" y="135" width="160" height="70" rx="10" fill="url(#activeNodeGlow)" class="pointer-events-none" />
          <text x="110" y="155" text-anchor="middle" fill="#8B5CF6" class="font-mono text-[10px] font-bold uppercase">2. Orquestador</text>
          <text x="110" y="178" text-anchor="middle" fill="#F8FAFC" class="font-sans font-bold text-sm">Step Functions</text>
          <text x="110" y="193" text-anchor="middle" fill="#A5B4FC" class="font-mono text-[10px]">ecs:runTask.sync</text>
        </g>

        <!-- Connector 1 -> 2 (Step Functions -> ECS Fargate) -->
        <path d="M 190 170 L 230 170" fill="none" stroke="#3B82F6" stroke-width="2" stroke-dasharray="4 4" marker-end="url(#arrow-blue)" 
              :class="getConnectorClass(1)" class="transition-all duration-500" />

        <!-- LANE 2: CÓMPUTO & TRANSFORMACIÓN (Center x=230..490) -->
        <!-- NODE 2: ECS Fargate Container -->
        <g @click="selectService(2)" class="cursor-pointer transition-all duration-500" :class="getNodeOpacityClass(2)">
          <rect x="230" y="20" width="260" height="190" rx="12" fill="url(#nodeGrad)" 
                :stroke="getNodeStroke(2)" 
                :stroke-width="isNodeActive(2) ? '3' : '1.5'" />
          <text x="360" y="42" text-anchor="middle" fill="#3B82F6" class="font-mono text-[11px] font-bold uppercase">3. Cómputo Serverless</text>
          <text x="360" y="62" text-anchor="middle" fill="#F8FAFC" class="font-sans font-bold text-sm">ECS Fargate Container</text>

          <!-- NODE 3: dbt-ol Wrapper inside Fargate -->
          <g @click.stop="selectService(3)" class="transition-all duration-500" :class="getNodeOpacityClass(3)">
            <rect x="250" y="75" width="220" height="115" rx="8" fill="#0F172A" 
                  :stroke="getNodeStroke(3)" 
                  :stroke-width="isNodeActive(3) ? '2.5' : '1.5'" />
            <text x="360" y="98" text-anchor="middle" fill="#60A5FA" class="font-mono text-[10px] font-bold uppercase">4. Wrapper dbt</text>
            <text x="360" y="122" text-anchor="middle" fill="#F8FAFC" class="font-mono font-bold text-sm">dbt-ol (OpenLineage)</text>
            <text x="360" y="145" text-anchor="middle" fill="#93C5FD" class="font-mono text-[11px]">Transformación SQL + Eventos</text>
          </g>
        </g>

        <!-- Connector 3 -> 4 (dbt-ol -> Athena SQL) -->
        <path d="M 470 132.5 L 510 132.5 L 510 52.5 L 550 52.5" fill="none" stroke="#3B82F6" stroke-width="2" stroke-dasharray="4 4" marker-end="url(#arrow-blue)" 
              :class="getConnectorClass(2)" class="transition-all duration-500" />

        <!-- LANE 3: ALMACENAMIENTO & CATÁLOGO (Right x=550..770) -->
        <!-- NODE 4: Amazon Athena -->
        <g @click="selectService(4)" class="cursor-pointer transition-all duration-500" :class="getNodeOpacityClass(4)">
          <rect x="550" y="20" width="220" height="65" rx="10" fill="url(#nodeGrad)" 
                :stroke="getNodeStroke(4)" 
                :stroke-width="isNodeActive(4) ? '3' : '1.5'" />
          <text x="660" y="42" text-anchor="middle" fill="#10B981" class="font-mono text-[10px] font-bold uppercase">5. Motor SQL Serverless</text>
          <text x="660" y="63" text-anchor="middle" fill="#F8FAFC" class="font-sans font-bold text-sm">Amazon Athena</text>
        </g>

        <!-- Connector 4 -> 5 (Athena -> S3) -->
        <path d="M 660 85 L 660 105" fill="none" stroke="#10B981" stroke-width="2" marker-end="url(#arrow-emerald)"
              :class="getConnectorClass(2)" class="transition-all duration-500" />

        <!-- NODE 5: Amazon S3 (Apache Iceberg) -->
        <g @click="selectService(5)" class="cursor-pointer transition-all duration-500" :class="getNodeOpacityClass(5)">
          <rect x="550" y="105" width="220" height="65" rx="10" fill="url(#nodeGrad)" 
                :stroke="getNodeStroke(5)" 
                :stroke-width="isNodeActive(5) ? '3' : '1.5'" />
          <text x="660" y="127" text-anchor="middle" fill="#06B6D4" class="font-mono text-[10px] font-bold uppercase">6. Storage ACID</text>
          <text x="660" y="148" text-anchor="middle" fill="#F8FAFC" class="font-sans font-bold text-sm">S3 (Apache Iceberg)</text>
        </g>

        <!-- Connector 5 -> 6 (S3 -> Glue) -->
        <path d="M 660 170 L 660 190" fill="none" stroke="#06B6D4" stroke-width="2" marker-end="url(#arrow-emerald)"
              :class="getConnectorClass(2)" class="transition-all duration-500" />

        <!-- NODE 6: AWS Glue Data Catalog -->
        <g @click="selectService(6)" class="cursor-pointer transition-all duration-500" :class="getNodeOpacityClass(6)">
          <rect x="550" y="190" width="220" height="65" rx="10" fill="url(#nodeGrad)" 
                :stroke="getNodeStroke(6)" 
                :stroke-width="isNodeActive(6) ? '3' : '1.5'" />
          <text x="660" y="212" text-anchor="middle" fill="#3B82F6" class="font-mono text-[10px] font-bold uppercase">7. Catálogo Metadatos</text>
          <text x="660" y="233" text-anchor="middle" fill="#F8FAFC" class="font-sans font-bold text-sm">Glue Data Catalog</text>
        </g>

        <!-- DIRECT LINEAGE CONNECTOR: Node 3 (dbt-ol) -> Node 7 (DataZone API) -->
        <!-- Exits bottom of dbt-ol (x=360, y=190) -> down to y=240 -> left to x=110 -> down to DataZone API top (x=110, y=270)! -->
        <path d="M 360 210 L 360 240 L 110 240 L 110 270" fill="none" stroke="#F43F5E" stroke-width="2.5" stroke-dasharray="6 4" marker-end="url(#arrow-rose)" 
              :class="getConnectorClass(3)" class="transition-all duration-500" />

        <!-- BOTTOM ROW: TRANSMISIÓN DE LINAJE & VISUALIZACIÓN (Group 3) -->
        <!-- NODE 7: Amazon DataZone API -->
        <g @click="selectService(7)" class="cursor-pointer transition-all duration-500" :class="getNodeOpacityClass(7)">
          <rect x="30" y="270" width="160" height="75" rx="10" fill="url(#nodeGrad)" 
                :stroke="getNodeStroke(7)" 
                :stroke-width="isNodeActive(7) ? '3' : '1.5'" />
          <text x="110" y="292" text-anchor="middle" fill="#F43F5E" class="font-mono text-[10px] font-bold uppercase">8. Transporte SigV4</text>
          <text x="110" y="313" text-anchor="middle" fill="#F8FAFC" class="font-mono font-bold text-xs">amazon_datazone_api</text>
          <text x="110" y="330" text-anchor="middle" fill="#FDA4AF" class="font-mono text-[9px]">PostLineageEvent API</text>
        </g>

        <!-- Connector 7 (DataZone) -> 8 (SageMaker Studio) -->
        <path d="M 190 307.5 L 230 307.5" fill="none" stroke="#F43F5E" stroke-width="2" stroke-dasharray="4 4" marker-end="url(#arrow-rose)" 
              :class="getConnectorClass(3)" class="transition-all duration-500" />

        <!-- Connector 6 (Glue) -> 8 (SageMaker Studio) -->
        <path d="M 550 222.5 L 360 222.5 L 360 270" fill="none" stroke="#3B82F6" stroke-width="2" stroke-dasharray="4 4" marker-end="url(#arrow-blue)" 
              :class="getConnectorClass(3)" class="transition-all duration-500" />

        <!-- NODE 8: Amazon SageMaker Unified Studio -->
        <g @click="selectService(8)" class="cursor-pointer transition-all duration-500" :class="getNodeOpacityClass(8)">
          <rect x="230" y="270" width="260" height="75" rx="10" fill="url(#nodeGrad)" 
                :stroke="getNodeStroke(8)" 
                :stroke-width="isNodeActive(8) ? '3' : '1.5'" />
          <text x="360" y="292" text-anchor="middle" fill="#8B5CF6" class="font-mono text-[10px] font-bold uppercase">9. Grafo de Linaje</text>
          <text x="360" y="313" text-anchor="middle" fill="#F8FAFC" class="font-sans font-bold text-xs">SageMaker Unified Studio</text>
          <text x="360" y="330" text-anchor="middle" fill="#C084FC" class="font-mono text-[9px]">Column-Level Lineage</text>
        </g>
      </svg>
    </div>

    <!-- Individual Technical Detail Panel for the Selected Service / Group -->
    <div class="glass-card w-full rounded-xl p-5 border border-slate-800/80 flex flex-col md:flex-row items-center justify-between gap-5 bg-slate-950/90">
      <div class="flex-1 space-y-2">
        <div class="flex items-center gap-2">
          <span class="px-2.5 py-1 rounded font-mono text-xs font-bold uppercase bg-blue-950 text-blue-300 border border-blue-800">
            {{ activeService.badge || `Servicio ${activeServiceIndex + 1}` }}
          </span>
          <h4 class="text-lg font-sans font-bold text-slate-100">{{ activeService.name }}</h4>
        </div>
        <p class="text-sm text-slate-200 leading-relaxed">{{ activeService.description }}</p>
        <p class="text-sm text-blue-300 font-sans"><strong class="text-slate-100">Ventaja AWS:</strong> {{ activeService.whyAws }}</p>
      </div>

      <!-- Code / Config Box -->
      <div class="w-full md:w-80 shrink-0 bg-slate-950 rounded-xl p-4 border border-slate-800 font-mono text-xs">
        <div class="text-[10px] text-slate-400 uppercase tracking-widest mb-1.5 font-bold flex justify-between">
          <span>{{ activeService.snippetHeader }}</span>
          <span class="text-emerald-400">AWS Native</span>
        </div>
        <pre class="text-slate-200 overflow-x-auto whitespace-pre font-mono leading-relaxed text-xs">{{ activeService.snippetCode }}</pre>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';

const props = defineProps<{
  currentStep: number;
}>();

const selectedServiceOverride = ref<number | null>(null);

function getNodeGroup(nodeIndex: number): number {
  if (nodeIndex <= 1) return 0;
  if (nodeIndex <= 3) return 1;
  if (nodeIndex <= 6) return 2;
  return 3;
}

const currentGroup = computed(() => {
  if (props.currentStep < 0) return 0;
  return Math.min(3, Math.max(0, props.currentStep));
});

const activeServiceIndex = computed(() => {
  if (selectedServiceOverride.value !== null) {
    return selectedServiceOverride.value;
  }
  switch (currentGroup.value) {
    case 0: return 0;
    case 1: return 2;
    case 2: return 4;
    case 3:
    default: return 7;
  }
});

watch(() => props.currentStep, () => {
  selectedServiceOverride.value = null;
});

function selectService(index: number) {
  selectedServiceOverride.value = index;
}

function isNodeActive(index: number): boolean {
  if (selectedServiceOverride.value !== null) {
    return selectedServiceOverride.value === index;
  }
  return getNodeGroup(index) === currentGroup.value;
}

function isNodeUnlocked(index: number): boolean {
  return getNodeGroup(index) <= currentGroup.value;
}

function getNodeOpacityClass(index: number): string {
  if (isNodeActive(index)) {
    return 'opacity-100 scale-[1.02]';
  }
  if (isNodeUnlocked(index)) {
    return 'opacity-85 scale-100';
  }
  return 'opacity-35 scale-95';
}

function getNodeStroke(index: number): string {
  if (isNodeActive(index)) {
    const strokeColors = ['#8B5CF6', '#8B5CF6', '#3B82F6', '#60A5FA', '#10B981', '#06B6D4', '#3B82F6', '#F43F5E', '#8B5CF6'];
    return strokeColors[index] || '#3B82F6';
  }
  return '#475569';
}

function getConnectorClass(groupIdx: number): Record<string, boolean> {
  const isPassed = currentGroup.value >= groupIdx;
  const isActive = currentGroup.value === groupIdx;
  return {
    'animate-dash-flow': isActive || isPassed,
    'opacity-100': isPassed,
    'opacity-20': !isPassed
  };
}

const servicesData = [
  {
    badge: '1. Disparador Cron',
    name: 'Amazon EventBridge Scheduler',
    description: 'Dispara el pipeline con precisión de milisegundos según horarios programados.',
    whyAws: 'Cero servidores encendidos 24/7.',
    snippetHeader: 'Schedule Expression',
    snippetCode: `rate(1 hour)`
  },
  {
    badge: '2. Orquestador Workflow',
    name: 'AWS Step Functions',
    description: 'Orquesta la máquina de estados e invoca la tarea de ECS Fargate.',
    whyAws: 'Maneja reintentos con backoff exponencial automáticamente.',
    snippetHeader: 'Integration Type',
    snippetCode: `Resource: ecs:runTask.sync`
  },
  {
    badge: '3. Cómputo Serverless',
    name: 'Amazon ECS en AWS Fargate',
    description: 'Ejecuta el contenedor de transformaciones asignando CPU/RAM efímera.',
    whyAws: 'Cobro exacto por segundos consumidos sin gestionar EC2.',
    snippetHeader: 'Launch Type',
    snippetCode: `launchType: FARGATE`
  },
  {
    badge: '4. Generador OpenLineage',
    name: 'dbt-ol (OpenLineage Wrapper)',
    description: 'Ejecuta recetas dbt e intercepta cada modelo generando eventos de linaje.',
    whyAws: 'Mantiene dbt estándar capturando metadatos en tiempo real.',
    snippetHeader: 'CLI Command',
    snippetCode: `dbt-ol run`
  },
  {
    badge: '5. Motor SQL Serverless',
    name: 'Amazon Athena (dbt-athena)',
    description: 'Motor SQL serverless que ejecuta las consultas DDL/DML compiladas por dbt.',
    whyAws: 'Procesamiento masivo pagando sólo por bytes escaneados.',
    snippetHeader: 'Adapter Config',
    snippetCode: `type: athena`
  },
  {
    badge: '6. Formato Columnar ACID',
    name: 'Amazon S3 (Apache Iceberg)',
    description: 'Almacenamiento columnar Parquet con transacciones ACID y time travel.',
    whyAws: 'Garantiza consistencia y auditoría histórica de datos.',
    snippetHeader: 'Table Format',
    snippetCode: `table_type: iceberg`
  },
  {
    badge: '7. Catálogo Unificado',
    name: 'AWS Glue Data Catalog',
    description: 'Repositorio central de metadatos de tablas y particiones.',
    whyAws: 'Fuente de verdad para SageMaker y DataZone.',
    snippetHeader: 'Catalog Entity',
    snippetCode: `table: fct_sales`
  },
  {
    badge: '8. Transporte SigV4 Directo',
    name: 'Amazon DataZone API',
    description: 'Publica eventos directamente a PostLineageEvent con autenticación SigV4.',
    whyAws: 'Sin Lambdas ni proxies intermediarios.',
    snippetHeader: 'openlineage.yml',
    snippetCode: `transport: amazon_datazone_api`
  },
  {
    badge: '9. Grafo de Linaje',
    name: 'Amazon SageMaker Unified Studio',
    description: 'Visualiza el grafo de linaje interconectado a nivel de columna.',
    whyAws: 'Grafica dependencias de extremo a extremo para auditoría.',
    snippetHeader: 'Lineage Scope',
    snippetCode: `Scope: Column-level`
  }
];

const activeService = computed(() => {
  return servicesData[activeServiceIndex.value] || servicesData[0];
});
</script>