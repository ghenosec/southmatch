import { describe, expect, it } from "vitest";
import { validateTheme, weightedDistance } from "@/core";
import { adjacentCharacters, characterHighlights, CONFIDENCE_LABELS, similarCharacters } from "@/services/quiz";
import { southParkTheme as theme } from "@/themes/south-park";

describe("catálogo de personagens", () => {
  it("todo personagem tem nível de confiança válido", () => {
    expect(validateTheme(theme).issues).toEqual([]);
    for (const c of theme.characters) expect(Object.keys(CONFIDENCE_LABELS)).toContain(c.confidence);
  });

  it("confiança bate com a documentação editorial (4 perfis de baixa confiança)", () => {
    const low = theme.characters.filter((c) => c.confidence === "low").map((c) => c.id).sort();
    expect(low).toEqual(["bebe", "heidi", "scott", "timmy"]);
  });

  it("personagens parecidos: exclui o próprio, ordena por afinidade e usa a distância do motor", () => {
    for (const c of theme.characters) {
      const similar = similarCharacters(theme, c.id, 3);
      expect(similar).toHaveLength(3);
      expect(similar.map((s) => s.character.id)).not.toContain(c.id);
      for (let i = 1; i < similar.length; i++) expect(similar[i - 1]!.affinity).toBeGreaterThanOrEqual(similar[i]!.affinity);
      const closest = similar[0]!;
      const expected = 100 * (1 - weightedDistance(c.scores, closest.character.scores, theme.axes));
      expect(closest.affinity).toBeCloseTo(expected, 10);
    }
  });

  it("o par mais parecido do catálogo aparece como vizinho mútuo (Timmy × Clyde)", () => {
    expect(similarCharacters(theme, "timmy", 1)[0]!.character.id).toBe("clyde");
  });

  it("destaques são os eixos mais distantes do centro", () => {
    const butters = theme.characters.find((c) => c.id === "butters")!;
    const h = characterHighlights(theme, butters);
    // Butters tem 5 eixos a 40 do centro (empatia 90, regras 90, conflito 10, humor 10, visão 10);
    // no empate vale a ordem dos eixos no tema.
    expect(h.map((x) => x.axisId)).toEqual(["empathy", "authority", "conflict"]);
    expect(h.every((x) => Math.abs(x.score - 50) === 40)).toBe(true);
  });

  it("navegação circular em ordem alfabética", () => {
    const sorted = [...theme.characters].sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
    const first = adjacentCharacters(theme, sorted[0]!.id);
    expect(first.previous!.id).toBe(sorted.at(-1)!.id);
    expect(first.next!.id).toBe(sorted[1]!.id);
    expect(adjacentCharacters(theme, "nao-existe")).toEqual({ previous: null, next: null });
  });

  it("erro claro para personagem inexistente", () => {
    expect(() => similarCharacters(theme, "nao-existe")).toThrow(/não encontrado/);
  });
});
