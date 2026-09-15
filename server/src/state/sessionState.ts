interface PollResults {
  [option: string]: Set<string>; // Guardamos Set de UUIDs por cada opción para evitar duplicados
}

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
      this.polls.set(trigger, {});
    }
  }

  registerVote(triggerId: string, voterUUID: string, option: string) {
    // Solo permitimos votar en el poll si ya está registrado en memoria
    if (!this.polls.has(triggerId)) {
      this.polls.set(triggerId, {});
    }

    const poll = this.polls.get(triggerId)!;
    
    // Si el usuario cambia de voto, primero lo removemos de las otras opciones de este mismo poll
    Object.keys(poll).forEach(opt => {
      if (poll[opt].has(voterUUID)) {
        poll[opt].delete(voterUUID);
      }
    });

    // Añadimos el UUID a la nueva opción elegida
    if (!poll[option]) {
      poll[option] = new Set();
    }
    poll[option].add(voterUUID);
  }

  getPollResults(triggerId: string) {
    const poll = this.polls.get(triggerId);
    if (!poll) return {};

    const results: Record<string, number> = {};
    Object.keys(poll).forEach(option => {
      results[option] = poll[option].size; // Devolvemos solo el conteo, no los UUIDs
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