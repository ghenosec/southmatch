import type { CSSProperties } from "react";
import type { ThemeVisualConfig } from "@/core/types";

/**
 * Converte as cores do tema em variáveis CSS que sobrescrevem os tokens
 * de globals.css. Trocar de tema troca a paleta sem tocar em componentes.
 */
export function themeVariables(visual: ThemeVisualConfig): CSSProperties {
  const c = visual.colors;
  return {
    "--color-sky": c.primary,
    "--color-snow": c.surface,
    "--color-ink": c.ink,
    "--color-action": c.accent,
    "--color-sun": c.highlight,
    "--color-muted": c.muted,
  } as CSSProperties;
}
