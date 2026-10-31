import { describe, expect, it } from "vitest";
import {
  clearAllSiteData,
  clearProgress,
  loadProgress,
  parseProgress,
  progressKey,
  PROGRESS_TTL_MS,
  questionSignature,
  saveProgress,
  serializeProgress,
  type KeyValueStore,
} from "@/lib/storage/quiz-progress";
import { exampleTheme } from "@/themes/example-theme";
import { southParkTheme as theme } from "@/themes/south-park";

const NOW = 1_800_000_000_000;

function memoryStore(): KeyValueStore & { data: Map<string, string> } {
  const data = new Map<string, string>();
  return {
    data,
    getItem: (k) => data.get(k) ?? null,
    setItem: (k, v) => void data.set(k, v),
    removeItem: (k) => void data.delete(k),
  };
}

const answers = { "soc-1": "agree", "emp-1": "strongly-disagree" };

describe("progresso salvo", () => {
  it("salva e recupera com chave versionada por tema", () => {
    const store = memoryStore();
    saveProgress(store, theme, answers, 2, NOW);
    expect([...store.data.keys()]).toEqual(["southmatch:progress:v1:south-park"]);
    const loaded = loadProgress(store, theme, NOW + 1000);
    expect(loaded?.answers).toEqual(answers);
    expect(loaded?.index).toBe(2);
  });

  it("guarda apenas respostas e metadados, sem dados pessoais", () => {
    const parsed = JSON.parse(serializeProgress(theme, answers, 0, NOW));
    expect(Object.keys(parsed).sort()).toEqual(["answers", "index", "questionSignature", "themeId", "updatedAt", "v"]);
  });

  it("temas diferentes não compartilham progresso", () => {
    const store = memoryStore();
    saveProgress(store, theme, answers, 0, NOW);
    expect(loadProgress(store, exampleTheme, NOW)).toBeNull();
    expect(progressKey("a")).not.toBe(progressKey("b"));
  });

  it.each<[string, string]>([
    ["JSON corrompido", "{not json"],
    ["array", "[]"],
    ["versão de formato diferente", JSON.stringify({ ...JSON.parse(serializeProgress(theme, answers, 0, NOW)), v: 99 })],
    ["outro tema", serializeProgress(exampleTheme, {}, 0, NOW)],
    ["assinatura de perguntas diferente", JSON.stringify({ ...JSON.parse(serializeProgress(theme, answers, 0, NOW)), questionSignature: "deadbeef" })],
    ["resposta com opção inválida", serializeProgress(theme, { "soc-1": "talvez" }, 0, NOW)],
    ["pergunta inexistente", serializeProgress(theme, { "xyz-9": "agree" }, 0, NOW)],
    ["índice fora do intervalo", serializeProgress(theme, answers, 99, NOW)],
    ["índice fracionário", serializeProgress(theme, answers, 1.5, NOW)],
    ["data no futuro", serializeProgress(theme, answers, 0, NOW + 10 * 60_000)],
    ["expirado", serializeProgress(theme, answers, 0, NOW - PROGRESS_TTL_MS - 1)],
    ["tamanho excessivo", "x".repeat(30_000)],
  ])("rejeita %s", (_, raw) => {
    expect(parseProgress(raw, theme, NOW)).toBeNull();
  });

  it("apaga dados inválidos ao carregar", () => {
    const store = memoryStore();
    store.setItem(progressKey(theme.id), "{lixo");
    expect(loadProgress(store, theme, NOW)).toBeNull();
    expect(store.data.size).toBe(0);
  });

  it("limpa o progresso", () => {
    const store = memoryStore();
    saveProgress(store, theme, answers, 0, NOW);
    clearProgress(store, theme);
    expect(store.data.size).toBe(0);
  });

  it("funciona sem armazenamento e com armazenamento que lança erro", () => {
    expect(loadProgress(null, theme, NOW)).toBeNull();
    const broken: KeyValueStore = {
      getItem: () => {
        throw new Error("bloqueado");
      },
      setItem: () => {
        throw new Error("cota");
      },
      removeItem: () => {
        throw new Error("bloqueado");
      },
    };
    expect(loadProgress(broken, theme, NOW)).toBeNull();
    expect(() => saveProgress(broken, theme, answers, 0, NOW)).not.toThrow();
    expect(() => clearProgress(broken, theme)).not.toThrow();
  });

  it("a assinatura muda quando as perguntas mudam", () => {
    const changed = { ...theme, questions: theme.questions.slice(1) };
    expect(questionSignature(changed)).not.toBe(questionSignature(theme));
    expect(questionSignature(theme)).toMatch(/^[0-9a-f]{8}$/);
  });
});

describe("apagar todos os dados do site", () => {
  function enumerable(entries: Record<string, string>) {
    const data = new Map(Object.entries(entries));
    return {
      data,
      get length() {
        return data.size;
      },
      key: (i: number) => [...data.keys()][i] ?? null,
      getItem: (k: string) => data.get(k) ?? null,
      setItem: (k: string, v: string) => void data.set(k, v),
      removeItem: (k: string) => void data.delete(k),
    };
  }

  it("remove só as chaves do SouthMatch", () => {
    const store = enumerable({
      "southmatch:progress:v1:south-park": "{}",
      "southmatch:prefs:auto-advance": "0",
      "outro-site": "x",
    });
    expect(clearAllSiteData(store)).toBe(2);
    expect([...store.data.keys()]).toEqual(["outro-site"]);
    expect(clearAllSiteData(store)).toBe(0);
    expect(clearAllSiteData(null)).toBe(0);
  });
});
