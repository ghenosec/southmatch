/**
 * Integridade das explicações: nenhuma frase pode contradizer os números.
 * Roda milhares de perfis simulados e confere cada frase gerada.
 */
import { describe, expect, it } from "vitest";
import { classifyScore, fillTemplate, findBand, runQuiz, validateTheme } from "@/core";
import type { AxisScores, ThemeDefinition } from "@/core/types";
import { buildExplanation, compareWithCharacter, resultSummaryText } from "@/services/quiz";
import { exampleTheme } from "@/themes/example-theme";
import { southParkTheme as theme } from "@/themes/south-park";
import { answersForScores } from "../themes/calibration-helpers";
import { seededRandom } from "../fixtures";

const ex = theme.explanations!;

function randomScores(rand: () => number, t: ThemeDefinition = theme): AxisScores {
  return Object.fromEntries(t.axes.map((a) => [a.id, Math.round(rand() * 20) * 5]));
}

function explain(scores: AxisScores, t: ThemeDefinition = theme) {
  const result = runQuiz({
    answers: answersForScores(t, scores),
    axes: t.axes,
    questions: t.questions,
    scale: t.scale,
    profiles: t.characters,
  });
  const winner = t.characters.find((c) => c.id === result.winner.profileId)!;
  return { result, winner, explanation: buildExplanation(t, result, winner) };
}

describe("textos de explicação do tema", () => {
  it("passam na validação (todos os eixos, seções e regras)", () => {
    expect(validateTheme(theme).issues).toEqual([]);
  });

  it("cada seção usa eixos existentes e todos os eixos aparecem em alguma seção", () => {
    const covered = new Set(ex.sections.flatMap((s) => s.axisIds));
    for (const a of theme.axes) expect(covered.has(a.id)).toBe(true);
  });

  it("frases de traço em comum não usam os polos como adjetivo (que exigiria concordância de gênero)", () => {
    for (const texts of Object.values(ex.axes)) {
      for (const t of Object.values(texts.shared)) {
        for (const axis of theme.axes) {
          for (const pole of [axis.lowPole, axis.highPole]) {
            const asAdjective = new RegExp(`\\b(é|são|ser|serem|ficar|ficam|parecer)\\s+(mais\\s+|muito\\s+)?${pole}\\b`, "i");
            expect(t).not.toMatch(asAdjective);
          }
        }
      }
    }
  });
});

