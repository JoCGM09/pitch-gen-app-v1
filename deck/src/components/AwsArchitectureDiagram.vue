<template>
  <div class="w-full flex flex-col gap-5 my-1">
    <!-- Main SVG Diagram Canvas - Official AWS Architecture Replica -->
    <div class="glass-card relative w-full h-[420px] rounded-2xl p-5 flex flex-col items-center justify-center overflow-hidden border border-slate-800/80 shadow-2xl">
      <!-- Ambient Glows -->
      <div class="absolute -top-24 -left-24 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div class="absolute -bottom-24 -right-24 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <svg viewBox="0 0 980 370" class="w-full h-full text-slate-100" xmlns="http://www.w3.org/2000/svg">
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

        <!-- 1. ORQUESTACIÓN ROW -->
        <!-- NODE 1: EventBridge Scheduler -->
        <g @click="selectService(0)" class="cursor-pointer transition-all duration-300 opacity-100 hover:scale-[1.02]">
          <rect x="20" y="30" width="160" height="85" rx="10" fill="url(#nodeGrad)" 
                :stroke="isServiceActive(0) ? '#8B5CF6' : '#475569'" 
                :stroke-width="isServiceActive(0) ? '3' : '1.5'" />
          <rect v-if="isServiceActive(0)" x="20" y="30" width="160" height="85" rx="10" fill="url(#activeNodeGlow)" class="pointer-events-none" />
          <text x="100" y="52" text-anchor="middle" fill="#8B5CF6" class="font-mono text-[10px] font-bold uppercase">1. Disparador</text>
          <text x="100" y="73" text-anchor="middle" fill="#F8FAFC" class="font-display font-bold text-xs">EventBridge</text>
          <text x="100" y="90" text-anchor="middle" fill="#94A3B8" class="font-mono text-[10px]">Scheduler Cron</text>
        </g>

        <!-- Connector 1 -> 2 -->
        <path d="M 180 72 L 220 72" stroke="#8B5CF6" stroke-width="2" stroke-dasharray="4 4" marker-end="url(#arrow-purple)" 
              :class="{'animate-dash-flow': isServiceActive(1), 'opacity-60': !isServiceActive(1)}" />

        <!-- NODE 2: Step Functions -->
        <g @click="selectService(1)" class="cursor-pointer transition-all duration-300 opacity-100 hover:scale-[1.02]">
          <rect x="220" y="30" width="160" height="85" rx="10" fill="url(#nodeGrad)" 
                :stroke="isServiceActive(1) ? '#8B5CF6' : '#475569'" 
                :stroke-width="isServiceActive(1) ? '3' : '1.5'" />
          <rect v-if="isServiceActive(1)" x="220" y="30" width="160" height="85" rx="10" fill="url(#activeNodeGlow)" class="pointer-events-none" />
          <text x="300" y="52" text-anchor="middle" fill="#8B5CF6" class="font-mono text-[10px] font-bold uppercase">2. Orquestador</text>
          <text x="300" y="73" text-anchor="middle" fill="#F8FAFC" class="font-display font-bold text-xs">Step Functions</text>
          <text x="300" y="90" text-anchor="middle" fill="#A5B4FC" class="font-mono text-[10px]">ecs:runTask.sync</text>
        </g>

        <!-- Connector 2 -> 3 -->
        <path d="M 380 72 L 420 72" stroke="#3B82F6" stroke-width="2" stroke-dasharray="4 4" marker-end="url(#arrow-blue)" 
              :class="{'animate-dash-flow': isServiceActive(2), 'opacity-60': !isServiceActive(2)}" />

        <!-- 2. CÓMPUTO CONTAINER (ECS Fargate + dbt-ol) -->
        <!-- NODE 3: ECS Fargate -->
        <g @click="selectService(2)" class="cursor-pointer transition-all duration-300 opacity-100 hover:scale-[1.02]">
          <rect x="420" y="20" width="220" height="150" rx="12" fill="url(#nodeGrad)" 
                :stroke="isServiceActive(2) || isServiceActive(3) ? '#3B82F6' : '#475569'" 
                :stroke-width="isServiceActive(2) || isServiceActive(3) ? '3' : '1.5'" />
          <text x="530" y="42" text-anchor="middle" fill="#3B82F6" class="font-mono text-[10px] font-bold uppercase">3. Cómputo Serverless</text>
          <text x="530" y="62" text-anchor="middle" fill="#F8FAFC" class="font-display font-bold text-xs">Amazon ECS en Fargate</text>

          <!-- NODE 4: dbt-ol Wrapper inside Fargate -->
          <g @click.stop="selectService(3)">
            <rect x="440" y="75" width="180" height="80" rx="8" fill="#0F172A" 
                  :stroke="isServiceActive(3) ? '#60A5FA' : '#3B82F6'" 
                  :stroke-width="isServiceActive(3) ? '2.5' : '1.5'" />
            <text x="530" y="98" text-anchor="middle" fill="#60A5FA" class="font-mono text-[10px] font-bold uppercase">4. Wrapper dbt</text>
            <text x="530" y="118" text-anchor="middle" fill="#F8FAFC" class="font-mono font-bold text-xs">dbt-ol (OpenLineage)</text>
            <text x="530" y="138" text-anchor="middle" fill="#93C5FD" class="font-mono text-[9px]">Genera Eventos SQL</text>
          </g>
        </g>

        <!-- Connector 4 -> 5 (Athena SQL) -->
        <path d="M 640 95 L 700 95" stroke="#3B82F6" stroke-width="2" stroke-dasharray="4 4" marker-end="url(#arrow-blue)" 
              :class="{'animate-dash-flow': isServiceActive(4), 'opacity-60': !isServiceActive(4)}" />

        <!-- 3. MOTOR SQL & ALMACENAMIENTO COLUMN -->
        <!-- NODE 5: Amazon Athena -->
        <g @click="selectService(4)" class="cursor-pointer transition-all duration-300 opacity-100 hover:scale-[1.02]">
          <rect x="700" y="20" width="240" height="70" rx="10" fill="url(#nodeGrad)" 
                :stroke="isServiceActive(4) ? '#10B981' : '#475569'" 
                :stroke-width="isServiceActive(4) ? '3' : '1.5'" />
          <text x="820" y="42" text-anchor="middle" fill="#10B981" class="font-mono text-[10px] font-bold uppercase">5. Motor SQL Serverless</text>
          <text x="820" y="63" text-anchor="middle" fill="#F8FAFC" class="font-display font-bold text-xs">Amazon Athena (dbt-athena)</text>
        </g>

        <!-- Connector 5 -> 6 -->
        <path d="M 820 90 L 820 110" stroke="#10B981" stroke-width="2" marker-end="url(#arrow-emerald)" />

        <!-- NODE 6: Amazon S3 (Apache Iceberg) -->
        <g @click="selectService(5)" class="cursor-pointer transition-all duration-300 opacity-100 hover:scale-[1.02]">
          <rect x="700" y="110" width="240" height="70" rx="10" fill="url(#nodeGrad)" 
                :stroke="isServiceActive(5) ? '#06B6D4' : '#475569'" 
                :stroke-width="isServiceActive(5) ? '3' : '1.5'" />
          <text x="820" y="132" text-anchor="middle" fill="#06B6D4" class="font-mono text-[10px] font-bold uppercase">6. Storage ACID</text>
          <text x="820" y="153" text-anchor="middle" fill="#F8FAFC" class="font-display font-bold text-xs">Amazon S3 (Apache Iceberg)</text>
        </g>

        <!-- Connector 6 -> 7 -->
        <path d="M 820 180 L 820 200" stroke="#06B6D4" stroke-width="2" marker-end="url(#arrow-emerald)" />

        <!-- NODE 7: AWS Glue Data Catalog -->
        <g @click="selectService(6)" class="cursor-pointer transition-all duration-300 opacity-100 hover:scale-[1.02]">
          <rect x="700" y="200" width="240" height="70" rx="10" fill="url(#nodeGrad)" 
                :stroke="isServiceActive(6) ? '#3B82F6' : '#475569'" 
                :stroke-width="isServiceActive(6) ? '3' : '1.5'" />
          <text x="820" y="222" text-anchor="middle" fill="#3B82F6" class="font-mono text-[10px] font-bold uppercase">7. Catálogo de Metadatos</text>
          <text x="820" y="243" text-anchor="middle" fill="#F8FAFC" class="font-display font-bold text-xs">AWS Glue Data Catalog</text>
        </g>

        <!-- DIRECT LINEAGE CONNECTOR: Node 4 (dbt-ol) -> Node 8 (DataZone API) -->
        <path d="M 530 170 L 530 270 L 380 270" stroke="#F43F5E" stroke-width="3" stroke-dasharray="6 4" marker-end="url(#arrow-rose)" 
              :class="{'animate-dash-flow': isServiceActive(7), 'opacity-60': !isServiceActive(7)}" />

        <!-- NODE 8: Amazon DataZone API -->
        <g @click="selectService(7)" class="cursor-pointer transition-all duration-300 opacity-100 hover:scale-[1.02]">
          <rect x="140" y="270" width="240" height="80" rx="10" fill="url(#nodeGrad)" 
                :stroke="isServiceActive(7) ? '#F43F5E' : '#475569'" 
                :stroke-width="isServiceActive(7) ? '3' : '1.5'" />
          <text x="260" y="292" text-anchor="middle" fill="#F43F5E" class="font-mono text-[10px] font-bold uppercase">8. Transporte Directo SigV4</text>
          <text x="260" y="313" text-anchor="middle" fill="#F8FAFC" class="font-mono font-bold text-xs">amazon_datazone_api</text>
          <text x="260" y="333" text-anchor="middle" fill="#FDA4AF" class="font-mono text-[9px]">API PostLineageEvent</text>
        </g>

        <!-- Connector 7 (Glue) & Connector 8 (DataZone) -> Node 9 (SageMaker Studio) -->
        <path d="M 820 270 L 820 310 L 680 310" stroke="#3B82F6" stroke-width="2" stroke-dasharray="4 4" marker-end="url(#arrow-blue)" />
        <path d="M 380 310 L 440 310" stroke="#F43F5E" stroke-width="2" marker-end="url(#arrow-rose)" />

        <!-- NODE 9: Amazon SageMaker Unified Studio -->
        <g @click="selectService(8)" class="cursor-pointer transition-all duration-300 opacity-100 hover:scale-[1.02]">
          <rect x="440" y="270" width="240" height="80" rx="10" fill="url(#nodeGrad)" 
                :stroke="isServiceActive(8) ? '#8B5CF6' : '#475569'" 
                :stroke-width="isServiceActive(8) ? '3' : '1.5'" />
          <text x="560" y="292" text-anchor="middle" fill="#8B5CF6" class="font-mono text-[10px] font-bold uppercase">9. Visualización de Linaje</text>
          <text x="560" y="313" text-anchor="middle" fill="#F8FAFC" class="font-display font-bold text-xs">SageMaker Unified Studio</text>
          <text x="560" y="333" text-anchor="middle" fill="#C084FC" class="font-mono text-[9px]">Column-Level Lineage Graph</text>
        </g>
      </svg>

      <!-- Corner Badge -->
      <div class="absolute top-3 right-3 flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/90 border border-slate-800 text-[11px] font-mono text-slate-300">
        <span class="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
        Nodo {{ activeServiceIndex + 1 }} / 9: {{ activeService.name }}
      </div>
    </div>

    <!-- Individual Technical Detail Panel for the Selected Service -->
    <div class="glass-card w-full rounded-xl p-4 border border-slate-800/80 flex flex-col md:flex-row items-center justify-between gap-4">
      <div class="flex-1 space-y-1">
        <div class="flex items-center gap-2">
          <span class="px-2 py-0.5 rounded font-mono text-[10px] font-bold uppercase bg-blue-950 text-blue-300 border border-blue-800">
            Servicio {{ activeServiceIndex + 1 }}
          </span>
          <h4 class="text-base font-display font-bold text-slate-100">{{ activeService.name }}</h4>
        </div>
        <p class="text-xs text-slate-300 leading-relaxed pt-1">{{ activeService.description }}</p>
        <p class="text-xs text-blue-300 font-mono pt-1">💡 <strong class="text-slate-200">Ventaja AWS:</strong> {{ activeService.whyAws }}</p>
      </div>

      <!-- Code / Config Box -->
      <div class="w-full md:w-80 shrink-0 bg-slate-950 rounded-lg p-3 border border-slate-800 font-mono text-[11px]">
        <div class="text-[9px] text-slate-500 uppercase tracking-widest mb-1 font-bold flex justify-between">
          <span>{{ activeService.snippetHeader }}</span>
          <span class="text-emerald-400">AWS Native</span>
        </div>
        <pre class="text-slate-300 overflow-x-auto whitespace-pre font-mono leading-tight">{{ activeService.snippetCode }}</pre>
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

