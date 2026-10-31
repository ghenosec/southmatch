import { EngineError } from "./errors";
import { rankProfiles } from "./ranking";
import { computeUserProfile } from "./scoring";
import type {
  AnswerDefinition,
  AxisDefinition,
  AxisWeights,
  ProfileDefinition,
  QuestionDefinition,
  QuizResult,
  UserAnswers,
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
  const topCount = input.topCount ?? 5;
  if (!Number.isInteger(topCount) || topCount < 1) {
    throw new EngineError("INVALID_TOP_COUNT", "topCount deve ser um inteiro positivo.");
  }
  const user = computeUserProfile(input.answers, input.questions, input.axes, input.scale);
  const ranking = rankProfiles(user.scores, input.profiles, input.axes, input.weights);
  return {
    versions: { dataFormat: DATA_FORMAT_VERSION, algorithm: ALGORITHM_VERSION },
    user,
    ranking,
    winner: ranking[0]!,
    top: ranking.slice(0, topCount),
  };
}
