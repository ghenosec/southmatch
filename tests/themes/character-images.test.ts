/**
 * Imagens de personagens fornecidas pelo responsável do projeto:
 * o mapa gerado precisa bater com os arquivos normalizados em public/.
 */
import { existsSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { validateTheme } from "@/core";
import { IMAGE_BASE_PATH, imageFor } from "@/themes/south-park/assets";
import { generatedCharacterImages } from "@/themes/south-park/images.generated";
import { southParkTheme as theme } from "@/themes/south-park";

const PUBLIC = join(__dirname, "..", "..", "public");

describe("imagens de personagens", () => {
  it("cada imagem do mapa existe (normalizada) e pertence a um personagem", () => {
    const slugs = new Set(theme.characters.map((c) => c.slug));
    for (const [slug, entry] of Object.entries(generatedCharacterImages)) {
      expect(slugs.has(slug), `slug desconhecido: ${slug}`).toBe(true);
      expect(entry.file).toBe(`normalized/${slug}.webp`);
      const path = join(PUBLIC, IMAGE_BASE_PATH, entry.file);
      expect(existsSync(path), `arquivo ausente: ${entry.file}`).toBe(true);
      expect(statSync(path).size).toBeLessThan(150_000);
    }
  });

  it("personagem sem imagem usa o avatar genérico (src nulo)", () => {
    expect(imageFor("slug-sem-imagem", "Fulano")).toEqual({
      src: null,
      alt: "Avatar genérico representando Fulano",
      credit: null,
    });
  });

  it("o tema continua válido com as imagens configuradas", () => {
    expect(validateTheme(theme).issues).toEqual([]);
  });
});
