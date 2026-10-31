/**
 * Registro de temas. Para adicionar um tema: crie a pasta em
 * `src/themes/<id>/`, exporte um `ThemeDefinition` e inclua-o aqui.
 */
import type { ThemeDefinition } from "@/core/types";
import { exampleTheme } from "./example-theme";
import { southParkTheme } from "./south-park";

const themes: readonly ThemeDefinition[] = [southParkTheme, exampleTheme];

export function getAllThemes(): readonly ThemeDefinition[] {
  return themes;
}

/** Temas visíveis na interface. */
export function getListedThemes(): readonly ThemeDefinition[] {
  return themes.filter((t) => t.listed);
}

export function getTheme(id: string): ThemeDefinition | undefined {
  return themes.find((t) => t.id === id);
}
