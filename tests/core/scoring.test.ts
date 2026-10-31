import { describe, expect, it } from "vitest";
import { applyPolarity, computeUserProfile, EngineError, normalizeAnswer } from "@/core";
import type { QuestionDefinition } from "@/core/types";
import { answerAll, makeAxes, makeQuestions, scale } from "../fixtures";

describe("normalizeAnswer", () => {
  it.each([
    ["sd", 0],
    ["d", 0.25],
    ["n", 0.5],
    ["a", 0.75],
    ["sa", 1],
  ])("converte %s em %d", (id, expected) => {
    expect(normalizeAnswer(id, scale)).toBe(expected);
  });

  it("rejeita opção desconhecida", () => {
    expect(() => normalizeAnswer("talvez", scale)).toThrow(EngineError);
  });
});

describe("applyPolarity", () => {
  it("mantém valor em perguntas diretas", () => {
    expect(applyPolarity(0.75, "direct")).toBe(0.75);
  });
  it("inverte em perguntas invertidas", () => {
    expect(applyPolarity(0.75, "reverse")).toBe(0.25);
    expect(applyPolarity(0, "reverse")).toBe(1);
  });
});

describe("computeUserProfile", () => {
  const axes = makeAxes(2);
  const questions = makeQuestions(axes, 4); // 2 diretas + 2 invertidas por eixo

  it("respostas neutras dão 50 em todos os eixos", () => {
    const profile = computeUserProfile(answerAll(questions, "n"), questions, axes, scale);
    expect(profile.scores).toEqual({ axis0: 50, axis1: 50 });
  });

  it("concordar com tudo se anula quando há equilíbrio de polaridades", () => {
    const profile = computeUserProfile(answerAll(questions, "sa"), questions, axes, scale);
    expect(profile.scores.axis0).toBe(50);
  });

  it("respostas coerentes levam ao extremo do eixo", () => {
    const answers = Object.fromEntries(
      questions.map((q) => [q.id, q.polarity === "direct" ? "sa" : "sd"]),
    );
    const profile = computeUserProfile(answers, questions, axes, scale);
    expect(profile.scores).toEqual({ axis0: 100, axis1: 100 });
  });

  it("aplica pesos na média ponderada", () => {
    const qs: QuestionDefinition[] = [
      { id: "p1", text: "a", axisId: "axis0", polarity: "direct", weight: 3, group: "g" },
      { id: "p2", text: "b", axisId: "axis0", polarity: "direct", weight: 1, group: "g" },
    ];
    const [axis] = makeAxes(1);
    const profile = computeUserProfile({ p1: "sa", p2: "sd" }, qs, [axis!], scale);
    // 100 × (1×3 + 0×1) / 4 = 75
    expect(profile.scores.axis0).toBe(75);
  });

  it("calcula exemplo manual com polaridade mista", () => {
    const qs: QuestionDefinition[] = [
      { id: "p1", text: "a", axisId: "axis0", polarity: "direct", weight: 1, group: "g" },
      { id: "p2", text: "b", axisId: "axis0", polarity: "reverse", weight: 1, group: "g" },
    ];
    const [axis] = makeAxes(1);
    // p1 concordo (0,75), p2 discordo (0,25 → 0,75) ⇒ 75
    expect(computeUserProfile({ p1: "a", p2: "d" }, qs, [axis!], scale).scores.axis0).toBe(75);
  });

  it("exige respostas completas por padrão", () => {
    const partial = answerAll(questions.slice(1), "a");
    expect(() => computeUserProfile(partial, questions, axes, scale)).toThrow(/Faltam 1/);
  });

  it("aceita parcial quando permitido e informa cobertura", () => {
    const partial = answerAll(questions.slice(1), "n");
    const profile = computeUserProfile(partial, questions, axes, scale, { requireComplete: false });
    expect(profile.missingQuestionIds).toEqual([questions[0]!.id]);
    expect(profile.coverage.axis0).toEqual({ answered: 3, total: 4 });
  });

  it("falha se um eixo ficar sem respostas", () => {
    const onlyAxis1 = answerAll(questions.filter((q) => q.axisId === "axis1"), "n");
    expect(() =>
      computeUserProfile(onlyAxis1, questions, axes, scale, { requireComplete: false }),
    ).toThrow(/axis0/);
  });

  it("rejeita pesos inválidos e eixos inexistentes", () => {
    const [axis] = makeAxes(1);
    const bad = (q: Partial<QuestionDefinition>) =>
      computeUserProfile({ x: "n" }, [{ id: "x", text: "t", axisId: "axis0", polarity: "direct", weight: 1, group: "g", ...q }], [axis!], scale);
    expect(() => bad({ weight: 0 })).toThrow(EngineError);
    expect(() => bad({ weight: Number.NaN })).toThrow(EngineError);
    expect(() => bad({ axisId: "nope" })).toThrow(EngineError);
  });

  it("ignora chaves de protótipo nas respostas", () => {
    const [axis] = makeAxes(1);
    const qs: QuestionDefinition[] = [
      { id: "toString", text: "t", axisId: "axis0", polarity: "direct", weight: 1, group: "g" },
    ];
    expect(() => computeUserProfile({}, qs, [axis!], scale)).toThrow(/Faltam/);
  });

  it("mantém todos os eixos entre 0 e 100", () => {
    for (const id of ["sd", "d", "n", "a", "sa"]) {
      const { scores } = computeUserProfile(answerAll(questions, id), questions, axes, scale);
      for (const v of Object.values(scores)) {
        expect(v).toBeGreaterThanOrEqual(0);
        expect(v).toBeLessThanOrEqual(100);
      }
    }
  });
});
