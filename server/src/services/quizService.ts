import { QUIZ_QUESTIONS, QuizQuestion, ClientQuestion } from '../data/quizQuestions';

interface AssignedQuestion {
  questionId: string;
  options: string[];
  correctOptionIndex: number;
}

interface UserQuizSession {
  streak: number; // 0 to 4
  assignedQuestions: AssignedQuestion[];
}

export interface QuizStats {
  0: number;
  1: number;
  2: number;
  3: number;
  4: number;
  totalParticipants: number;
}

class QuizService {
  private userSessions = new Map<string, UserQuizSession>();

  // Utility to shuffle an array (Fisher-Yates)
  private shuffle<T>(array: T[]): T[] {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }

  // Generate 4 random questions from the pool of 20 with shuffled options
  private generate4Questions(): { assigned: AssignedQuestion[]; client: ClientQuestion[] } {
    const picked = this.shuffle(QUIZ_QUESTIONS).slice(0, 4);
    const assigned: AssignedQuestion[] = [];
    const client: ClientQuestion[] = [];

    for (const q of picked) {
      // Map options with their original index
      const optionIndices = q.options.map((_, idx) => idx);
      const shuffledIndices = this.shuffle(optionIndices);

      const shuffledOptions = shuffledIndices.map(idx => q.options[idx]);
      const newCorrectIndex = shuffledIndices.indexOf(q.correctIndex);

      assigned.push({
        questionId: q.id,
        options: shuffledOptions,
        correctOptionIndex: newCorrectIndex
      });

      client.push({
        id: q.id,
        question: q.question,
        options: shuffledOptions
      });
    }

    return { assigned, client };
  }

  public startQuiz(uuid: string): { streak: number; questions: ClientQuestion[] } {
    // Security: Cap maximum active quiz sessions to prevent memory exhaustion
    if (this.userSessions.size > 2000 && !this.userSessions.has(uuid)) {
      // Evict oldest entry
      const firstKey = this.userSessions.keys().next().value;
      if (firstKey) {
        this.userSessions.delete(firstKey);
      }
    }

    const { assigned, client } = this.generate4Questions();
    
    // Existing session preserves streak if 4 (victory) or resets
    const existing = this.userSessions.get(uuid);
    const streak = existing && existing.streak === 4 ? 4 : 0;

    this.userSessions.set(uuid, {
      streak,
      assignedQuestions: assigned
    });

    return { streak, questions: client };
  }

  public getCurrentSession(uuid: string): { streak: number; questions: ClientQuestion[] } {
    let session = this.userSessions.get(uuid);
    if (!session) {
      return this.startQuiz(uuid);
    }

    const client: ClientQuestion[] = session.assignedQuestions.map(q => {
      const original = QUIZ_QUESTIONS.find(item => item.id === q.questionId);
      return {
        id: q.questionId,
        question: original ? original.question : '',
        options: q.options
      };
    });

    return { streak: session.streak, questions: client };
  }

  public submitAnswer(uuid: string, questionId: string, selectedOptionIndex: number): {
    correct: boolean;
    streak: number;
    completed: boolean;
    newQuestions?: ClientQuestion[];
  } {
    let session = this.userSessions.get(uuid);
    if (!session) {
      const started = this.startQuiz(uuid);
      session = this.userSessions.get(uuid)!;
    }

    const currentStreak = session.streak;
    if (currentStreak >= 4) {
      return { correct: true, streak: 4, completed: true };
    }

    const expectedQuestion = session.assignedQuestions[currentStreak];
    if (!expectedQuestion || expectedQuestion.questionId !== questionId) {
      // Invalid question order or stale question -> Reset quiz
      const { assigned, client } = this.generate4Questions();
      session.streak = 0;
      session.assignedQuestions = assigned;
      return { correct: false, streak: 0, completed: false, newQuestions: client };
    }

    const isCorrect = selectedOptionIndex === expectedQuestion.correctOptionIndex;

    if (isCorrect) {
      session.streak += 1;
      const completed = session.streak === 4;
      return {
        correct: true,
        streak: session.streak,
        completed
      };
    } else {
      // Incorrect answer: reset streak to 0 and assign 4 new random questions
      const { assigned, client } = this.generate4Questions();
      session.streak = 0;
      session.assignedQuestions = assigned;

      return {
        correct: false,
        streak: 0,
        completed: false,
        newQuestions: client
      };
    }
  }

  public getStats(): QuizStats {
    const stats: QuizStats = {
      0: 0,
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      totalParticipants: this.userSessions.size
    };

    this.userSessions.forEach(session => {
      const s = Math.min(4, Math.max(0, session.streak)) as 0 | 1 | 2 | 3 | 4;
      stats[s] += 1;
    });

    return stats;
  }

  public resetAll() {
    this.userSessions.clear();
  }
}

export const quizService = new QuizService();
