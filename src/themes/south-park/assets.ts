/**
 * Recursos visuais do tema.
 *
 * Nenhuma imagem oficial ou derivada de South Park é usada. Todos os
 * personagens usam placeholders gerados pela interface (`image.src = null`).
 * Para adicionar uma ilustração: coloque o arquivo em
 * public/themes/south-park/, preencha `image.src` e registre a licença em
 * `image.license` (a validação do tema rejeita imagem sem licença).
 */
export const assets = {
  /** Base pública dos arquivos do tema. */
  basePath: "/themes/south-park",
  /** Ilustrações licenciadas disponíveis. Vazio até haver recursos autorizados. */
  licensed: [] as readonly { readonly file: string; readonly license: string }[],
} as const;
