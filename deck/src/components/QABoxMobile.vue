<template>
  <div class="bg-background-card rounded-2xl p-4 border border-background-surface shadow-2xl space-y-3">
    <div class="flex items-center justify-between">
      <h3 class="font-sans font-bold text-sm text-text-main flex items-center gap-2">
        <span>💬</span> Pregunta al Presentador
      </h3>
      <span class="font-sans text-[10px]" :class="charsLeft < 20 ? 'text-semantic-error font-bold' : 'text-text-muted'">
        {{ charsLeft }} / 250
      </span>
    </div>

    <!-- Input Textarea -->
    <div class="space-y-2">
      <textarea
        v-model="questionText"
        maxlength="250"
        :disabled="cooldownRemaining > 0"
        placeholder="Escribe tu pregunta o comentario..."
        rows="2"
        class="w-full bg-background-main border border-background-surface rounded-xl p-3 text-xs text-text-main placeholder:text-text-muted focus:outline-none focus:border-brand-primary disabled:opacity-50 resize-none font-sans"
      ></textarea>

      <!-- Submit Button & Timer -->
      <div class="flex items-center justify-between">
        <span v-if="cooldownRemaining > 0" class="font-sans text-[11px] text-brand-primary flex items-center gap-1.5">
          <span class="w-2 h-2 rounded-full bg-brand-primary animate-ping"></span>
          Espera {{ cooldownRemaining }}s
        </span>
        <span v-else-if="successMessage" class="font-sans text-[11px] text-semantic-success font-semibold">
          ✓ Pregunta enviada
        </span>
        <span v-else class="text-[10px] text-text-muted font-sans">1 por 30s</span>

        <button
          @click="onSubmit"
          :disabled="!isValidQuestion || cooldownRemaining > 0"
          class="px-4 py-2 rounded-xl bg-brand-primary hover:bg-brand-secondary disabled:bg-background-surface disabled:text-text-muted text-white font-sans font-bold text-xs transition-colors shrink-0 shadow-md"
        >
          Enviar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue';

const emit = defineEmits<{
  (e: 'send-qa', question: string): void;
}>();

const questionText = ref('');
const cooldownRemaining = ref(0);
const successMessage = ref(false);
let timer: any = null;

const charsLeft = computed(() => 250 - questionText.value.length);
const isValidQuestion = computed(() => questionText.value.trim().length > 3);

function onSubmit() {
  if (!isValidQuestion.value || cooldownRemaining.value > 0) return;

  const cleanText = questionText.value.trim();
  emit('send-qa', cleanText);

  questionText.value = '';
  successMessage.value = true;
  cooldownRemaining.value = 30;

  timer = setInterval(() => {
    cooldownRemaining.value--;
    if (cooldownRemaining.value <= 0) {
      clearInterval(timer);
      successMessage.value = false;
    }
  }, 1000);
}

onUnmounted(() => {
  if (timer) clearInterval(timer);
});
</script>