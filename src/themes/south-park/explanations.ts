/**
 * Textos das explicações personalizadas (conteúdo editorial).
 *
 * As frases evitam adjetivos com gênero ("empático/empática") e usam
 * verbos ou "Vocês dois", para servir a qualquer pessoa e personagem.
 * A escolha de qual frase aparece é feita pelo serviço, a partir dos números.
 */
import type { ThemeExplanations } from "@/core/types";

export const explanations: ThemeExplanations = {
  axes: {
    sociability: {
      shared: {
        low: "Você e {name} tendem a preferir círculos pequenos a multidões.",
        center: "Você e {name} transitam bem entre momentos sociais e momentos a sós.",
        high: "Você e {name} tendem a se sentir em casa no meio de muita gente.",
      },
      strength: {
        low: "Capacidade de aproveitar a própria companhia",
        center: "Facilidade para se adaptar a ambientes diferentes",
        high: "Facilidade para criar conexões e animar o grupo",
      },
    },
    empathy: {
      shared: {
        low: "Vocês dois tendem a colocar os próprios interesses em primeiro lugar.",
        center: "Vocês dois se importam com os outros sem esquecer de si mesmos.",
        high: "Vocês dois tendem a sentir na pele os problemas dos outros.",
      },
      strength: {
        low: "Objetividade diante de problemas",
        center: "Equilíbrio entre cuidar dos outros e de si",
        high: "Sensibilidade para perceber o que os outros sentem",
      },
    },
    authority: {
      shared: {
        low: "Você e {name} tendem a desconfiar de regras e de quem manda.",
        center: "Você e {name} seguem regras, mas abrem exceções quando acham justo.",
        high: "Você e {name} tendem a respeitar combinados e hierarquias.",
      },
      strength: {
        low: "Coragem para questionar o que parece injusto",
        center: "Bom senso para saber quando seguir e quando questionar regras",
        high: "Confiabilidade e respeito a compromissos",
      },
    },
    decision: {
      shared: {
        low: "Vocês dois tendem a agir primeiro e pensar depois.",
        center: "Vocês dois misturam intuição e análise na hora de decidir.",
        high: "Vocês dois tendem a pensar bem antes de agir.",
      },
      strength: {
        low: "Rapidez para agir quando é preciso",
        center: "Flexibilidade para decidir rápido ou com calma",
        high: "Cuidado ao avaliar consequências",
      },
    },
    conflict: {
      shared: {
        low: "Você e {name} tendem a evitar brigas e a buscar o acordo.",
        center: "Você e {name} enfrentam conflitos quando precisam, sem sair procurando briga.",
        high: "Você e {name} não costumam fugir de um confronto.",
      },
      strength: {
        low: "Habilidade para acalmar os ânimos",
        center: "Firmeza sem agressividade",
        high: "Coragem para defender o que pensa",
      },
    },
    ambition: {
      shared: {
        low: "Vocês dois tendem a valorizar a tranquilidade mais do que vencer.",
        center: "Vocês dois têm metas, mas sem viver em função delas.",
        high: "Vocês dois tendem a mirar alto e a gostar de competir.",
      },
      strength: {
        low: "Tranquilidade e pouca necessidade de aprovação",
        center: "Equilíbrio entre metas e qualidade de vida",
        high: "Determinação para perseguir objetivos difíceis",
      },
    },
    humor: {
      shared: {
        low: "Você e {name} tendem a levar as conversas a sério.",
        center: "Você e {name} curtem uma piada, mas sabem a hora de parar.",
        high: "Você e {name} tendem a usar ironia e humor ácido.",
      },
      strength: {
        low: "Seriedade para lidar com assuntos delicados",
        center: "Bom humor na medida certa",
        high: "Humor afiado para aliviar tensões",
      },
    },
    loyalty: {
      shared: {
        low: "Vocês dois tendem a seguir o próprio caminho, mesmo longe do grupo.",
        center: "Vocês dois são leais sem abrir mão da própria autonomia.",
        high: "Vocês dois tendem a ficar ao lado dos amigos, aconteça o que acontecer.",
      },
      strength: {
        low: "Independência para tomar as próprias decisões",
        center: "Lealdade sem perder a autonomia",
        high: "Fidelidade aos amigos",
      },
    },
    worldview: {
      shared: {
        low: "Você e {name} tendem a acreditar em causas e ideais.",
        center: "Você e {name} combinam ideais com uma boa dose de realismo.",
        high: "Você e {name} tendem a focar no que funciona na prática.",
      },
      strength: {
        low: "Convicção nos próprios valores",
        center: "Equilíbrio entre ideais e realismo",
        high: "Foco em soluções práticas",
      },
    },
  },
  sections: [
    { id: "pessoas", title: "Seu jeito de lidar com pessoas", axisIds: ["sociability", "empathy"] },
    { id: "amizades", title: "Sua relação com amizades", axisIds: ["loyalty"] },
    { id: "conflitos", title: "Sua reação a conflitos", axisIds: ["conflict"] },
    { id: "humor", title: "Seu senso de humor", axisIds: ["humor"] },
    { id: "regras", title: "Seu comportamento diante de regras", axisIds: ["authority"] },
    { id: "decisao", title: "Seu estilo de decisão", axisIds: ["decision"] },
    { id: "motivacoes", title: "Suas motivações", axisIds: ["ambition", "worldview"] },
  ],
  contradictions: [
    {
      id: "social-independente",
      when: [{ axisId: "sociability", direction: "high" }, { axisId: "loyalty", direction: "low" }],
      text: "Você gosta de estar entre pessoas, mas não se prende a um grupo.",
    },
    {
      id: "empatico-confrontador",
      when: [{ axisId: "empathy", direction: "high" }, { axisId: "conflict", direction: "high" }],
      text: "Você se importa muito com os outros, mas não foge de um confronto — nem com quem gosta.",
    },
    {
      id: "rebelde-leal",
      when: [{ axisId: "authority", direction: "low" }, { axisId: "loyalty", direction: "high" }],
      text: "Você questiona regras e autoridades, mas é fiel ao seu grupo.",
    },
    {
      id: "ambicioso-impulsivo",
      when: [{ axisId: "ambition", direction: "high" }, { axisId: "decision", direction: "low" }],
      text: "Você mira alto, mas costuma agir antes de planejar.",
    },
    {
      id: "idealista-conciliador",
      when: [{ axisId: "worldview", direction: "low" }, { axisId: "conflict", direction: "low" }],
      text: "Você acredita em causas, mas prefere evitar o confronto que elas às vezes exigem.",
    },
    {
      id: "individualista-leal",
      when: [{ axisId: "empathy", direction: "low" }, { axisId: "loyalty", direction: "high" }],
      text: "Você tende a priorizar seus próprios interesses, mas defende seus amigos.",
    },
    {
      id: "sarcastico-empatico",
      when: [{ axisId: "humor", direction: "high" }, { axisId: "empathy", direction: "high" }],
      text: "Seu humor pode ser afiado, mas você se importa com como os outros se sentem.",
    },
    {
      id: "reservado-ambicioso",
      when: [{ axisId: "sociability", direction: "low" }, { axisId: "ambition", direction: "high" }],
      text: "Você prefere círculos pequenos, mas quer ser reconhecido pelo que faz.",
    },
    {
      id: "disciplinado-pragmatico",
      when: [{ axisId: "authority", direction: "high" }, { axisId: "worldview", direction: "high" }],
      text: "Você respeita regras, mas admite abrir mão de princípios quando o resultado exige.",
    },
  ],
  noContradictions: "Neste teste, seu perfil não mostrou tensões marcantes entre os eixos.",
  balancedProfile:
    "Suas respostas ficaram perto do centro na maioria dos eixos. Isso pode indicar um perfil equilibrado — ou muitas respostas neutras. Nesses casos, personagens de perfil moderado tendem a aparecer no topo.",
};
