import { affinityFromDistance, compareAxes, weightedDistance } from "../affinity";
import { EngineError } from "../errors";
import type {
  AffinityResult,
  AxisComparison,
  AxisDefinition,
  AxisScores,
  AxisWeights,
  ProfileDefinition,
} from "../types";

/** Diferenças de afinidade menores que isto contam como empate. */
const TIE_EPSILON = 1e-9;

function maxAbsoluteDifference(axes: readonly AxisComparison[]): number {
  return axes.reduce((max, a) => Math.max(max, a.absoluteDifference), 0);
}

/**
 * Ordenação estável e determinística:
 * 1. maior afinidade;
 * 2. em empate, menor maior-diferença em um eixo (perfil mais uniforme);
 * 3. em empate, ID do perfil em ordem alfabética.
 * Popularidade nunca entra no critério.
 */
function compareResults(a: Omit<AffinityResult, "rank">, b: Omit<AffinityResult, "rank">): number {
  const byAffinity = b.affinity - a.affinity;
  if (Math.abs(byAffinity) > TIE_EPSILON) return byAffinity;
  const byMax = maxAbsoluteDifference(a.axes) - maxAbsoluteDifference(b.axes);
  if (Math.abs(byMax) > TIE_EPSILON) return byMax;
  return a.profileId < b.profileId ? -1 : a.profileId > b.profileId ? 1 : 0;
}

/** Ordena os eixos do mais parecido ao menos parecido (empate: ordem do tema). */
function axesByCloseness(axes: readonly AxisComparison[]): AxisComparison[] {
  return axes
    .map((axis, index) => ({ axis, index }))
    .sort((x, y) => x.axis.absoluteDifference - y.axis.absoluteDifference || x.index - y.index)
    .map((entry) => entry.axis);
}

export function rankProfiles(
  user: AxisScores,
  profiles: readonly ProfileDefinition[],
  axes: readonly AxisDefinition[],
  weights: AxisWeights = {},
): AffinityResult[] {
  if (profiles.length === 0) {
    throw new EngineError("NO_PROFILES", "Nenhum perfil para comparar.");
  }
  const seen = new Set<string>();
  const results = profiles.map((profile) => {
    if (seen.has(profile.id)) {
      throw new EngineError("DUPLICATE_PROFILE", `Perfil duplicado: "${profile.id}".`);
    }
    seen.add(profile.id);
    const comparisons = compareAxes(user, profile.scores, axes);
    const distance = weightedDistance(user, profile.scores, axes, weights);
    const ordered = axesByCloseness(comparisons);
    return {
      profileId: profile.id,
      affinity: affinityFromDistance(distance),
      distance,
      axes: comparisons,
      closestAxes: ordered.map((a) => a.axisId),
      furthestAxes: [...ordered].reverse().map((a) => a.axisId),
    };
  });

  return results.sort(compareResults).map((result, index) => ({ ...result, rank: index + 1 }));
}
