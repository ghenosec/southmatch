/**
 * Tema fictício mínimo, usado só em testes arquiteturais.
 * 3 eixos, 6 perguntas, 3 personagens. Não aparece na interface.
 */
import { DATA_FORMAT_VERSION } from "@/core/version";
import type { AxisBand, ThemeDefinition } from "@/core/types";
import { likertPtBr } from "../shared/likert-pt-br";

function bands(low: string, mid: string, high: string): AxisBand[] {
  return [
    { min: 0, max: 33, label: low, description: `Tendência a ${low.toLowerCase()}.` },
    { min: 34, max: 66, label: mid, description: `Equilíbrio: ${mid.toLowerCase()}.` },
    { min: 67, max: 100, label: high, description: `Tendência a ${high.toLowerCase()}.` },
  ];
}

export const exampleTheme: ThemeDefinition = {
  id: "example-theme",
  name: "Tema de Exemplo",
  description: "Tema mínimo para validar que o motor funciona com qualquer pacote.",
  locale: "pt-BR",
  versions: { dataFormat: DATA_FORMAT_VERSION, profiles: "2026.10.0" },
  listed: false,
  visual: {
    colors: {
      primary: "#3b82f6",
      primaryContrast: "#ffffff",
      surface: "#ffffff",
      ink: "#111827",
      accent: "#ef4444",
      highlight: "#facc15",
      muted: "#6b7280",
    },
  },
  texts: {
    title: "Qual criatura você seria?",
    subtitle: "Um teste de exemplo.",
    intro: "Seis afirmações, três criaturas.",
    disclaimer: "Conteúdo fictício para testes.",
  },
  scale: likertPtBr,
  axes: [
    {
      id: "energy",
      name: "Energia",
      lowPole: "Calmo",
      highPole: "Agitado",
      description: "Ritmo com que você age.",
      bands: bands("Calmo", "Ritmo variável", "Agitado"),
      defaultWeight: 1,
    },
    {
      id: "order",
      name: "Ordem",
      lowPole: "Espontâneo",
      highPole: "Organizado",
      description: "Preferência por planejamento.",
      bands: bands("Espontâneo", "Flexível", "Organizado"),
      defaultWeight: 1,
    },
    {
      id: "warmth",
      name: "Calor",
      lowPole: "Distante",
      highPole: "Acolhedor",
      description: "Como você trata os outros.",
      bands: bands("Distante", "Seletivo", "Acolhedor"),
      defaultWeight: 1,
    },
  ],
  questions: [
    { id: "ex-energy-1", text: "Gosto de começar o dia cheio de atividades.", axisId: "energy", polarity: "direct", weight: 1, group: "a" },
    { id: "ex-energy-2", text: "Prefiro tardes tranquilas sem compromissos.", axisId: "energy", polarity: "reverse", weight: 1, group: "b" },
    { id: "ex-order-1", text: "Faço listas antes de sair para comprar algo.", axisId: "order", polarity: "direct", weight: 1, group: "a" },
    { id: "ex-order-2", text: "Decido meus planos de fim de semana na hora.", axisId: "order", polarity: "reverse", weight: 1, group: "b" },
    { id: "ex-warmth-1", text: "Puxo conversa com quem parece deslocado.", axisId: "warmth", polarity: "direct", weight: 1, group: "a" },
    { id: "ex-warmth-2", text: "Os problemas dos outros raramente me afetam.", axisId: "warmth", polarity: "reverse", weight: 1, group: "b" },
  ],
  characters: [
    {
      id: "grumpy-robot",
      slug: "robo-ranzinza",
      name: "Robô Ranzinza",
      shortDescription: "Metódico e pouco sociável.",
      longDescription: "Um robô fictício que segue rotinas e evita conversas.",
      traits: ["Metódico"],
      strengths: ["Confiável"],
      limitations: ["Rígido"],
      contradictions: ["Reclama da rotina que ele mesmo criou"],
      scores: { energy: 30, order: 90, warmth: 20 },
      editorialRationale: "Perfil sintético de teste.",
      color: "#64748b",
      image: { src: null, alt: "Placeholder do Robô Ranzinza", credit: null },
      result: { headline: "Você é o Robô Ranzinza!", summary: "Ordem acima de tudo." },
    },
    {
      id: "explorer-cat",
      slug: "gata-exploradora",
      name: "Gata Exploradora",
      shortDescription: "Agitada e espontânea.",
      longDescription: "Uma gata fictícia que nunca planeja nada.",
      traits: ["Curiosa"],
      strengths: ["Adaptável"],
      limitations: ["Dispersa"],
      contradictions: ["Ama aventura, mas volta sempre ao mesmo sofá"],
      scores: { energy: 90, order: 15, warmth: 55 },
      editorialRationale: "Perfil sintético de teste.",
      color: "#f97316",
      image: { src: null, alt: "Placeholder da Gata Exploradora", credit: null },
      result: { headline: "Você é a Gata Exploradora!", summary: "O plano é não ter plano." },
    },
    {
      id: "librarian-owl",
      slug: "coruja-bibliotecaria",
      name: "Coruja Bibliotecária",
      shortDescription: "Calma e acolhedora.",
      longDescription: "Uma coruja fictícia que ajuda todos a achar o livro certo.",
      traits: ["Paciente"],
      strengths: ["Acolhedora"],
      limitations: ["Lenta para decidir"],
      contradictions: ["Organiza tudo, menos a própria mesa"],
      scores: { energy: 20, order: 60, warmth: 90 },
      editorialRationale: "Perfil sintético de teste.",
      color: "#8b5cf6",
      image: { src: null, alt: "Placeholder da Coruja Bibliotecária", credit: null },
      result: { headline: "Você é a Coruja Bibliotecária!", summary: "Calma e cuidado." },
    },
  ],
};
