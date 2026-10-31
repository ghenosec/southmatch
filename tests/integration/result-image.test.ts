import { describe, expect, it } from "vitest";
import { runQuiz } from "@/core";
import { buildImageContent } from "@/lib/export/result-image";
import { initialsOf } from "@/lib/initials";
import { southParkTheme as theme } from "@/themes/south-park";
import { answersForScores } from "../themes/calibration-helpers";

function result(scores: Record<string, number>) {
  return runQuiz({
    answers: answersForScores(theme, scores),
    axes: theme.axes,
    questions: theme.questions,
    scale: theme.scale,
    profiles: theme.characters,
  });
}

describe("conteúdo da imagem do resultado", () => {
  it("traz projeto, vencedor, afinidade, características, eixos e endereço", () => {
    const butters = theme.characters.find((c) => c.id === "butters")!;
    const c = buildImageContent(theme, result(butters.scores), "https://southmatch.exemplo.test");
    expect(c.brand).toBe("SouthMatch");
    expect(c.winnerName).toBe("Butters Stotch");
    expect(c.affinity).toBe(100);
    expect(c.traits.length).toBeGreaterThan(0);
    expect(c.traits.length).toBeLessThanOrEqual(3);
    expect(c.axes).toHaveLength(9);
    expect(c.url).toBe("southmatch.exemplo.test");
    expect(c.footnote).toMatch(/entretenimento/);
  });

  it("características predominantes são as faixas dos eixos mais marcantes", () => {
    const scores = Object.fromEntries(theme.axes.map((a) => [a.id, 50]));
    scores.humor = 100;
    scores.empathy = 0;
    const c = buildImageContent(theme, result(scores), "http://localhost:3000");
    // Empate (ambos a 50 do centro): mantém a ordem dos eixos no tema.
    expect(c.traits).toEqual(["Muito individualista", "Muito sarcástico"]);
  });

  it("perfil equilibrado não inventa características", () => {
    const c = buildImageContent(theme, result(Object.fromEntries(theme.axes.map((a) => [a.id, 50]))), "x");
    expect(c.traits).toEqual(["Perfil equilibrado"]);
  });

  it("iniciais dos avatares", () => {
    expect(initialsOf("Eric Cartman")).toBe("EC");
    expect(initialsOf("Mr. Garrison")).toBe("MG");
    expect(initialsOf("PC Principal")).toBe("PP");
    expect(initialsOf("Chef")).toBe("C");
  });
});
