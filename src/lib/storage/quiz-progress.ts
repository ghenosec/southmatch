/**
 * Progresso do questionário salvo no navegador.
 *
 * - Chave versionada e vinculada ao tema.
 * - Invalida dados de outro formato, de outro conjunto de perguntas,
 *   expirados ou com respostas inválidas.
 * - Nada é enviado para fora do dispositivo.
 */
import { validateAnswers } from "@/core";
import type { ThemeDefinition, UserAnswers } from "@/core/types";

export const PROGRESS_FORMAT_VERSION = 1;
/** Progresso mais antigo que isto é descartado. */
export const PROGRESS_TTL_MS = 30 * 24 * 60 * 60 * 1000;

export interface StoredProgress {
  readonly v: typeof PROGRESS_FORMAT_VERSION;
  readonly themeId: string;
  /** Assinatura das perguntas: muda se o conjunto de perguntas mudar. */
  readonly questionSignature: string;
  readonly answers: UserAnswers;
  readonly index: number;
  readonly updatedAt: number;
}

/** Interface mínima de armazenamento (localStorage ou um substituto em testes). */
export interface KeyValueStore {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export function progressKey(themeId: string): string {
  return `southmatch:progress:v${PROGRESS_FORMAT_VERSION}:${themeId}`;
}

/** Hash FNV-1a (32 bits) dos IDs das perguntas, em ordem. */
export function questionSignature(theme: ThemeDefinition): string {
  let hash = 0x811c9dc5;
  for (const char of theme.questions.map((q) => `${q.id}:${q.axisId}:${q.polarity}`).join("|")) {
    hash ^= char.charCodeAt(0);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return hash.toString(16).padStart(8, "0");
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** Lê e valida o progresso. Qualquer problema resulta em `null`. */
export function parseProgress(raw: string | null, theme: ThemeDefinition, now: number): StoredProgress | null {
  if (raw === null || raw.length > 20_000) return null;
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    return null;
  }
  if (!isRecord(data)) return null;
  const { v, themeId, questionSignature: signature, answers, index, updatedAt } = data;
  if (v !== PROGRESS_FORMAT_VERSION || themeId !== theme.id) return null;
  if (signature !== questionSignature(theme)) return null;
  if (typeof updatedAt !== "number" || !Number.isFinite(updatedAt)) return null;
  if (now - updatedAt > PROGRESS_TTL_MS || updatedAt - now > 60_000) return null;
  if (!Number.isInteger(index) || (index as number) < 0 || (index as number) >= theme.questions.length) return null;
  if (!validateAnswers(answers, theme.questions, theme.scale).valid) return null;
  return {
    v: PROGRESS_FORMAT_VERSION,
    themeId: theme.id,
    questionSignature: signature,
    answers: { ...(answers as UserAnswers) },
    index: index as number,
    updatedAt,
  };
}

export function serializeProgress(
  theme: ThemeDefinition,
  answers: UserAnswers,
  index: number,
  now: number,
): string {
  const progress: StoredProgress = {
    v: PROGRESS_FORMAT_VERSION,
    themeId: theme.id,
    questionSignature: questionSignature(theme),
    answers,
    index,
    updatedAt: now,
  };
  return JSON.stringify(progress);
}

/** Retorna o localStorage se ele estiver disponível e gravável; senão, `null`. */
export function browserStore(): KeyValueStore | null {
  try {
    const store = globalThis.localStorage;
    if (!store) return null;
    const probe = "southmatch:probe";
    store.setItem(probe, "1");
    store.removeItem(probe);
    return store;
  } catch {
    return null;
  }
}

export function loadProgress(store: KeyValueStore | null, theme: ThemeDefinition, now: number): StoredProgress | null {
  if (!store) return null;
  const key = progressKey(theme.id);
  let raw: string | null;
  try {
    raw = store.getItem(key);
  } catch {
    return null;
  }
  const progress = parseProgress(raw, theme, now);
  // Dados inválidos ou expirados são apagados.
  if (raw !== null && progress === null) {
    try {
      store.removeItem(key);
    } catch {
      /* armazenamento indisponível */
    }
  }
  return progress;
}

export function saveProgress(
  store: KeyValueStore | null,
  theme: ThemeDefinition,
  answers: UserAnswers,
  index: number,
  now: number,
): void {
  if (!store) return;
  try {
    store.setItem(progressKey(theme.id), serializeProgress(theme, answers, index, now));
  } catch {
    /* cota cheia ou modo privado: o quiz continua funcionando sem salvar */
  }
}

export function clearProgress(store: KeyValueStore | null, theme: ThemeDefinition): void {
  if (!store) return;
  try {
    store.removeItem(progressKey(theme.id));
  } catch {
    /* ignorado */
  }
}

/** Prefixo de todas as chaves que o site grava no navegador. */
export const SITE_KEY_PREFIX = "southmatch:";

export interface EnumerableStore extends KeyValueStore {
  readonly length: number;
  key(index: number): string | null;
}

/** Apaga tudo o que o SouthMatch guardou neste navegador. Retorna quantos itens removeu. */
export function clearAllSiteData(store: EnumerableStore | null): number {
  if (!store) return 0;
  const keys: string[] = [];
  try {
    for (let i = 0; i < store.length; i++) {
      const k = store.key(i);
      if (k?.startsWith(SITE_KEY_PREFIX)) keys.push(k);
    }
    for (const k of keys) store.removeItem(k);
  } catch {
    return 0;
  }
  return keys.length;
}
