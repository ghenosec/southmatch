/**
 * Ponto de acesso da interface aos temas e ao motor.
 */
import type { ThemeDefinition } from "@/core/types";
import { getTheme } from "@/themes/registry";

export * from "./quiz-service";
export * from "./quiz-state";
export * from "./explanations";

/** Tema exibido no site. Trocar aqui é suficiente para mudar o tema padrão. */
export const DEFAULT_THEME_ID = "south-park";

export function getActiveTheme(): ThemeDefinition {
  const theme = getTheme(DEFAULT_THEME_ID);
  if (!theme) throw new Error(`Tema padrão "${DEFAULT_THEME_ID}" não registrado.`);
  return theme;
}

/**
 * Duração estimada: entre 9 e 13 segundos por afirmação.
 * Estimativa ainda não validada com usuários reais.
 */
export function estimatedMinutes(theme: ThemeDefinition): { min: number; max: number } {
  const n = theme.questions.length;
  return { min: Math.max(1, Math.round((n * 9) / 60)), max: Math.max(1, Math.round((n * 13) / 60)) };
}
