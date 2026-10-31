import type { Polarity, QuestionDefinition } from "@/core/types";

/**
 * As 45 afirmações (5 por eixo), originais, em pt-BR.
 *
 * "direct": concordar puxa o eixo para o polo 100.
 * "reverse": concordar puxa o eixo para o polo 0.
 *
 * Os IDs são estáveis: nunca reutilize um ID para outra frase.
 * A auditoria editorial está em docs/QUESTION_AUDIT.md.
 */
type Item = readonly [id: string, text: string, polarity: Polarity];

const byAxis: Readonly<Record<string, readonly Item[]>> = {
  sociability: [
    ["soc-1", "Prefiro passar meu tempo com um grupo de pessoas do que ficar sozinho.", "direct"],
    ["soc-2", "Depois de um dia cheio de gente, preciso de um tempo sozinho para recarregar.", "reverse"],
    ["soc-3", "Em uma festa, costumo puxar conversa com pessoas que não conheço.", "direct"],
    ["soc-4", "Em um grupo, prefiro ouvir a falar.", "reverse"],
    ["soc-5", "Fico animado quando um plano de fim de semana envolve muita gente.", "direct"],
  ],
  empathy: [
    ["emp-1", "Quando alguém está passando por dificuldades, costumo me colocar no lugar dessa pessoa.", "direct"],
    ["emp-2", "Cada um deve resolver os próprios problemas sem esperar ajuda dos outros.", "reverse"],
    ["emp-3", "Percebo rapidamente quando alguém ao meu redor está chateado.", "direct"],
    ["emp-4", "Se uma decisão me beneficia, não me preocupo muito com quem sai prejudicado.", "reverse"],
    ["emp-5", "Histórias tristes de desconhecidos raramente mexem comigo.", "reverse"],
  ],
  authority: [
    ["aut-1", "Se considero uma regra injusta, tenho dificuldade em simplesmente obedecê-la.", "reverse"],
    ["aut-2", "Sigo as regras mesmo quando ninguém está olhando.", "direct"],
    ["aut-3", "Respeito a decisão de quem está no comando, mesmo quando discordo dela.", "direct"],
    ["aut-4", "Gosto de testar até onde posso ir antes de levar uma bronca.", "reverse"],
    ["aut-5", "Cumprir horários e combinados é muito importante para mim.", "direct"],
  ],
  decision: [
    ["dec-1", "Antes de tomar uma decisão importante, costumo analisar as possíveis consequências.", "direct"],
    ["dec-2", "Costumo agir primeiro e pensar depois.", "reverse"],
    ["dec-3", "Gosto de comparar várias opções antes de escolher uma.", "direct"],
    ["dec-4", "Muitas vezes compro coisas por impulso.", "reverse"],
    ["dec-5", "Quando uma ideia me empolga, começo a colocá-la em prática na mesma hora.", "reverse"],
  ],
  conflict: [
    ["con-1", "Não tenho medo de confrontar alguém quando discordo de suas atitudes.", "direct"],
    ["con-2", "Prefiro deixar uma discussão de lado a correr o risco de brigar.", "reverse"],
    ["con-3", "Defendo minha opinião com firmeza, mesmo quando todos pensam diferente.", "direct"],
    ["con-4", "Quando meus amigos brigam, costumo ser quem tenta acalmar os ânimos.", "reverse"],
    ["con-5", "Quando alguém me provoca, costumo responder à altura.", "direct"],
  ],
  ambition: [
    ["amb-1", "Gosto de competir e alcançar objetivos que outras pessoas consideram difíceis.", "direct"],
    ["amb-2", "Para mim, ter uma vida tranquila é mais importante do que ter sucesso.", "reverse"],
    ["amb-3", "Tenho planos claros sobre onde quero chegar nos próximos anos.", "direct"],
    ["amb-4", "Não me incomodo em ficar em segundo lugar.", "reverse"],
    ["amb-5", "Raramente penso em conquistar reconhecimento.", "reverse"],
  ],
  humor: [
    ["hum-1", "Costumo usar sarcasmo para tornar conversas mais divertidas.", "direct"],
    ["hum-2", "Prefiro uma conversa séria a uma conversa cheia de piadas.", "reverse"],
    ["hum-3", "Acho graça em piadas que outras pessoas consideram de mau gosto.", "direct"],
    ["hum-4", "Fico incomodado quando alguém faz piada com um assunto sério.", "reverse"],
    ["hum-5", "Muitas vezes faço uma piada para sair de uma situação constrangedora.", "direct"],
  ],
  loyalty: [
    ["loy-1", "Mesmo quando discordo de um amigo, tento permanecer ao lado dele.", "direct"],
    ["loy-2", "Se meu grupo toma uma decisão que considero errada, sigo meu próprio caminho.", "reverse"],
    ["loy-3", "Faço sacrifícios pessoais pelo bem dos meus amigos.", "direct"],
    ["loy-4", "Prefiro resolver as coisas sozinho a depender de um grupo.", "reverse"],
    ["loy-5", "Troco de turma com facilidade quando algo deixa de me agradar.", "reverse"],
  ],
  worldview: [
    ["wor-1", "Para mim, uma solução prática geralmente vale mais do que uma ideia bonita.", "direct"],
    ["wor-2", "Vale a pena lutar por uma causa mesmo quando a chance de vitória é pequena.", "reverse"],
    ["wor-3", "Às vezes é preciso abrir mão de princípios para conseguir resultados.", "direct"],
    ["wor-4", "Acredito que o mundo pode melhorar muito se as pessoas se esforçarem.", "reverse"],
    ["wor-5", "Desconfio de discursos que prometem mudar o mundo.", "direct"],
  ],
};

/** Ordem dos eixos dentro de cada rodada de apresentação. */
const AXIS_ORDER = [
  "sociability",
  "empathy",
  "authority",
  "decision",
  "conflict",
  "ambition",
  "humor",
  "loyalty",
  "worldview",
] as const;

/**
 * Apresentação intercalada: a rodada N traz a N-ésima afirmação de cada eixo,
 * para que perguntas do mesmo eixo não apareçam em sequência.
 * A ordem não afeta o cálculo (o motor agrega por eixo).
 */
export const questions: readonly QuestionDefinition[] = [0, 1, 2, 3, 4].flatMap((round) =>
  AXIS_ORDER.map((axisId) => {
    const item = byAxis[axisId]?.[round];
    if (!item) throw new Error(`Pergunta ausente: eixo "${axisId}", rodada ${round + 1}.`);
    const [id, text, polarity] = item;
    return { id, text, axisId, polarity, weight: 1, group: `rodada-${round + 1}` };
  }),
);
