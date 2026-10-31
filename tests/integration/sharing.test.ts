import { describe, expect, it } from "vitest";
import { ALGORITHM_VERSION, resultFromScores, runQuiz } from "@/core";
import {
  decodeSharedResult,
  encodeSharedResult,
  readShareFragment,
  SHARE_FORMAT_VERSION,
  shareUrl,
} from "@/lib/sharing/share-link";
import { encodeThemeResult, resolveSharedResult, SHARED_ERROR_MESSAGES } from "@/services/quiz";
import { southParkTheme as theme } from "@/themes/south-park";
import { answersForScores } from "../themes/calibration-helpers";
import { seededRandom } from "../fixtures";

function sampleResult(seed = 1) {
  const rand = seededRandom(seed);
  const scores = Object.fromEntries(theme.axes.map((a) => [a.id, Math.round(rand() * 20) * 5]));
  return runQuiz({
    answers: answersForScores(theme, scores),
    axes: theme.axes,
    questions: theme.questions,
    scale: theme.scale,
    profiles: theme.characters,
  });
}

describe("formato do link", () => {
  const base = { themeId: "south-park", algorithm: 1, profilesVersion: "2026.10.0", scores: [0, 5, 50, 100, 37, 99, 1, 64, 80] };

  it("ida e volta preserva todos os campos", () => {
    const decoded = decodeSharedResult(encodeSharedResult(base));
    expect(decoded).toEqual({ ok: true, data: { format: SHARE_FORMAT_VERSION, ...base } });
  });

  it("é compacto e contém só caracteres seguros para URL", () => {
    const code = encodeSharedResult(base);
    expect(code.length).toBeLessThan(60);
    expect(code).toMatch(/^[0-9a-z.~-]+$/i);
    expect(encodeURIComponent(code)).toBe(code);
  });

  it("não inclui respostas individuais", () => {
    const code = encodeThemeResult(theme, sampleResult());
    for (const q of theme.questions) expect(code).not.toContain(q.id);
    expect(code).not.toMatch(/agree|neutral/);
  });

  it("arredonda pontuações fracionárias para inteiros", () => {
    const d = decodeSharedResult(encodeSharedResult({ ...base, scores: [12.4, 12.6] }));
    expect(d.ok && d.data.scores).toEqual([12, 13]);
  });

  it("recusa codificar dados inválidos", () => {
    expect(() => encodeSharedResult({ ...base, scores: [101] })).toThrow();
    expect(() => encodeSharedResult({ ...base, scores: [] })).toThrow();
    expect(() => encodeSharedResult({ ...base, themeId: "Tema Ruim" })).toThrow();
    expect(() => encodeSharedResult({ ...base, profilesVersion: "a~b" })).toThrow();
  });

  const valid = encodeSharedResult(base);
  it.each<[string, string | null, string]>([
    ["vazio", "", "empty"],
    ["nulo", null, "empty"],
    ["longo demais", "1~".repeat(300), "too-long"],
    ["poucas partes", "1~south-park~1", "malformed"],
    ["formato futuro", valid.replace(/^1~/, "2~"), "unsupported-format"],
    ["formato não numérico", valid.replace(/^1~/, "x~"), "malformed"],
    ["pontuação alterada", valid.replace(/~(..)/, "~zz").replace("south-park", "south-park"), "checksum"],
    ["verificação alterada", valid.slice(0, -1) + (valid.endsWith("0") ? "1" : "0"), "checksum"],
    ["truncado", valid.slice(0, -3), "checksum"],
  ])("rejeita link %s", (_, raw, error) => {
    expect(decodeSharedResult(raw)).toEqual({ ok: false, error });
  });

  it("rejeita valores acima de 100 mesmo com verificação correta", () => {
    // Monta um link com "2s" (=100) trocado por "zz" (=1295) e recalcula a verificação.
    const forged = encodeSharedResult({ ...base, scores: [100] }).split("~");
    forged[4] = "zz";
    const body = forged.slice(0, 5).join("~");
    let h = 0x811c9dc5;
    for (let i = 0; i < body.length; i++) h = Math.imul(h ^ body.charCodeAt(i), 0x01000193) >>> 0;
    expect(decodeSharedResult(`${body}~${h.toString(36).padStart(7, "0")}`)).toEqual({ ok: false, error: "malformed" });
  });

  it("lê o fragmento e monta a URL", () => {
    const url = shareUrl("https://exemplo.test", valid);
    expect(url).toBe(`https://exemplo.test/resultado#r=${valid}`);
    expect(readShareFragment(new URL(url).hash)).toBe(valid);
    expect(readShareFragment("#outra=1")).toBeNull();
    expect(readShareFragment("")).toBeNull();
  });
});

describe("reconstrução do resultado compartilhado", () => {
  it("reproduz exatamente o mesmo ranking do resultado original", () => {
    for (let seed = 1; seed <= 200; seed++) {
      const original = sampleResult(seed);
      const shared = resolveSharedResult(encodeThemeResult(theme, original));
      expect(shared.ok).toBe(true);
      if (!shared.ok) return;
      expect(shared.result.user.scores).toEqual(original.user.scores);
      expect(shared.result.ranking.map((r) => [r.profileId, r.affinity])).toEqual(
        original.ranking.map((r) => [r.profileId, r.affinity]),
      );
    }
  });

  it("recusa perfis de versão anterior em vez de recalcular em silêncio", () => {
    const old = encodeSharedResult({
      themeId: theme.id,
      algorithm: ALGORITHM_VERSION,
      profilesVersion: "2025.01.0",
      scores: theme.axes.map(() => 50),
    });
    expect(resolveSharedResult(old)).toEqual({ ok: false, error: "outdated-profiles" });
  });

  it("recusa algoritmo de versão diferente", () => {
    const other = encodeSharedResult({
      themeId: theme.id,
      algorithm: ALGORITHM_VERSION + 1,
      profilesVersion: theme.versions.profiles,
      scores: theme.axes.map(() => 50),
    });
    expect(resolveSharedResult(other)).toEqual({ ok: false, error: "outdated-algorithm" });
  });

  it("recusa tema desconhecido e número de eixos diferente", () => {
    const enc = (themeId: string, n: number) =>
      encodeSharedResult({ themeId, algorithm: ALGORITHM_VERSION, profilesVersion: theme.versions.profiles, scores: Array(n).fill(50) });
    expect(resolveSharedResult(enc("tema-inexistente", 9))).toEqual({ ok: false, error: "unknown-theme" });
    expect(resolveSharedResult(enc(theme.id, 8))).toEqual({ ok: false, error: "axis-mismatch" });
  });

  it("todo erro tem mensagem para o usuário", () => {
    for (const msg of Object.values(SHARED_ERROR_MESSAGES)) expect(msg.length).toBeGreaterThan(10);
  });

  it("resultFromScores equivale a runQuiz para o mesmo perfil", () => {
    const original = sampleResult(42);
    const rebuilt = resultFromScores({ scores: original.user.scores, axes: theme.axes, profiles: theme.characters });
    expect(rebuilt.ranking).toEqual(original.ranking);
    expect(rebuilt.user.coverage).toEqual({});
  });
});
