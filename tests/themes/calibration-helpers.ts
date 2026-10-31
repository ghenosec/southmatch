import { rankProfiles, weightedDistance } from "@/core";
import type { AxisScores, ThemeDefinition, UserAnswers } from "@/core/types";

/**
 * Constrói respostas válidas que reproduzem exatamente `target`.
 * Requer pontuações múltiplas de 100 / (perguntas × (opções − 1)) por eixo.
 */
export function answersForScores(theme: ThemeDefinition, target: AxisScores): UserAnswers {
  const options = theme.scale.options;
  const maxStep = options.length - 1;
  const answers: Record<string, string> = {};
  for (const axis of theme.axes) {
    const qs = theme.questions.filter((q) => q.axisId === axis.id);
    let steps = Math.round(((target[axis.id] ?? 50) / 100) * qs.length * maxStep);
    for (const q of qs) {
      const s = Math.min(maxStep, steps);
      steps -= s;
      const index = q.polarity === "direct" ? s : maxStep - s;
      answers[q.id] = options[index]!.id;
    }
  }
  return answers;
}

export function winnerDistribution(theme: ThemeDefinition, users: readonly AxisScores[]): Map<string, number> {
  const counts = new Map(theme.characters.map((c) => [c.id, 0]));
  for (const user of users) {
    const [winner] = rankProfiles(user, theme.characters, theme.axes);
    counts.set(winner!.profileId, (counts.get(winner!.profileId) ?? 0) + 1);
  }
  return counts;
}

export interface PairDistance {
  readonly a: string;
  readonly b: string;
  readonly affinity: number;
}

/** Todos os pares de personagens, do mais parecido ao menos parecido. */
export function characterPairs(theme: ThemeDefinition): PairDistance[] {
  const pairs: PairDistance[] = [];
  const list = theme.characters;
  for (let i = 0; i < list.length; i++) {
    for (let j = i + 1; j < list.length; j++) {
      const d = weightedDistance(list[i]!.scores, list[j]!.scores, theme.axes);
      pairs.push({ a: list[i]!.id, b: list[j]!.id, affinity: 100 * (1 - d) });
    }
  }
  return pairs.sort((x, y) => y.affinity - x.affinity);
}
