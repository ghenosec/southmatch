/**
 * Formato compacto e versionado do resultado compartilhável.
 *
 *   <formato>~<tema>~<algoritmo>~<perfis>~<pontuações>~<verificação>
 *   ex.: 1~south-park~1~2026.10.0~0k1e…~3f9a2c
 *
 * - Fica no fragmento da URL (#r=…): o navegador não envia fragmentos ao servidor.
 * - Guarda só as pontuações dos eixos (inteiros 0–100, 2 caracteres base 36 cada),
 *   nunca as respostas individuais nem dados pessoais.
 * - A verificação (FNV-1a) detecta links truncados ou editados por engano.
 *   Não é assinatura: alguém pode forjar pontuações, o que só afeta o próprio link.
 */
export const SHARE_FORMAT_VERSION = 1;
const SEPARATOR = "~";
const MAX_LENGTH = 400;
const MAX_AXES = 64;

export interface SharedResultData {
  readonly format: number;
  readonly themeId: string;
  readonly algorithm: number;
  readonly profilesVersion: string;
  /** Pontuações na ordem dos eixos do tema. */
  readonly scores: readonly number[];
}

export type DecodeError = "empty" | "too-long" | "malformed" | "unsupported-format" | "checksum";

export type DecodeResult =
  | { readonly ok: true; readonly data: SharedResultData }
  | { readonly ok: false; readonly error: DecodeError };

function checksum(text: string): string {
  let hash = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return hash.toString(36).padStart(7, "0");
}

const THEME_ID = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const PROFILES_VERSION = /^[0-9A-Za-z._-]{1,32}$/;
const SCORES = /^[0-9a-z]*$/;

export function encodeSharedResult(data: Omit<SharedResultData, "format">): string {
  if (!THEME_ID.test(data.themeId)) throw new Error("ID de tema inválido para compartilhamento.");
  if (!PROFILES_VERSION.test(data.profilesVersion)) throw new Error("Versão de perfis inválida.");
  if (data.scores.length === 0 || data.scores.length > MAX_AXES) throw new Error("Quantidade de eixos inválida.");
  const scores = data.scores
    .map((s) => {
      if (!Number.isFinite(s) || s < 0 || s > 100) throw new Error("Pontuação fora de 0–100.");
      return Math.round(s).toString(36).padStart(2, "0");
    })
    .join("");
  const body = [SHARE_FORMAT_VERSION, data.themeId, data.algorithm, data.profilesVersion, scores].join(SEPARATOR);
  return `${body}${SEPARATOR}${checksum(body)}`;
}

export function decodeSharedResult(raw: string | null | undefined): DecodeResult {
  if (!raw) return { ok: false, error: "empty" };
  if (raw.length > MAX_LENGTH) return { ok: false, error: "too-long" };
  const parts = raw.split(SEPARATOR);
  if (parts.length !== 6) return { ok: false, error: "malformed" };
  const [format, themeId, algorithm, profilesVersion, scores, check] = parts as [string, string, string, string, string, string];

  if (!/^\d+$/.test(format)) return { ok: false, error: "malformed" };
  if (Number(format) !== SHARE_FORMAT_VERSION) return { ok: false, error: "unsupported-format" };
  if (checksum(parts.slice(0, 5).join(SEPARATOR)) !== check) return { ok: false, error: "checksum" };
  if (!THEME_ID.test(themeId) || !/^\d{1,4}$/.test(algorithm) || !PROFILES_VERSION.test(profilesVersion)) {
    return { ok: false, error: "malformed" };
  }
  if (!SCORES.test(scores) || scores.length === 0 || scores.length % 2 !== 0 || scores.length > MAX_AXES * 2) {
    return { ok: false, error: "malformed" };
  }
  const values: number[] = [];
  for (let i = 0; i < scores.length; i += 2) {
    const v = parseInt(scores.slice(i, i + 2), 36);
    if (!Number.isInteger(v) || v < 0 || v > 100) return { ok: false, error: "malformed" };
    values.push(v);
  }
  return {
    ok: true,
    data: { format: SHARE_FORMAT_VERSION, themeId, algorithm: Number(algorithm), profilesVersion, scores: values },
  };
}

/** Lê o parâmetro `r` do fragmento (`#r=…`). */
export function readShareFragment(hash: string): string | null {
  const params = new URLSearchParams(hash.replace(/^#/, ""));
  return params.get("r");
}

export function shareUrl(origin: string, payload: string): string {
  return `${origin}/resultado#r=${encodeURIComponent(payload)}`;
}
