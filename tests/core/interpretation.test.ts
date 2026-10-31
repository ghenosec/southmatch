import { describe, expect, it } from "vitest";
import {
  classifyScore,
  dominantAxes,
  EngineError,
  fillTemplate,
  findBand,
  interpretProfile,
  interpretResult,
  rankProfiles,
} from "@/core";
import type { AxisDefinition } from "@/core/types";
import { makeAxes } from "../fixtures";

const axis: AxisDefinition = {
  ...makeAxes(1)[0]!,
  bands: [
    { min: 0, max: 20, label: "Muito baixo", description: "." },
    { min: 21, max: 40, label: "Baixo", description: "." },
    { min: 41, max: 59, label: "Equilibrado", description: "." },
    { min: 60, max: 79, label: "Alto", description: "." },
    { min: 80, max: 100, label: "Muito alto", description: "." },
  ],
};

describe("findBand", () => {
  it("encontra a faixa pelos limites inclusivos", () => {
    expect(findBand(axis, 0).label).toBe("Muito baixo");
    expect(findBand(axis, 20).label).toBe("Muito baixo");
    expect(findBand(axis, 21).label).toBe("Baixo");
    expect(findBand(axis, 100).label).toBe("Muito alto");
  });
  it("valores fracionários entre faixas vão para a mais próxima", () => {
    expect(findBand(axis, 20.4).label).toBe("Muito baixo");
    expect(findBand(axis, 20.6).label).toBe("Baixo");
  });
});

describe("classifyScore", () => {
  it.each([
    [50, "center", "balanced"],
    [59.9, "center", "balanced"],
    [60, "high", "moderate"],
    [75, "high", "strong"],
    [30, "low", "moderate"],
    [5, "low", "strong"],
  ] as const)("%d → %s/%s", (score, direction, intensity) => {
    expect(classifyScore(score)).toEqual({ direction, intensity });
  });
});

describe("integridade das interpretações", () => {
  it("nunca descreve um polo oposto ao da pontuação", () => {
    for (let score = 0; score <= 100; score += 0.5) {
      const [interp] = interpretProfile({ axis0: score }, [axis]);
      if (score < 40) expect(interp!.direction).toBe("low");
      if (score > 60) expect(interp!.direction).toBe("high");
      if (interp!.direction === "high") expect(score).toBeGreaterThan(50);
      if (interp!.direction === "low") expect(score).toBeLessThan(50);
    }
  });

  it("traço em comum exige mesmo lado e diferença pequena", () => {
    const axes = makeAxes(4);
    const user = { axis0: 80, axis1: 52, axis2: 20, axis3: 70 };
    const profile = { axis0: 75, axis1: 48, axis2: 85, axis3: 40 };
    const [winner] = rankProfiles(user, [{ id: "p", scores: profile }], axes);
    const result = interpretResult(user, winner!, profile, axes);
    const rel = Object.fromEntries(result.winner.axes.map((a) => [a.axisId, a.relation]));
    expect(rel).toEqual({ axis0: "shared", axis1: "shared", axis2: "opposite", axis3: "different" });
    expect(result.winner.sharedAxes).toEqual(["axis1", "axis0"]);
    expect(result.winner.differentAxes).toEqual(["axis2", "axis3"]);
  });

  it("eixos dominantes ignoram os equilibrados e ordenam pela força", () => {
    const axes = makeAxes(3);
    const interp = interpretProfile({ axis0: 52, axis1: 10, axis2: 70 }, axes);
    expect(dominantAxes(interp)).toEqual(["axis1", "axis2"]);
  });
});

describe("fillTemplate", () => {
  it("substitui variáveis", () => {
    expect(fillTemplate("Você e {name} têm {n}% de afinidade.", { name: "Ana", n: 87 })).toBe(
      "Você e Ana têm 87% de afinidade.",
    );
  });
  it("não interpreta HTML: apenas texto", () => {
    expect(fillTemplate("{x}", { x: "<b>oi</b>" })).toBe("<b>oi</b>");
  });
  it("falha se faltar variável", () => {
    expect(() => fillTemplate("{faltando}", {})).toThrow(EngineError);
  });
});
