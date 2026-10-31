import { EngineError } from "./errors";
import { rankProfiles } from "./ranking";
import { computeUserProfile } from "./scoring";
import type {
  AnswerDefinition,
  AxisDefinition,
  AxisScores,
  AxisWeights,
  ProfileDefinition,
  QuestionDefinition,
  QuizResult,
  UserAnswers,
  UserProfile,
} from "./types";
import { ALGORITHM_VERSION, DATA_FORMAT_VERSION } from "./version";

export interface RunQuizInput {
  readonly answers: UserAnswers;
  readonly axes: readonly AxisDefinition[];
  readonly questions: readonly QuestionDefinition[];
  readonly scale: AnswerDefinition;
  readonly profiles: readonly ProfileDefinition[];
  /** Sobrescrita opcional dos pesos dos eixos. */
  readonly weights?: AxisWeights;
  /** Quantos resultados entram em `top`. Padrão: 5. */
  readonly topCount?: number;
}

/**
 * Ponto de entrada do motor: respostas → perfil → ranking.
 * Função pura e determinística.
 */
export function runQuiz(input: RunQuizInput): QuizResult {
  const user = computeUserProfile(input.answers, input.questions, input.axes, input.scale);
  return buildResult(user, input.profiles, input.axes, input.weights, input.topCount);
}

export interface ResultFromScoresInput {
  readonly scores: AxisScores;
  readonly axes: readonly AxisDefinition[];
  readonly profiles: readonly ProfileDefinition[];
  readonly weights?: AxisWeights;
  readonly topCount?: number;
}

/**
 * Monta o resultado a partir de um perfil já calculado (ex.: link compartilhado).
 * Não há respostas: a cobertura fica vazia.
 */
export function resultFromScores(input: ResultFromScoresInput): QuizResult {
  const user: UserProfile = { scores: input.scores, coverage: {}, missingQuestionIds: [] };
  return buildResult(user, input.profiles, input.axes, input.weights, input.topCount);
}

function buildResult(
  user: UserProfile,
  profiles: readonly ProfileDefinition[],
  axes: readonly AxisDefinition[],
  weights: AxisWeights | undefined,
  topCount = 5,
): QuizResult {
  if (!Number.isInteger(topCount) || topCount < 1) {
    throw new EngineError("INVALID_TOP_COUNT", "topCount deve ser um inteiro positivo.");
  }
  const ranking = rankProfiles(user.scores, profiles, axes, weights);
  return {
    versions: { dataFormat: DATA_FORMAT_VERSION, algorithm: ALGORITHM_VERSION },
    user,
    ranking,
    winner: ranking[0]!,
    top: ranking.slice(0, topCount),
  };
}
