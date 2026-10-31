import { describe, expect, it } from "vitest";
import {
  answeredCount,
  createQuizReducer,
  EMPTY_QUIZ_STATE,
  estimatedMinutes,
  firstUnansweredIndex,
  getActiveTheme,
  isComplete,
  type QuizState,
} from "@/services/quiz";

const theme = getActiveTheme();
const qs = theme.questions;
const reduce = createQuizReducer(qs);

function answerAll(state: QuizState = EMPTY_QUIZ_STATE): QuizState {
  return qs.reduce((s, q) => reduce(s, { type: "answer", questionId: q.id, optionId: "agree", advance: true }), state);
}

describe("quiz reducer", () => {
  it("registra resposta sem avançar quando advance=false", () => {
    const s = reduce(EMPTY_QUIZ_STATE, { type: "answer", questionId: qs[0]!.id, optionId: "agree", advance: false });
    expect(s.answers[qs[0]!.id]).toBe("agree");
    expect(s.index).toBe(0);
  });

  it("avança automaticamente quando advance=true", () => {
    const s = reduce(EMPTY_QUIZ_STATE, { type: "answer", questionId: qs[0]!.id, optionId: "agree", advance: true });
    expect(s.index).toBe(1);
  });

  it("não avança com 'next' sem resposta", () => {
    expect(reduce(EMPTY_QUIZ_STATE, { type: "next" })).toBe(EMPTY_QUIZ_STATE);
  });

  it("volta e altera uma resposta sem perder as outras", () => {
    let s = answerAll();
    s = reduce(s, { type: "goto", index: 3 });
    s = reduce(s, { type: "answer", questionId: qs[3]!.id, optionId: "disagree", advance: false });
    expect(s.answers[qs[3]!.id]).toBe("disagree");
    expect(answeredCount(s, qs)).toBe(45);
    s = reduce(s, { type: "prev" });
    expect(s.index).toBe(2);
  });

  it("não deixa pular para além da primeira pergunta em aberto", () => {
    const s = reduce(EMPTY_QUIZ_STATE, { type: "goto", index: 10 });
    expect(s.index).toBe(0);
  });

  it("limita índices aos extremos", () => {
    expect(reduce(EMPTY_QUIZ_STATE, { type: "prev" }).index).toBe(0);
    const done = answerAll();
    expect(done.index).toBe(44);
    expect(reduce(done, { type: "next" }).index).toBe(44);
  });

  it("ignora perguntas desconhecidas", () => {
    const s = reduce(EMPTY_QUIZ_STATE, { type: "answer", questionId: "nope", optionId: "agree", advance: true });
    expect(s).toBe(EMPTY_QUIZ_STATE);
  });

  it("reinicia", () => {
    expect(reduce(answerAll(), { type: "reset" })).toEqual(EMPTY_QUIZ_STATE);
  });

  it("detecta conclusão e primeira pergunta em aberto", () => {
    expect(isComplete(EMPTY_QUIZ_STATE, qs)).toBe(false);
    expect(isComplete(answerAll(), qs)).toBe(true);
    expect(firstUnansweredIndex({ [qs[0]!.id]: "agree" }, qs)).toBe(1);
  });
});

describe("estimatedMinutes", () => {
  it("estima 7 a 10 minutos para 45 afirmações", () => {
    expect(estimatedMinutes(theme)).toEqual({ min: 7, max: 10 });
  });
});
