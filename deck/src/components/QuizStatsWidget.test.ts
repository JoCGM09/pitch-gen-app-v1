import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { ref } from 'vue';
import QuizStatsWidget from './QuizStatsWidget.vue';

const mockQuizStats = ref({
  0: 0, 1: 0, 2: 0, 3: 0, 4: 0, totalParticipants: 0
});

vi.mock('../composables/useSocket', () => ({
  useSocket: () => ({
    quizStats: mockQuizStats
  })
}));

describe('QuizStatsWidget.vue', () => {
  beforeEach(() => {
    mockQuizStats.value = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, totalParticipants: 0 };
  });

  it('renders correctly with initial zero stats', () => {
    const wrapper = mount(QuizStatsWidget);
    expect(wrapper.text()).toContain('0 Participantes');
    expect(wrapper.text()).toContain('Tasa de Éxito0%');
  });

  it('updates UI when stats change', async () => {
    mockQuizStats.value = {
      0: 5, 1: 3, 2: 2, 3: 0, 4: 10, totalParticipants: 20
    };
    const wrapper = mount(QuizStatsWidget);
    
    expect(wrapper.text()).toContain('20 Participantes');
    // 10 victories / 20 participants = 50% success rate
    expect(wrapper.text()).toContain('Tasa de Éxito50%');
    expect(wrapper.text()).toContain('10 personas (50%)');
  });
});
