import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import { ref } from 'vue';
import ActiveQuizMobile from './ActiveQuizMobile.vue';

const mockQuizSession = ref<any>(null);
const mockQuizAnswerResult = ref<any>(null);
const mockStartQuiz = vi.fn();
const mockSubmitQuizAnswer = vi.fn();

vi.mock('../composables/useSocket', () => ({
  useSocket: () => ({
    quizSession: mockQuizSession,
    quizAnswerResult: mockQuizAnswerResult,
    startQuiz: mockStartQuiz,
    submitQuizAnswer: mockSubmitQuizAnswer
  })
}));

describe('ActiveQuizMobile.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockQuizSession.value = null;
    mockQuizAnswerResult.value = null;
  });

  it('calls startQuiz on mount', async () => {
    mount(ActiveQuizMobile, {
      props: { uuid: 'test-uuid' }
    });
    expect(mockStartQuiz).toHaveBeenCalledWith('test-uuid');
  });

  it('renders loading state when quizSession is null', () => {
    const wrapper = mount(ActiveQuizMobile, {
      props: { uuid: 'test-uuid' }
    });
    expect(wrapper.text()).toContain('Cargando preguntas del Quiz...');
  });

  it('renders first question when quizSession is provided', async () => {
    mockQuizSession.value = {
      streak: 0,
      questions: [
        { id: 'q1', question: '¿Cuál es el riesgo de que la IA acceda a datos sin linaje?', options: ['A', 'B', 'C', 'D'] }
      ]
    };
    const wrapper = mount(ActiveQuizMobile, {
      props: { uuid: 'test-uuid' }
    });
    await flushPromises();

    expect(wrapper.text()).toContain('¿Cuál es el riesgo de que la IA acceda a datos sin linaje?');
    expect(wrapper.text()).toContain('Racha: 0/4');
  });

  it('submits answer when an option is clicked', async () => {
    mockQuizSession.value = {
      streak: 0,
      questions: [
        { id: 'q1', question: 'Question 1', options: ['A', 'B', 'C', 'D'] }
      ]
    };
    const wrapper = mount(ActiveQuizMobile, {
      props: { uuid: 'test-uuid' }
    });
    await flushPromises();

    const buttons = wrapper.findAll('button');
    await buttons[0].trigger('click');

    expect(mockSubmitQuizAnswer).toHaveBeenCalledWith('test-uuid', 'q1', 0);
  });

  it('shows success feedback on correct answer', async () => {
    mockQuizSession.value = {
      streak: 0,
      questions: [
        { id: 'q1', question: 'Question 1', options: ['A', 'B', 'C', 'D'] }
      ]
    };
    const wrapper = mount(ActiveQuizMobile, {
      props: { uuid: 'test-uuid' }
    });
    await flushPromises();

    mockQuizAnswerResult.value = { correct: true, streak: 1, completed: false };
    await flushPromises();

    expect(wrapper.text()).toContain('¡Respuesta correcta!');
  });

  it('shows error feedback on incorrect answer', async () => {
    mockQuizSession.value = {
      streak: 0,
      questions: [
        { id: 'q1', question: 'Question 1', options: ['A', 'B', 'C', 'D'] }
      ]
    };
    const wrapper = mount(ActiveQuizMobile, {
      props: { uuid: 'test-uuid' }
    });
    await flushPromises();

    mockQuizAnswerResult.value = { correct: false, streak: 0, completed: false };
    await flushPromises();

    expect(wrapper.text()).toContain('Incorrecto. ¡Racha reiniciada!');
  });

  it('renders victory screen when streak reaches 4', async () => {
    mockQuizSession.value = {
      streak: 4,
      questions: [] // Questions might be empty or irrelevant now
    };
    const wrapper = mount(ActiveQuizMobile, {
      props: { uuid: 'test-uuid' }
    });
    await flushPromises();

    // Check if QuizVictory component is rendered (or its text)
    // Assuming QuizVictory says something about "Insignia" or "Victoria"
    expect(wrapper.findComponent({ name: 'QuizVictory' }).exists()).toBe(true);
  });
});
