/**
 * Calibração do tema South Park.
 *
 * Investiga personagens favorecidos, inalcançáveis, vetores quase idênticos,
 * empates e estabilidade. Imprime um relatório (copiado para
 * docs/CHARACTER_PROFILES.md) e falha se limites mínimos forem violados.
 */
import { describe, expect, it } from "vitest";
import { computeUserProfile, rankProfiles, runQuiz } from "@/core";
import type { AxisScores } from "@/core/types";
import { southParkTheme as theme } from "@/themes/south-park";
import { randomAnswers, seededRandom } from "../fixtures";
import { answersForScores, characterPairs, winnerDistribution } from "./calibration-helpers";

const SAMPLES = 20_000;
const OPTIONS = theme.scale.options.map((o) => o.id);
const pct = (n: number, total: number) => `${((100 * n) / total).toFixed(1)}%`;

/** Perfis uniformes no espaço de pontuações (múltiplos de 5, como respostas reais). */
function uniformUsers(seed: number, n: number): AxisScores[] {
  const rand = seededRandom(seed);
  return Array.from({ length: n }, () =>
    Object.fromEntries(theme.axes.map((a) => [a.id, Math.round(rand() * 20) * 5])),
  );
}

/** Perfis vindos de respostas aleatórias (concentram-se perto de 50). */
function randomAnswerUsers(seed: number, n: number): AxisScores[] {
  const rand = seededRandom(seed);
  return Array.from({ length: n }, () =>
    computeUserProfile(randomAnswers(theme.questions, rand, OPTIONS), theme.questions, theme.axes, theme.scale).scores,
  );
}

function table(dist: Map<string, number>, total: number): string {
  return [...dist.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([id, n]) => `  ${id.padEnd(14)} ${pct(n, total).padStart(6)}`)
    .join("\n");
}

describe("calibração — South Park", () => {
  it("todo personagem é alcançável por respostas válidas (vence com 100%)", () => {
    for (const c of theme.characters) {
      const answers = answersForScores(theme, c.scores);
      const result = runQuiz({
        answers,
        axes: theme.axes,
        questions: theme.questions,
        scale: theme.scale,
        profiles: theme.characters,
      });
      expect(result.user.scores).toEqual(c.scores);
      expect(result.winner.profileId).toBe(c.id);
      expect(result.winner.affinity).toBe(100);
    }
  });

  it("nenhum par de personagens é praticamente idêntico (afinidade < 90)", () => {
    const pairs = characterPairs(theme);
    console.log(
      "\nPares mais parecidos:\n" +
        pairs.slice(0, 8).map((p) => `  ${p.a} × ${p.b}: ${p.affinity.toFixed(1)}`).join("\n"),
    );
    expect(pairs[0]!.affinity).toBeLessThan(90);
  });

  it("distribuição de vencedores com perfis uniformes: todos vencem, nenhum domina", () => {
    const dist = winnerDistribution(theme, uniformUsers(1, SAMPLES));
    console.log(`\nVencedores — ${SAMPLES} perfis uniformes:\n${table(dist, SAMPLES)}`);
    for (const [, n] of dist) {
      expect(n / SAMPLES).toBeGreaterThan(0.005); // todo personagem vence ≥ 0,5%
      expect(n / SAMPLES).toBeLessThan(0.2); // nenhum vence ≥ 20%
    }
  });

  it("distribuição com respostas aleatórias (diagnóstico de viés central)", () => {
    const dist = winnerDistribution(theme, randomAnswerUsers(2, SAMPLES));
    console.log(`\nVencedores — ${SAMPLES} questionários com respostas aleatórias:\n${table(dist, SAMPLES)}`);
    // Respostas aleatórias tendem ao centro; só exigimos que nenhum personagem
    // absorva mais da metade dos resultados.
    for (const [, n] of dist) expect(n / SAMPLES).toBeLessThan(0.5);
  });

  // Pontuações reais andam em passos de 5, então empates exatos acontecem;
  // o desempate estável do motor os resolve. Exigimos apenas que sejam raros.
  it("empates exatos no topo são raros (< 2%)", () => {
    const users = uniformUsers(3, 5_000);
    let ties = 0;
    for (const u of users) {
      const [a, b] = rankProfiles(u, theme.characters, theme.axes);
      if (Math.abs(a!.affinity - b!.affinity) < 1e-9) ties++;
    }
    console.log(`\nEmpates exatos no 1º lugar: ${ties} em 5000`);
    expect(ties / users.length).toBeLessThan(0.02);
  });

  it("estabilidade: mudar uma resposta em um passo altera a afinidade do vencedor em no máximo 2 pontos", () => {
    const rand = seededRandom(4);
    const ids = theme.scale.options.map((o) => o.id);
    for (let i = 0; i < 500; i++) {
      const answers = { ...randomAnswers(theme.questions, rand, OPTIONS) };
      const base = runQuiz({ answers, axes: theme.axes, questions: theme.questions, scale: theme.scale, profiles: theme.characters });
      const q = theme.questions[Math.floor(rand() * theme.questions.length)]!;
      const idx = ids.indexOf(answers[q.id]!);
      const next = idx === ids.length - 1 ? idx - 1 : idx + 1;
      const changed = runQuiz({
        answers: { ...answers, [q.id]: ids[next]! },
        axes: theme.axes,
        questions: theme.questions,
        scale: theme.scale,
        profiles: theme.characters,
      });
      const before = base.winner;
      const after = changed.ranking.find((r) => r.profileId === before.profileId)!;
      // Um passo = 5 pontos em um eixo ⇒ |Δdistância| ≤ 5/(100·√9) ⇒ |Δafinidade| ≤ 1,67.
      expect(Math.abs(after.affinity - before.affinity)).toBeLessThanOrEqual(5 / 3 + 1e-9);
    }
  });

  it("respostas todas neutras produzem 50 em todos os eixos", () => {
    const answers = Object.fromEntries(theme.questions.map((q) => [q.id, "neutral"]));
    const result = runQuiz({ answers, axes: theme.axes, questions: theme.questions, scale: theme.scale, profiles: theme.characters });
    console.log(
      `\nTudo neutro → top 5: ${result.top.map((r) => `${r.profileId} (${r.affinity.toFixed(1)})`).join(", ")}`,
    );
    expect(Object.values(result.user.scores).every((v) => v === 50)).toBe(true);
  });
});
