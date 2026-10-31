/**
 * Recursos visuais do tema.
 *
 * As imagens dos personagens são fornecidas pelo responsável do projeto.
 * Como adicionar ou atualizar:
 *
 *   1. Copie os arquivos para public/themes/south-park/ com o nome <slug>.png
 *      (também aceita .webp, .jpg, .jpeg). Ex.: stan-marsh.png
 *   2. Rode: npm run images:sync   (crédito opcional: -- --credit "Arte de Fulano")
 *      O script recorta as margens e gera versões padronizadas em
 *      public/themes/south-park/normalized/ (mesmo quadro, mesma altura, alinhadas pela base).
 *   3. Rode: npm run check
 *
 * Personagem sem arquivo continua com o avatar genérico do site.
 */
import type { ImageReference } from "@/core/types";
import { generatedCharacterImages } from "./images.generated";

export const IMAGE_BASE_PATH = "/themes/south-park";

export function imageFor(slug: string, name: string): ImageReference {
  const entry = generatedCharacterImages[slug];
  if (!entry) return { src: null, alt: `Avatar genérico representando ${name}`, credit: null };
  return { src: `${IMAGE_BASE_PATH}/${entry.file}`, alt: name, credit: entry.credit };
}
