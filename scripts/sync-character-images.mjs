/**
 * Sincroniza as imagens de personagens fornecidas pelo responsável do projeto.
 *
 *   npm run images:sync -- --license "origem e termos da licença"
 *   npm run images:check            (só verifica; falha se algo estiver inconsistente)
 *
 * Procura em public/themes/south-park/ um arquivo por personagem com o nome
 * <slug>.(png|webp|jpg|jpeg|svg) e gera src/themes/south-park/images.generated.ts.
 * Não baixa nem cria imagens.
 */
import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const PUBLIC_DIR = join(ROOT, "public", "themes", "south-park");
const CHARACTERS = join(ROOT, "src", "themes", "south-park", "characters.ts");
const GENERATED = join(ROOT, "src", "themes", "south-park", "images.generated.ts");
const EXTENSIONS = ["png", "webp", "jpg", "jpeg", "svg"];

const args = process.argv.slice(2);
const checkOnly = args.includes("--check");
const licenseIndex = args.indexOf("--license");
const licenseArg = licenseIndex >= 0 ? args[licenseIndex + 1]?.trim() : undefined;

const slugs = [...readFileSync(CHARACTERS, "utf8").matchAll(/^\s+slug: "([^"]+)",$/gm)].map((m) => m[1]);

/** Licenças já registradas (para não exigir --license de novo a cada sincronização). */
function previousLicenses() {
  if (!existsSync(GENERATED)) return {};
  const text = readFileSync(GENERATED, "utf8");
  const out = {};
  for (const m of text.matchAll(/"([^"]+)": \{ file: "([^"]+)", license: ("(?:[^"\\]|\\.)*") \}/g)) {
    out[m[1]] = JSON.parse(m[3]);
  }
  return out;
}

const files = existsSync(PUBLIC_DIR) ? readdirSync(PUBLIC_DIR) : [];
const previous = previousLicenses();
const found = {};
const missing = [];

for (const slug of slugs) {
  const file = EXTENSIONS.map((ext) => `${slug}.${ext}`).find((name) => files.includes(name));
  if (file) found[slug] = file;
  else missing.push(slug);
}

console.log(`Pasta: public/themes/south-park/  (${Object.keys(found).length} de ${slugs.length} personagens)\n`);
for (const slug of slugs) {
  console.log(`  ${found[slug] ? "✔" : "·"} ${slug.padEnd(20)} ${found[slug] ?? `faltando — adicione ${slug}.png`}`);
}

if (checkOnly) {
  const generated = previousLicenses();
  const broken = Object.keys(generated).filter((slug) => !found[slug]);
  const unsynced = Object.keys(found).filter((slug) => !(slug in generated));
  if (broken.length) console.error(`\nNo mapa, mas sem arquivo: ${broken.join(", ")}. Rode npm run images:sync.`);
  if (unsynced.length) console.error(`\nArquivo presente, mas fora do mapa: ${unsynced.join(", ")}. Rode npm run images:sync -- --license "...".`);
  process.exit(broken.length || unsynced.length ? 1 : 0);
}

const needsLicense = Object.keys(found).filter((slug) => !previous[slug]);
if (needsLicense.length && !licenseArg) {
  console.error(
    `\nInforme a origem/licença das imagens novas (${needsLicense.join(", ")}):\n` +
      `  npm run images:sync -- --license "origem e termos da licença"`,
  );
  process.exit(1);
}

const entries = Object.entries(found).map(([slug, file]) => {
  const license = licenseArg ?? previous[slug];
  return `  ${JSON.stringify(slug)}: { file: ${JSON.stringify(file)}, license: ${JSON.stringify(license)} },`;
});

writeFileSync(
  GENERATED,
  [
    "// Arquivo gerado por `npm run images:sync`. Não edite à mão.",
    "// Imagens de personagens fornecidas pelo responsável do projeto, em public/themes/south-park/.",
    "",
    "export const generatedCharacterImages: Readonly<Record<string, { readonly file: string; readonly license: string }>> = {",
    ...entries,
    "};",
    "",
  ].join("\n"),
);
console.log(`\nMapa atualizado: src/themes/south-park/images.generated.ts (${entries.length} imagens).`);
if (missing.length) console.log(`Sem imagem (usam o avatar genérico): ${missing.length}.`);
