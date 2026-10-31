import { describe, expect, it } from "vitest";
import {
  affinityFromDistance,
  compareAxes,
  EngineError,
  resolveAxisWeights,
  weightedDistance,
} from "@/core";
import { makeAxes, seededRandom } from "../fixtures";

const axes = makeAxes(2);

describe("weightedDistance", () => {
  it("é zero para perfis idênticos", () => {
    expect(weightedDistance({ axis0: 30, axis1: 70 }, { axis0: 30, axis1: 70 }, axes)).toBe(0);
  });

  it("é 1 para extremos opostos em todos os eixos", () => {
    expect(weightedDistance({ axis0: 0, axis1: 100 }, { axis0: 100, axis1: 0 }, axes)).toBe(1);
  });

  it("segue a fórmula com pesos iguais", () => {
    // sqrt((40² + 0²) / 2) / 100 = sqrt(800)/100
    const d = weightedDistance({ axis0: 50, axis1: 50 }, { axis0: 90, axis1: 50 }, axes);
    expect(d).toBeCloseTo(Math.sqrt(800) / 100, 12);
  });

  it("aplica pesos por eixo", () => {
    // pesos 3 e 1: sqrt((3×40²) / 4) / 100
    const d = weightedDistance({ axis0: 50, axis1: 50 }, { axis0: 90, axis1: 50 }, axes, { axis0: 3, axis1: 1 });
    expect(d).toBeCloseTo(Math.sqrt((3 * 1600) / 4) / 100, 12);
  });

  it("é simétrica", () => {
    const a = { axis0: 12, axis1: 88 };
    const b = { axis0: 61, axis1: 40 };
    expect(weightedDistance(a, b, axes)).toBe(weightedDistance(b, a, axes));
  });

  it("rejeita pontuações fora de 0–100 ou ausentes", () => {
    expect(() => weightedDistance({ axis0: 101, axis1: 0 }, { axis0: 0, axis1: 0 }, axes)).toThrow(EngineError);
    expect(() => weightedDistance({ axis0: 10 }, { axis0: 0, axis1: 0 }, axes)).toThrow(EngineError);
  });
});

describe("resolveAxisWeights", () => {
  it("usa defaultWeight e aceita sobrescrita", () => {
    expect(resolveAxisWeights(axes, { axis1: 2 })).toEqual({ axis0: 1, axis1: 2 });
  });
  it("rejeita peso negativo e soma zero", () => {
    expect(() => resolveAxisWeights(axes, { axis0: -1 })).toThrow(EngineError);
    expect(() => resolveAxisWeights(axes, { axis0: 0, axis1: 0 })).toThrow(EngineError);
  });
});

describe("affinityFromDistance", () => {
  it("converte distância em afinidade", () => {
    expect(affinityFromDistance(0)).toBe(100);
    expect(affinityFromDistance(1)).toBe(0);
    expect(affinityFromDistance(0.13)).toBeCloseTo(87, 10);
  });
  it("rejeita NaN", () => {
    expect(() => affinityFromDistance(Number.NaN)).toThrow(EngineError);
  });
  it("fica entre 0 e 100 para 10.000 pares aleatórios", () => {
    const rand = seededRandom(42);
    const many = makeAxes(9);
    const vec = () => Object.fromEntries(many.map((a) => [a.id, rand() * 100]));
    for (let i = 0; i < 10_000; i++) {
      const aff = affinityFromDistance(weightedDistance(vec(), vec(), many));
      expect(aff).toBeGreaterThanOrEqual(0);
      expect(aff).toBeLessThanOrEqual(100);
    }
  });
});

describe("compareAxes", () => {
  it("calcula diferença com sinal, absoluta e similaridade", () => {
    const [first] = compareAxes({ axis0: 30, axis1: 50 }, { axis0: 70, axis1: 50 }, axes);
    expect(first).toEqual({
      axisId: "axis0",
      userScore: 30,
      profileScore: 70,
      difference: -40,
      absoluteDifference: 40,
      similarity: 60,
    });
  });
});
