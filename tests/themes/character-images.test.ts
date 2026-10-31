/**
 * Imagens de personagens fornecidas pelo responsável do projeto:
 * o mapa gerado precisa bater com os arquivos em public/ e ter licença registrada.
 */
import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { validateTheme } from "@/core";
import { IMAGE_BASE_PATH, imageFor } from "@/themes/south-park/assets";
import { generatedCharacterImages } from "@/themes/south-park/images.generated";
import { southParkTheme as theme } from "@/themes/south-park";

const PUBLIC = join(__dirname, "..", "..", "public");

describe("imagens de personagens", () => {
  it("cada imagem do mapa existe em public/ e pertence a um personagem", () => {
    const slugs = new Set(theme.characters.map((c) => c.slug));
    for (const [slug, entry] of Object.entries(generatedCharacterImages)) {
      expect(slugs.has(slug), `slug desconhecido: ${slug}`).toBe(true);
      expect(entry.file).toMatch(new RegExp(`^${slug}\.(png|webp|jpe?g|svg)$`));
      expect(existsSync(join(PUBLIC, IMAGE_BASE_PATH, entry.file)), `arquivo ausente: ${entry.file}`).toBe(true);
      expect(entry.license.trim().length).toBeGreaterThan(0);
    }
  });

  it("personagem sem imagem usa o avatar genérico (src nulo)", () => {
    const img = imageFor("slug-sem-imagem", "Fulano");
    expect(img).toEqual({ src: null, alt: "Avatar genérico representando Fulano", license: null });
  });

  it("o tema continua válido com as imagens configuradas", () => {
    expect(validateTheme(theme).issues).toEqual([]);
    for (const c of theme.characters) {
      if (c.image.src) expect(c.image.license).toBeTruthy();
    }
  });
});
