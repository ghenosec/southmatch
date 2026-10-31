/**
 * Os 20 personagens do tema.
 *
 * Valores dos eixos (0–100) são atribuições editoriais baseadas em
 * comportamentos recorrentes na série — ver docs/CHARACTER_PROFILES.md.
 * Todos os valores são múltiplos de 5 para que qualquer perfil possa ser
 * reproduzido exatamente por respostas válidas (5 perguntas × passos de 0,25).
 *
 * Ao mudar qualquer valor, incremente `versions.profiles` em config.ts.
 */
import type { AxisScores, CharacterDefinition } from "@/core/types";

/** Ordem: soc, emp, aut, dec, con, amb, hum, loy, wor. */
type Vector = readonly [number, number, number, number, number, number, number, number, number];

function v([sociability, empathy, authority, decision, conflict, ambition, humor, loyalty, worldview]: Vector): AxisScores {
  return { sociability, empathy, authority, decision, conflict, ambition, humor, loyalty, worldview };
}

function placeholder(name: string) {
  return { src: null, alt: `Ilustração provisória representando ${name}`, license: null };
}

export const characters: readonly CharacterDefinition[] = [
  {
    id: "cartman",
    slug: "eric-cartman",
    name: "Eric Cartman",
    shortDescription: "Manipulador, ambicioso e sem freio — sempre com um plano mirabolante.",
    longDescription:
      "Cartman quer vencer a qualquer custo. Monta esquemas elaborados para ganhar dinheiro, fama ou vingança, manipula quem estiver por perto e raramente sente culpa. É mandão, provocador e dono de um humor ácido, mas também é persistente e criativo quando quer algo.",
    traits: ["Manipulador", "Ambicioso", "Provocador"],
    strengths: ["Persistência", "Criatividade para planos", "Poder de persuasão"],
    limitations: ["Pouca empatia", "Egocentrismo", "Rancor"],
    contradictions: ["Exige respeito à própria autoridade, mas ignora a de todo mundo"],
    scores: v([75, 5, 20, 65, 90, 95, 80, 25, 80]),
    editorialRationale:
      "Ambição e confronto quase máximos pelos esquemas recorrentes e provocações. Empatia mínima pela indiferença ao sofrimento alheio. Regras baixas: ignora autoridade alheia. Decisão acima do centro porque seus planos costumam ser elaborados, ainda que movidos por impulso. Lealdade baixa: troca de lado quando convém.",
    confidence: "high",
    color: "#d7263d",
    image: placeholder("Eric Cartman"),
    result: {
      headline: "Você é mais parecido com Eric Cartman!",
      summary: "Você tende a mirar alto, não foge de uma briga e tem um humor afiado. Só cuidado para a ambição não atropelar quem está ao lado.",
    },
  },
  {
    id: "stan",
    slug: "stan-marsh",
    name: "Stan Marsh",
    shortDescription: "O garoto comum que tenta fazer a coisa certa — e se cansa do absurdo do mundo.",
    longDescription:
      "Stan costuma ser a voz da razão do grupo. Leal aos amigos, especialmente a Kyle, ele se incomoda com injustiças, mas também tem momentos de cinismo e desânimo diante do caos ao redor. Prefere resolver as coisas sem drama, embora acabe envolvido em quase todas as confusões.",
    traits: ["Leal", "Sensato", "Um pouco cínico"],
    strengths: ["Senso de justiça", "Lealdade", "Equilíbrio"],
    limitations: ["Desânimo diante do caos", "Evita assumir a liderança"],
    contradictions: ["Quer mudar as coisas, mas às vezes conclui que nada vale a pena"],
    scores: v([55, 70, 50, 55, 45, 35, 55, 80, 50]),
    editorialRationale:
      "Perfil moderado na maioria dos eixos, refletindo seu papel de 'garoto comum'. Empatia e lealdade altas pela amizade constante com Kyle e pela preocupação com injustiças. Visão de mundo no centro: alterna entre idealismo e cinismo ao longo da série.",
    confidence: "high",
    color: "#3a6fd9",
    image: placeholder("Stan Marsh"),
    result: {
      headline: "Você é mais parecido com Stan Marsh!",
      summary: "Você tende a buscar o equilíbrio, valoriza muito seus amigos e tenta fazer o certo — mesmo quando o mundo parece não colaborar.",
    },
  },
  {
    id: "kyle",
    slug: "kyle-broflovski",
    name: "Kyle Broflovski",
    shortDescription: "Idealista, inteligente e pronto para discutir quando algo está errado.",
    longDescription:
      "Kyle tem princípios firmes e não aceita injustiça calado. É estudioso, argumenta com paixão e vive em conflito com Cartman. Frequentemente é quem tira a lição moral da história, embora seu temperamento explosivo o coloque em brigas.",
    traits: ["Idealista", "Questionador", "Intenso"],
    strengths: ["Princípios firmes", "Inteligência", "Coragem para discordar"],
    limitations: ["Temperamento explosivo", "Dificuldade em deixar uma discussão de lado"],
    contradictions: ["Defende a razão, mas perde a cabeça com facilidade"],
    scores: v([55, 75, 45, 70, 80, 55, 40, 75, 20]),
    editorialRationale:
      "Visão de mundo muito idealista pelos discursos morais recorrentes. Confronto alto pelas discussões constantes, sobretudo com Cartman. Decisão analítica por ser estudioso e argumentativo. Empatia e lealdade altas.",
    confidence: "high",
    color: "#2e9e5b",
    image: placeholder("Kyle Broflovski"),
    result: {
      headline: "Você é mais parecido com Kyle Broflovski!",
      summary: "Você tende a defender suas ideias com paixão e não aceita injustiças em silêncio. Seus princípios guiam suas escolhas.",
    },
  },
  {
    id: "kenny",
    slug: "kenny-mccormick",
    name: "Kenny McCormick",
    shortDescription: "Destemido, irreverente e mais leal do que parece.",
    longDescription:
      "Kenny fala pouco (e quase sempre abafado pelo capuz), mas topa qualquer aventura arriscada e adora humor pesado. Vem de uma família pobre, o que lhe dá uma visão prática da vida. Por trás da irreverência, costuma proteger quem ama.",
    traits: ["Destemido", "Irreverente", "Protetor"],
    strengths: ["Coragem", "Lealdade discreta", "Adaptação a dificuldades"],
    limitations: ["Imprudência", "Pouco interesse em planejar"],
    contradictions: ["Parece não levar nada a sério, mas se sacrifica pelos outros"],
    scores: v([55, 65, 20, 25, 40, 25, 80, 75, 70]),
    editorialRationale:
      "Impulsividade e rebeldia pela disposição a riscos e travessuras. Humor alto pelo gosto por piadas pesadas. Visão pragmática ligada à realidade de pobreza da família. Lealdade e empatia acima do centro pela proteção a amigos e à irmã.",
    confidence: "high",
    color: "#f28c28",
    image: placeholder("Kenny McCormick"),
    result: {
      headline: "Você é mais parecido com Kenny McCormick!",
      summary: "Você tende a encarar a vida com coragem e bom humor, sem muito planejamento — e é mais leal do que deixa transparecer.",
    },
  },
  {
    id: "butters",
    slug: "butters-stotch",
    name: "Butters Stotch",
    shortDescription: "Gentil, ingênuo e obediente — com um lado vilão de brincadeira.",
    longDescription:
      "Butters acredita no melhor das pessoas, obedece aos pais e raramente percebe quando está sendo usado. É doce, otimista e evita brigas. Às vezes libera a frustração no alter ego Professor Caos, um vilão que, no fundo, não faz mal a ninguém.",
    traits: ["Gentil", "Ingênuo", "Otimista"],
    strengths: ["Bondade", "Otimismo", "Disposição para ajudar"],
    limitations: ["Ingenuidade", "Dificuldade em dizer não"],
    contradictions: ["É o garoto mais obediente da cidade, mas tem um alter ego que quer dominar o mundo"],
    scores: v([65, 90, 90, 30, 10, 20, 10, 80, 10]),
    editorialRationale:
      "Empatia e disciplina muito altas pela gentileza e obediência aos pais. Conflito mínimo: evita brigas. Visão muito idealista pelo otimismo e ingenuidade. Humor sério: raramente usa sarcasmo. O alter ego Professor Caos está registrado como contradição, não como pontuação.",
    confidence: "high",
    color: "#5bc0de",
    image: placeholder("Butters Stotch"),
    result: {
      headline: "Você é mais parecido com Butters Stotch!",
      summary: "Você tende a acreditar no lado bom das pessoas, evita conflitos e se importa muito com os outros.",
    },
  },
  {
    id: "randy",
    slug: "randy-marsh",
    name: "Randy Marsh",
    shortDescription: "Exagerado, empolgado e obcecado pela novidade da vez.",
    longDescription:
      "Randy, pai de Stan, mergulha de cabeça em qualquer moda, ideia ou projeto — e leva a família junto. É extrovertido, competitivo e dramático. Age antes de pensar e transforma pequenas coisas em grandes crises.",
    traits: ["Impulsivo", "Exagerado", "Entusiasmado"],
    strengths: ["Energia contagiante", "Coragem para recomeçar"],
    limitations: ["Impulsividade extrema", "Obsessões passageiras", "Pouca autocrítica"],
    contradictions: ["É cientista, mas raramente pensa antes de agir"],
    scores: v([85, 45, 20, 5, 65, 75, 50, 45, 40]),
    editorialRationale:
      "Decisão quase no mínimo pelas reações impulsivas recorrentes. Sociabilidade alta pelo gosto por plateia. Ambição alta pelas obsessões com projetos. Regras baixas: frequentemente desafia autoridades e convenções. Visão levemente idealista por abraçar causas com entusiasmo.",
    confidence: "high",
    color: "#8e5a2b",
    image: placeholder("Randy Marsh"),
    result: {
      headline: "Você é mais parecido com Randy Marsh!",
      summary: "Você tende a se empolgar rápido, agir no impulso e viver tudo com intensidade — para o bem e para o mal.",
    },
  },
  {
    id: "wendy",
    slug: "wendy-testaburger",
    name: "Wendy Testaburger",
    shortDescription: "Inteligente, determinada e engajada em causas.",
    longDescription:
      "Wendy é uma das alunas mais dedicadas da escola. Envolve-se em causas sociais, não tem medo de enfrentar quem a desafia (inclusive Cartman) e gosta de liderar. É ambiciosa e organizada, com forte senso de justiça.",
    traits: ["Determinada", "Engajada", "Líder"],
    strengths: ["Inteligência", "Coragem", "Organização"],
    limitations: ["Pode ser inflexível", "Pouca paciência com quem discorda"],
    contradictions: ["Defende a cooperação, mas gosta de estar no comando"],
    scores: v([65, 70, 55, 80, 75, 85, 40, 55, 30]),
    editorialRationale:
      "Ambição e análise altas pela dedicação escolar e liderança. Confronto alto: enfrenta adversários de frente. Visão idealista pelo engajamento em causas. Regras levemente acima do centro: respeita instituições, mas as contesta quando acha injusto.",
    confidence: "medium",
    color: "#c2185b",
    image: placeholder("Wendy Testaburger"),
    result: {
      headline: "Você é mais parecido com Wendy Testaburger!",
      summary: "Você tende a ser determinado, gosta de liderar e luta pelo que acredita.",
    },
  },
  {
    id: "craig",
    slug: "craig-tucker",
    name: "Craig Tucker",
    shortDescription: "Impassível, sarcástico e sem paciência para drama.",
    longDescription:
      "Craig encara tudo com cara de tédio. Fala pouco, responde com humor seco e não esconde o desprezo por confusões desnecessárias. Prefere uma vida sem grandes emoções, mas defende quem considera seu — especialmente Tweek.",
    traits: ["Impassível", "Sarcástico", "Direto"],
    strengths: ["Calma", "Franqueza", "Realismo"],
    limitations: ["Pouca expressividade", "Desinteresse por grandes projetos"],
    contradictions: ["Diz que não liga para nada, mas protege quem ama"],
    scores: v([25, 40, 25, 65, 45, 15, 75, 55, 85]),
    editorialRationale:
      "Sociabilidade baixa pelo comportamento reservado. Ambição baixa pelo desejo de uma vida tranquila. Humor alto pelo sarcasmo seco. Visão muito pragmática. Regras baixas: desafia autoridades com frequência, ainda que sem alarde.",
    confidence: "medium",
    color: "#2f5d8a",
    image: placeholder("Craig Tucker"),
    result: {
      headline: "Você é mais parecido com Craig Tucker!",
      summary: "Você tende a manter a calma, falar só o necessário e ver o mundo com realismo — e um toque de ironia.",
    },
  },
  {
    id: "tweek",
    slug: "tweek-tweak",
    name: "Tweek Tweak",
    shortDescription: "Ansioso, inquieto e sempre esperando o pior.",
    longDescription:
      "Tweek vive em estado de alerta. Qualquer imprevisto vira uma catástrofe na cabeça dele, o que o faz reagir no susto. Evita conflitos, segue o que mandam por medo das consequências e encontra segurança em poucas pessoas próximas.",
    traits: ["Ansioso", "Inquieto", "Sensível"],
    strengths: ["Sensibilidade", "Fidelidade a quem confia"],
    limitations: ["Ansiedade", "Reações precipitadas", "Dificuldade em lidar com pressão"],
    contradictions: ["Teme tudo, mas acaba envolvido nas maiores confusões"],
    scores: v([30, 60, 60, 10, 25, 20, 15, 65, 50]),
    editorialRationale:
      "Decisão muito impulsiva: reage em pânico em vez de analisar. Conflito baixo: foge de confrontos. Regras levemente altas por obedecer por medo. Humor sério: raramente faz piadas. A ansiedade é tratada como traço do personagem, não como avaliação clínica.",
    confidence: "medium",
    color: "#a67c52",
    image: placeholder("Tweek Tweak"),
    result: {
      headline: "Você é mais parecido com Tweek Tweak!",
      summary: "Você tende a se preocupar bastante com o que pode dar errado e encontra segurança em pessoas próximas.",
    },
  },
  {
    id: "jimmy",
    slug: "jimmy-valmer",
    name: "Jimmy Valmer",
    shortDescription: "Comediante nato, confiante e sempre pronto para o palco.",
    longDescription:
      "Jimmy se vê como um humorista profissional e aproveita qualquer plateia para uma piada. É extrovertido, confiante e persistente em seus objetivos, com um senso de humor afiado e bastante autoironia.",
    traits: ["Engraçado", "Confiante", "Extrovertido"],
    strengths: ["Carisma", "Autoconfiança", "Persistência"],
    limitations: ["Nem sempre lê bem o ambiente", "Busca de atenção"],
    contradictions: ["Quer ser levado a sério como artista, mas vive de piada"],
    scores: v([90, 55, 45, 55, 50, 75, 95, 65, 55]),
    editorialRationale:
      "Humor quase máximo pela identidade de comediante. Sociabilidade muito alta pelo gosto por plateia. Ambição alta pela dedicação à carreira de humorista. Demais eixos moderados por falta de evidência forte em outra direção.",
    confidence: "medium",
    color: "#f2c94c",
    image: placeholder("Jimmy Valmer"),
    result: {
      headline: "Você é mais parecido com Jimmy Valmer!",
      summary: "Você tende a ser o centro das risadas, tem confiança de sobra e usa o humor como forma de se conectar.",
    },
  },
  {
    id: "timmy",
    slug: "timmy-burch",
    name: "Timmy Burch",
    shortDescription: "Entusiasmado, sociável e cheio de energia.",
    longDescription:
      "Timmy se comunica quase só gritando o próprio nome, mas sua animação é contagiante. É sociável, adora estar com os amigos e se joga em atividades como a banda que formou. Tem um perfil menos documentado que outros personagens.",
    traits: ["Entusiasmado", "Sociável", "Animado"],
    strengths: ["Energia", "Alegria", "Espírito de grupo"],
    limitations: ["Impulsividade"],
    contradictions: ["Diz sempre a mesma palavra, mas se faz entender por todos"],
    scores: v([85, 65, 45, 30, 40, 55, 50, 70, 45]),
    editorialRationale:
      "Perfil de baixa confiança: o personagem tem pouco diálogo. Sociabilidade e lealdade altas pela animação constante e convivência em grupo. Decisão impulsiva pelo entusiasmo. Demais eixos próximos do centro. A deficiência do personagem não foi usada como base para nenhum valor.",
    confidence: "low",
    color: "#e65100",
    image: placeholder("Timmy Burch"),
    result: {
      headline: "Você é mais parecido com Timmy Burch!",
      summary: "Você tende a encarar a vida com entusiasmo, adora estar entre amigos e contagia quem está por perto.",
    },
  },
  {
    id: "tolkien",
    slug: "tolkien-black",
    name: "Tolkien Black",
    shortDescription: "Sensato, responsável e uma das vozes da razão da turma.",
    longDescription:
      "Tolkien costuma ser quem aponta o óbvio quando todos perdem o juízo. É responsável, inteligente e leal aos amigos, com uma visão prática das situações. Fica irritado com preconceitos e com exageros do grupo.",
    traits: ["Sensato", "Responsável", "Leal"],
    strengths: ["Bom senso", "Maturidade", "Confiabilidade"],
    limitations: ["Pode parecer distante da bagunça do grupo"],
    contradictions: ["É a voz da razão, mas ainda assim entra nas confusões da turma"],
    scores: v([50, 70, 70, 80, 50, 55, 45, 70, 70]),
    editorialRationale:
      "Decisão muito analítica e regras acima do centro pelo papel recorrente de voz da razão. Visão pragmática. Empatia e lealdade altas pela amizade constante com Craig e Clyde. Conflito no centro: reclama, mas não busca briga.",
    confidence: "medium",
    color: "#6a4c93",
    image: placeholder("Tolkien Black"),
    result: {
      headline: "Você é mais parecido com Tolkien Black!",
      summary: "Você tende a ser a pessoa sensata do grupo, que pensa antes de agir e mantém os pés no chão.",
    },
  },
  {
    id: "clyde",
    slug: "clyde-donovan",
    name: "Clyde Donovan",
    shortDescription: "Emotivo, sociável e louco para ser notado.",
    longDescription:
      "Clyde quer ser popular e gosta de estar no centro das atenções. É emotivo — chora e se empolga com facilidade —, age no impulso e evita confrontos diretos. É fiel à turma de Craig, embora às vezes se deixe levar pela vaidade.",
    traits: ["Emotivo", "Vaidoso", "Sociável"],
    strengths: ["Sinceridade emocional", "Simpatia"],
    limitations: ["Impulsividade", "Carência de atenção", "Pouca firmeza"],
    contradictions: ["Quer parecer durão, mas é o primeiro a chorar"],
    scores: v([75, 50, 45, 20, 25, 40, 55, 60, 35]),
    editorialRationale:
      "Sociabilidade alta pela busca de popularidade. Decisão impulsiva e conflito baixo pelo comportamento emotivo e por recuar diante de embates. Visão levemente idealista. Demais eixos moderados.",
    confidence: "medium",
    color: "#d35400",
    image: placeholder("Clyde Donovan"),
    result: {
      headline: "Você é mais parecido com Clyde Donovan!",
      summary: "Você tende a viver as emoções intensamente, gosta de estar entre pessoas e não esconde o que sente.",
    },
  },
  {
    id: "bebe",
    slug: "bebe-stevens",
    name: "Bebe Stevens",
    shortDescription: "Sociável, confiante e no centro da vida social da escola.",
    longDescription:
      "Bebe é popular, falante e atenta às tendências. Melhor amiga de Wendy, é leal às amigas, mas também gosta de estar em evidência. Tem opinião forte sobre a vida social da turma e não hesita em entrar em disputas.",
    traits: ["Popular", "Confiante", "Falante"],
    strengths: ["Facilidade social", "Lealdade às amigas", "Autoconfiança"],
    limitations: ["Preocupação com status", "Pode ser competitiva"],
    contradictions: ["Valoriza a amizade, mas compete por atenção"],
    scores: v([85, 45, 45, 45, 60, 65, 50, 70, 60]),
    editorialRationale:
      "Sociabilidade muito alta pela popularidade. Lealdade alta pela amizade com Wendy. Ambição e confronto acima do centro pela disputa por status. Personagem com menos material de destaque; perfil de confiança média.",
    confidence: "low",
    color: "#ff6f91",
    image: placeholder("Bebe Stevens"),
    result: {
      headline: "Você é mais parecido com Bebe Stevens!",
      summary: "Você tende a brilhar em grupo, tem confiança social e é fiel aos seus amigos mais próximos.",
    },
  },
  {
    id: "garrison",
    slug: "mr-garrison",
    name: "Mr. Garrison",
    shortDescription: "Professor amargo, imprevisível e sempre pronto para um escândalo.",
    longDescription:
      "Mr. Garrison é um professor que claramente não gosta muito de ensinar. Explosivo, ressentido e imprevisível, muda de rumo de forma radical e se envolve em polêmicas. Tem ambições grandiosas e um humor amargo.",
    traits: ["Explosivo", "Imprevisível", "Amargo"],
    strengths: ["Ousadia", "Franqueza sem filtro"],
    limitations: ["Pouca empatia", "Instabilidade", "Ressentimento"],
    contradictions: ["É educador, mas ensina quase tudo menos o conteúdo da aula"],
    scores: v([55, 10, 30, 15, 85, 70, 75, 15, 60]),
    editorialRationale:
      "Confronto muito alto e decisão muito impulsiva pelas explosões e mudanças radicais. Empatia e lealdade muito baixas pelo tratamento hostil aos alunos e aliados. Ambição alta pelas aspirações políticas e de fama. Humor alto e amargo.",
    confidence: "high",
    color: "#4caf50",
    image: placeholder("Mr. Garrison"),
    result: {
      headline: "Você é mais parecido com Mr. Garrison!",
      summary: "Você tende a não ter filtro, enfrentar tudo de frente e seguir seus próprios impulsos — sem pedir licença.",
    },
  },
  {
    id: "chef",
    slug: "chef",
    name: "Chef",
    shortDescription: "O adulto acolhedor que dá conselhos aos garotos (nem sempre adequados).",
    longDescription:
      "Chef, cozinheiro da escola, era o adulto em quem os garotos confiavam. Caloroso, sociável e prático, oferecia conselhos — muitas vezes em forma de música — e tinha uma visão realista da vida.",
    traits: ["Acolhedor", "Prático", "Carismático"],
    strengths: ["Empatia", "Conselhos práticos", "Carisma"],
    limitations: ["Conselhos às vezes inadequados para a idade"],
    contradictions: ["É o adulto mais sensato da cidade, mas seus conselhos frequentemente fogem do assunto"],
    scores: v([80, 80, 45, 60, 45, 35, 55, 75, 75]),
    editorialRationale:
      "Empatia e sociabilidade altas pelo papel de confidente dos garotos. Visão pragmática pelos conselhos realistas. Lealdade alta pela proximidade com as crianças. Perfil baseado principalmente nas temporadas em que o personagem foi recorrente.",
    confidence: "medium",
    color: "#b5651d",
    image: placeholder("Chef"),
    result: {
      headline: "Você é mais parecido com Chef!",
      summary: "Você tende a acolher as pessoas, dar conselhos práticos e manter os pés no chão.",
    },
  },
  {
    id: "pc-principal",
    slug: "pc-principal",
    name: "PC Principal",
    shortDescription: "Diretor intenso que impõe suas regras com força total.",
    longDescription:
      "PC Principal chegou à escola para impor o politicamente correto — com músculos, gritos e tolerância zero. Acredita fervorosamente em suas causas, reage com agressividade a quem as desafia e valoriza muito a irmandade com seus colegas.",
    traits: ["Intenso", "Ideológico", "Autoritário"],
    strengths: ["Convicção", "Energia", "Lealdade aos seus"],
    limitations: ["Agressividade", "Impulsividade", "Pouca abertura ao diálogo"],
    contradictions: ["Prega a tolerância, mas resolve discordâncias na força"],
    scores: v([70, 55, 85, 35, 95, 65, 15, 70, 15]),
    editorialRationale:
      "Confronto quase máximo pelas reações agressivas. Regras e autoridade muito altas por impor normas como diretor. Visão muito idealista pela devoção às suas causas. Humor sério. Empatia moderada: defende grupos em tese, mas é duro com indivíduos.",
    confidence: "medium",
    color: "#1e88e5",
    image: placeholder("PC Principal"),
    result: {
      headline: "Você é mais parecido com PC Principal!",
      summary: "Você tende a defender suas convicções com intensidade e acredita que regras existem para ser cumpridas.",
    },
  },
  {
    id: "scott",
    slug: "scott-malkinson",
    name: "Scott Malkinson",
    shortDescription: "Certinho, sério e meio deslocado.",
    longDescription:
      "Scott é um garoto certinho e um tanto ingênuo, que tenta se enturmar mas costuma ficar à margem. Leva as coisas a sério, reclama quando se sente injustiçado e segue regras com mais zelo que a maioria.",
    traits: ["Certinho", "Sério", "Reservado"],
    strengths: ["Responsabilidade", "Sinceridade"],
    limitations: ["Dificuldade de se enturmar", "Reclamações frequentes"],
    contradictions: ["Quer ser aceito, mas não abre mão do próprio jeito"],
    scores: v([35, 45, 65, 50, 40, 40, 20, 40, 50]),
    editorialRationale:
      "Perfil de baixa confiança: personagem secundário com pouco desenvolvimento. Sociabilidade e humor baixos pelo jeito sério e deslocado. Regras acima do centro. Demais eixos moderados. Nenhum valor foi baseado em condições de saúde do personagem.",
    confidence: "low",
    color: "#607d8b",
    image: placeholder("Scott Malkinson"),
    result: {
      headline: "Você é mais parecido com Scott Malkinson!",
      summary: "Você tende a levar as coisas a sério, seguir as regras e ser fiel ao seu próprio jeito.",
    },
  },
  {
    id: "heidi",
    slug: "heidi-turner",
    name: "Heidi Turner",
    shortDescription: "Gentil e inteligente, com uma fase de desilusão marcante.",
    longDescription:
      "Heidi é uma aluna inteligente e gentil que passou por uma transformação na série: um relacionamento com Cartman a tornou mais cínica e desconfiada, até que ela decidiu romper e seguir seu caminho. Seu perfil combina sensatez com uma visão mais realista do mundo.",
    traits: ["Inteligente", "Reflexiva", "Desconfiada"],
    strengths: ["Capacidade de reflexão", "Inteligência", "Coragem para recomeçar"],
    limitations: ["Pode se deixar influenciar", "Tendência ao desânimo"],
    contradictions: ["Começou otimista e acabou cética — e ainda tenta acreditar nas pessoas"],
    scores: v([40, 55, 55, 65, 40, 45, 45, 50, 65]),
    editorialRationale:
      "Perfil que mistura as fases da personagem. Decisão analítica e visão pragmática pela desilusão das temporadas mais recentes. Lealdade no centro: rompeu com quem a prejudicava. Sociabilidade levemente baixa.",
    confidence: "low",
    color: "#9c27b0",
    image: placeholder("Heidi Turner"),
    result: {
      headline: "Você é mais parecido com Heidi Turner!",
      summary: "Você tende a refletir antes de agir e aprendeu a olhar o mundo com mais realismo, sem perder a gentileza.",
    },
  },
  {
    id: "gerald",
    slug: "gerald-broflovski",
    name: "Gerald Broflovski",
    shortDescription: "Advogado respeitável por fora, provocador nato por dentro.",
    longDescription:
      "Gerald, pai de Kyle, é um advogado que gosta de parecer sensato e moralmente correto. Ao mesmo tempo, já mostrou um lado provocador e vaidoso: provoca os outros às escondidas e se esforça muito para não ser descoberto.",
    traits: ["Vaidoso", "Calculista", "Provocador"],
    strengths: ["Inteligência", "Argumentação"],
    limitations: ["Hipocrisia", "Orgulho", "Pouca empatia na prática"],
    contradictions: ["Defende a moral em público, mas se diverte provocando os outros em segredo"],
    scores: v([50, 25, 60, 70, 60, 70, 70, 35, 50]),
    editorialRationale:
      "Decisão analítica e ambição alta pela carreira de advogado e pela capacidade de planejar para não ser descoberto. Humor alto e empatia baixa pelo lado provocador. Regras acima do centro pela fachada respeitável. Visão de mundo no centro: discurso de princípios, prática pragmática.",
    confidence: "medium",
    color: "#00897b",
    image: placeholder("Gerald Broflovski"),
    result: {
      headline: "Você é mais parecido com Gerald Broflovski!",
      summary: "Você tende a pensar estrategicamente, argumentar bem e ter um senso de humor provocador.",
    },
  },
];
