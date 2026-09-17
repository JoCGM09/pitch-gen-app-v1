<template>
  <div 
    class="deck-container w-screen h-screen flex flex-col justify-between cursor-pointer select-none overflow-hidden relative"
    @click="handleContainerClick"
  >
    <!-- TOP HEADER BAR -->
    <header class="w-full px-8 py-2.5 flex items-center justify-between z-20 border-b border-slate-800/40 bg-slate-950/20 backdrop-blur-md">
      <div class="flex items-center gap-2">
        <div class="w-2.5 h-2.5 rounded-full bg-blue-500/80 animate-pulse"></div>
      </div>
    </header>

    <!-- MAIN SLIDE CANVAS -->
    <main class="aspect-video flex-1 w-full max-w-[1720px] mx-auto px-8 py-4 flex flex-col justify-center z-10 overflow-y-auto">
      <Transition name="fade" mode="out-in">
        <div v-if="currentSlide" :key="currentSlide.id" class="w-full h-full flex flex-col justify-center">
          
          <!-- LAYOUT 1: HERO (Slide 0) -->
          <div v-if="currentSlide.layout === 'hero'" class="flex flex-col items-center text-center space-y-6 my-auto max-w-4xl mx-auto">
            <span class="px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 font-mono text-xs font-semibold uppercase tracking-wider">
              {{ currentSlide.badge }}
            </span>

            <h1 class="text-4xl md:text-5xl font-display font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-blue-300 leading-tight">
              {{ currentSlide.title }}
            </h1>

            <p class="text-lg text-slate-300 max-w-2xl font-light leading-relaxed">
              {{ currentSlide.subtitle }}
            </p>

            <!-- Poll Widget or Question Box -->
            <div class="w-full">
              <PollWidget v-if="currentSlide.interactionTrigger" :triggerId="currentSlide.interactionTrigger" />
              <div v-else class="glass-card p-6 rounded-2xl border-l-4 border-l-blue-500 text-left my-2">
                <div v-html="sanitize(currentSlide.content)" class="prose prose-invert max-w-none text-slate-200"></div>
              </div>
            </div>

            <!-- Speaker Bio Tag -->
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center font-bold text-white font-mono text-lg shadow-md shrink-0">
                J
              </div>
              <div class="text-left">
                <p class="font-display font-bold text-base text-slate-200">José Carlos Guerra Martinez</p>
                <p class="text-xs text-slate-400 font-mono mt-0.5 leading-tight">
                  Not Sales Cloud Architect at Axmos Technologies<br>
                  Google Developer Group Open Lima Organizer
                </p>
              </div>
            </div>
          </div>

          <!-- LAYOUT 2: SPOTLIGHT (Slide 1) -->
          <div v-else-if="currentSlide.layout === 'spotlight'" class="flex flex-col space-y-4 my-auto">
            <div class="space-y-1">
              <h2 class="text-3xl md:text-4xl font-display font-extrabold text-slate-100">{{ currentSlide.title }}</h2>
              <p class="text-base text-slate-400 font-light">{{ currentSlide.subtitle }}</p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              <template v-if="currentSlide.steps">
                <div 
                  v-for="(step, index) in currentSlide.steps" 
                  :key="step.id"
                  v-show="index <= currentStepIndex"
                  class="glass-card p-6 rounded-2xl border transition-all duration-500 ease-out space-y-4"
                  :class="index === currentStepIndex ? 'border-cyan-400/80 shadow-glow-blue scale-[1.03] bg-slate-900/90' : 'border-slate-800/80 opacity-75'"
                >
                  <div class="flex items-center justify-between">
                    <span class="px-2.5 py-1 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono text-xs font-bold uppercase">
                      Pilar 0{{ index + 1 }}
                    </span>
                  </div>
                  <h3 class="text-xl font-display font-bold text-slate-100">{{ step.title }}</h3>
                  <div v-html="sanitize(step.content)" class="text-slate-300 text-sm leading-relaxed"></div>
                </div>
              </template>
            </div>
          </div>

          <!-- LAYOUT 3: RISK CARDS (Slide 2) -->
          <div v-else-if="currentSlide.layout === 'risk-cards'" class="flex flex-col space-y-4 my-auto">
            <div class="space-y-1">
              <h2 class="text-3xl md:text-4xl font-display font-extrabold text-slate-100">{{ currentSlide.title }}</h2>
              <p class="text-base text-slate-400 font-light">{{ currentSlide.subtitle }}</p>
            </div>

            <PollWidget v-if="currentSlide.interactionTrigger" :triggerId="currentSlide.interactionTrigger" />

            <div class="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
              <template v-if="currentSlide.steps">
                <div 
                  v-for="(step, index) in currentSlide.steps" 
                  :key="step.id"
                  v-show="index <= currentStepIndex"
                  class="glass-card p-6 rounded-2xl border transition-all duration-500 space-y-3"
                  :class="index === currentStepIndex ? 'border-rose-500/80 shadow-glow-rose bg-slate-900/90 scale-[1.03]' : 'border-slate-800/80 opacity-75'"
                >
                  <div class="flex items-center justify-between">
                    <span class="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 font-mono font-bold text-sm flex items-center justify-center">
                      0{{ index + 1 }}
                    </span>
                    <span class="text-xs font-mono text-rose-400/80 uppercase font-semibold">Riesgo IA</span>
                  </div>
                  <h3 class="text-lg font-display font-bold text-slate-100">{{ step.title }}</h3>
                  <div v-html="sanitize(step.content)" class="text-slate-300 text-sm leading-relaxed"></div>
                </div>
              </template>
            </div>
          </div>

          <!-- LAYOUT 4: DBT DAG DIAGRAM (Slide 3) -->
          <div v-else-if="currentSlide.layout === 'dbt-dag'" class="flex flex-col space-y-3 my-auto">
            <div class="space-y-1">
              <h2 class="text-3xl font-display font-extrabold text-slate-100">{{ currentSlide.title }}</h2>
              <p class="text-sm text-slate-400 font-light">{{ currentSlide.subtitle }}</p>
            </div>
            <DbtDagDiagram :currentStep="currentStepIndex" />
          </div>

          <!-- LAYOUT 5: COMPARISON (Slide 4) -->
          <div v-else-if="currentSlide.layout === 'comparison'" class="flex flex-col space-y-4 my-auto">
            <div class="space-y-1">
              <h2 class="text-3xl md:text-4xl font-display font-extrabold text-slate-100">{{ currentSlide.title }}</h2>
              <p class="text-base text-slate-400 font-light">{{ currentSlide.subtitle }}</p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <template v-if="currentSlide.steps">
                <div 
                  v-for="(step, index) in currentSlide.steps" 
                  :key="step.id"
                  v-show="index <= currentStepIndex"
                  class="glass-card p-6 rounded-2xl border transition-all duration-500 space-y-3"
                  :class="index === 0 ? 'border-orange-500/80 shadow-glow-purple bg-slate-900/90 scale-[1.02]' : 'border-blue-500/80 shadow-glow-blue bg-slate-900/90 scale-[1.02]'"
                >
                  <div class="flex items-center gap-2">
                    <span class="px-2.5 py-1 rounded text-xs font-mono font-bold uppercase"
                          :class="index === 0 ? 'bg-orange-500/10 border border-orange-500/30 text-orange-400' : 'bg-blue-500/10 border border-blue-500/30 text-blue-400'">
                      {{ index === 0 ? 'Modelo dbt (SQL)' : 'Modelo de IA (LLM)' }}
                    </span>
                  </div>
                  <h3 class="text-xl font-display font-bold text-slate-100">{{ step.title }}</h3>
                  <div v-html="sanitize(step.content)" class="text-slate-300 text-sm leading-relaxed"></div>
                </div>
              </template>
            </div>
          </div>

          <!-- LAYOUT 6: AGENT CATALOG DIAGRAM (Slide 5 - 4 pasos) -->
          <div v-else-if="currentSlide.layout === 'agent-catalog'" class="flex flex-col space-y-3 my-auto">
            <div class="space-y-1">
              <h2 class="text-3xl font-display font-extrabold text-slate-100">{{ currentSlide.title }}</h2>
              <p class="text-sm text-slate-400 font-light">{{ currentSlide.subtitle }}</p>
            </div>
            <AgentCatalogDiagram :currentStep="currentStepIndex" />
          </div>

          <!-- LAYOUT 7: LINEAGE TREE (Slide 6) -->
          <div v-else-if="currentSlide.layout === 'lineage-tree'" class="flex flex-col space-y-3 my-auto">
            <div class="space-y-1">
              <h2 class="text-3xl font-display font-extrabold text-slate-100">{{ currentSlide.title }}</h2>
              <p class="text-sm text-slate-400 font-light">{{ currentSlide.subtitle }}</p>
            </div>
            <DataLineageTreeDiagram :currentStep="currentStepIndex" />
          </div>

          <!-- LAYOUT 8: OPENLINEAGE DIAGRAM (Slide 7) -->
          <div v-else-if="currentSlide.layout === 'standard-cards'" class="flex flex-col space-y-3 my-auto">
            <div class="space-y-1">
              <h2 class="text-3xl font-display font-extrabold text-slate-100">{{ currentSlide.title }}</h2>
              <p class="text-sm text-slate-400 font-light">{{ currentSlide.subtitle }}</p>
            </div>
            <OpenLineageDiagram :currentStep="currentStepIndex" />
          </div>

          <!-- LAYOUT 9: IMPACT RISK DIAGRAM (Slide 8) -->
          <div v-else-if="currentSlide.layout === 'impact-grid'" class="flex flex-col space-y-3 my-auto">
            <div class="space-y-1">
              <h2 class="text-3xl font-display font-extrabold text-slate-100">{{ currentSlide.title }}</h2>
              <p class="text-sm text-slate-400 font-light">{{ currentSlide.subtitle }}</p>
            </div>
            <ImpactRiskDiagram :currentStep="currentStepIndex" />
          </div>

          <!-- LAYOUT 10: AWS BUILDING BLOCK 1 (Slide 9 - 4 componentes separados) -->
          <div v-else-if="currentSlide.layout === 'aws-building-block-1'" class="flex flex-col space-y-4 my-auto">
            <div class="space-y-1">
              <span class="px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 font-mono text-xs font-bold uppercase tracking-wider">
                Infraestructura Serverless en AWS
              </span>
              <h2 class="text-3xl md:text-4xl font-display font-extrabold text-slate-100">{{ currentSlide.title }}</h2>
              <p class="text-base text-slate-400 font-light">{{ currentSlide.subtitle }}</p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
              <template v-if="currentSlide.steps">
                <div 
                  v-for="(step, index) in currentSlide.steps" 
                  :key="step.id"
                  v-show="index <= currentStepIndex"
                  class="glass-card p-5 rounded-2xl border transition-all duration-500 space-y-3 bg-slate-900/90 flex flex-col justify-between"
                  :class="index === currentStepIndex ? 'border-purple-500/80 shadow-glow-purple scale-[1.03]' : 'border-slate-800/80 opacity-75'"
                >
                  <div class="flex items-center justify-between">
                    <span class="px-2 py-0.5 rounded font-mono text-[10px] font-bold uppercase bg-purple-950 text-purple-300 border border-purple-800">
                      Componente {{ index + 1 }}
                    </span>
                  </div>
                  <h3 class="text-base font-display font-bold text-slate-100 leading-snug">{{ step.title }}</h3>
                  <div v-html="sanitize(step.content)" class="text-slate-300 text-xs leading-relaxed"></div>
                </div>
              </template>
            </div>
          </div>

          <!-- LAYOUT 11: AWS BUILDING BLOCK 2 (Slide 10 - 5 componentes separados) -->
          <div v-else-if="currentSlide.layout === 'aws-building-block-2'" class="flex flex-col space-y-4 my-auto">
            <div class="space-y-1">
              <span class="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-bold uppercase tracking-wider">
                Infraestructura Serverless en AWS
              </span>
              <h2 class="text-3xl md:text-4xl font-display font-extrabold text-slate-100">{{ currentSlide.title }}</h2>
              <p class="text-base text-slate-400 font-light">{{ currentSlide.subtitle }}</p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-5 gap-3.5 pt-2">
              <template v-if="currentSlide.steps">
                <div 
                  v-for="(step, index) in currentSlide.steps" 
                  :key="step.id"
                  v-show="index <= currentStepIndex"
                  class="glass-card p-4 rounded-2xl border transition-all duration-500 space-y-2 bg-slate-900/90 flex flex-col justify-between"
                  :class="index === currentStepIndex ? 'border-emerald-500/80 shadow-glow-emerald scale-[1.03]' : 'border-slate-800/80 opacity-75'"
                >
                  <div class="flex items-center justify-between">
                    <span class="px-2 py-0.5 rounded font-mono text-[9px] font-bold uppercase bg-emerald-950 text-emerald-300 border border-emerald-800">
                      Componente {{ index + 5 }}
                    </span>
                  </div>
                  <h3 class="text-sm font-display font-bold text-slate-100 leading-snug">{{ step.title }}</h3>
                  <div v-html="sanitize(step.content)" class="text-slate-300 text-[11px] leading-relaxed"></div>
                </div>
              </template>
            </div>
          </div>

          <!-- LAYOUT 12: ARCHITECTURE DIAGRAM (Slide 11) -->
          <div v-else-if="currentSlide.layout === 'architecture'" class="flex flex-col space-y-3 my-auto">
            <div class="space-y-1">
              <h2 class="text-3xl font-display font-extrabold text-slate-100">{{ currentSlide.title }}</h2>
              <p class="text-sm text-slate-400 font-light">{{ currentSlide.subtitle }}</p>
            </div>
            <AwsArchitectureDiagram :currentStep="currentStepIndex" />
          </div>

          <!-- LAYOUT QA VIEW -->
          <div v-else-if="currentSlide.layout === 'qa-view'" class="flex flex-col space-y-4 my-auto h-full max-h-[70vh]">
            <div class="space-y-1 text-center shrink-0">
              <h2 class="text-3xl md:text-4xl font-display font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-teal-200">
                {{ currentSlide.title }}
              </h2>
              <p class="text-sm text-slate-400 font-light max-w-2xl mx-auto">{{ currentSlide.subtitle }}</p>
            </div>

            <div class="flex-1 overflow-y-auto mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 auto-rows-max pr-4 custom-scrollbar">
              <div 
                v-for="(q, idx) in qaQuestionsList" 
                :key="q.id"
                class="glass-card p-5 rounded-2xl border border-slate-700/60 bg-slate-900/80 shadow-lg space-y-2 h-fit relative group"
              >
                <!-- Botón ocultar pregunta -->
                <button 
                  @click.stop="handleRemoveQA(q.id)"
                  class="absolute top-3 right-3 w-7 h-7 rounded-full bg-rose-500/20 hover:bg-rose-500/40 text-rose-400 transition-colors flex items-center justify-center border border-rose-500/30 font-bold"
                  title="Eliminar pregunta"
                >
                  ✕
                </button>

                <div class="flex items-center justify-between text-xs font-mono text-slate-500 pr-8">
                  <span class="text-emerald-400 font-bold uppercase">Pregunta #{{ qaQuestionsList.length - idx }}</span>
                  <span>{{ new Date(q.timestamp).toLocaleTimeString() }}</span>
                </div>
                <p class="text-lg text-slate-200 font-light leading-relaxed">{{ q.question }}</p>
              </div>

              <div v-if="qaQuestionsList.length === 0" class="col-span-1 md:col-span-2 text-center p-12 border border-dashed border-slate-700/50 rounded-2xl">
                <p class="text-slate-400 font-mono text-sm">No hay preguntas de la audiencia todavía.</p>
              </div>
            </div>
          </div>

          <!-- LAYOUT DEFAULT: CARDS / ACTION -->
          <div v-else class="flex flex-col space-y-4 my-auto max-w-5xl mx-auto w-full">
            <div class="space-y-1 text-center">
              <h2 class="text-3xl md:text-4xl font-display font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-200">
                {{ currentSlide.title }}
              </h2>
              <p class="text-sm text-slate-400 font-light max-w-2xl mx-auto">{{ currentSlide.subtitle }}</p>
            </div>

            <PollWidget v-if="currentSlide.interactionTrigger" :triggerId="currentSlide.interactionTrigger" />

            <div class="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
              <template v-if="currentSlide.steps">
                <div 
                  v-for="(step, index) in currentSlide.steps" 
                  :key="step.id"
                  v-show="index <= currentStepIndex"
                  class="glass-card p-6 rounded-2xl border transition-all duration-500 space-y-3"
                  :class="index === currentStepIndex ? 'border-emerald-500/80 shadow-glow-emerald bg-slate-900/90 scale-[1.02]' : 'border-slate-800/80 opacity-75'"
                >
                  <span class="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono font-bold text-sm flex items-center justify-center">
                    0{{ index + 1 }}
                  </span>
                  <h3 class="text-lg font-display font-bold text-slate-100">{{ step.title }}</h3>
                  <div v-html="sanitize(step.content)" class="text-slate-300 text-sm leading-relaxed"></div>
                </div>
              </template>
            </div>
          </div>

        </div>
      </Transition>
    </main>

    <!-- BOTTOM FOOTER BAR -->
    <footer class="w-full px-8 py-3 z-20 border-t border-slate-800/60 bg-slate-950/60 backdrop-blur-md flex items-center justify-between">
      <div class="flex items-center gap-2"></div>

      <!-- Slide Progress Bar & Counter -->
      <div class="flex items-center gap-4 flex-1 max-w-md mx-8">
        <div class="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <div 
            class="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 rounded-full"
            :style="{ width: `${progressPercentage}%` }"
          ></div>
        </div>
        <span class="font-mono text-xs text-slate-300 font-bold shrink-0">
          Slide {{ currentSlideIndex + 1 }} / {{ totalSlides }}
        </span>
      </div>

      <!-- Navigation Legend Hint -->
      <div class="flex items-center gap-2 text-xs font-mono text-slate-500">
        <span class="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">←</span>
        <span class="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">→</span>
        <span class="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">Espacio</span>
        <span>Navegar</span>
      </div>
    </footer>

    <!-- Secret Prompt Overlay -->
    <div v-if="showSecretPrompt" class="absolute inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center" @click.stop>
      <div class="bg-slate-900 border border-slate-700 p-8 rounded-2xl w-full max-w-md space-y-6">
        <h2 class="text-2xl font-display font-bold text-slate-100">Autenticación de Presentador</h2>
        <p class="text-sm text-slate-400">Introduce la clave de la sesión para sincronizar tu deck con la audiencia en tiempo real.</p>
        <div class="space-y-4">
          <input 
            type="password" 
            v-model="presenterSecretInput" 
            placeholder="Clave secreta..."
            @keydown.enter="submitSecret"
            class="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-slate-100 focus:outline-none focus:border-blue-500"
          />
          <button 
            @click="submitSecret" 
            class="w-full px-4 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-colors"
          >
            Conectar y Sincronizar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, watch, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import DOMPurify from 'dompurify';
