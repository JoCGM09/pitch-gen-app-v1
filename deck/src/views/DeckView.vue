<template>
  <div 
    class="deck-container w-screen h-screen flex items-center justify-center cursor-pointer select-none overflow-hidden"
    @click="next"
  >
    <div class="aspect-video w-full max-w-[1920px] max-h-screen p-12 md:p-24 relative flex flex-col justify-center">
      <Transition name="fade" mode="out-in">
        <div v-if="currentSlide" :key="currentSlide.id" class="w-full h-full flex flex-col">
          <!-- Slide Base Content -->
          <div class="slide-content">
            <template v-if="currentSlide.content.includes('<AwsArchitectureDiagram />')">
              <div v-html="sanitize(currentSlide.content.replace('<AwsArchitectureDiagram />', ''))"></div>
              <AwsArchitectureDiagram :currentStep="currentStepIndex" class="mt-8" />
            </template>
            <template v-else>
              <div v-html="sanitize(currentSlide.content)"></div>
            </template>
          </div>
          
          <!-- Slide Steps -->
          <div v-if="currentSlide.steps" class="flex flex-col gap-4 mt-8">
            <TransitionGroup name="slide-up">
              <div 
                v-for="(step, index) in currentSlide.steps" 
                :key="step.id"
                v-show="index <= currentStepIndex"
                v-html="sanitize(step.content)"
                class="w-full"
              ></div>
            </TransitionGroup>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import DOMPurify from 'dompurify';
import AwsArchitectureDiagram from '../components/AwsArchitectureDiagram.vue';
import { useDeck } from '../composables/useDeck';
import { useKeyboardControls } from '../composables/useKeyboardControls';
import { useSocket } from '../composables/useSocket';
import slidesData from '../data/slides.json';

const route = useRoute();
const router = useRouter();
const { initDeck, currentSlide, currentSlideIndex, currentStepIndex, next, prev } = useDeck();
const { connect, emitPresenterSync } = useSocket();

const sanitize = (html: string) => DOMPurify.sanitize(html);

useKeyboardControls({ next, prev });

onMounted(() => {
  // Inicializamos con el JSON parseado de pitch.md en vez de dummySlides
  initDeck(slidesData as any);
  connect();
  syncStateFromRoute();
  
  // Emisión inicial al servidor
  const slide = slidesData[currentSlideIndex.value] as any;
  const trigger = slide && slide.interactionTrigger ? slide.interactionTrigger : null;
  emitPresenterSync(currentSlideIndex.value, currentStepIndex.value, trigger);
  if (trigger) {
    console.log(`[Interaction Trigger Fired]: ${trigger} en la slide ${currentSlideIndex.value}`);
  }
});

// Actualizar el estado interno si la URL cambia (ej. el usuario usa Back/Forward en el navegador)
watch(() => route.params, () => {
  syncStateFromRoute();
});

// Sincronizar la URL y emitir al servidor si el estado interno cambia
watch([currentSlideIndex, currentStepIndex], ([newSlide, newStep]) => {
  const currentRouteSlide = parseInt(route.params.slide as string, 10);
  const currentRouteStep = parseInt(route.params.step as string, 10);
  
  if (newSlide !== currentRouteSlide || newStep !== currentRouteStep) {
    router.push(`/deck/${newSlide}/${newStep}`);
  }

  const slide = slidesData[newSlide] as any;
  const trigger = slide && slide.interactionTrigger ? slide.interactionTrigger : null;
  emitPresenterSync(newSlide, newStep, trigger);
  if (trigger) {
    console.log(`[Interaction Trigger Fired]: ${trigger} en la slide ${newSlide}`);
  }
});

function syncStateFromRoute() {
  if (route.name === 'deck') {
    let slide = parseInt(route.params.slide as string, 10);
    let step = parseInt(route.params.step as string, 10);
    
    // Bounds checking and clamping
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
