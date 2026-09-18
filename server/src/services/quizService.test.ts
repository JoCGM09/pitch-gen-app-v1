import { describe, it, expect, beforeEach } from 'vitest';
import { quizService } from './quizService';

describe('QuizService', () => {
  const testUuid = 'test-user-123';

  beforeEach(() => {
    quizService.resetAll();
  });

  it('should start a new quiz session with 4 questions and 0 streak', () => {
    const session = quizService.startQuiz(testUuid);
    expect(session.streak).toBe(0);
    expect(session.questions).toHaveLength(4);
    expect(session.questions[0]).toHaveProperty('id');
    expect(session.questions[0]).toHaveProperty('question');
    expect(session.questions[0]).toHaveProperty('options');
    // Ensure correct answer index is NOT sent to client
    expect(session.questions[0]).not.toHaveProperty('correctIndex');
  });

  it('should reset streak to 0 and assign 4 new questions on wrong answer', () => {
    const session = quizService.startQuiz(testUuid);
    const firstQ = session.questions[0];

    // Intentionally pass an invalid option index like 99
    const result = quizService.submitAnswer(testUuid, firstQ.id, 99);
    expect(result.correct).toBe(false);
    expect(result.streak).toBe(0);
    expect(result.completed).toBe(false);
    expect(result.newQuestions).toBeDefined();
    expect(result.newQuestions).toHaveLength(4);
  });

  it('should report correct stats for global participants', () => {
    quizService.startQuiz('user-1');
    quizService.startQuiz('user-2');

    const stats = quizService.getStats();
    expect(stats.totalParticipants).toBe(2);
    expect(stats[0]).toBe(2);
  });

  it('should complete the quiz successfully with 4 correct answers', () => {
    const session = quizService.startQuiz(testUuid);
    let currentStreak = 0;

    for (let i = 0; i < 4; i++) {
      const currentQuestion = session.questions[i];
      // We need to find the correct index in the internal assigned questions
      const internalSession = (quizService as any).userSessions.get(testUuid);
      const correctIndex = internalSession.assignedQuestions[i].correctOptionIndex;

      const result = quizService.submitAnswer(testUuid, currentQuestion.id, correctIndex);
      currentStreak++;
      expect(result.correct).toBe(true);
      expect(result.streak).toBe(currentStreak);
      
      if (i === 3) {
        expect(result.completed).toBe(true);
      } else {
        expect(result.completed).toBe(false);
      }
    }
  });

  it('should return the same questions upon reconnection (getCurrentSession)', () => {
    const originalSession = quizService.startQuiz(testUuid);
    const reconnectedSession = quizService.getCurrentSession(testUuid);

    expect(reconnectedSession.streak).toBe(originalSession.streak);
    expect(reconnectedSession.questions).toEqual(originalSession.questions);
  });

  it('should reset everything on resetAll', () => {
    quizService.startQuiz(testUuid);
    quizService.resetAll();
    const stats = quizService.getStats();
    expect(stats.totalParticipants).toBe(0);
    expect(stats[0]).toBe(0);
  });
});