import AwsArchitectureDiagram from '../components/AwsArchitectureDiagram.vue';
import DbtDagDiagram from '../components/DbtDagDiagram.vue';
import AgentCatalogDiagram from '../components/AgentCatalogDiagram.vue';
import DataLineageTreeDiagram from '../components/DataLineageTreeDiagram.vue';
import OpenLineageDiagram from '../components/OpenLineageDiagram.vue';
import ImpactRiskDiagram from '../components/ImpactRiskDiagram.vue';
import PollWidget from '../components/PollWidget.vue';
import { useDeck } from '../composables/useDeck';
import { useKeyboardControls } from '../composables/useKeyboardControls';
import { useSocket } from '../composables/useSocket';
import type { Slide } from '../types';
import slidesDataRaw from '../data/slides.json';

const slidesData = slidesDataRaw as unknown as Slide[];

const route = useRoute();
const router = useRouter();
const { initDeck, currentSlide, currentSlideIndex, currentStepIndex, next, prev } = useDeck();
const { connect, emitPresenterSync, emitPresenterReset, requestQAList, removeQA, qaQuestionsList } = useSocket();

const presenterSecretInput = ref('');
const activeSecret = ref(import.meta.env.VITE_PRESENTER_SECRET || '');
const showSecretPrompt = computed(() => !activeSecret.value);

