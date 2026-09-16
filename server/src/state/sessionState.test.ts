import { describe, it, expect, beforeEach } from 'vitest';
import { globalState } from './sessionState';

describe('SessionState', () => {
  beforeEach(() => {
    // Reset state before each test
    globalState.currentSlideIndex = 0;
    globalState.currentStepIndex = -1;
    globalState.activeTrigger = null;
    globalState.polls.clear();
  });

  it('should sync presenter state correctly', () => {
    globalState.syncPresenter(1, 2, 'test-trigger');
    
    expect(globalState.currentSlideIndex).toBe(1);
    expect(globalState.currentStepIndex).toBe(2);
    expect(globalState.activeTrigger).toBe('test-trigger');
    expect(globalState.polls.has('test-trigger')).toBe(true);
  });

  it('should register votes correctly', () => {
    globalState.syncPresenter(0, 0, 'poll1');
    globalState.registerVote('poll1', 'user1', 'A');
    globalState.registerVote('poll1', 'user2', 'B');
    globalState.registerVote('poll1', 'user3', 'A');

    const results = globalState.getPollResults('poll1');
    expect(results).toEqual({ 'A': 2, 'B': 1 });
  });

  it('should change user vote if they vote again in the same poll', () => {
    globalState.syncPresenter(0, 0, 'poll1');
    globalState.registerVote('poll1', 'user1', 'A');
    globalState.registerVote('poll1', 'user1', 'B');

    const results = globalState.getPollResults('poll1');
    expect(results).toEqual({ 'A': 0, 'B': 1 });
  });

  it('should return empty object for non-existent poll', () => {
    const results = globalState.getPollResults('non-existent');
    expect(results).toEqual({});
  });

  it('should get snapshot of current state', () => {
    globalState.syncPresenter(5, 0, 'closing-poll');
    const snapshot = globalState.getSnapshot();
    
    expect(snapshot).toEqual({
      currentSlideIndex: 5,
      currentStepIndex: 0,
      activeTrigger: 'closing-poll'
    });
  });
});
