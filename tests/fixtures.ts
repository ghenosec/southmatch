import type {
  AnswerDefinition,
  AxisBand,
  AxisDefinition,
  QuestionDefinition,
  UserAnswers,
} from "@/core/types";

export const scale: AnswerDefinition = {
  id: "test-likert",
  options: [
    { id: "sd", label: "Discordo totalmente", value: 0 },
    { id: "d", label: "Discordo", value: 0.25 },
    { id: "n", label: "Neutro", value: 0.5 },
    { id: "a", label: "Concordo", value: 0.75 },
    { id: "sa", label: "Concordo totalmente", value: 1 },
  ],
};

export const OPTION_IDS = scale.options.map((o) => o.id);

const fullBand: AxisBand[] = [
  { min: 0, max: 49, label: "Baixo", description: "Baixo." },
  { min: 50, max: 100, label: "Alto", description: "Alto." },
];

export function makeAxes(count: number, weight = 1): AxisDefinition[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `axis${i}`,
    name: `Eixo ${i}`,
    lowPole: "Baixo",
    highPole: "Alto",
    description: "Eixo de teste.",
    bands: fullBand,
    defaultWeight: weight,
  }));
}

/** `perAxis` perguntas por eixo, alternando direta/invertida. */
export function makeQuestions(axes: readonly AxisDefinition[], perAxis: number): QuestionDefinition[] {
  return axes.flatMap((axis) =>
    Array.from({ length: perAxis }, (_, i) => ({
      id: `${axis.id}-q${i}`,
      text: `Pergunta ${i} do ${axis.id}`,
      axisId: axis.id,
      polarity: i % 2 === 0 ? ("direct" as const) : ("reverse" as const),
      weight: 1,
      group: "g",
    })),
  );
}

export function answerAll(questions: readonly QuestionDefinition[], optionId: string): UserAnswers {
  return Object.fromEntries(questions.map((q) => [q.id, optionId]));
}

/** PRNG determinístico (mulberry32) para cenários simulados reprodutíveis. */
export function seededRandom(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function randomAnswers(
  questions: readonly QuestionDefinition[],
  rand: () => number,
  optionIds: readonly string[] = OPTION_IDS,
): UserAnswers {
  return Object.fromEntries(questions.map((q) => [q.id, optionIds[Math.floor(rand() * optionIds.length)]!]));
}