function submitSecret() {
  if (presenterSecretInput.value.trim()) {
    activeSecret.value = presenterSecretInput.value.trim();
    syncWithServer();
  }
}

function handleRemoveQA(id: string) {
  if (activeSecret.value) {
    removeQA(activeSecret.value, id);
  }
}

const totalSlides = computed(() => slidesData.length);
const progressPercentage = computed(() => {
  if (totalSlides.value === 0) return 0;
  return ((currentSlideIndex.value + 1) / totalSlides.value) * 100;
});

const sanitize = (html: string) => DOMPurify.sanitize(html);

useKeyboardControls({ next, prev });

function handleContainerClick(event: MouseEvent) {
  const target = event.target as HTMLElement;
  if (target.closest('button') || target.closest('a') || target.closest('input')) {
    return;
  }
  next();
}

function syncWithServer() {
  if (!activeSecret.value) return;
  const slide = slidesData[currentSlideIndex.value] as any;
  const trigger = slide && slide.interactionTrigger ? slide.interactionTrigger : null;
  emitPresenterSync(currentSlideIndex.value, currentStepIndex.value, trigger, activeSecret.value);
  if (trigger) {
    console.log(`[Interaction Trigger Fired]: ${trigger}`);
  }
  
  if (slide && slide.layout === 'qa-view') {
    requestQAList(activeSecret.value);
  }
}

