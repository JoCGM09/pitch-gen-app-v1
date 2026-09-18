import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import { ref } from 'vue';
import AudienceView from './AudienceView.vue';

const mockSnapshot = ref<{ activeTrigger: string | null }>({ activeTrigger: null });

vi.mock('../composables/useSocket', () => ({
  useSocket: () => ({
    socket: ref({ id: 'test-socket' }),
    isConnected: ref(true),
    audienceSnapshot: mockSnapshot,
    accumulatedNotes: ref([]),
    connect: vi.fn(),
    submitAudienceVote: vi.fn(),
    submitAudienceQA: vi.fn()
  })
}));

vi.mock('vue-router', () => ({
  useRoute: () => ({
    params: { sessionId: 'test-session' }
  })
}));

describe('AudienceView.vue', () => {
  beforeEach(() => {
    localStorage.clear();
    mockSnapshot.value = { activeTrigger: null };
  });

  it('generates and persists UUID in localStorage', async () => {
    mount(AudienceView);
    await flushPromises();

    const storedUuid = localStorage.getItem('pitchgen_audience_uuid');
    expect(storedUuid).toBeTruthy();
    expect(storedUuid).toContain('aud-');
  });

  it('renders idle screen when no active poll', async () => {
    const wrapper = mount(AudienceView);
    await flushPromises();

    expect(wrapper.text()).toContain('Escuchando atentamente...');
    expect(wrapper.text()).toContain('Pregunta al Presentador');
  });

  it('renders active poll when trigger is received', async () => {
    mockSnapshot.value = { activeTrigger: 'poll-apertura' };
    const wrapper = mount(AudienceView);
    await flushPromises();

    expect(wrapper.text()).toContain('Encuesta en Vivo');
    expect(wrapper.text()).toContain('¿Tienes hoy un Agente de IA');
  });
});
