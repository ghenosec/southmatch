/**
 * Padroniza e registra as imagens de personagens fornecidas pelo responsável.
 *
 *   npm run images:sync                          (processa e atualiza o mapa)
 *   npm run images:sync -- --credit "Arte de X"  (crédito opcional para imagens novas)
 *   npm run images:check                         (só verifica; falha se algo estiver desatualizado)
 *
 * Para cada personagem, procura public/themes/south-park/<slug>.(png|webp|jpg|jpeg) e gera
 * public/themes/south-park/normalized/<slug>.webp:
 *   - recorta as margens vazias (transparentes ou da cor do canto);
 *   - encaixa o personagem num quadro de 512×512 com a mesma altura máxima;
 *   - centraliza na horizontal e alinha pela base (todos "no mesmo chão").
 * Os arquivos originais não são alterados.
 */
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();
const SOURCE_DIR = join(ROOT, "public", "themes", "south-park");
const OUT_DIR = join(SOURCE_DIR, "normalized");
const CHARACTERS = join(ROOT, "src", "themes", "south-park", "characters.ts");
const GENERATED = join(ROOT, "src", "themes", "south-park", "images.generated.ts");
const EXTENSIONS = ["png", "webp", "jpg", "jpeg"];

/** Quadro final e área útil: o lado maior do personagem ocupa até CONTENT px. */
const CANVAS = 512;
const CONTENT = 456;
const BOTTOM_MARGIN = 20;

const args = process.argv.slice(2);
const checkOnly = args.includes("--check");
const creditIndex = args.indexOf("--credit");
const creditArg = creditIndex >= 0 ? args[creditIndex + 1]?.trim() || null : null;

const slugs = [...readFileSync(CHARACTERS, "utf8").matchAll(/^\s+slug: "([^"]+)",$/gm)].map((m) => m[1]);

function previousCredits() {
  if (!existsSync(GENERATED)) return {};
  const out = {};
  const text = readFileSync(GENERATED, "utf8");
  for (const m of text.matchAll(/"([^"]+)": \{ file: "[^"]+", credit: (null|"(?:[^"\\]|\\.)*") \}/g)) {
    out[m[1]] = JSON.parse(m[2]);
  }
  return out;
}

const files = existsSync(SOURCE_DIR) ? readdirSync(SOURCE_DIR) : [];
const sources = {};
for (const slug of slugs) {
  const file = EXTENSIONS.map((ext) => `${slug}.${ext}`).find((name) => files.includes(name));
  if (file) sources[slug] = file;
}

const outPath = (slug) => join(OUT_DIR, `${slug}.webp`);
const isStale = (slug) =>
  !existsSync(outPath(slug)) || statSync(outPath(slug)).mtimeMs < statSync(join(SOURCE_DIR, sources[slug])).mtimeMs;

console.log(`Pasta: public/themes/south-park/  (${Object.keys(sources).length} de ${slugs.length} personagens)\n`);

if (checkOnly) {
  const generated = previousCredits();
  const problems = [];
  for (const slug of Object.keys(sources)) {
    if (!(slug in generated)) problems.push(`${slug}: fora do mapa`);
    else if (isStale(slug)) problems.push(`${slug}: versão padronizada desatualizada`);
  }
  for (const slug of Object.keys(generated)) if (!sources[slug]) problems.push(`${slug}: no mapa, mas sem arquivo original`);
  for (const slug of slugs) console.log(`  ${sources[slug] ? "✔" : "·"} ${slug.padEnd(20)} ${sources[slug] ?? `faltando — adicione ${slug}.png`}`);
  if (problems.length) {
    console.error(`\nRode npm run images:sync:\n  ${problems.join("\n  ")}`);
    process.exit(1);
  }
  process.exit(0);
}

mkdirSync(OUT_DIR, { recursive: true });

async function normalize(slug) {
  const input = join(SOURCE_DIR, sources[slug]);
  // 1) recorta margens vazias (compara com a cor do canto, incluindo transparência)
  const trimmed = await sharp(input).ensureAlpha().trim({ threshold: 12 }).png().toBuffer({ resolveWithObject: true });
  // 2) encaixa na área útil mantendo a proporção
  const fitted = await sharp(trimmed.data)
    .resize({ width: CONTENT, height: CONTENT, fit: "inside", kernel: "lanczos3" })
    .png()
    .toBuffer({ resolveWithObject: true });
  const { width, height } = fitted.info;
  // 3) quadro transparente, centralizado na horizontal e alinhado pela base
  const left = Math.floor((CANVAS - width) / 2);
  const top = CANVAS - BOTTOM_MARGIN - height;
  await sharp({ create: { width: CANVAS, height: CANVAS, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
    .composite([{ input: fitted.data, left, top }])
    .webp({ quality: 88, alphaQuality: 90, effort: 5 })
    .toFile(outPath(slug));
  return { original: `${trimmed.info.width}×${trimmed.info.height}`, final: `${width}×${height}` };
}

const previous = previousCredits();
const entries = [];
for (const slug of slugs) {
  if (!sources[slug]) {
    console.log(`  · ${slug.padEnd(20)} faltando — adicione ${slug}.png`);
    continue;
  }
  const r = await normalize(slug);
  const kb = (statSync(outPath(slug)).size / 1024).toFixed(0);
  console.log(`  ✔ ${slug.padEnd(20)} conteúdo ${r.original.padEnd(10)} → ${r.final.padEnd(8)} (${kb} KB)`);
  const credit = slug in previous ? (creditArg ?? previous[slug]) : creditArg;
  entries.push(`  ${JSON.stringify(slug)}: { file: ${JSON.stringify(`normalized/${slug}.webp`)}, credit: ${JSON.stringify(credit)} },`);
}

writeFileSync(
  GENERATED,
  [
    "// Arquivo gerado por `npm run images:sync`. Não edite à mão.",
    "// Imagens de personagens fornecidas pelo responsável do projeto, padronizadas em",
    "// public/themes/south-park/normalized/ (512×512, alinhadas pela base).",
    "",
    "export const generatedCharacterImages: Readonly<",
    "  Record<string, { readonly file: string; readonly credit: string | null }>",
    "> = {",
    ...entries,
    "};",
    "",
  ].join("\n"),
);
console.log(`\nMapa atualizado: src/themes/south-park/images.generated.ts (${entries.length} imagens).`);
