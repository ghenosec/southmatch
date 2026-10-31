/**
 * Serviço de aplicação: liga um tema ao motor.
 * A interface usa este serviço em vez de chamar o motor diretamente.
 */
import {
  interpretResult,
  runQuiz,
  validateTheme,
  type AffinityResult,
  type CharacterDefinition,
  type InterpretationResult,
  type QuizResult,
  type ThemeDefinition,
  type UserAnswers,
} from "@/core";

export interface ThemeQuizResult {
  readonly themeId: string;
  readonly profilesVersion: string;
  readonly result: QuizResult;
  readonly interpretation: InterpretationResult;
  readonly character: (r: AffinityResult) => CharacterDefinition;
}

export class ThemeValidationError extends Error {
  constructor(themeId: string, details: string) {
    super(`Tema "${themeId}" inválido: ${details}`);
    this.name = "ThemeValidationError";
  }
}

/** Lança erro se o tema não respeitar o contrato. */
export function assertValidTheme(theme: ThemeDefinition): void {
  const { valid, issues } = validateTheme(theme);
  if (!valid) {
    throw new ThemeValidationError(
      theme.id,
      issues.slice(0, 5).map((i) => `${i.path}: ${i.message}`).join("; "),
    );
  }
}

export function computeThemeResult(theme: ThemeDefinition, answers: UserAnswers): ThemeQuizResult {
  const result = runQuiz({
    answers,
    axes: theme.axes,
    questions: theme.questions,
    scale: theme.scale,
    profiles: theme.characters,
  });
  const byId = new Map(theme.characters.map((c) => [c.id, c]));
  const character = (r: AffinityResult) => {
    const found = byId.get(r.profileId);
    if (!found) throw new Error(`Personagem "${r.profileId}" não encontrado.`);
    return found;
  };
  const interpretation = interpretResult(
    result.user.scores,
    result.winner,
    character(result.winner).scores,
    theme.axes,
  );
  return {
    themeId: theme.id,
    profilesVersion: theme.versions.profiles,
    result,
    interpretation,
    character,
  };
}