describe("coerência das explicações em 3.000 perfis simulados", () => {
  const rand = seededRandom(2026);
  const cases = Array.from({ length: 3000 }, () => explain(randomScores(rand)));

  it("traços em comum: mesmo lado do eixo, diferença pequena e frase da direção certa", () => {
    for (const { result, winner, explanation } of cases) {
      for (const s of explanation.winner.similarities) {
        const u = result.user.scores[s.axisId]!;
        const c = winner.scores[s.axisId]!;
        expect(Math.abs(u - c)).toBeLessThanOrEqual(12);
        const dir = classifyScore(u).direction;
        expect(classifyScore(c).direction).toBe(dir);
        expect(s.text).toBe(fillTemplate(ex.axes[s.axisId]!.shared[dir], { name: winner.name }));
      }
    }
  });

  it("nunca afirma extroversão quando a sociabilidade é baixa (e vice-versa)", () => {
    const high = ex.axes.sociability!.shared.high;
    const low = ex.axes.sociability!.shared.low;
    for (const { result, winner, explanation } of cases) {
      const s = result.user.scores.sociability!;
      const texts = explanation.winner.similarities.map((x) => x.text);
      if (texts.includes(fillTemplate(high, { name: winner.name }))) expect(s).toBeGreaterThanOrEqual(60);
      if (texts.includes(fillTemplate(low, { name: winner.name }))) expect(s).toBeLessThanOrEqual(40);
    }
  });

  it("diferenças: só com diferença ≥ 25 e citando o polo do lado do personagem", () => {
    for (const { result, winner, explanation } of cases) {
      for (const d of explanation.winner.differences) {
        const axis = theme.axes.find((a) => a.id === d.axisId)!;
        const u = result.user.scores[d.axisId]!;
        const c = winner.scores[d.axisId]!;
        expect(Math.abs(u - c)).toBeGreaterThanOrEqual(25);
        expect(d.text).toContain(`“${c > u ? axis.highPole : axis.lowPole}”`);
      }
    }
  });

  it("seções do perfil descrevem a faixa em que a pontuação realmente está", () => {
    for (const { result, explanation } of cases.slice(0, 500)) {
      for (const section of explanation.sections) {
        const def = ex.sections.find((s) => s.id === section.id)!;
        def.axisIds.forEach((id, i) => {
          const axis = theme.axes.find((a) => a.id === id)!;
          expect(section.paragraphs[i]).toBe(findBand(axis, result.user.scores[id]!).description);
        });
      }
    }
  });

  it("contradições: cada frase tem todas as condições satisfeitas e nenhuma regra válida fica de fora", () => {
    for (const { result, explanation } of cases) {
      const matching = ex.contradictions.filter((r) =>
        r.when.every((c) => classifyScore(result.user.scores[c.axisId]!).direction === c.direction),
      );
      const expected = matching.length ? matching.map((r) => r.text) : [ex.noContradictions];
      expect(explanation.contradictions).toEqual(expected);
    }
  });

  it("pontos fortes vêm dos eixos mais marcantes, na direção certa", () => {
    for (const { result, explanation } of cases.slice(0, 500)) {
      expect(explanation.strengths).toHaveLength(3);
      const top = [...theme.axes]
        .map((a) => ({ id: a.id, s: result.user.scores[a.id]! }))
        .sort((a, b) => Math.abs(b.s - 50) - Math.abs(a.s - 50))[0]!;
      expect(explanation.strengths[0]).toBe(ex.axes[top.id]!.strength[classifyScore(top.s).direction]);
    }
  });

  it("justificativa cita a afinidade calculada e o personagem vencedor", () => {
    for (const { result, winner, explanation } of cases.slice(0, 200)) {
      expect(explanation.justification).toContain(winner.name);
      expect(explanation.justification).toContain(`${Math.round(result.winner.affinity)}%`);
    }
  });

  it("aviso de perfil equilibrado aparece só quando no máximo 2 eixos fogem do centro", () => {
    for (const { result, explanation } of cases) {
      const marked = Object.values(result.user.scores).filter((s) => Math.abs(s - 50) >= 10).length;
      expect(explanation.balancedNote !== null).toBe(marked <= 2);
    }
    const neutral = explain(Object.fromEntries(theme.axes.map((a) => [a.id, 50])));
    expect(neutral.explanation.balancedNote).toBe(ex.balancedProfile);
  });
});

describe("comparação com qualquer personagem", () => {
  it("compara o usuário com cada um dos 20 personagens com dados consistentes", () => {
    const scores = randomScores(seededRandom(5));
    for (const c of theme.characters) {
      const cmp = compareWithCharacter(theme, scores, c);
      expect(cmp.rows).toHaveLength(9);
      for (const r of cmp.rows) expect(r.difference).toBe(r.user - r.character);
      expect(cmp.affinity).toBeGreaterThanOrEqual(0);
      expect(cmp.affinity).toBeLessThanOrEqual(100);
    }
  });

  it("comparar com o próprio vetor dá 100% e nenhuma diferença", () => {
    const c = theme.characters[0]!;
    const cmp = compareWithCharacter(theme, c.scores, c);
    expect(cmp.affinity).toBe(100);
    expect(cmp.differences).toEqual([]);
  });
});

describe("tema sem textos de explicação", () => {
  it("funciona com textos genéricos a partir das faixas", () => {
    const scores = { energy: 100, order: 100, warmth: 100 };
    const { explanation } = explain(scores, exampleTheme);
    expect(explanation.sections).toHaveLength(3);
    expect(explanation.strengths).toEqual([]);
    expect(explanation.contradictions).toEqual([]);
    expect(explanation.balancedNote).toBeNull();
  });
});

describe("resumo para copiar", () => {
  it("contém vencedor, top 5 e os eixos, sem respostas individuais", () => {
    const { result, winner } = explain(randomScores(seededRandom(11)));
    const names = result.top.map((r) => theme.characters.find((c) => c.id === r.profileId)!.name);
    const text = resultSummaryText(theme, result, winner, names);
    expect(text).toContain(winner.name);
    for (const a of theme.axes) expect(text).toContain(a.name);
    for (const q of theme.questions) expect(text).not.toContain(q.id);
  });
});
