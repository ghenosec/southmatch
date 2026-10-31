/**
 * Gera explicações personalizadas a partir dos números calculados.
 *
 * Genérico: não conhece nenhum tema. Cada frase só aparece quando os dados
 * a sustentam (traço em comum = mesmo lado do eixo e diferença pequena;
 * seção de perfil = faixa em que a pontuação realmente está).
 */
import {
  classifyScore,
  compareAxes,
  fillTemplate,
  findBand,
  interpretComparison,
  interpretProfile,
  rankProfiles,
  round,
  type AxisDefinition,
  type AxisScores,
  type CharacterDefinition,
  type QuizResult,
  type ThemeDefinition,
} from "@/core";

export interface ExplainedAxis {
  readonly axisId: string;
  readonly text: string;
}

export interface CharacterComparison {
  readonly characterId: string;
  readonly affinity: number;
  readonly rows: readonly {
    readonly axisId: string;
    readonly axisName: string;
    readonly user: number;
    readonly character: number;
    /** usuário − personagem */
    readonly difference: number;
  }[];
  /** Traços em comum, do mais parecido ao menos parecido. */
  readonly similarities: readonly ExplainedAxis[];
  /** Diferenças relevantes, da maior para a menor. */
  readonly differences: readonly ExplainedAxis[];
}

export interface ResultExplanation {
  /** Por que o vencedor foi escolhido (sempre verdadeiro pelos números). */
  readonly justification: string;
  readonly winner: CharacterComparison;
  /** Perfil muito perto do centro: aviso para interpretar com cautela. */
  readonly balancedNote: string | null;
  readonly sections: readonly { readonly id: string; readonly title: string; readonly paragraphs: readonly string[] }[];
  readonly strengths: readonly string[];
  readonly contradictions: readonly string[];
}

const MAX_SIMILARITIES = 3;
const MAX_DIFFERENCES = 3;
/** Perfil "equilibrado" quando no máximo este número de eixos foge do centro. */
const BALANCED_MAX_MARKED_AXES = 2;

function axisName(axes: readonly AxisDefinition[], id: string): string {
  return axes.find((a) => a.id === id)?.name ?? id;
}

function joinNames(names: readonly string[]): string {
  if (names.length <= 1) return names.join("");
  return `${names.slice(0, -1).join(", ")} e ${names.at(-1)}`;
}

/** Frase de diferença sem adjetivos com gênero: cita o polo e os dois valores. */
function differenceText(axis: AxisDefinition, name: string, user: number, character: number): string {
  const pole = character > user ? axis.highPole : axis.lowPole;
  return `${axis.name}: ${name} fica mais perto de “${pole}” (${round(character)}) do que você (${round(user)}).`;
}

/** Compara o usuário com qualquer personagem do tema. */
export function compareWithCharacter(
  theme: ThemeDefinition,
  userScores: AxisScores,
  character: CharacterDefinition,
): CharacterComparison {
  const [result] = rankProfiles(userScores, [character], theme.axes);
  const interp = interpretComparison(result!, character.scores, userScores, theme.axes);
  const axisTexts = theme.explanations?.axes;

  const similarities = interp.sharedAxes.slice(0, MAX_SIMILARITIES).map((axisId) => {
    const row = interp.axes.find((a) => a.axisId === axisId)!;
    const template = axisTexts?.[axisId]?.shared[row.user.direction];
    const text = template
      ? fillTemplate(template, { name: character.name })
      : `${axisName(theme.axes, axisId)}: vocês dois ficam na faixa “${row.user.band.label}”.`;
    return { axisId, text };
  });

  const differences = interp.differentAxes.slice(0, MAX_DIFFERENCES).map((axisId) => {
    const axis = theme.axes.find((a) => a.id === axisId)!;
    return { axisId, text: differenceText(axis, character.name, userScores[axisId]!, character.scores[axisId]!) };
  });

  const rows = compareAxes(userScores, character.scores, theme.axes).map((c) => ({
    axisId: c.axisId,
    axisName: axisName(theme.axes, c.axisId),
    user: c.userScore,
    character: c.profileScore,
    difference: c.difference,
  }));

  return { characterId: character.id, affinity: result!.affinity, rows, similarities, differences };
}

export function buildExplanation(
  theme: ThemeDefinition,
  result: QuizResult,
  winner: CharacterDefinition,
): ResultExplanation {
  const scores = result.user.scores;
  const ex = theme.explanations;
  const comparison = compareWithCharacter(theme, scores, winner);
  const user = interpretProfile(scores, theme.axes);

  const closest = result.winner.closestAxes.slice(0, 3).map((id) => axisName(theme.axes, id));
  const justification =
    `Entre os ${result.ranking.length} personagens, ${winner.name} teve o perfil mais próximo do seu, ` +
    `com afinidade de ${round(result.winner.affinity)}%. ` +
    `Os eixos em que vocês mais se parecem são ${joinNames(closest)}.`;

  const marked = user.filter((u) => u.intensity !== "balanced").length;
  const balancedNote = ex && marked <= BALANCED_MAX_MARKED_AXES ? ex.balancedProfile : null;

  const sections = (ex?.sections ?? theme.axes.map((a) => ({ id: a.id, title: a.name, axisIds: [a.id] }))).map((s) => ({
    id: s.id,
    title: s.title,
    paragraphs: s.axisIds.map((id) => {
      const axis = theme.axes.find((a) => a.id === id)!;
      return findBand(axis, scores[id]!).description;
    }),
  }));

  // Pontos fortes: eixos mais marcantes primeiro; completa com os demais.
  const byStrength = [...user].sort((a, b) => Math.abs(b.score - 50) - Math.abs(a.score - 50));
  const strengths = ex
    ? byStrength.slice(0, 3).map((u) => ex.axes[u.axisId]!.strength[u.direction])
    : [];

  const contradictions = ex
    ? (() => {
        const hits = ex.contradictions
          .filter((rule) => rule.when.every((c) => classifyScore(scores[c.axisId]!).direction === c.direction))
          .map((rule) => rule.text);
        return hits.length > 0 ? hits : [ex.noContradictions];
      })()
    : [];

  return { justification, winner: comparison, balancedNote, sections, strengths, contradictions };
}

/** Texto curto para copiar/compartilhar (sem respostas individuais). */
export function resultSummaryText(
  theme: ThemeDefinition,
  result: QuizResult,
  winner: CharacterDefinition,
  topNames: readonly string[],
): string {
  const lines = [
    `Meu resultado no SouthMatch: ${winner.name} (afinidade de ${round(result.winner.affinity)}%).`,
    `Top 5: ${topNames.join(", ")}.`,
    "",
    ...theme.axes.map((a) => {
      const s = result.user.scores[a.id]!;
      return `${a.name}: ${round(s)}/100 (${findBand(a, s).label})`;
    }),
  ];
  return lines.join("\n");
}
