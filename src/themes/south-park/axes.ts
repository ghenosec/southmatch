import type { AxisBand, AxisDefinition } from "@/core/types";
import { bandTexts } from "./descriptions";

/** Limites das cinco faixas. O centro (41–59) é a faixa equilibrada. */
const BAND_LIMITS = [
  [0, 20],
  [21, 40],
  [41, 59],
  [60, 79],
  [80, 100],
] as const;

function bandsFor(axisId: string): AxisBand[] {
  const texts = bandTexts[axisId];
  if (!texts) throw new Error(`Textos de faixa ausentes para o eixo "${axisId}".`);
  return BAND_LIMITS.map(([min, max], i) => ({ min, max, ...texts[i]! }));
}

/** Os nove eixos. Pesos iguais (1) — nenhum eixo vale mais que outro. */
export const axes: readonly AxisDefinition[] = [
  {
    id: "sociability",
    shortName: "Social",
    name: "Sociabilidade",
    lowPole: "Reservado",
    highPole: "Extrovertido",
    description: "O quanto você busca a companhia de outras pessoas e se sente à vontade em grupos.",
    bands: bandsFor("sociability"),
    defaultWeight: 1,
  },
  {
    id: "empathy",
    shortName: "Empatia",
    name: "Empatia",
    lowPole: "Individualista",
    highPole: "Empático",
    description: "O quanto os sentimentos e problemas dos outros influenciam suas atitudes.",
    bands: bandsFor("empathy"),
    defaultWeight: 1,
  },
  {
    id: "authority",
    shortName: "Regras",
    name: "Regras e autoridade",
    lowPole: "Rebelde",
    highPole: "Disciplinado",
    description: "Sua relação com regras, combinados e com quem está no comando.",
    bands: bandsFor("authority"),
    defaultWeight: 1,
  },
  {
    id: "decision",
    shortName: "Decisão",
    name: "Tomada de decisão",
    lowPole: "Impulsivo",
    highPole: "Analítico",
    description: "Se você decide no impulso ou depois de pensar nas consequências.",
    bands: bandsFor("decision"),
    defaultWeight: 1,
  },
  {
    id: "conflict",
    shortName: "Conflito",
    name: "Conflitos",
    lowPole: "Conciliador",
    highPole: "Confrontador",
    description: "Como você reage a discordâncias e provocações.",
    bands: bandsFor("conflict"),
    defaultWeight: 1,
  },
  {
    id: "ambition",
    shortName: "Motivação",
    name: "Motivação",
    lowPole: "Desapegado",
    highPole: "Ambicioso",
    description: "O quanto vencer, crescer e ser reconhecido move você.",
    bands: bandsFor("ambition"),
    defaultWeight: 1,
  },
  {
    id: "humor",
    shortName: "Humor",
    name: "Humor",
    lowPole: "Sério",
    highPole: "Sarcástico",
    description: "O papel da ironia e das piadas, inclusive as pesadas, no seu jeito de ser.",
    bands: bandsFor("humor"),
    defaultWeight: 1,
  },
  {
    id: "loyalty",
    shortName: "Lealdade",
    name: "Lealdade",
    lowPole: "Independente",
    highPole: "Leal ao grupo",
    description: "Se você prioriza o grupo ou a própria autonomia quando os dois entram em choque.",
    bands: bandsFor("loyalty"),
    defaultWeight: 1,
  },
  {
    id: "worldview",
    shortName: "Visão",
    name: "Visão de mundo",
    lowPole: "Idealista",
    highPole: "Pragmático",
    description: "Se você guia suas escolhas por princípios e causas ou pelo que funciona na prática.",
    bands: bandsFor("worldview"),
    defaultWeight: 1,
  },
];
