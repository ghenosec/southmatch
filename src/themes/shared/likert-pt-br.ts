import type { AnswerDefinition } from "@/core/types";

/** Escala Likert de 5 pontos em pt-BR, compartilhável entre temas. */
export const likertPtBr: AnswerDefinition = {
  id: "likert-5-pt-br",
  options: [
    { id: "strongly-disagree", label: "Discordo totalmente", value: 0 },
    { id: "disagree", label: "Discordo", value: 0.25 },
    { id: "neutral", label: "Neutro / Não sei", value: 0.5 },
    { id: "agree", label: "Concordo", value: 0.75 },
    { id: "strongly-agree", label: "Concordo totalmente", value: 1 },
  ],
};
