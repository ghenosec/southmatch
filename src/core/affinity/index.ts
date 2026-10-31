import { EngineError } from "../errors";
import { clamp, isFiniteNumber } from "../math";
import type {
  AxisComparison,
  AxisDefinition,
  AxisId,
  AxisScores,
  AxisWeights,
} from "../types";

/** Resolve o peso de cada eixo (sobrescrita opcional > defaultWeight). */
export function resolveAxisWeights(
  axes: readonly AxisDefinition[],
  overrides: AxisWeights = {},
): Record<AxisId, number> {
  const weights: Record<AxisId, number> = {};
  for (const axis of axes) {
    const weight = Object.hasOwn(overrides, axis.id) ? overrides[axis.id] : axis.defaultWeight;
    if (!isFiniteNumber(weight) || weight < 0) {
      throw new EngineError("INVALID_WEIGHT", `Peso inválido no eixo "${axis.id}".`);
    }
    weights[axis.id] = weight;
  }
  const total = Object.values(weights).reduce((a, b) => a + b, 0);
  if (total <= 0) {
    throw new EngineError("ZERO_WEIGHTS", "A soma dos pesos dos eixos precisa ser maior que zero.");
  }
  return weights;
}

function readScore(scores: AxisScores, axisId: AxisId, owner: string): number {
  const value = Object.hasOwn(scores, axisId) ? scores[axisId] : undefined;
  if (!isFiniteNumber(value) || value < 0 || value > 100) {
    throw new EngineError("INVALID_SCORE", `Pontuação inválida de ${owner} no eixo "${axisId}".`);
  }
  return value;
}

/** Compara dois vetores eixo a eixo. */
export function compareAxes(
  user: AxisScores,
  profile: AxisScores,
  axes: readonly AxisDefinition[],
): AxisComparison[] {
  return axes.map((axis) => {
    const userScore = readScore(user, axis.id, "usuário");
    const profileScore = readScore(profile, axis.id, "perfil");
    const difference = userScore - profileScore;
    const absoluteDifference = Math.abs(difference);
    return {
      axisId: axis.id,
      userScore,
      profileScore,
      difference,
      absoluteDifference,
      similarity: 100 - absoluteDifference,
    };
  });
}

/**
 * Distância euclidiana ponderada e normalizada (0–1).
 *
 * distância = sqrt(Σ peso × (a − b)² / Σ peso) / 100
 */
export function weightedDistance(
  a: AxisScores,
  b: AxisScores,
  axes: readonly AxisDefinition[],
  weights: AxisWeights = {},
): number {
  const resolved = resolveAxisWeights(axes, weights);
  let sum = 0;
  let totalWeight = 0;
  for (const axis of axes) {
    const weight = resolved[axis.id]!;
    const diff = readScore(a, axis.id, "A") - readScore(b, axis.id, "B");
    sum += weight * diff * diff;
    totalWeight += weight;
  }
  return clamp(Math.sqrt(sum / totalWeight) / 100, 0, 1);
}

/** Afinidade = 100 × (1 − distância), sempre entre 0 e 100. */
export function affinityFromDistance(distance: number): number {
  if (!isFiniteNumber(distance)) {
    throw new EngineError("INVALID_DISTANCE", "Distância inválida.");
  }
  return clamp(100 * (1 - distance), 0, 100);
}