onMounted(() => {
  initDeck(slidesData as any);
  connect(import.meta.env.VITE_WS_URL || 'https://pitch-gen-realtime.onrender.com', 'deck');
  syncStateFromRoute();
  syncWithServer();
});

watch(() => route.params, () => {
  syncStateFromRoute();
});

watch([currentSlideIndex, currentStepIndex], ([newSlide, newStep]) => {
  const currentRouteSlide = parseInt(route.params.slide as string, 10);
  const currentRouteStep = parseInt(route.params.step as string, 10);
  
  if (newSlide !== currentRouteSlide || newStep !== currentRouteStep) {
    router.push(`/deck/${newSlide}/${newStep}`);
  }

  syncWithServer();
});

function syncStateFromRoute() {
  if (route.name === 'deck') {
    let slide = parseInt(route.params.slide as string, 10);
    let step = parseInt(route.params.step as string, 10);
    
    // Auto-reset when reaching exactly the beginning of the presentation
    if (slide === 0 && step === -1 && activeSecret.value) {
      emitPresenterReset(activeSecret.value);
    }
    
    if (!isNaN(slide)) {
      slide = Math.max(0, Math.min(slide, slidesData.length - 1));
      currentSlideIndex.value = slide;
    }
    
    if (!isNaN(step)) {
      const currentSlideData = slidesData[currentSlideIndex.value] as any;
      const maxSteps = currentSlideData.steps ? currentSlideData.steps.length - 1 : -1;
      step = Math.max(-1, Math.min(step, maxSteps));
      currentStepIndex.value = step;
    }
  }
}
</script>
