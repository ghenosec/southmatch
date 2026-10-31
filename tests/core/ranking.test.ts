import { describe, expect, it } from "vitest";
import { EngineError, rankProfiles, runQuiz } from "@/core";
import { makeAxes, makeQuestions, randomAnswers, scale, seededRandom } from "../fixtures";

const axes = makeAxes(2);

describe("rankProfiles", () => {
  it("ordena da maior para a menor afinidade e numera posições", () => {
    const ranking = rankProfiles(
      { axis0: 80, axis1: 20 },
      [
        { id: "far", scores: { axis0: 0, axis1: 100 } },
        { id: "near", scores: { axis0: 75, axis1: 25 } },
        { id: "mid", scores: { axis0: 50, axis1: 50 } },
      ],
      axes,
    );
    expect(ranking.map((r) => r.profileId)).toEqual(["near", "mid", "far"]);
    expect(ranking.map((r) => r.rank)).toEqual([1, 2, 3]);
  });

  it("desempata pela menor diferença máxima em um eixo", () => {
    // Empate exato com 4 eixos: diferenças (20,0,0,0) e (10,10,10,10)
    // dão a mesma distância: sqrt(400/4) = sqrt(400/4) = 10.
    const four = makeAxes(4);
    const user = { axis0: 50, axis1: 50, axis2: 50, axis3: 50 };
    const ranking = rankProfiles(
      user,
      [
        { id: "a-spiky", scores: { axis0: 70, axis1: 50, axis2: 50, axis3: 50 } },
        { id: "z-even", scores: { axis0: 60, axis1: 60, axis2: 60, axis3: 60 } },
      ],
      four,
    );
    expect(ranking[0]!.affinity).toBeCloseTo(ranking[1]!.affinity, 12);
    expect(ranking[0]!.profileId).toBe("z-even");
  });

  it("desempata por ID quando tudo é igual", () => {
    const same = { axis0: 40, axis1: 60 };
    const ranking = rankProfiles({ axis0: 50, axis1: 50 }, [
      { id: "beta", scores: same },
      { id: "alpha", scores: same },
    ], axes);
    expect(ranking.map((r) => r.profileId)).toEqual(["alpha", "beta"]);
  });

  it("não depende da ordem de entrada dos perfis", () => {
    const profiles = [
      { id: "p1", scores: { axis0: 10, axis1: 90 } },
      { id: "p2", scores: { axis0: 60, axis1: 40 } },
      { id: "p3", scores: { axis0: 60, axis1: 40 } },
      { id: "p4", scores: { axis0: 95, axis1: 5 } },
    ];
    const user = { axis0: 55, axis1: 45 };
    const a = rankProfiles(user, profiles, axes).map((r) => r.profileId);
    const b = rankProfiles(user, [...profiles].reverse(), axes).map((r) => r.profileId);
    expect(a).toEqual(b);
  });

  it("lista eixos mais próximos e mais distantes", () => {
    const [r] = rankProfiles({ axis0: 50, axis1: 50 }, [{ id: "x", scores: { axis0: 55, axis1: 90 } }], axes);
    expect(r!.closestAxes).toEqual(["axis0", "axis1"]);
    expect(r!.furthestAxes).toEqual(["axis1", "axis0"]);
  });

  it("rejeita lista vazia e IDs duplicados", () => {
    expect(() => rankProfiles({ axis0: 1, axis1: 1 }, [], axes)).toThrow(EngineError);
    const p = { id: "dup", scores: { axis0: 1, axis1: 1 } };
    expect(() => rankProfiles({ axis0: 1, axis1: 1 }, [p, p], axes)).toThrow(EngineError);
  });
});

describe("runQuiz", () => {
  const ax = makeAxes(3);
  const questions = makeQuestions(ax, 3);
  const profiles = [
    { id: "low", scores: { axis0: 10, axis1: 10, axis2: 10 } },
    { id: "mid", scores: { axis0: 50, axis1: 50, axis2: 50 } },
    { id: "high", scores: { axis0: 90, axis1: 90, axis2: 90 } },
  ];

  it("é determinístico: mesmas entradas, mesmo resultado", () => {
    const answers = randomAnswers(questions, seededRandom(7));
    const input = { answers, axes: ax, questions, scale, profiles };
    expect(runQuiz(input)).toEqual(runQuiz(input));
  });

  it("não depende da ordem de exibição das perguntas", () => {
    const answers = randomAnswers(questions, seededRandom(9));
    const a = runQuiz({ answers, axes: ax, questions, scale, profiles });
    const b = runQuiz({ answers, axes: ax, questions: [...questions].reverse(), scale, profiles });
    expect(a.user.scores).toEqual(b.user.scores);
    expect(a.ranking.map((r) => r.profileId)).toEqual(b.ranking.map((r) => r.profileId));
  });

  it("retorna vencedor, top N e versões", () => {
    const answers = Object.fromEntries(questions.map((q) => [q.id, "n"]));
    const result = runQuiz({ answers, axes: ax, questions, scale, profiles, topCount: 2 });
    expect(result.winner.profileId).toBe("mid");
    expect(result.winner.affinity).toBe(100);
    expect(result.top).toHaveLength(2);
    expect(result.ranking).toHaveLength(3);
    expect(result.versions).toEqual({ dataFormat: 1, algorithm: 1 });
  });

  it("rejeita topCount inválido", () => {
    const answers = Object.fromEntries(questions.map((q) => [q.id, "n"]));
    expect(() => runQuiz({ answers, axes: ax, questions, scale, profiles, topCount: 0 })).toThrow(EngineError);
  });
});
