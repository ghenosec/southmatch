/**
 * Consultas sobre o catálogo de personagens, usando o motor (sem regras por personagem).
 */
import {
  interpretProfile,
  rankProfiles,
  type AxisInterpretation,
  type CharacterDefinition,
  type ProfileConfidence,
  type ThemeDefinition,
} from "@/core";

export const CONFIDENCE_LABELS: Readonly<Record<ProfileConfidence, { label: string; description: string }>> = {
  high: {
    label: "Confiança alta",
    description: "Personagem muito recorrente, com comportamentos consistentes ao longo da série.",
  },
  medium: {
    label: "Confiança média",
    description: "Personagem recorrente, mas com menos material em alguns eixos.",
  },
  low: {
    label: "Confiança baixa",
    description: "Pouco diálogo ou desenvolvimento na série; vários eixos receberam valores moderados.",
  },
};

/** Os personagens com perfis mais próximos, pela mesma afinidade do teste. */
export function similarCharacters(
  theme: ThemeDefinition,
  characterId: string,
  count = 3,
): { character: CharacterDefinition; affinity: number }[] {
  const self = theme.characters.find((c) => c.id === characterId);
  if (!self) throw new Error(`Personagem "${characterId}" não encontrado.`);
  const others = theme.characters.filter((c) => c.id !== characterId);
  return rankProfiles(self.scores, others, theme.axes)
    .slice(0, count)
    .map((r) => ({ character: others.find((c) => c.id === r.profileId)!, affinity: r.affinity }));
}

/** Eixos mais marcantes do personagem (mais distantes do centro). */
export function characterHighlights(theme: ThemeDefinition, character: CharacterDefinition, count = 3): AxisInterpretation[] {
  return interpretProfile(character.scores, theme.axes)
    .filter((i) => i.intensity !== "balanced")
    .sort((a, b) => Math.abs(b.score - 50) - Math.abs(a.score - 50))
    .slice(0, count);
}

/** Vizinhos em ordem alfabética, para navegar entre páginas de personagem. */
export function adjacentCharacters(theme: ThemeDefinition, characterId: string) {
  const sorted = [...theme.characters].sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
  const i = sorted.findIndex((c) => c.id === characterId);
  if (i === -1) return { previous: null, next: null };
  return {
    previous: sorted[(i - 1 + sorted.length) % sorted.length]!,
    next: sorted[(i + 1) % sorted.length]!,
  };
}
