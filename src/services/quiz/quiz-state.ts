/**
 * Estado de navegação do questionário (funções puras, sem React).
 * O componente usa este reducer via useReducer.
 */
import type { QuestionDefinition, UserAnswers } from "@/core/types";

export interface QuizState {
  readonly answers: UserAnswers;
  /** Índice da pergunta exibida (0 a total − 1). */
  readonly index: number;
}

export type QuizAction =
  | { readonly type: "answer"; readonly questionId: string; readonly optionId: string; readonly advance: boolean }
  | { readonly type: "next" }
  | { readonly type: "prev" }
  | { readonly type: "goto"; readonly index: number }
  | { readonly type: "reset" };

export const EMPTY_QUIZ_STATE: QuizState = { answers: {}, index: 0 };

export function answeredCount(state: QuizState, questions: readonly QuestionDefinition[]): number {
  return questions.filter((q) => Object.hasOwn(state.answers, q.id)).length;
}

export function isComplete(state: QuizState, questions: readonly QuestionDefinition[]): boolean {
  return questions.length > 0 && answeredCount(state, questions) === questions.length;
}

/** Primeira pergunta sem resposta, ou a última se todas estiverem respondidas. */
export function firstUnansweredIndex(answers: UserAnswers, questions: readonly QuestionDefinition[]): number {
  const i = questions.findIndex((q) => !Object.hasOwn(answers, q.id));
  return i === -1 ? Math.max(0, questions.length - 1) : i;
}

function clampIndex(index: number, total: number): number {
  return Math.min(Math.max(0, Math.trunc(index)), Math.max(0, total - 1));
}

export function createQuizReducer(questions: readonly QuestionDefinition[]) {
  const total = questions.length;
  const ids = new Set(questions.map((q) => q.id));

  return function quizReducer(state: QuizState, action: QuizAction): QuizState {
    switch (action.type) {
      case "answer": {
        if (!ids.has(action.questionId)) return state;
        const answers = { ...state.answers, [action.questionId]: action.optionId };
        const index = action.advance ? clampIndex(state.index + 1, total) : state.index;
        return { answers, index };
      }
      case "next": {
        // Só avança se a pergunta atual já tiver resposta.
        const current = questions[state.index];
        if (!current || !Object.hasOwn(state.answers, current.id)) return state;
        return { ...state, index: clampIndex(state.index + 1, total) };
      }
      case "prev":
        return { ...state, index: clampIndex(state.index - 1, total) };
      case "goto": {
        // Permite ir a qualquer pergunta já respondida ou à primeira em aberto.
        const target = clampIndex(action.index, total);
        const limit = firstUnansweredIndex(state.answers, questions);
        return target <= limit ? { ...state, index: target } : state;
      }
      case "reset":
        return EMPTY_QUIZ_STATE;
    }
  };
}
