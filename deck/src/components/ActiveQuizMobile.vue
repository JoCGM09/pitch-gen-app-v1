<template>
  <div class="w-full flex flex-col space-y-4">
    <!-- Victory Screen when 4/4 streak is reached -->
    <QuizVictory 
      v-if="currentStreak === 4" 
      @restart="handleStartQuiz"
    />

    <!-- Active Quiz Questions Form -->
    <div v-else-if="currentQuestion" class="glass-card p-5 rounded-2xl border border-blue-500/30 bg-slate-950/40 space-y-5 relative overflow-hidden">
      <!-- Top Streak Header -->
      <div class="flex items-center justify-between border-b border-slate-800 pb-3">
        <div class="flex items-center gap-2">
          <span class="text-base">🧠</span>
          <span class="font-sans font-bold text-xs uppercase tracking-wider text-slate-200">
            Desafío Final
          </span>
        </div>

        <div class="flex items-center gap-1">
          <span class="font-mono text-xs font-bold text-blue-400 mr-2">
            Racha: {{ currentStreak }}/4
          </span>
          <div class="flex gap-1">
            <div 
              v-for="i in 4" 
              :key="i"
              class="w-2.5 h-2.5 rounded-full transition-all duration-300"
              :class="i <= currentStreak ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]' : 'bg-slate-800 border border-slate-700'"
            ></div>
          </div>
        </div>
      </div>

      <!-- Feedback Banner (Wrong / Reset Notification) -->
      <Transition name="fade">
        <div v-if="feedbackMessage" class="p-3 rounded-xl border text-xs font-mono flex items-center justify-between"
             :class="feedbackType === 'error' ? 'bg-red-500/10 border-red-500/30 text-red-300' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'">
          <span>{{ feedbackMessage }}</span>
          <span class="text-xs">{{ feedbackType === 'error' ? '💥' : '✨' }}</span>
        </div>
      </Transition>

      <!-- Question Text -->
      <div class="space-y-2">
        <span class="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
          Pregunta {{ currentStreak + 1 }} de 4:
        </span>
        <h3 class="text-sm font-semibold text-white leading-relaxed">
          {{ currentQuestion.question }}
        </h3>
      </div>

      <!-- Options Buttons -->
      <div class="space-y-2.5 pt-1">
        <button
          v-for="(option, idx) in currentQuestion.options"
          :key="idx"
          @click="selectOption(idx)"
          :disabled="isSubmitting"
          class="w-full text-left p-3.5 rounded-xl border font-sans text-xs transition-all flex items-start gap-3 active:scale-[0.98] disabled:opacity-50"
          :class="selectedOption === idx 
            ? 'bg-blue-600/30 border-blue-400 text-white font-medium shadow-[0_0_15px_rgba(59,130,246,0.3)]' 
            : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 text-slate-200 hover:bg-slate-800/80'"
        >
          <span class="w-5 h-5 rounded-lg bg-slate-800 border border-slate-700 font-mono text-[10px] font-bold text-slate-300 flex items-center justify-center shrink-0 mt-0.5">
            {{ ['A', 'B', 'C', 'D'][idx] }}
          </span>
          <span class="flex-1 leading-snug">{{ option }}</span>
        </button>
      </div>

      <p class="text-[10px] text-slate-500 font-mono text-center pt-2">
        ⚠️ Si te equivocas, la racha vuelve a 0 y se asignan 4 preguntas nuevas.
      </p>
    </div>

    <!-- Loading State -->
    <div v-else class="glass-card p-8 rounded-2xl border border-slate-800 text-center space-y-3">
      <div class="animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
      <p class="text-xs text-slate-400 font-mono">Cargando preguntas del Quiz...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { useSocket } from '../composables/useSocket';
import QuizVictory from './QuizVictory.vue';

const props = defineProps<{
  uuid: string;
}>();

const { quizSession, quizAnswerResult, startQuiz, submitQuizAnswer } = useSocket();

const selectedOption = ref<number | null>(null);
const isSubmitting = ref(false);
const feedbackMessage = ref<string | null>(null);
const feedbackType = ref<'success' | 'error'>('success');

const currentStreak = computed(() => quizSession.value?.streak || 0);

const currentQuestion = computed(() => {
  if (!quizSession.value || !quizSession.value.questions) return null;
  const index = quizSession.value.streak;
  if (index >= 4) return null;
  return quizSession.value.questions[index] || null;
});

function handleStartQuiz() {
  selectedOption.value = null;
  feedbackMessage.value = null;
  if (props.uuid) {
    startQuiz(props.uuid);
  }
}

function selectOption(optionIndex: number) {
  if (isSubmitting.value || !currentQuestion.value || !props.uuid) return;

  selectedOption.value = optionIndex;
  isSubmitting.value = true;

  submitQuizAnswer(props.uuid, currentQuestion.value.id, optionIndex);
}

watch(quizAnswerResult, (newResult) => {
  if (!newResult) return;

  isSubmitting.value = false;
  selectedOption.value = null;

  if (newResult.correct) {
    feedbackType.value = 'success';
    feedbackMessage.value = newResult.completed ? '🎉 ¡Felicidades! Completaste el desafío.' : '✅ ¡Respuesta correcta!';
    setTimeout(() => {
      feedbackMessage.value = null;
    }, 2000);
  } else {
    feedbackType.value = 'error';
    feedbackMessage.value = '❌ Incorrecto. ¡Racha reiniciada! Nuevas preguntas asignadas.';
    setTimeout(() => {
      feedbackMessage.value = null;
    }, 3000);
  }
});

onMounted(() => {
  handleStartQuiz();
});
</script>
