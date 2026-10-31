import { describe, expect, it } from "vitest";
import { isValidAnswers, validateAnswers, validateAxes, validateTheme } from "@/core";
import type { ThemeDefinition } from "@/core/types";
import { exampleTheme } from "@/themes/example-theme";

function withChanges(change: (t: ThemeDefinition) => ThemeDefinition): ThemeDefinition {
  return change(structuredClone(exampleTheme));
}

describe("validateTheme", () => {
  it("aceita o tema de exemplo", () => {
    expect(validateTheme(exampleTheme)).toEqual({ valid: true, issues: [] });
  });

  it.each<[string, (t: ThemeDefinition) => ThemeDefinition]>([
    ["ID de pergunta duplicado", (t) => ({ ...t, questions: [...t.questions, { ...t.questions[0]!, text: "outra" }] })],
    ["pergunta apontando para eixo inexistente", (t) => ({ ...t, questions: t.questions.map((q, i) => (i === 0 ? { ...q, axisId: "x" } : q)) })],
    ["texto de pergunta repetido", (t) => ({ ...t, questions: t.questions.map((q, i) => (i === 1 ? { ...q, text: t.questions[0]!.text } : q)) })],
    ["perfil sem um eixo", (t) => ({ ...t, characters: t.characters.map((c, i) => (i === 0 ? { ...c, scores: { energy: 1, order: 1 } } : c)) })],
    ["perfil com valor fora de 0–100", (t) => ({ ...t, characters: t.characters.map((c, i) => (i === 0 ? { ...c, scores: { ...c.scores, energy: 120 } } : c)) })],
    ["perfil com eixo extra", (t) => ({ ...t, characters: t.characters.map((c, i) => (i === 0 ? { ...c, scores: { ...c.scores, extra: 1 } } : c)) })],
    ["slug duplicado", (t) => ({ ...t, characters: t.characters.map((c) => ({ ...c, slug: "mesmo" })) })],
    ["cor inválida", (t) => ({ ...t, characters: t.characters.map((c, i) => (i === 0 ? { ...c, color: "red" } : c)) })],
    ["imagem sem licença", (t) => ({ ...t, characters: t.characters.map((c, i) => (i === 0 ? { ...c, image: { src: "/x.png", alt: "x", license: null } } : c)) })],
    ["lista de pontos fortes vazia", (t) => ({ ...t, characters: t.characters.map((c, i) => (i === 0 ? { ...c, strengths: [] } : c)) })],
    ["versão de formato incompatível", (t) => ({ ...t, versions: { ...t.versions, dataFormat: 99 } })],
    ["eixo sem perguntas", (t) => ({ ...t, questions: t.questions.filter((q) => q.axisId !== "energy") })],
    ["peso zero", (t) => ({ ...t, questions: t.questions.map((q, i) => (i === 0 ? { ...q, weight: 0 } : q)) })],
    ["opção da escala fora de 0–1", (t) => ({ ...t, scale: { ...t.scale, options: t.scale.options.map((o, i) => (i === 0 ? { ...o, value: 2 } : o)) } })],
  ])("rejeita %s", (_, change) => {
    const report = validateTheme(withChanges(change));
    expect(report.valid).toBe(false);
    expect(report.issues.length).toBeGreaterThan(0);
  });
});

describe("validateAxes — faixas", () => {
  const base = exampleTheme.axes[0]!;
  it("rejeita lacuna entre faixas", () => {
    const bands = [{ ...base.bands[0]!, max: 30 }, ...base.bands.slice(1)];
    expect(validateAxes([{ ...base, bands }]).valid).toBe(false);
  });
  it("rejeita faixa que não chega a 100", () => {
    const bands = [...base.bands.slice(0, -1), { ...base.bands.at(-1)!, max: 99 }];
    expect(validateAxes([{ ...base, bands }]).valid).toBe(false);
  });
});

describe("validateAnswers", () => {
  const { questions, scale } = exampleTheme;
  it("aceita respostas parciais válidas", () => {
    expect(isValidAnswers({ "ex-energy-1": "agree" }, questions, scale)).toBe(true);
  });
  it.each([
    ["não-objeto", "texto"],
    ["array", ["agree"]],
    ["null", null],
    ["pergunta desconhecida", { nope: "agree" }],
    ["opção desconhecida", { "ex-energy-1": "talvez" }],
    ["valor não-string", { "ex-energy-1": 3 }],
  ])("rejeita %s", (_, value) => {
    expect(validateAnswers(value, questions, scale).valid).toBe(false);
  });
});
