import { describe, expect, it } from "vitest";
import { computeUserProfile, runQuiz, validateTheme } from "@/core";
import { southParkTheme as theme } from "@/themes/south-park";

const AXIS_IDS = [
  "sociability",
  "empathy",
  "authority",
  "decision",
  "conflict",
  "ambition",
  "humor",
  "loyalty",
  "worldview",
];

describe("tema South Park — integridade dos dados", () => {
  it("passa na validação completa do motor", () => {
    expect(validateTheme(theme).issues).toEqual([]);
  });

  it("tem os nove eixos esperados, na ordem, com peso 1", () => {
    expect(theme.axes.map((a) => a.id)).toEqual(AXIS_IDS);
    expect(theme.axes.every((a) => a.defaultWeight === 1)).toBe(true);
  });

  it("cada eixo tem 5 faixas cobrindo 0–100", () => {
    for (const axis of theme.axes) {
      expect(axis.bands).toHaveLength(5);
      expect(axis.bands[0]!.min).toBe(0);
      expect(axis.bands[4]!.max).toBe(100);
    }
  });

  it("tem exatamente 45 perguntas, 5 por eixo", () => {
    expect(theme.questions).toHaveLength(45);
    for (const id of AXIS_IDS) {
      expect(theme.questions.filter((q) => q.axisId === id)).toHaveLength(5);
    }
  });

  it("IDs de pergunta são únicos e estáveis (prefixo do eixo)", () => {
    const ids = theme.questions.map((q) => q.id);
    expect(new Set(ids).size).toBe(45);
    for (const q of theme.questions) expect(q.id).toMatch(/^[a-z]{3}-[1-5]$/);
  });

  it("equilibra polaridades: 2 ou 3 de cada tipo por eixo, 23/22 no total", () => {
    for (const id of AXIS_IDS) {
      const direct = theme.questions.filter((q) => q.axisId === id && q.polarity === "direct").length;
      expect([2, 3]).toContain(direct);
    }
    const totalDirect = theme.questions.filter((q) => q.polarity === "direct").length;
    expect(totalDirect).toBe(23);
  });

  it("todas as perguntas têm peso 1 (pesos diferentes exigiriam justificativa)", () => {
    expect(theme.questions.every((q) => q.weight === 1)).toBe(true);
  });

  it("perguntas consecutivas nunca são do mesmo eixo", () => {
    for (let i = 1; i < theme.questions.length; i++) {
      expect(theme.questions[i]!.axisId).not.toBe(theme.questions[i - 1]!.axisId);
    }
  });

  it("nenhuma pergunta menciona personagens ou a série", () => {
    const names = theme.characters.flatMap((c) => c.name.split(/\s+/)).filter((w) => w.length > 3);
    for (const q of theme.questions) {
      expect(q.text).not.toMatch(/south park/i);
      for (const n of names) expect(q.text).not.toContain(n);
    }
  });

  it("perguntas são frases curtas terminadas em ponto", () => {
    for (const q of theme.questions) {
      expect(q.text.length).toBeLessThanOrEqual(100);
      expect(q.text).toMatch(/\.$/);
    }
  });

  it("tem exatamente 20 personagens com IDs e slugs únicos", () => {
    expect(theme.characters).toHaveLength(20);
    expect(new Set(theme.characters.map((c) => c.id)).size).toBe(20);
    expect(new Set(theme.characters.map((c) => c.slug)).size).toBe(20);
  });

  it("todos os perfis têm os 9 eixos com múltiplos de 5 entre 0 e 100", () => {
    for (const c of theme.characters) {
      expect(Object.keys(c.scores).sort()).toEqual([...AXIS_IDS].sort());
      for (const v of Object.values(c.scores)) {
        expect(v % 5).toBe(0);
        expect(v).toBeGreaterThanOrEqual(0);
        expect(v).toBeLessThanOrEqual(100);
      }
    }
  });

  it("nenhum personagem usa imagem sem licença (só placeholders por enquanto)", () => {
    for (const c of theme.characters) {
      expect(c.image.src === null || c.image.license !== null).toBe(true);
    }
  });

  it("descrições e conteúdos de resultado estão preenchidos", () => {
    for (const c of theme.characters) {
      expect(c.shortDescription.length).toBeGreaterThan(20);
      expect(c.longDescription.length).toBeGreaterThan(100);
      expect(c.editorialRationale.length).toBeGreaterThan(80);
      expect(c.result.headline).toContain(c.name);
      expect(c.traits.length).toBeGreaterThanOrEqual(3);
    }
  });

  it("polaridade correta: concordar com afirmações diretas leva ao polo 100", () => {
    const answers = Object.fromEntries(
      theme.questions.map((q) => [q.id, q.polarity === "direct" ? "strongly-agree" : "strongly-disagree"]),
    );
    const { scores } = computeUserProfile(answers, theme.questions, theme.axes, theme.scale);
    for (const id of AXIS_IDS) expect(scores[id]).toBe(100);
  });

  it("o tema completo roda no motor", () => {
    const answers = Object.fromEntries(theme.questions.map((q) => [q.id, "neutral"]));
    const result = runQuiz({
      answers,
      axes: theme.axes,
      questions: theme.questions,
      scale: theme.scale,
      profiles: theme.characters,
    });
    expect(result.ranking).toHaveLength(20);
    expect(result.top).toHaveLength(5);
  });
});