const activeServiceIndex = computed(() => {
  if (selectedServiceOverride.value !== null) {
    return selectedServiceOverride.value;
  }
  switch (props.currentStep) {
    case 0: return 0; // EventBridge
    case 1: return 2; // ECS Fargate
    case 2: return 4; // Athena
    case 3:
    default: return 7; // DataZone API
  }
});

watch(() => props.currentStep, () => {
  selectedServiceOverride.value = null;
});

function selectService(index: number) {
  selectedServiceOverride.value = index;
}

function isServiceActive(index: number): boolean {
  return activeServiceIndex.value === index;
}

const servicesData = [
  {
    name: 'Amazon EventBridge Scheduler',
    description: 'Dispara la ejecución del pipeline según horarios programados (cron) o eventos de carga de datos S3.',
    whyAws: 'Cero servidores encendidos 24/7. Permite programar millones de tareas con precisión de milisegundos.',
    snippetHeader: 'Schedule Expression',
    snippetCode: `rate(1 hour)\n# O ventana cron pos-ingesta`
  },
  {
    name: 'AWS Step Functions',
    description: 'Orquesta la máquina de estados e invoca la tarea de ECS Fargate mediante la integración ecs:runTask.sync.',
    whyAws: 'Maneja reintentos con backoff exponencial y alertas automáticas sin escribir código de infraestructura.',
    snippetHeader: 'Integration Type',
    snippetCode: `Type: Task\nResource: ecs:runTask.sync`
  },
  {
    name: 'Amazon ECS en AWS Fargate',
    description: 'Ejecuta el contenedor de transformaciones de forma serverless, asignando CPU y memoria efímera sólo durante la ejecución.',
    whyAws: 'Cobro exacto por segundos consumidos. Escala a cero sin administrar clústeres ni instancias EC2.',
    snippetHeader: 'Fargate Launch Type',
    snippetCode: `launchType: FARGATE\nnetworkConfiguration: awsvpc`
  },
  {
    name: 'dbt-ol (OpenLineage Wrapper)',
    description: 'Wrapper oficial que ejecuta recetas dbt SQL e intercepta cada modelo generando eventos de linaje START/COMPLETE.',
    whyAws: 'Mantiene las transformaciones dbt estándar mientras garantiza la captura automática de metadatos.',
    snippetHeader: 'CLI Command',
    snippetCode: `dbt-ol run --profiles-dir .`
  },
  {
    name: 'Amazon Athena (dbt-athena)',
    description: 'Motor SQL serverless que ejecuta las consultas DDL/DML compiladas por el adaptador dbt-athena.',
    whyAws: 'Procesamiento masivo paralelo pagando únicamente por los bytes escaneados en cada consulta.',
    snippetHeader: 'Adapter Config',
    snippetCode: `type: athena\nschema: analytics_prod`
  },
  {
    name: 'Amazon S3 (Apache Iceberg)',
    description: 'Almacenamiento columnar Parquet con soporte Apache Iceberg para transacciones ACID y time travel.',
    whyAws: 'Garantiza consistencia en lecturas concurrentes y auditoría histórica de versiones de tablas.',
    snippetHeader: 'Table Format',
    snippetCode: `table_type: iceberg\nformat: parquet`
  },
  {
    name: 'AWS Glue Data Catalog',
    description: 'Repositorio centralizado de metadatos que registra esquemas y particiones de tablas en S3.',
    whyAws: 'Fuente única de verdad que permite a SageMaker y DataZone importar activos automáticamente.',
    snippetHeader: 'Catalog Entity',
    snippetCode: `database: prod_warehouse\ntable: fct_sales`
  },
  {
    name: 'Amazon DataZone API (amazon_datazone_api)',
    description: 'Transporte nativo de openlineage-python que publica eventos directo a la API PostLineageEvent.',
    whyAws: 'Sin proxy intermediario (sin Lambda, SQS o API Gateway). Autenticación nativa SigV4 IAM Role.',
    snippetHeader: 'openlineage.yml',
    snippetCode: `transport:\n  type: amazon_datazone_api\n  domainId: dzd_xxx`
  },
  {
    name: 'Amazon SageMaker Unified Studio',
    description: 'Interfaz gráfica que correlaciona los eventos de linaje con las tablas de Glue y dibuja el grafo a nivel de columna.',
    whyAws: 'Permite a ingenieros, auditores y agentes explorar visualmente las dependencias de extremo a extremo.',
    snippetHeader: 'Lineage Graph',
    snippetCode: `Granularity: Column-level\nScope: Upstream/Downstream`
  }
];

const activeService = computed(() => {
  return servicesData[activeServiceIndex.value] || servicesData[0];
});
</script>
