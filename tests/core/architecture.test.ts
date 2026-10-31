/**
 * Testes arquiteturais: garantem que o motor é independente de temas,
 * de React e do navegador, e que funciona com temas de tamanhos diferentes.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { describe, expect, it } from "vitest";
import { runQuiz, validateTheme } from "@/core";
import { exampleTheme } from "@/themes/example-theme";
import { getAllThemes } from "@/themes/registry";
import { makeAxes, makeQuestions, randomAnswers, scale, seededRandom } from "../fixtures";

const ROOT = join(__dirname, "..", "..");
const CORE = join(ROOT, "src", "core");
const THEMES = join(ROOT, "src", "themes");

function listFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    return statSync(full).isDirectory() ? listFiles(full) : /\.(ts|tsx)$/.test(name) ? [full] : [];
  });
}

const coreFiles = listFiles(CORE).map((file) => ({
  file: relative(ROOT, file),
  source: readFileSync(file, "utf8"),
}));

function importsOf(source: string): string[] {
  return [...source.matchAll(/(?:import|export)[^"']*from\s*["']([^"']+)["']/g)].map((m) => m[1]!);
}

describe("independência do motor (src/core)", () => {
  it("existem arquivos no motor para verificar", () => {
    expect(coreFiles.length).toBeGreaterThan(5);
  });

  it.each(coreFiles)("$file só importa módulos internos do motor", ({ source }) => {
    for (const spec of importsOf(source)) {
      expect(spec, `import proibido: ${spec}`).toMatch(/^\.\.?\//);
    }
  });

  it.each(coreFiles)("$file não usa React, Next, navegador ou rede", ({ source }) => {
    const code = source.replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm, ""); // ignora comentários
    for (const forbidden of [
      /\breact\b/i,
      /\bnext\//,
      /\bwindow\b/,
      /\bdocument\b/,
      /\blocalStorage\b/,
      /\bsessionStorage\b/,
      /\bfetch\(/,
      /\bnavigator\b/,
      /\beval\(/,
      /new Function\(/,
      /Math\.random\(/,
      /Date\.now\(/,
    ]) {
      expect(code).not.toMatch(forbidden);
    }
  });

  it.each(coreFiles)("$file não menciona temas ou personagens", ({ source }) => {
    for (const name of ["south", "park", "cartman", "stan", "kyle", "kenny", "butters", "example-theme"]) {
      expect(source).not.toMatch(new RegExp(`\\b${name}\\b`, "i"));
    }
  });
});

describe("temas não contêm regras de pontuação", () => {
  const themeFiles = listFiles(THEMES).map((f) => ({ file: relative(ROOT, f), source: readFileSync(f, "utf8") }));
  it.each(themeFiles)("$file só importa tipos/versões do motor", ({ source }) => {
    for (const spec of importsOf(source)) {
      if (spec.startsWith("@/core")) expect(spec).toMatch(/^@\/core\/(types|version)$/);
      expect(spec).not.toMatch(/^@\/(components|app|services|lib)/);
    }
  });
});

describe("o mesmo motor processa temas diferentes", () => {
  it("todos os temas registrados são válidos", () => {
    for (const theme of getAllThemes()) {
      expect(validateTheme(theme).issues).toEqual([]);
    }
  });

  it("roda o tema de exemplo (3 eixos, 6 perguntas, 3 personagens)", () => {
    expect(exampleTheme.axes).toHaveLength(3);
    expect(exampleTheme.questions).toHaveLength(6);
    expect(exampleTheme.characters).toHaveLength(3);

    // Respostas que descrevem alguém calmo, organizado e distante.
    const answers = {
      "ex-energy-1": "disagree",
      "ex-energy-2": "agree",
      "ex-order-1": "strongly-agree",
      "ex-order-2": "strongly-disagree",
      "ex-warmth-1": "disagree",
      "ex-warmth-2": "agree",
    };
    const result = runQuiz({
      answers,
      axes: exampleTheme.axes,
      questions: exampleTheme.questions,
      scale: exampleTheme.scale,
      profiles: exampleTheme.characters,
    });
    expect(result.user.scores).toEqual({ energy: 25, order: 100, warmth: 25 });
    expect(result.winner.profileId).toBe("grumpy-robot");
    expect(result.ranking).toHaveLength(3);
  });

  it.each([1, 2, 5, 9, 12])("aceita %d eixo(s) com quantidades variadas de perguntas e perfis", (axisCount) => {
    const axes = makeAxes(axisCount);
    const questions = makeQuestions(axes, 1 + (axisCount % 4));
    const rand = seededRandom(axisCount);
    const profiles = Array.from({ length: axisCount + 2 }, (_, i) => ({
      id: `p${i}`,
      scores: Object.fromEntries(axes.map((a) => [a.id, Math.round(rand() * 100)])),
    }));
    const result = runQuiz({ answers: randomAnswers(questions, rand), axes, questions, scale, profiles });
    expect(Object.keys(result.user.scores)).toHaveLength(axisCount);
    expect(result.ranking).toHaveLength(profiles.length);
  });
});
