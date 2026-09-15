type PollResults = Map<string, Set<string>>; // Opción -> UUIDs

class SessionState {
  currentSlideIndex: number = 0;
  currentStepIndex: number = -1;
  activeTrigger: string | null = null;
  
  // Guardamos resultados agregados para cada poll (TriggerID -> Opcion -> UUIDs)
  polls: Map<string, PollResults> = new Map();

  syncPresenter(slideIndex: number, stepIndex: number, trigger: string | null) {
    this.currentSlideIndex = slideIndex;
    this.currentStepIndex = stepIndex;
    this.activeTrigger = trigger;
    
    // Si hay un nuevo trigger y no lo teníamos trackeado, inicializamos sus contadores
    if (trigger && !this.polls.has(trigger)) {
      this.polls.set(trigger, new Map());
    }
  }

  registerVote(triggerId: string, voterUUID: string, option: string) {
    // Solo permitimos votar en el poll si ya está registrado en memoria
    if (!this.polls.has(triggerId)) {
      this.polls.set(triggerId, new Map());
    }

    const poll = this.polls.get(triggerId)!;
    
    // Si el usuario cambia de voto, primero lo removemos de las otras opciones de este mismo poll
    poll.forEach((voters, _opt) => {
      if (voters.has(voterUUID)) {
        voters.delete(voterUUID);
      }
    });

    // Añadimos el UUID a la nueva opción elegida
    if (!poll.has(option)) {
      poll.set(option, new Set());
    }
    poll.get(option)!.add(voterUUID);
  }

  getPollResults(triggerId: string) {
    const poll = this.polls.get(triggerId);
    if (!poll) return {};

    const results: Record<string, number> = {};
    poll.forEach((voters, option) => {
      results[option] = voters.size; // Devolvemos solo el conteo, no los UUIDs
    });
    return results;
  }

  getSnapshot() {
    return {
      currentSlideIndex: this.currentSlideIndex,
      currentStepIndex: this.currentStepIndex,
      activeTrigger: this.activeTrigger
    };
  }
}

// Instancia global en memoria
export const globalState = new SessionState();