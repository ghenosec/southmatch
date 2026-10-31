/**
 * Calibração com respondentes simulados "realistas": cada pessoa tem um traço
 * latente por eixo e responde de forma coerente com ele, com ruído.
 * Mede também o efeito de tendências de resposta (concordar com tudo, neutralidade).
 */
import { describe, expect, it } from "vitest";
import { runQuiz } from "@/core";
import type { UserAnswers } from "@/core/types";
import { southParkTheme as theme } from "@/themes/south-park";
import { seededRandom } from "../fixtures";

const OPTIONS = theme.scale.options.map((o) => o.id);
const N = 10_000;

function gaussian(rand: () => number) {
  const u = Math.max(rand(), 1e-12);
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * rand());
}

interface Style {
  /** Desvio padrão do ruído, em passos da escala (0–4). */
  noise: number;
  /** Viés de concordância somado a toda resposta, em passos. */
  acquiescence: number;
  /** Probabilidade de responder "Neutro" independentemente do traço. */
  neutralRate: number;
}

function respondent(rand: () => number, style: Style): UserAnswers {
  const latent = Object.fromEntries(theme.axes.map((a) => [a.id, rand()]));
  return Object.fromEntries(
    theme.questions.map((q) => {
      if (rand() < style.neutralRate) return [q.id, "neutral"];
      const trait = latent[q.axisId]!;
      const agreement = q.polarity === "direct" ? trait : 1 - trait;
      const step = Math.round(agreement * 4 + gaussian(rand) * style.noise + style.acquiescence);
      return [q.id, OPTIONS[Math.min(4, Math.max(0, step))]!];
    }),
  );
}

function distribution(style: Style, seed: number) {
  const rand = seededRandom(seed);
  const counts = new Map(theme.characters.map((c) => [c.id, 0]));
  for (let i = 0; i < N; i++) {
    const r = runQuiz({ answers: respondent(rand, style), axes: theme.axes, questions: theme.questions, scale: theme.scale, profiles: theme.characters });
    counts.set(r.winner.profileId, counts.get(r.winner.profileId)! + 1);
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([id, n]) => ({ id, share: n / N }));
}

function print(title: string, d: { id: string; share: number }[]) {
  console.log(`\n${title}\n` + d.map((x) => `  ${x.id.padEnd(14)} ${(100 * x.share).toFixed(1).padStart(5)}%`).join("\n"));
}

describe("calibração com respondentes realistas", () => {
  it("respostas coerentes com ruído moderado: todos aparecem, nenhum domina", () => {
    const d = distribution({ noise: 0.7, acquiescence: 0, neutralRate: 0.1 }, 101);
    print(`Coerentes (ruído 0,7; 10% neutras) — ${N} pessoas`, d);
    expect(d[0]!.share).toBeLessThan(0.2);
    for (const x of d) expect(x.share).toBeGreaterThan(0.002);
  });

  it("efeito de concordar com tudo (viés de aquiescência) fica limitado", () => {
    const base = distribution({ noise: 0.7, acquiescence: 0, neutralRate: 0.1 }, 202);
    const biased = distribution({ noise: 0.7, acquiescence: 0.8, neutralRate: 0.1 }, 202);
    print("Com viés de concordância (+0,8 passo)", biased);
    // Com polaridades equilibradas, o viés se cancela em parte: nenhum personagem
    // deve ganhar mais de 10 pontos percentuais de participação.
    const byId = new Map(base.map((x) => [x.id, x.share]));
    for (const x of biased) expect(Math.abs(x.share - byId.get(x.id)!)).toBeLessThan(0.1);
  });

  it("muitas respostas neutras concentram o resultado em perfis moderados (achado documentado)", () => {
    const d = distribution({ noise: 0.7, acquiescence: 0, neutralRate: 0.6 }, 303);
    print("60% de respostas neutras", d);
    expect(d[0]!.share).toBeLessThan(0.5);
  });
});
