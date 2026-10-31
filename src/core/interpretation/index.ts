import { EngineError } from "../errors";
import type {
  AffinityResult,
  AxisDefinition,
  AxisInterpretation,
  AxisRelation,
  AxisScores,
  ComparisonInterpretation,
  InterpretationResult,
  TraitDirection,
  TraitIntensity,
} from "../types";

/** Limiares usados para transformar números em categorias interpretáveis. */
export interface InterpretationThresholds {
  /** |pontuação − 50| abaixo disto = equilibrado (centro). */
  readonly balanced: number;
  /** |pontuação − 50| a partir disto = tendência forte. */
  readonly strong: number;
  /** Diferença máxima para considerar um traço em comum. */
  readonly shared: number;
  /** Diferença mínima para considerar uma diferença relevante. */
  readonly different: number;
  /** Diferença mínima (com lados opostos) para considerar perfis opostos no eixo. */
  readonly opposite: number;
}

export const DEFAULT_THRESHOLDS: InterpretationThresholds = {
  balanced: 10,
  strong: 25,
  shared: 12,
  different: 25,
  opposite: 40,
};

export function findBand(axis: AxisDefinition, score: number) {
  const band = axis.bands.find((b) => score >= b.min && score <= b.max);
  if (band) return band;
  // Faixas usam limites inteiros; valores fracionários entre faixas vão para a mais próxima.
  const nearest = [...axis.bands].sort(
    (a, b) =>
      Math.min(Math.abs(score - a.min), Math.abs(score - a.max)) -
      Math.min(Math.abs(score - b.min), Math.abs(score - b.max)),
  )[0];
  if (!nearest) {
    throw new EngineError("NO_BANDS", `O eixo "${axis.id}" não tem faixas de interpretação.`);
  }
  return nearest;
}

export function classifyScore(
  score: number,
  thresholds: InterpretationThresholds = DEFAULT_THRESHOLDS,
): { direction: TraitDirection; intensity: TraitIntensity } {
  const offset = score - 50;
  const magnitude = Math.abs(offset);
  if (magnitude < thresholds.balanced) return { direction: "center", intensity: "balanced" };
  return {
    direction: offset < 0 ? "low" : "high",
    intensity: magnitude >= thresholds.strong ? "strong" : "moderate",
  };
}

export function interpretAxis(
  axis: AxisDefinition,
  score: number,
  thresholds: InterpretationThresholds = DEFAULT_THRESHOLDS,
): AxisInterpretation {
  return { axisId: axis.id, score, band: findBand(axis, score), ...classifyScore(score, thresholds) };
}

export function interpretProfile(
  scores: AxisScores,
  axes: readonly AxisDefinition[],
  thresholds: InterpretationThresholds = DEFAULT_THRESHOLDS,
): AxisInterpretation[] {
  return axes.map((axis) => {
    const score = scores[axis.id];
    if (score === undefined) {
      throw new EngineError("INVALID_SCORE", `Pontuação ausente no eixo "${axis.id}".`);
    }
    return interpretAxis(axis, score, thresholds);
  });
}

export function relateAxis(
  user: AxisInterpretation,
  profile: AxisInterpretation,
  thresholds: InterpretationThresholds = DEFAULT_THRESHOLDS,
): AxisRelation {
  const diff = Math.abs(user.score - profile.score);
  const opposed =
    (user.direction === "low" && profile.direction === "high") ||
    (user.direction === "high" && profile.direction === "low");
  if (opposed && diff >= thresholds.opposite) return "opposite";
  if (diff >= thresholds.different) return "different";
  if (diff <= thresholds.shared && user.direction === profile.direction) return "shared";
  return "close";
}

export function interpretComparison(
  result: AffinityResult,
  profileScores: AxisScores,
  userScores: AxisScores,
  axes: readonly AxisDefinition[],
  thresholds: InterpretationThresholds = DEFAULT_THRESHOLDS,
): ComparisonInterpretation {
  const byId = new Map(axes.map((a) => [a.id, a]));
  const rows = result.axes.map((comparison) => {
    const axis = byId.get(comparison.axisId);
    if (!axis) throw new EngineError("UNKNOWN_AXIS", `Eixo desconhecido "${comparison.axisId}".`);
    const user = interpretAxis(axis, userScores[axis.id] ?? comparison.userScore, thresholds);
    const profile = interpretAxis(axis, profileScores[axis.id] ?? comparison.profileScore, thresholds);
    return {
      axisId: axis.id,
      relation: relateAxis(user, profile, thresholds),
      absoluteDifference: comparison.absoluteDifference,
      user,
      profile,
    };
  });

  const shared = rows
    .filter((r) => r.relation === "shared")
    .sort((a, b) => a.absoluteDifference - b.absoluteDifference)
    .map((r) => r.axisId);
  const different = rows
    .filter((r) => r.relation === "different" || r.relation === "opposite")
    .sort((a, b) => b.absoluteDifference - a.absoluteDifference)
    .map((r) => r.axisId);

  return { profileId: result.profileId, axes: rows, sharedAxes: shared, differentAxes: different };
}

/** Eixos do usuário ordenados pela força da tendência (distância do centro). */
export function dominantAxes(interpretations: readonly AxisInterpretation[]): string[] {
  return interpretations
    .map((item, index) => ({ item, index }))
    .filter(({ item }) => item.intensity !== "balanced")
    .sort((a, b) => Math.abs(b.item.score - 50) - Math.abs(a.item.score - 50) || a.index - b.index)
    .map(({ item }) => item.axisId);
}

export function interpretResult(
  userScores: AxisScores,
  winner: AffinityResult,
  winnerScores: AxisScores,
  axes: readonly AxisDefinition[],
  thresholds: InterpretationThresholds = DEFAULT_THRESHOLDS,
): InterpretationResult {
  const user = interpretProfile(userScores, axes, thresholds);
  return {
    user,
    dominantAxes: dominantAxes(user),
    winner: interpretComparison(winner, winnerScores, userScores, axes, thresholds),
  };
}

/**
 * Preenche um template de texto com variáveis `{nome}`.
 * Só substitui texto: nunca interpreta HTML nem executa código.
 * Variáveis ausentes geram erro para evitar frases quebradas.
 */
export function fillTemplate(template: string, vars: Readonly<Record<string, string | number>>): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => {
    if (!Object.hasOwn(vars, key)) {
      throw new EngineError("MISSING_TEMPLATE_VAR", `Variável de template ausente: "${key}".`);
    }
    return String(vars[key]);
  });
}
