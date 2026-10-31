import { isFiniteNumber } from "../math";
import type {
  AnswerDefinition,
  AxisDefinition,
  ProfileDefinition,
  QuestionDefinition,
  ThemeDefinition,
  UserAnswers,
} from "../types";
import { DATA_FORMAT_VERSION } from "../version";

export interface ValidationIssue {
  readonly path: string;
  readonly message: string;
}

export interface ValidationReport {
  readonly valid: boolean;
  readonly issues: readonly ValidationIssue[];
}

function report(issues: ValidationIssue[]): ValidationReport {
  return { valid: issues.length === 0, issues };
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function checkUniqueIds(items: readonly { id: string }[], path: string, issues: ValidationIssue[]) {
  const seen = new Set<string>();
  items.forEach((item, i) => {
    if (!isNonEmptyString(item.id)) issues.push({ path: `${path}[${i}].id`, message: "ID vazio." });
    else if (seen.has(item.id)) issues.push({ path: `${path}[${i}].id`, message: `ID duplicado "${item.id}".` });
    seen.add(item.id);
  });
}

export function validateAxes(axes: readonly AxisDefinition[]): ValidationReport {
  const issues: ValidationIssue[] = [];
  if (axes.length === 0) issues.push({ path: "axes", message: "É preciso pelo menos um eixo." });
  checkUniqueIds(axes, "axes", issues);

  axes.forEach((axis, i) => {
    const p = `axes[${i}]`;
    for (const key of ["name", "lowPole", "highPole", "description"] as const) {
      if (!isNonEmptyString(axis[key])) issues.push({ path: `${p}.${key}`, message: "Texto obrigatório." });
    }
    if (!isFiniteNumber(axis.defaultWeight) || axis.defaultWeight <= 0) {
      issues.push({ path: `${p}.defaultWeight`, message: "Peso deve ser um número maior que zero." });
    }
    // Faixas: ordenadas, contíguas (inteiros), cobrindo 0–100.
    const bands = [...axis.bands].sort((a, b) => a.min - b.min);
    if (bands.length === 0) {
      issues.push({ path: `${p}.bands`, message: "É preciso pelo menos uma faixa." });
      return;
    }
    if (bands[0]!.min !== 0) issues.push({ path: `${p}.bands`, message: "A primeira faixa deve começar em 0." });
    if (bands[bands.length - 1]!.max !== 100) {
      issues.push({ path: `${p}.bands`, message: "A última faixa deve terminar em 100." });
    }
    bands.forEach((band, j) => {
      if (!(band.min <= band.max)) issues.push({ path: `${p}.bands[${j}]`, message: "min maior que max." });
      if (!isNonEmptyString(band.label) || !isNonEmptyString(band.description)) {
        issues.push({ path: `${p}.bands[${j}]`, message: "Faixa sem rótulo ou descrição." });
      }
      const next = bands[j + 1];
      if (next && next.min !== band.max + 1) {
        issues.push({ path: `${p}.bands[${j}]`, message: "Faixas com lacuna ou sobreposição." });
      }
    });
  });
  return report(issues);
}

export function validateScale(scale: AnswerDefinition): ValidationReport {
  const issues: ValidationIssue[] = [];
  if (scale.options.length < 2) issues.push({ path: "scale.options", message: "A escala precisa de 2+ opções." });
  checkUniqueIds(scale.options, "scale.options", issues);
  scale.options.forEach((o, i) => {
    if (!isFiniteNumber(o.value) || o.value < 0 || o.value > 1) {
      issues.push({ path: `scale.options[${i}].value`, message: "Valor deve estar entre 0 e 1." });
    }
    if (!isNonEmptyString(o.label)) issues.push({ path: `scale.options[${i}].label`, message: "Rótulo obrigatório." });
  });
  return report(issues);
}

export function validateQuestions(
  questions: readonly QuestionDefinition[],
  axes: readonly AxisDefinition[],
): ValidationReport {
  const issues: ValidationIssue[] = [];
  const axisIds = new Set(axes.map((a) => a.id));
  if (questions.length === 0) issues.push({ path: "questions", message: "É preciso pelo menos uma pergunta." });
  checkUniqueIds(questions, "questions", issues);

  const texts = new Set<string>();
  questions.forEach((q, i) => {
    const p = `questions[${i}]`;
    if (!isNonEmptyString(q.text)) issues.push({ path: `${p}.text`, message: "Texto obrigatório." });
    const normalized = q.text.trim().toLowerCase();
    if (texts.has(normalized)) issues.push({ path: `${p}.text`, message: "Texto repetido." });
    texts.add(normalized);
    if (!axisIds.has(q.axisId)) issues.push({ path: `${p}.axisId`, message: `Eixo inexistente "${q.axisId}".` });
    if (q.polarity !== "direct" && q.polarity !== "reverse") {
      issues.push({ path: `${p}.polarity`, message: "Polaridade deve ser 'direct' ou 'reverse'." });
    }
    if (!isFiniteNumber(q.weight) || q.weight <= 0) {
      issues.push({ path: `${p}.weight`, message: "Peso deve ser maior que zero." });
    }
    if (!isNonEmptyString(q.group)) issues.push({ path: `${p}.group`, message: "Grupo obrigatório." });
  });

  for (const axis of axes) {
    if (!questions.some((q) => q.axisId === axis.id)) {
      issues.push({ path: "questions", message: `O eixo "${axis.id}" não tem perguntas.` });
    }
  }
  return report(issues);
}

export function validateProfiles(
  profiles: readonly ProfileDefinition[],
  axes: readonly AxisDefinition[],
): ValidationReport {
  const issues: ValidationIssue[] = [];
  const axisIds = new Set(axes.map((a) => a.id));
  if (profiles.length === 0) issues.push({ path: "profiles", message: "É preciso pelo menos um perfil." });
  checkUniqueIds(profiles, "profiles", issues);

  profiles.forEach((profile, i) => {
    const p = `profiles[${i}].scores`;
    for (const axis of axes) {
      const value = Object.hasOwn(profile.scores, axis.id) ? profile.scores[axis.id] : undefined;
      if (!isFiniteNumber(value) || value < 0 || value > 100) {
        issues.push({ path: `${p}.${axis.id}`, message: "Valor deve estar entre 0 e 100." });
      }
    }
    for (const key of Object.keys(profile.scores)) {
      if (!axisIds.has(key)) issues.push({ path: `${p}.${key}`, message: "Eixo não definido no tema." });
    }
  });
  return report(issues);
}

const HEX_COLOR = /^#[0-9a-f]{6}$/i;
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** Valida um tema completo: estrutura, referências e conteúdo obrigatório. */
export function validateTheme(theme: ThemeDefinition): ValidationReport {
  const issues: ValidationIssue[] = [];
  if (!isNonEmptyString(theme.id) || !SLUG.test(theme.id)) {
    issues.push({ path: "id", message: "ID do tema deve ser um slug (a-z, 0-9, hífen)." });
  }
  if (!isNonEmptyString(theme.name)) issues.push({ path: "name", message: "Nome obrigatório." });
  if (theme.versions.dataFormat !== DATA_FORMAT_VERSION) {
    issues.push({
      path: "versions.dataFormat",
      message: `Tema usa formato ${theme.versions.dataFormat}; o motor suporta ${DATA_FORMAT_VERSION}.`,
    });
  }
  if (!isNonEmptyString(theme.versions.profiles)) {
    issues.push({ path: "versions.profiles", message: "Versão editorial dos perfis obrigatória." });
  }

  issues.push(
    ...validateAxes(theme.axes).issues,
    ...validateScale(theme.scale).issues,
    ...validateQuestions(theme.questions, theme.axes).issues,
    ...validateProfiles(theme.characters, theme.axes).issues,
  );

  const slugs = new Set<string>();
  theme.characters.forEach((c, i) => {
    const p = `characters[${i}]`;
    if (!SLUG.test(c.slug)) issues.push({ path: `${p}.slug`, message: "Slug inválido." });
    if (slugs.has(c.slug)) issues.push({ path: `${p}.slug`, message: `Slug duplicado "${c.slug}".` });
    slugs.add(c.slug);
    for (const key of ["name", "shortDescription", "longDescription", "editorialRationale"] as const) {
      if (!isNonEmptyString(c[key])) issues.push({ path: `${p}.${key}`, message: "Texto obrigatório." });
    }
    for (const key of ["traits", "strengths", "limitations", "contradictions"] as const) {
      if (c[key].length === 0 || !c[key].every(isNonEmptyString)) {
        issues.push({ path: `${p}.${key}`, message: "Lista obrigatória sem itens vazios." });
      }
    }
    if (!HEX_COLOR.test(c.color)) issues.push({ path: `${p}.color`, message: "Cor deve ser #rrggbb." });
    if (!isNonEmptyString(c.image.alt)) issues.push({ path: `${p}.image.alt`, message: "Texto alternativo obrigatório." });
    if (c.image.src !== null && !isNonEmptyString(c.image.license)) {
      issues.push({ path: `${p}.image.license`, message: "Imagem sem licença registrada." });
    }
    if (!isNonEmptyString(c.result.headline) || !isNonEmptyString(c.result.summary)) {
      issues.push({ path: `${p}.result`, message: "Conteúdo de resultado obrigatório." });
    }
  });

  for (const [key, value] of Object.entries(theme.visual.colors)) {
    if (!HEX_COLOR.test(value)) issues.push({ path: `visual.colors.${key}`, message: "Cor deve ser #rrggbb." });
  }
  return report(issues);
}

/**
 * Valida respostas vindas de fora (ex.: armazenamento local).
 * Aceita respostas parciais; rejeita perguntas ou opções desconhecidas.
 */
export function validateAnswers(
  answers: unknown,
  questions: readonly QuestionDefinition[],
  scale: AnswerDefinition,
): ValidationReport {
  const issues: ValidationIssue[] = [];
  if (typeof answers !== "object" || answers === null || Array.isArray(answers)) {
    return report([{ path: "answers", message: "Respostas devem ser um objeto." }]);
  }
  const questionIds = new Set(questions.map((q) => q.id));
  const optionIds = new Set(scale.options.map((o) => o.id));
  for (const [questionId, optionId] of Object.entries(answers)) {
    if (!questionIds.has(questionId)) issues.push({ path: `answers.${questionId}`, message: "Pergunta desconhecida." });
    if (typeof optionId !== "string" || !optionIds.has(optionId)) {
      issues.push({ path: `answers.${questionId}`, message: "Opção desconhecida." });
    }
  }
  return report(issues);
}

/** Type guard conveniente para respostas validadas. */
export function isValidAnswers(
  answers: unknown,
  questions: readonly QuestionDefinition[],
  scale: AnswerDefinition,
): answers is UserAnswers {
  return validateAnswers(answers, questions, scale).valid;
}
