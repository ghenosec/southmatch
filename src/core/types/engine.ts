/**
 * Contratos do motor de personalidade.
 *
 * Tudo aqui é genérico: nenhum tipo conhece um tema específico,
 * a quantidade de eixos, perguntas ou perfis.
 */

/** Identificador de eixo. Cada tema define os seus. */
export type AxisId = string;

/** Faixa interpretativa de um eixo (ex.: 0–20 = "muito reservado"). */
export interface AxisBand {
  /** Limite inferior, inclusivo (0–100). */
  readonly min: number;
  /** Limite superior, inclusivo (0–100). */
  readonly max: number;
  /** Rótulo curto da faixa. */
  readonly label: string;
  /** Texto interpretativo da faixa. */
  readonly description: string;
}

export interface AxisDefinition {
  readonly id: AxisId;
  readonly name: string;
  /** Nome curto para gráficos (opcional; padrão: `name`). */
  readonly shortName?: string;
  /** Rótulo do polo associado ao valor 0. */
  readonly lowPole: string;
  /** Rótulo do polo associado ao valor 100. */
  readonly highPole: string;
  readonly description: string;
  /** Faixas que devem cobrir 0–100 sem lacunas nem sobreposição. */
  readonly bands: readonly AxisBand[];
  /** Peso do eixo no cálculo de afinidade (> 0). */
  readonly defaultWeight: number;
}

/**
 * "direct": concordar puxa o eixo para 100.
 * "reverse": concordar puxa o eixo para 0.
 */
export type Polarity = "direct" | "reverse";

export interface QuestionDefinition {
  /** ID estável. Nunca reutilizar um ID com outro significado. */
  readonly id: string;
  readonly text: string;
  readonly axisId: AxisId;
  readonly polarity: Polarity;
  /** Peso da pergunta dentro do eixo (> 0). */
  readonly weight: number;
  /** Grupo de apresentação. Não interfere no cálculo. */
  readonly group: string;
}

/** Uma opção de resposta da escala. */
export interface AnswerOption {
  /** ID estável da opção (ex.: "agree"). */
  readonly id: string;
  readonly label: string;
  /** Valor normalizado entre 0 e 1. */
  readonly value: number;
}

/** Escala de respostas usada pelas perguntas de um tema. */
export interface AnswerDefinition {
  readonly id: string;
  /** Opções na ordem de exibição. */
  readonly options: readonly AnswerOption[];
}

/** Respostas do usuário: ID da pergunta → ID da opção escolhida. */
export type UserAnswers = Readonly<Record<string, string>>;

/** Vetor de pontuação: ID do eixo → valor entre 0 e 100. */
export type AxisScores = Readonly<Record<AxisId, number>>;

/** Perfil comparável: só o que o motor precisa saber. */
export interface ProfileDefinition {
  readonly id: string;
  readonly scores: AxisScores;
}

/** Pesos opcionais por eixo, sobrepondo `defaultWeight`. */
export type AxisWeights = Readonly<Record<AxisId, number>>;

export interface AxisCoverage {
  readonly answered: number;
  readonly total: number;
}

/** Perfil numérico calculado a partir das respostas. */
export interface UserProfile {
  readonly scores: AxisScores;
  readonly coverage: Readonly<Record<AxisId, AxisCoverage>>;
  /** Perguntas sem resposta (ignoradas no cálculo). */
  readonly missingQuestionIds: readonly string[];
}

/** Comparação de um eixo entre usuário e perfil. */
export interface AxisComparison {
  readonly axisId: AxisId;
  readonly userScore: number;
  readonly profileScore: number;
  /** usuário − perfil (−100 a 100). */
  readonly difference: number;
  /** |diferença| (0 a 100). */
  readonly absoluteDifference: number;
  /** 100 − |diferença|. */
  readonly similarity: number;
}

export interface AffinityResult {
  readonly profileId: string;
  /** Índice de similaridade entre 0 e 100 (não é probabilidade). */
  readonly affinity: number;
  /** Distância normalizada entre 0 e 1. */
  readonly distance: number;
  /** Posição no ranking, começando em 1. */
  readonly rank: number;
  readonly axes: readonly AxisComparison[];
  /** Eixos mais próximos, do mais parecido ao menos parecido. */
  readonly closestAxes: readonly AxisId[];
  /** Eixos mais distantes, do mais diferente ao menos diferente. */
  readonly furthestAxes: readonly AxisId[];
}

export interface EngineVersions {
  readonly dataFormat: number;
  readonly algorithm: number;
}

export interface QuizResult {
  readonly versions: EngineVersions;
  readonly user: UserProfile;
  /** Ranking completo, ordenado da maior para a menor afinidade. */
  readonly ranking: readonly AffinityResult[];
  readonly winner: AffinityResult;
  readonly top: readonly AffinityResult[];
}

/** Intensidade de uma tendência em relação ao centro (50). */
export type TraitIntensity = "balanced" | "moderate" | "strong";

/** Lado do eixo para onde a pontuação aponta. */
export type TraitDirection = "low" | "center" | "high";

export interface AxisInterpretation {
  readonly axisId: AxisId;
  readonly score: number;
  readonly band: AxisBand;
  readonly direction: TraitDirection;
  readonly intensity: TraitIntensity;
}

/** Relação de um eixo entre usuário e perfil, para explicações. */
export type AxisRelation = "shared" | "close" | "different" | "opposite";

export interface ComparisonInterpretation {
  readonly profileId: string;
  readonly axes: readonly {
    readonly axisId: AxisId;
    readonly relation: AxisRelation;
    readonly absoluteDifference: number;
    readonly user: AxisInterpretation;
    readonly profile: AxisInterpretation;
  }[];
  /** Eixos em que usuário e perfil apontam para o mesmo lado e estão próximos. */
  readonly sharedAxes: readonly AxisId[];
  /** Eixos com diferença relevante. */
  readonly differentAxes: readonly AxisId[];
}

export interface InterpretationResult {
  /** Interpretação de cada eixo do usuário. */
  readonly user: readonly AxisInterpretation[];
  /** Eixos com tendências mais marcantes, do mais forte ao mais fraco. */
  readonly dominantAxes: readonly AxisId[];
  /** Comparação interpretada com o perfil vencedor. */
  readonly winner: ComparisonInterpretation;
}
