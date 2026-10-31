/**
 * Liga o formato de compartilhamento ao motor e aos temas.
 *
 * Regra: nunca recalcular em silêncio um resultado antigo com perfis ou
 * algoritmo novos. Se as versões não baterem, o link é recusado com uma
 * mensagem explicando o motivo.
 */
import { ALGORITHM_VERSION, resultFromScores, type QuizResult, type ThemeDefinition } from "@/core";
import { decodeSharedResult, encodeSharedResult, type DecodeError } from "@/lib/sharing/share-link";
import { getTheme } from "@/themes/registry";

export type SharedResultError =
  | DecodeError
  | "unknown-theme"
  | "axis-mismatch"
  | "outdated-algorithm"
  | "outdated-profiles";

export type SharedResultOutcome =
  | { readonly ok: true; readonly theme: ThemeDefinition; readonly result: QuizResult }
  | { readonly ok: false; readonly error: SharedResultError };

export const SHARED_ERROR_MESSAGES: Readonly<Record<SharedResultError, string>> = {
  empty: "O link não contém um resultado.",
  "too-long": "O link é longo demais para ser um resultado do SouthMatch.",
  malformed: "O link parece incompleto ou foi alterado.",
  "unsupported-format": "Este link foi criado por uma versão do SouthMatch que não é mais suportada.",
  checksum: "O link parece incompleto ou foi alterado.",
  "unknown-theme": "Este link é de um teste que não existe mais.",
  "axis-mismatch": "Este link não corresponde aos eixos atuais do teste.",
  "outdated-algorithm":
    "Este resultado foi calculado com uma versão anterior do algoritmo. Para não mostrar números diferentes dos originais, ele não pode ser reconstruído.",
  "outdated-profiles":
    "Este resultado foi calculado com uma versão anterior dos perfis dos personagens. Para não mostrar um ranking diferente do original, ele não pode ser reconstruído.",
};

/** Gera o código compartilhável de um resultado. */
export function encodeThemeResult(theme: ThemeDefinition, result: QuizResult): string {
  return encodeSharedResult({
    themeId: theme.id,
    algorithm: result.versions.algorithm,
    profilesVersion: theme.versions.profiles,
    scores: theme.axes.map((a) => result.user.scores[a.id]!),
  });
}

/** Valida o código e reconstrói o resultado com as mesmas versões. */
export function resolveSharedResult(raw: string | null): SharedResultOutcome {
  const decoded = decodeSharedResult(raw);
  if (!decoded.ok) return decoded;
  const { data } = decoded;

  const theme = getTheme(data.themeId);
  if (!theme) return { ok: false, error: "unknown-theme" };
  if (data.scores.length !== theme.axes.length) return { ok: false, error: "axis-mismatch" };
  if (data.algorithm !== ALGORITHM_VERSION) return { ok: false, error: "outdated-algorithm" };
  if (data.profilesVersion !== theme.versions.profiles) return { ok: false, error: "outdated-profiles" };

  const scores = Object.fromEntries(theme.axes.map((a, i) => [a.id, data.scores[i]!]));
  const result = resultFromScores({ scores, axes: theme.axes, profiles: theme.characters });
  return { ok: true, theme, result };
}
