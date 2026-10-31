import { EngineError } from "../errors";
import type {
  AnswerDefinition,
  AxisCoverage,
  AxisDefinition,
  AxisId,
  Polarity,
  QuestionDefinition,
  UserAnswers,
  UserProfile,
} from "../types";
import { clamp, isFiniteNumber } from "../math";

/** Converte o ID de uma opção em seu valor normalizado (0–1). */
export function normalizeAnswer(optionId: string, scale: AnswerDefinition): number {
  const option = scale.options.find((o) => o.id === optionId);
  if (!option) {
    throw new EngineError("UNKNOWN_OPTION", `Opção de resposta desconhecida: "${optionId}".`);
  }
  if (!isFiniteNumber(option.value) || option.value < 0 || option.value > 1) {
    throw new EngineError("INVALID_OPTION_VALUE", `Valor inválido na opção "${optionId}".`);
  }
  return option.value;
}

/** Aplica a polaridade: perguntas invertidas usam 1 − valor. */
export function applyPolarity(value: number, polarity: Polarity): number {
  return polarity === "reverse" ? 1 - value : value;
}

export interface ScoreOptions {
  /**
   * Quando verdadeiro, lança erro se alguma pergunta estiver sem resposta.
   * Padrão: verdadeiro.
   */
  readonly requireComplete?: boolean;
}

/**
 * Calcula o perfil do usuário.
 *
 * eixo = 100 × Σ(valor_ajustado × peso) / Σ(peso), só com perguntas respondidas.
 */
export function computeUserProfile(
  answers: UserAnswers,
  questions: readonly QuestionDefinition[],
  axes: readonly AxisDefinition[],
  scale: AnswerDefinition,
  options: ScoreOptions = {},
): UserProfile {
  const requireComplete = options.requireComplete ?? true;
  if (axes.length === 0) {
    throw new EngineError("NO_AXES", "Nenhum eixo informado.");
  }

  const sums = new Map<AxisId, { weighted: number; weight: number; answered: number; total: number }>();
  for (const axis of axes) {
    sums.set(axis.id, { weighted: 0, weight: 0, answered: 0, total: 0 });
  }

  const missing: string[] = [];
  for (const question of questions) {
    const bucket = sums.get(question.axisId);
    if (!bucket) {
      throw new EngineError(
        "UNKNOWN_AXIS",
        `Pergunta "${question.id}" aponta para eixo inexistente "${question.axisId}".`,
      );
    }
    if (!isFiniteNumber(question.weight) || question.weight <= 0) {
      throw new EngineError("INVALID_WEIGHT", `Peso inválido na pergunta "${question.id}".`);
    }
    bucket.total += 1;

    const optionId = Object.hasOwn(answers, question.id) ? answers[question.id] : undefined;
    if (optionId === undefined) {
      missing.push(question.id);
      continue;
    }
    const adjusted = applyPolarity(normalizeAnswer(optionId, scale), question.polarity);
    bucket.weighted += adjusted * question.weight;
    bucket.weight += question.weight;
    bucket.answered += 1;
  }

  if (requireComplete && missing.length > 0) {
    throw new EngineError("INCOMPLETE_ANSWERS", `Faltam ${missing.length} resposta(s).`);
  }

  const scores: Record<AxisId, number> = {};
  const coverage: Record<AxisId, AxisCoverage> = {};
  for (const axis of axes) {
    const bucket = sums.get(axis.id)!;
    if (bucket.weight === 0) {
      throw new EngineError("AXIS_WITHOUT_ANSWERS", `O eixo "${axis.id}" não tem respostas.`);
    }
    scores[axis.id] = clamp((100 * bucket.weighted) / bucket.weight, 0, 100);
    coverage[axis.id] = { answered: bucket.answered, total: bucket.total };
  }

  return { scores, coverage, missingQuestionIds: missing };
}
