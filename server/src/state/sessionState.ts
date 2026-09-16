type PollResults = Map<string, Set<string>>; // Opción -> UUIDs

export interface QAQuestion {
  id: string;
  uuid: string;
  question: string;
  timestamp: number;
}

class SessionState {
  currentSlideIndex: number = 0;
  currentStepIndex: number = -1;
  activeTrigger: string | null = null;
  
  polls: Map<string, PollResults> = new Map();
  qaQuestions: QAQuestion[] = [];

  syncPresenter(slideIndex: number, stepIndex: number, trigger: string | null) {
    this.currentSlideIndex = slideIndex;
    this.currentStepIndex = stepIndex;
    this.activeTrigger = trigger;
    
    if (trigger && !this.polls.has(trigger)) {
      this.polls.set(trigger, new Map());
    }
  }

  registerVote(triggerId: string, voterUUID: string, option: string) {
    if (!this.polls.has(triggerId)) {
      this.polls.set(triggerId, new Map());
    }

    const poll = this.polls.get(triggerId)!;
    
    poll.forEach((voters, _opt) => {
      if (voters.has(voterUUID)) {
        voters.delete(voterUUID);
      }
    });

    if (!poll.has(option)) {
      // Limit number of options per poll to prevent memory exhaustion by attackers
      if (poll.size >= 10) {
        return;
      }
      poll.set(option, new Set());
    }
    poll.get(option)!.add(voterUUID);
  }

  getPollResults(triggerId: string) {
    const poll = this.polls.get(triggerId);
    if (!poll) return {};

    const results: Record<string, number> = {};
    poll.forEach((voters, option) => {
      results[option] = voters.size;
    });
    return results;
  }

  addQAQuestion(question: QAQuestion) {
    this.qaQuestions.unshift(question);
    if (this.qaQuestions.length > 50) {
      this.qaQuestions.pop();
    }
  }
  
  getQAQuestions() {
    return this.qaQuestions;
  }

  removeQAQuestion(id: string) {
    this.qaQuestions = this.qaQuestions.filter(q => q.id !== id);
  }

  resetSession() {
    this.polls.clear();
    this.qaQuestions = [];
    this.activeTrigger = null;
  }

  getSnapshot() {
    return {
      currentSlideIndex: this.currentSlideIndex,
      currentStepIndex: this.currentStepIndex,
      activeTrigger: this.activeTrigger
    };
  }
}

export const globalState = new SessionState();