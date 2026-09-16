import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import DeckView from './DeckView.vue';
import { createRouter, createWebHistory } from 'vue-router';
import { nextTick } from 'vue';
import { useDeck } from '../composables/useDeck';
import slidesData from '../data/slides.json';

import { ref } from 'vue';

// Mock useSocket
vi.mock('../composables/useSocket', () => ({
  useSocket: () => ({
    connect: vi.fn(),
    emitPresenterSync: vi.fn(),
    emitPresenterReset: vi.fn(),
    requestQAList: vi.fn(),
    qaQuestionsList: ref([]),
    activePollResults: ref({}),
    simulateVote: vi.fn()
  })
}));

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

describe('DeckView.vue', () => {
  let router: any;
  let wrapper: any;

  beforeEach(async () => {
    // Reset global state
    const { currentSlideIndex, currentStepIndex, slides } = useDeck();
    currentSlideIndex.value = 0;
    currentStepIndex.value = -1;
    slides.value = slidesData as any;

    router = createRouter({
      history: createWebHistory(),
      routes: [
        {
          path: '/deck/:slide/:step',
          name: 'deck',
          component: DeckView
        }
      ]
    });
    
    // Mock fullscreen API
    document.documentElement.requestFullscreen = vi.fn().mockResolvedValue(undefined);
    document.exitFullscreen = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(document, 'fullscreenElement', {
      configurable: true,
      get: vi.fn().mockReturnValue(null),
    });
  });

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount();
    }
  });

  async function wait() {
    await flushPromises();
    await nextTick();
    await flushPromises();
    await nextTick();
  }

  async function createWrapper(path = '/deck/0/-1') {
    router.push(path);
    await router.isReady();
    wrapper = mount(DeckView, {
      global: {
        plugins: [router],
        stubs: {
          Transition: true,
          TransitionGroup: true
        }
      }
    });
    await wait();
    return wrapper;
  }

  it('renders the first slide with correct 16:9 classes', async () => {
    wrapper = await createWrapper();
    expect(wrapper.text()).toContain('Cuando la IA no sabe');
    
    const container = wrapper.find('.deck-container');
    expect(container.exists()).toBe(true);
    expect(container.classes()).toContain('h-screen');
    expect(container.classes()).toContain('w-screen');

    const aspectBox = wrapper.find('.aspect-video');
    expect(aspectBox.exists()).toBe(true);
  });

  it('fires interaction trigger on slide change', async () => {
    const consoleSpy = vi.spyOn(console, 'log');
    
    // We create the wrapper which triggers onMounted on Slide 0
    wrapper = await createWrapper();
    
    // Slide 0 has no trigger
    const initialLogs = consoleSpy.mock.calls.filter(call => call[0].includes('[Interaction Trigger Fired]'));
    expect(initialLogs.length).toBe(0);

    consoleSpy.mockClear();
    
    // Go to Slide 1 (has trigger 'poll-apertura')
    await wrapper.trigger('click');
    await wait();
    
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('[Interaction Trigger Fired]: poll-apertura'));
    
    consoleSpy.mockRestore();
  });

  it('advances on click and updates URL', async () => {
    wrapper = await createWrapper();
    
    await wrapper.trigger('click');
    await wait();
    
    expect(router.currentRoute.value.path).toBe('/deck/1/-1');
    expect(wrapper.text()).toContain('Pregunta de Apertura');

    await wrapper.trigger('click');
    await wait();

    expect(router.currentRoute.value.path).toBe('/deck/2/-1');
    expect(wrapper.text()).toContain('¿Por qué conectar un agente');
  });

  it('shows steps sequentially on click', async () => {
    wrapper = await createWrapper('/deck/2/-1');

    await wrapper.trigger('click');
    await wait();
    
    expect(router.currentRoute.value.path).toBe('/deck/2/0');
    const { currentStepIndex } = useDeck();
    expect(currentStepIndex.value).toBe(0);
  });

  it('loads correct slide and step from URL', async () => {
    wrapper = await createWrapper('/deck/2/1');

    expect(wrapper.text()).toContain('¿Por qué conectar un agente');
    
    const { currentStepIndex } = useDeck();
    expect(currentStepIndex.value).toBe(1);
  });

  it('handles keyboard navigation', async () => {
    wrapper = await createWrapper();

    // Initially Slide 0
    expect(wrapper.text()).toContain('Cuando la IA no sabe');

    // Press ArrowRight -> Slide 1, Step -1
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
    await wait();
    expect(router.currentRoute.value.path).toBe('/deck/1/-1');
    expect(wrapper.text()).toContain('Pregunta de Apertura');

    // Press ArrowRight -> Slide 2, Step -1
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
    await wait();
    expect(router.currentRoute.value.path).toBe('/deck/2/-1');
    expect(wrapper.text()).toContain('¿Por qué conectar un agente');

    // Press ArrowRight -> Slide 2, Step 0
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
    await wait();
    expect(router.currentRoute.value.path).toBe('/deck/2/0');
    expect(useDeck().currentStepIndex.value).toBe(0);

    // Press ArrowLeft -> Slide 2, Step -1
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
    await wait();
    expect(router.currentRoute.value.path).toBe('/deck/2/-1');
    expect(useDeck().currentStepIndex.value).toBe(-1);
  });

  it('toggles fullscreen on "f" key', async () => {
    wrapper = await createWrapper();

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'f' }));
    expect(document.documentElement.requestFullscreen).toHaveBeenCalled();

    // Simulate fullscreen
    Object.defineProperty(document, 'fullscreenElement', {
      configurable: true,
      get: vi.fn().mockReturnValue(document.documentElement),
    });

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'f' }));
    expect(document.exitFullscreen).toHaveBeenCalled();
  });

  it('respects navigation bounds', async () => {
    wrapper = await createWrapper();

    // At start, prev should do nothing
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
    await wait();
    expect(router.currentRoute.value.path).toBe('/deck/0/-1');

    // Go to end (slide 15)
    router.push('/deck/15/-1');
    await wait();

    // At end, next should do nothing
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
    await wait();
    expect(router.currentRoute.value.path).toBe('/deck/15/-1');
  });
});
