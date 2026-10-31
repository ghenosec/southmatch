/**
 * Textos interpretativos das faixas de cada eixo (conteúdo editorial).
 * Cinco faixas por eixo: 0–20, 21–40, 41–59, 60–79, 80–100.
 * Linguagem de tendência ("você tende a…"), nunca absoluta.
 */
export interface BandText {
  readonly label: string;
  readonly description: string;
}

/** Ordem: muito baixo, baixo, equilibrado, alto, muito alto. */
export type AxisBandTexts = readonly [BandText, BandText, BandText, BandText, BandText];

export const bandTexts: Readonly<Record<string, AxisBandTexts>> = {
  sociability: [
    { label: "Muito reservado", description: "Você tende a preferir a própria companhia e a recarregar as energias longe de multidões." },
    { label: "Reservado", description: "Suas respostas sugerem que você gosta de gente, mas em doses menores e com pessoas próximas." },
    { label: "Equilibrado", description: "Você transita bem entre momentos sociais e momentos a sós, conforme a situação." },
    { label: "Sociável", description: "Você tende a buscar companhia e a se sentir à vontade em grupos." },
    { label: "Muito extrovertido", description: "Neste teste, você demonstrou gostar de estar no centro da roda e de conhecer gente nova." },
  ],
  empathy: [
    { label: "Muito individualista", description: "Você tende a priorizar seus próprios interesses e a esperar que cada um cuide de si." },
    { label: "Individualista", description: "Suas respostas sugerem uma postura mais prática do que emocional diante dos problemas alheios." },
    { label: "Equilibrado", description: "Você se importa com os outros, mas sem perder de vista as próprias necessidades." },
    { label: "Empático", description: "Você tende a perceber o que os outros sentem e a se colocar no lugar deles." },
    { label: "Muito empático", description: "Neste teste, você demonstrou ser muito sensível ao sofrimento alheio." },
  ],
  authority: [
    { label: "Muito rebelde", description: "Você tende a questionar regras e a desafiar quem está no comando." },
    { label: "Rebelde", description: "Suas respostas sugerem que você segue regras quando concorda com elas, e só." },
    { label: "Equilibrado", description: "Você respeita regras na maior parte do tempo, mas abre exceções quando acha justo." },
    { label: "Disciplinado", description: "Você tende a cumprir combinados e a respeitar hierarquias." },
    { label: "Muito disciplinado", description: "Neste teste, você demonstrou forte apego a regras, horários e autoridade." },
  ],
  decision: [
    { label: "Muito impulsivo", description: "Você tende a agir no calor do momento e a decidir pelo instinto." },
    { label: "Impulsivo", description: "Suas respostas sugerem que você prefere agir rápido a planejar demais." },
    { label: "Equilibrado", description: "Você mistura intuição e análise, dependendo do que está em jogo." },
    { label: "Analítico", description: "Você tende a pesar opções e consequências antes de escolher." },
    { label: "Muito analítico", description: "Neste teste, você demonstrou planejar com cuidado quase tudo o que faz." },
  ],
  conflict: [
    { label: "Muito conciliador", description: "Você tende a evitar brigas e a buscar paz a quase qualquer custo." },
    { label: "Conciliador", description: "Suas respostas sugerem que você prefere acalmar os ânimos a partir para o confronto." },
    { label: "Equilibrado", description: "Você enfrenta conflitos quando precisa, mas não sai procurando briga." },
    { label: "Firme", description: "Você tende a defender suas posições e a não fugir de uma discussão." },
    { label: "Muito confrontador", description: "Neste teste, você demonstrou disposição para encarar qualquer embate de frente." },
  ],
  ambition: [
    { label: "Muito desapegado", description: "Você tende a valorizar a tranquilidade mais do que vitórias ou reconhecimento." },
    { label: "Desapegado", description: "Suas respostas sugerem que sucesso é bom, mas não é o que move você." },
    { label: "Equilibrado", description: "Você tem metas, mas não vive em função delas." },
    { label: "Ambicioso", description: "Você tende a gostar de desafios e a querer chegar longe." },
    { label: "Muito ambicioso", description: "Neste teste, você demonstrou forte vontade de vencer, crescer e ser reconhecido." },
  ],
  humor: [
    { label: "Muito sério", description: "Você tende a preferir conversas sérias e a ver pouca graça em piadas ácidas." },
    { label: "Sério", description: "Suas respostas sugerem que você ri, mas sabe a hora de parar." },
    { label: "Equilibrado", description: "Você aprecia humor, sem fazer dele sua principal forma de se expressar." },
    { label: "Bem-humorado", description: "Você tende a usar piadas e ironia para lidar com as situações." },
    { label: "Muito sarcástico", description: "Neste teste, você demonstrou humor afiado e pouco medo de piadas pesadas." },
  ],
  loyalty: [
    { label: "Muito independente", description: "Você tende a seguir seu próprio caminho, mesmo que isso signifique sair do grupo." },
    { label: "Independente", description: "Suas respostas sugerem que você valoriza seus amigos, mas não abre mão da própria autonomia." },
    { label: "Equilibrado", description: "Você é leal na medida certa, sem perder sua individualidade." },
    { label: "Leal", description: "Você tende a ficar ao lado dos amigos mesmo quando discorda deles." },
    { label: "Muito leal", description: "Neste teste, você demonstrou colocar o grupo à frente de quase tudo." },
  ],
  worldview: [
    { label: "Muito idealista", description: "Você tende a acreditar que vale lutar por um mundo melhor, mesmo contra as probabilidades." },
    { label: "Idealista", description: "Suas respostas sugerem que princípios e causas pesam bastante nas suas escolhas." },
    { label: "Equilibrado", description: "Você combina ideais com uma boa dose de realismo." },
    { label: "Pragmático", description: "Você tende a valorizar o que funciona mais do que o que soa bonito." },
    { label: "Muito pragmático", description: "Neste teste, você demonstrou desconfiança de promessas grandiosas e foco em resultados." },
  ],
};
