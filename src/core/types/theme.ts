/**
 * Contrato de dados de um tema.
 *
 * Um tema é um pacote de conteúdo. Ele importa tipos do motor,
 * mas nunca contém regras de pontuação.
 */
import type {
  AnswerDefinition,
  AxisDefinition,
  AxisScores,
  ProfileDefinition,
  QuestionDefinition,
  TraitDirection,
} from "./engine";

/** Textos de explicação de um eixo, por direção do traço (low/center/high). */
export interface AxisExplanationTexts {
  /** Traço em comum com um personagem. Pode usar a variável `{name}`. */
  readonly shared: Readonly<Record<TraitDirection, string>>;
  /** Ponto forte associado a cada direção. */
  readonly strength: Readonly<Record<TraitDirection, string>>;
}

/** Seção do perfil comportamental, composta por um ou mais eixos. */
export interface ProfileSectionDefinition {
  readonly id: string;
  readonly title: string;
  readonly axisIds: readonly string[];
}

/** Regra de combinação: o texto aparece quando todas as condições valem. */
export interface CombinationRule {
  readonly id: string;
  readonly when: readonly { readonly axisId: string; readonly direction: "low" | "high" }[];
  readonly text: string;
}

export interface ThemeExplanations {
  readonly axes: Readonly<Record<string, AxisExplanationTexts>>;
  readonly sections: readonly ProfileSectionDefinition[];
  readonly contradictions: readonly CombinationRule[];
  /** Exibido quando nenhuma regra de contradição se aplica. */
  readonly noContradictions: string;
  /** Exibido quando o perfil do usuário é muito equilibrado. */
  readonly balancedProfile: string;
}

/** Referência de imagem. `src` nulo = usar placeholder gerado. */
export interface ImageReference {
  readonly src: string | null;
  readonly alt: string;
  /** Crédito opcional da ilustração (ex.: artista da fan-art). */
  readonly credit: string | null;
}

/** Conteúdo exibido na página de resultado para um personagem. */
export interface CharacterResultContent {
  /** Título do resultado (ex.: "Você é mais parecido com X!"). */
  readonly headline: string;
  /** Parágrafo de abertura do resultado. */
  readonly summary: string;
}

/** Quanto material da obra sustenta o perfil (transparência editorial). */
export type ProfileConfidence = "high" | "medium" | "low";

export interface CharacterDefinition extends ProfileDefinition {
  readonly name: string;
  readonly slug: string;
  readonly shortDescription: string;
  readonly longDescription: string;
  readonly traits: readonly string[];
  readonly strengths: readonly string[];
  readonly limitations: readonly string[];
  readonly contradictions: readonly string[];
  readonly scores: AxisScores;
  /** Por que estes valores foram atribuídos (auditoria editorial). */
  readonly editorialRationale: string;
  /** Confiança editorial do perfil (opcional). */
  readonly confidence?: ProfileConfidence;
  /** Cor temática em hexadecimal (#rrggbb). */
  readonly color: string;
  readonly image: ImageReference;
  readonly result: CharacterResultContent;
}

/** Tokens visuais do tema. A interface lê estes valores, sem cores fixas. */
export interface ThemeVisualConfig {
  readonly colors: {
    readonly primary: string;
    readonly primaryContrast: string;
    readonly surface: string;
    readonly ink: string;
    readonly accent: string;
    readonly highlight: string;
    readonly muted: string;
  };
}

/** Textos de interface específicos do tema. */
export interface ThemeTexts {
  readonly title: string;
  readonly subtitle: string;
  readonly intro: string;
  /** Aviso legal / de independência. */
  readonly disclaimer: string;
}

export interface ThemeVersions {
  /** Versão do formato de dados que o tema segue. */
  readonly dataFormat: number;
  /** Versão editorial dos perfis. Mude sempre que valores mudarem. */
  readonly profiles: string;
}

export interface ThemeDefinition {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly locale: string;
  readonly versions: ThemeVersions;
  /** Temas não listados ficam fora da interface (ex.: tema de testes). */
  readonly listed: boolean;
  readonly visual: ThemeVisualConfig;
  readonly texts: ThemeTexts;
  readonly scale: AnswerDefinition;
  readonly axes: readonly AxisDefinition[];
  readonly questions: readonly QuestionDefinition[];
  readonly characters: readonly CharacterDefinition[];
  /** Textos para explicações personalizadas. Opcional: sem eles, só faixas são usadas. */
  readonly explanations?: ThemeExplanations;
}
