# PROMPT MESTRE — DESENVOLVIMENTO DO SOUTHMATCH

**Projeto:** SouthMatch  
**Tipo:** Aplicação web de testes de personalidade e afinidade com personagens fictícios  
**Referência funcional:** https://12axes.vercel.app/  
**Tema inicial:** South Park  
**Idioma:** Português brasileiro (pt-BR)  
**Diretório de desenvolvimento:** `C:\Users\Ghebo\southmatch`  
**Objetivo:** Aplicação gratuita, anônima, responsiva, modular, reutilizável e preparada para publicação na Vercel.

---

# 1. SUA FUNÇÃO COMO IA DESENVOLVEDORA

Você atuará como uma equipe sênior multidisciplinar, assumindo as responsabilidades de:

- Arquiteto de software.
- Desenvolvedor Full Stack.
- Especialista em Next.js, React e TypeScript.
- Designer UX/UI.
- Especialista em construção de questionários comportamentais.
- Especialista em algoritmos de pontuação e afinidade.
- Engenheiro de qualidade e testes.
- Especialista em acessibilidade.
- Especialista em segurança, privacidade e performance.
- Responsável pela documentação técnica.

Sua missão é desenvolver o SouthMatch do planejamento à implementação funcional, seguindo rigorosamente os requisitos deste documento.

Não quero apenas um conceito, wireframe ou protótipo com botões sem funcionalidade.

Quero uma aplicação real, utilizável, organizada, escalável e preparada para produção.

Você deve:

1. Planejar antes de implementar.
2. Escolher soluções simples, modernas e sustentáveis.
3. Separar completamente o algoritmo dos temas.
4. Implementar funcionalidades reais.
5. Criar conteúdo completo para o teste.
6. Desenvolver uma interface visualmente marcante.
7. Escrever testes automatizados.
8. Validar cálculos matemáticos.
9. Documentar decisões técnicas.
10. Informar os arquivos e diretórios modificados.
11. Evitar funcionalidades fictícias ou incompletas.
12. Não executar deploy, commits, pushes ou merges sem minha autorização.

Trabalhe em fases, realizando o máximo de implementação possível em cada etapa e informando claramente pendências e limitações.

---

# 2. VISÃO GERAL DO SOUTHMATCH

O SouthMatch será uma aplicação web que permitirá descobrir com qual personagem de South Park o usuário mais se parece.

O funcionamento será inspirado no modelo de questionários do 12Axes, mas com identidade, conteúdo, metodologia e código próprios.

O sistema apresentará aproximadamente 45 afirmações sobre:

- Personalidade.
- Valores pessoais.
- Relações sociais.
- Amizade.
- Lealdade.
- Empatia.
- Humor.
- Ambição.
- Autoridade.
- Regras.
- Conflitos.
- Tomada de decisões.
- Comportamento em grupo.
- Visão de mundo.

Após responder às afirmações, o usuário receberá um perfil comportamental e um ranking de compatibilidade com personagens.

O objetivo é que o resultado seja divertido, mas também coerente com as respostas.

A aplicação deve transmitir a sensação de:

"Esse resultado realmente combina comigo."

O teste não terá finalidade clínica e não deverá alegar validade psicológica ou científica que não tenha sido demonstrada.

---

# 3. PROPOSTA DE VALOR

O SouthMatch terá cinco diferenciais principais.

## 3.1 Resultado individualizado

Não exibir apenas um personagem.

Mostrar também as razões da compatibilidade, características do usuário, semelhanças e diferenças.

## 3.2 Comparação multidimensional

Utilizar nove eixos de personalidade em vez de regras simplistas associadas diretamente aos personagens.

## 3.3 Experiência temática

Criar um site com atmosfera inspirada em South Park, elementos de humor e uma linguagem visual divertida.

## 3.4 Gratuito e anônimo

Não exigir cadastro, nome, telefone ou e-mail.

## 3.5 Arquitetura reutilizável

O algoritmo deverá funcionar com qualquer conjunto de personagens, categorias, perfis ou questionários compatíveis.

South Park será apenas o primeiro tema.

---

# 4. LINGUAGENS E TECNOLOGIAS OBRIGATÓRIAS

Utilizar a seguinte stack como padrão.

## 4.1 Linguagem principal

**TypeScript**

Toda a lógica de negócio, pontuação, cálculos, comparações, validações e integração com componentes deverá utilizar TypeScript.

Configurar o projeto em modo estrito.

Evitar `any`, conversões de tipo inseguras e estruturas não validadas.

## 4.2 Framework principal

**Next.js com App Router**

Utilizar uma versão estável e compatível com as dependências.

Implementar páginas, roteamento, metadata, renderização adequada e otimização de recursos.

Preferir geração estática quando tecnicamente apropriada.

## 4.3 Interface

**React**

Criar componentes reutilizáveis, tipados, acessíveis e organizados.

## 4.4 Estilização

**Tailwind CSS**

Utilizar variáveis de design, tokens de cores, espaçamentos, tipografia e temas.

Evitar estilos duplicados ou cores fixas espalhadas pelos componentes.

## 4.5 Estrutura web

Utilizar HTML5 semântico e CSS moderno.

## 4.6 Ícones

**Lucide React**

## 4.7 Gráficos

**Recharts**, se atender adequadamente às necessidades.

Implementar gráficos para:

- Nove eixos.
- Comparação entre usuário e personagem.
- Ranking.
- Diferenças entre perfis.

Priorizar legibilidade e acessibilidade.

## 4.8 Testes unitários

**Vitest**

Testar principalmente o algoritmo, os perfis e as validações.

## 4.9 Testes de interface

**Playwright**

Validar o questionário, navegação, resultados, compartilhamento e responsividade.

## 4.10 Versionamento

**Git + GitHub**

Utilizar branch de desenvolvimento e commits organizados, sempre executados somente com minha autorização.

## 4.11 Hospedagem

**Vercel**

Preparar o projeto para deploy, mas não publicar sem autorização.

## 4.12 Banco de dados

Não utilizar banco de dados na primeira versão.

As perguntas, personagens, eixos e configurações serão armazenados em arquivos TypeScript ou JSON versionados.

Os cálculos ocorrerão no navegador.

O progresso poderá ser salvo localmente no dispositivo do usuário.

## 4.13 Serviços externos

Não utilizar APIs pagas, IA generativa em tempo de execução, autenticação ou serviços externos desnecessários.

Priorizar simplicidade, velocidade, baixo custo e privacidade.

---

# 5. REQUISITO ARQUITETURAL OBRIGATÓRIO — MOTOR INDEPENDENTE

**ESTE É UM DOS REQUISITOS MAIS IMPORTANTES DO PROJETO.**

O SouthMatch deverá ser construído como uma aplicação modular orientada a dados.

O motor de personalidade não poderá depender do tema South Park.

O tema South Park não poderá conter regras matemáticas próprias de pontuação.

A interface não poderá conter o algoritmo diretamente.

Cada camada terá responsabilidades específicas e limites bem definidos.

## 5.1 As três camadas principais

### Camada A — Motor de personalidade

Responsável por:

- Interpretar respostas.
- Normalizar valores.
- Aplicar polaridades.
- Calcular eixos.
- Aplicar pesos.
- Calcular distâncias.
- Calcular afinidades.
- Ordenar perfis.
- Identificar diferenças.
- Identificar semelhanças.
- Validar estruturas.
- Produzir dados para explicações.

Deverá funcionar exclusivamente a partir de dados genéricos recebidos.

Exemplo:

Entrada:
- Respostas do usuário.
- Definição dos eixos.
- Definição das perguntas.
- Perfis de comparação.

Saída:
- Perfil numérico do usuário.
- Ranking de afinidade.
- Distâncias por eixo.
- Dados estruturados de interpretação.

O motor não poderá conter referências aos nomes Cartman, Stan, Kyle ou South Park.

### Camada B — Temas

Cada tema será um pacote de conteúdo e configuração.

O pacote South Park deverá conter:

- Identificador.
- Nome.
- Descrição.
- Configuração visual.
- Perguntas.
- Eixos.
- Personagens.
- Perfis numéricos.
- Textos.
- Ilustrações autorizadas.
- Explicações.
- Versão editorial.

Futuramente poderão existir outros pacotes.

Exemplos hipotéticos:

- South Park.
- Os Simpsons.
- The Office.
- Personagens históricos.
- Arquétipos comportamentais originais.

O motor deverá funcionar com todos, desde que os pacotes respeitem o contrato de dados.

### Camada C — Interface

Responsável por:

- Exibir conteúdo.
- Capturar respostas.
- Controlar navegação.
- Mostrar progresso.
- Apresentar resultados.
- Renderizar gráficos.
- Compartilhar resultados.

Os componentes deverão receber dados e configurações por propriedades.

Não escrever lógica especial como:

"Se o tema for South Park, usar outra fórmula."

Não escrever lógica especial como:

"Se o personagem for Cartman, adicionar pontos."

A arquitetura deve eliminar esse tipo de acoplamento.

## 5.2 Regra de dependência

O motor não pode importar arquivos de temas.

O motor não pode importar React.

O motor não pode acessar elementos do navegador.

O motor não pode depender de APIs externas.

O motor deve ser composto preferencialmente de funções puras e determinísticas.

Os temas podem importar contratos de tipo do motor.

A interface pode consumir o motor e os temas por meio de serviços de aplicação.

## 5.3 Estrutura obrigatória

Utilizar como referência:

```text
C:\Users\Ghebo\southmatch\
│
├── src\
│   ├── app\
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── quiz\
│   │   │   └── page.tsx
│   │   ├── resultado\
│   │   │   └── page.tsx
│   │   ├── personagens\
│   │   │   ├── page.tsx
│   │   │   └── [slug]\
│   │   │       └── page.tsx
│   │   ├── metodologia\
│   │   ├── privacidade\
│   │   └── sobre\
│   │
│   ├── core\
│   │   ├── types\
│   │   ├── scoring\
│   │   ├── affinity\
│   │   ├── ranking\
│   │   ├── validation\
│   │   └── interpretation\
│   │
│   ├── themes\
│   │   ├── registry.ts
│   │   ├── south-park\
│   │   │   ├── config.ts
│   │   │   ├── axes.ts
│   │   │   ├── questions.ts
│   │   │   ├── characters.ts
│   │   │   ├── descriptions.ts
│   │   │   └── assets.ts
│   │   └── example-theme\
│   │
│   ├── components\
│   │   ├── layout\
│   │   ├── landing\
│   │   ├── quiz\
│   │   ├── results\
│   │   ├── characters\
│   │   ├── charts\
│   │   └── ui\
│   │
│   ├── services\
│   │   └── quiz\
│   │
│   ├── lib\
│   │   ├── storage\
│   │   ├── sharing\
│   │   └── export\
│   │
│   └── styles\
│
├── public\
│   └── themes\
│       └── south-park\
│
├── tests\
│   ├── core\
│   ├── themes\
│   ├── integration\
│   └── e2e\
│
├── docs\
│   ├── ARCHITECTURE.md
│   ├── METHODOLOGY.md
│   ├── QUESTION_AUDIT.md
│   ├── CHARACTER_PROFILES.md
│   └── TESTING.md
│
├── package.json
├── tsconfig.json
└── README.md
```

Poderá ajustar detalhes dessa estrutura quando houver justificativa técnica, preservando obrigatoriamente a separação de responsabilidades.

## 5.4 Contrato genérico de temas

Criar interfaces TypeScript para representar:

- ThemeDefinition.
- AxisDefinition.
- QuestionDefinition.
- ProfileDefinition.
- CharacterDefinition.
- AnswerDefinition.
- QuizResult.
- AffinityResult.
- InterpretationResult.

Os identificadores dos eixos devem ser configuráveis.

O motor não poderá assumir a existência de nove eixos.

O tema South Park utilizará nove, mas outro tema poderá utilizar cinco, oito ou doze.

Da mesma forma, o motor não poderá exigir exatamente 45 perguntas ou 20 personagens.

Essas quantidades pertencem à configuração de cada tema.

Validar os dados na inicialização do teste ou durante o build.

## 5.5 Critério obrigatório de reutilização

Criar um tema fictício mínimo para testes arquiteturais.

Esse tema deverá possuir:

- Três eixos.
- Seis perguntas.
- Três personagens fictícios.

Executar o mesmo motor com esse tema e com South Park.

Se for necessário alterar funções matemáticas para adicionar o segundo tema, a arquitetura não estará devidamente desacoplada.

## 5.6 Versionamento

Separar três versões:

- Versão do formato de dados.
- Versão do algoritmo.
- Versão editorial dos perfis do tema.

Alterações em personagens não deverão exigir mudanças na lógica de cálculo.

Alterações no algoritmo não deverão exigir a reescrita do conteúdo dos personagens, salvo mudanças de contrato devidamente documentadas.

---

# 6. DESIGN E IDENTIDADE VISUAL

O SouthMatch deverá ter uma identidade visual própria, divertida e reconhecível.

A referência artística será o clima visual de South Park, sem reproduzir indevidamente sua identidade protegida.

Elementos desejados:

- Montanhas nevadas.
- Céu azul.
- Cidade pequena.
- Árvores com neve.
- Cartões com aparência de papel recortado.
- Cores vibrantes.
- Silhuetas simples.
- Animações discretas.
- Humor visual.
- Botões grandes.
- Tipografia clara.

A interface deve parecer um produto de entretenimento, não um painel administrativo.

## 6.1 Paleta sugerida

Utilizar uma paleta configurável, com:

- Azul-claro como cor de destaque.
- Branco-neve para superfícies.
- Azul-escuro para contraste.
- Vermelho para detalhes de interação.
- Amarelo para destaques e conquistas.
- Cinzas neutros para textos secundários.

Os valores finais poderão ser refinados durante o design.

## 6.2 Características visuais

O site deve ser:

- Moderno.
- Responsivo.
- Fluido.
- Divertido.
- Leve.
- Legível.
- Acessível.

Evitar excesso de animações e efeitos que prejudiquem o carregamento.

## 6.3 Direitos autorais

South Park e seus personagens pertencem aos respectivos titulares de direitos.

Não utilizar logotipos, imagens oficiais, capturas de tela ou ilustrações derivadas protegidas sem autorização adequada.

Na primeira implementação, usar placeholders e ilustrações originais independentes enquanto não houver recursos devidamente licenciados.

Adicionar aviso de projeto independente de fãs, sem afiliação com os titulares.

O aviso não deve ser tratado como autorização de uso.

Revisar também eventuais conflitos de marca relacionados ao nome SouthMatch antes da publicação.

---

# 7. PÁGINA INICIAL

Rota:

`/`

Título principal:

**Qual personagem de South Park você seria?**

Subtítulo:

"Descubra quem mais combina com a sua personalidade."

Descrição:

"Responda a 45 afirmações sobre seu jeito de pensar, agir e lidar com o mundo. No final, descubra qual personagem de South Park mais se parece com você."

## 7.1 Elementos necessários

- Hero temático.
- Nome SouthMatch.
- Botão "Começar teste".
- Informação sobre as 45 perguntas.
- Duração estimada de 7 a 10 minutos, sujeita à validação.
- Informação de gratuidade.
- Informação de anonimato.
- Explicação do funcionamento.
- Prévia dos nove eixos.
- Alguns personagens do catálogo.
- FAQ.
- Rodapé.
- Links para metodologia e privacidade.
- Aviso de independência.

## 7.2 Experiência

O usuário deve conseguir iniciar o questionário imediatamente.

Não colocar formulários de cadastro, pop-ups desnecessários ou etapas artificiais.

---

# 8. QUESTIONÁRIO DE PERSONALIDADE

Rota:

`/quiz`

O questionário inicial do South Park terá exatamente 45 afirmações.

Cada uma utilizará cinco opções:

1. Discordo totalmente.
2. Discordo.
3. Neutro / Não sei.
4. Concordo.
5. Concordo totalmente.

## 8.1 Interface

Exibir uma afirmação por vez.

Mostrar:

- Número da pergunta.
- Barra de progresso.
- Enunciado.
- Cinco opções.
- Botão "Voltar".
- Botão de avanço quando necessário.
- Opção de reiniciar.

A navegação deverá permitir revisar e alterar respostas.

## 8.2 Persistência

Salvar o progresso no armazenamento local do navegador.

Utilizar uma chave versionada, vinculada ao tema.

Não compartilhar automaticamente as respostas.

Se houver progresso anterior, oferecer continuar ou reiniciar.

Implementar expiração ou invalidação segura para versões incompatíveis.

## 8.3 Acessibilidade

- Navegação por teclado.
- Botões e opções acessíveis.
- Labels descritivos.
- Feedback de seleção.
- Foco visível.
- Mensagens de progresso acessíveis.
- Suporte a dispositivos móveis.
- Respeito a preferências de movimento reduzido.

## 8.4 Experiência de interação

O usuário deve perceber claramente quando uma resposta foi registrada.

Permitir avanço automático opcional, sem impedir mudanças.

Não perder respostas ao navegar entre perguntas.

---

# 9. OS NOVE EIXOS DO SOUTHMATCH

O tema South Park utilizará nove dimensões.

Cada uma será expressa em uma escala de 0 a 100.

| ID | Eixo | Valor 0 | Valor 100 |
|---|---|---|---|
| sociability | Sociabilidade | Reservado | Extrovertido |
| empathy | Empatia | Individualista | Empático |
| authority | Regras e autoridade | Rebelde | Disciplinado |
| decision | Tomada de decisão | Impulsivo | Analítico |
| conflict | Conflitos | Conciliador | Confrontador |
| ambition | Motivação | Desapegado | Ambicioso |
| humor | Humor | Sério | Sarcástico |
| loyalty | Lealdade | Independente | Leal ao grupo |
| worldview | Visão de mundo | Idealista | Pragmático |

O centro da escala será 50.

Nenhum polo será considerado automaticamente melhor ou pior.

Cada eixo deverá possuir:

- ID.
- Nome.
- Polo inicial.
- Polo final.
- Descrição.
- Interpretações por faixa.
- Peso padrão.

Os eixos devem ser independentes, sem pressupor que determinado traço exige outro.

Documentar limitações e possíveis sobreposições entre dimensões.

---

# 10. ELABORAÇÃO DAS 45 PERGUNTAS

Criar cinco afirmações para cada eixo.

Todas as perguntas devem ser originais.

## 10.1 Regras de elaboração

- Linguagem natural em português brasileiro.
- Frases simples e claras.
- Situações reconhecíveis.
- Equilíbrio entre afirmações diretas e invertidas.
- Evitar frases ambíguas.
- Evitar perguntas com duas ideias simultâneas.
- Evitar repetição.
- Não mencionar personagens.
- Não exigir conhecimento de South Park.
- Não associar diretamente respostas a nomes de personagens.
- Evitar vieses que favoreçam determinados resultados.

## 10.2 Exemplos de afirmações

"Prefiro passar meu tempo com um grupo de pessoas do que ficar sozinho."

"Quando alguém está passando por dificuldades, costumo me colocar no lugar dessa pessoa."

"Se considero uma regra injusta, tenho dificuldade em simplesmente obedecê-la."

"Antes de tomar uma decisão importante, costumo analisar as possíveis consequências."

"Não tenho medo de confrontar alguém quando discordo de suas atitudes."

"Gosto de competir e alcançar objetivos que outras pessoas consideram difíceis."

"Costumo usar sarcasmo para tornar conversas mais divertidas."

"Mesmo quando discordo de um amigo, tento permanecer ao lado dele."

"Para mim, uma solução prática geralmente vale mais do que uma ideia bonita."

Esses são exemplos. Criar o conjunto definitivo de 45 afirmações com revisão editorial.

## 10.3 Modelo das perguntas

Cada pergunta deverá conter:

- ID estável.
- Texto.
- ID do eixo.
- Polaridade.
- Peso.
- Grupo de apresentação.

A ordem visual não poderá interferir no cálculo.

## 10.4 Balanceamento

Distribuir afirmações diretas e invertidas entre os eixos.

Criar testes que validem essa distribuição.

Não definir pesos diferentes sem uma justificativa explícita.

---

# 11. CATÁLOGO DE PERSONAGENS

Implementar inicialmente 20 personagens.

1. Eric Cartman.
2. Stan Marsh.
3. Kyle Broflovski.
4. Kenny McCormick.
5. Butters Stotch.
6. Randy Marsh.
7. Wendy Testaburger.
8. Craig Tucker.
9. Tweek Tweak.
10. Jimmy Valmer.
11. Timmy Burch.
12. Tolkien Black.
13. Clyde Donovan.
14. Bebe Stevens.
15. Mr. Garrison.
16. Chef.
17. PC Principal.
18. Scott Malkinson.
19. Heidi Turner.
20. Gerald Broflovski.

## 11.1 Modelo do personagem

Cada personagem deverá conter:

- ID.
- Nome.
- Slug.
- Descrição curta.
- Descrição detalhada.
- Traços predominantes.
- Pontos fortes.
- Limitações.
- Contradições.
- Valores nos nove eixos.
- Justificativa editorial.
- Cor temática.
- Referência de imagem.
- Conteúdos para o resultado.

## 11.2 Construção dos perfis

Pesquisar e revisar os comportamentos recorrentes dos personagens.

Considerar:

- Relações sociais.
- Atitudes.
- Valores.
- Conflitos.
- Humor.
- Motivação.
- Desenvolvimento ao longo da série.

Evitar inventar eventos e características.

Não atribuir valores apenas para fazer um personagem aparecer com maior frequência.

## 11.3 Qualidade da comparação

Os perfis deverão apresentar diferenças suficientes para produzir resultados úteis.

Não tornar personagens artificialmente extremos.

Documentar personagens com características semelhantes e como serão diferenciados.

Criar um relatório de calibração.

---

# 12. ALGORITMO MATEMÁTICO

O resultado deverá ser determinístico e auditável.

Não utilizar sorteios.

Não utilizar IA generativa durante a execução do teste.

## 12.1 Conversão das respostas

Mapear:

- Discordo totalmente = 0.
- Discordo = 0,25.
- Neutro = 0,50.
- Concordo = 0,75.
- Concordo totalmente = 1.

Para perguntas invertidas:

`valor_ajustado = 1 - valor_original`

## 12.2 Cálculo por eixo

Calcular a média ponderada dos valores ajustados.

Fórmula:

`eixo = 100 × soma(valor_ajustado × peso) / soma(peso)`

Validar divisões, valores ausentes e pesos inválidos.

O resultado de cada eixo deverá ficar entre 0 e 100.

## 12.3 Afinidade entre perfis

Utilizar distância euclidiana ponderada e normalizada.

Fórmula:

`distância = sqrt(soma(peso × (usuário - personagem)²) / soma(pesos)) / 100`

Afinidade:

`afinidade = 100 × (1 - distância)`

O sistema deverá verificar matematicamente que a afinidade pertence ao intervalo entre 0 e 100.

Utilizar inicialmente pesos iguais para todos os eixos.

## 12.4 Interpretação das porcentagens

A porcentagem será um índice de similaridade calculado.

Não representar o resultado como:

- Probabilidade científica.
- Diagnóstico psicológico.
- Medida de identidade.
- Percentual de características biológicas.
- Conclusão clínica.

## 12.5 Ranking

Comparar o perfil do usuário com todos os personagens.

Ordenar por maior afinidade.

Retornar:

- Personagem vencedor.
- Ranking completo.
- Cinco melhores resultados.
- Diferenças por eixo.
- Semelhanças principais.
- Diferenças principais.

Definir critério de desempate estável.

Não usar popularidade do personagem como desempate.

## 12.6 Calibração

Criar testes para identificar:

- Personagens favorecidos.
- Perfis inalcançáveis.
- Empates excessivos.
- Sensibilidade exagerada.
- Resultados incoerentes.
- Personagens com vetores praticamente idênticos.

Implementar cenários simulados.

Investigar se respostas próximas resultam em perfis próximos.

Não alterar o algoritmo apenas para produzir rankings aparentemente mais divertidos.

---

# 13. SISTEMA DE EXPLICAÇÕES

Desenvolver explicações personalizadas sem depender de IA generativa.

O sistema deverá interpretar os dados calculados.

## 13.1 Explicação do personagem vencedor

Mostrar:

- Principais traços em comum.
- Diferenças relevantes.
- Tendências de personalidade.
- Justificativa para a compatibilidade.

## 13.2 Explicações condicionais

Utilizar regras e templates baseados em:

- Pontuação absoluta dos eixos.
- Proximidade entre usuário e personagem.
- Diferenças mais relevantes.
- Combinação de características.

Exemplo:

"Você e Stan demonstram tendências semelhantes ao lidar com amizades e decisões difíceis."

Essa mensagem só poderá aparecer quando os valores efetivamente sustentarem a interpretação.

## 13.3 Integridade das explicações

Criar testes para impedir contradições.

Não afirmar que o usuário é altamente extrovertido quando sua pontuação de sociabilidade indicar o contrário.

Evitar mensagens excessivamente absolutas.

Preferir expressões como:

- "Você tende a..."
- "Suas respostas sugerem..."
- "Neste teste, você demonstrou..."
- "Seu perfil apresenta..."

---

# 14. PÁGINA DE RESULTADOS

Rota:

`/resultado`

A página de resultados será uma das áreas mais importantes da aplicação.

Deverá ser visualmente atrativa e informativa.

## 14.1 Resultado principal

Exibir:

- Personagem mais compatível.
- Nome.
- Ilustração autorizada ou placeholder.
- Índice de afinidade.
- Mensagem personalizada.
- Características predominantes.

Exemplo ilustrativo:

"Você é mais parecido com Stan Marsh!"

"Afinidade: 87%"

O valor mostrado deverá ser calculado, nunca fixado no componente.

## 14.2 Ranking

Mostrar os cinco personagens mais compatíveis.

Cada personagem terá:

- Nome.
- Imagem.
- Afinidade.
- Descrição curta.
- Ação para comparar.

## 14.3 Nove eixos

Mostrar barras bipolares com:

- Nome.
- Valor.
- Polos.
- Marcador central.
- Breve interpretação.

## 14.4 Comparação detalhada

Permitir selecionar personagens e comparar:

- Usuário versus personagem.
- Pontuação por eixo.
- Diferença numérica.
- Principais semelhanças.
- Principais diferenças.

Adicionar gráfico radar se ele melhorar a experiência.

Oferecer alternativa textual acessível.

## 14.5 Perfil comportamental

Criar seções como:

- Seu jeito de lidar com pessoas.
- Sua relação com amizades.
- Sua reação a conflitos.
- Seu senso de humor.
- Seu comportamento diante de regras.
- Seu estilo de decisão.
- Suas motivações.
- Seus pontos fortes.
- Suas contradições.

Gerar esses conteúdos com base nas respostas e pontuações.

## 14.6 Ações

Disponibilizar:

- Refazer teste.
- Copiar resultado.
- Compartilhar.
- Baixar imagem.
- Comparar personagens.
- Ver metodologia.

---

# 15. COMPARTILHAMENTO

Implementar links compartilháveis sem exigir cadastro.

## 15.1 Estratégia

Codificar o perfil resumido do usuário em um formato compacto, validado e versionado.

Evitar incluir todas as 45 respostas individuais no endereço.

Não incluir identificadores pessoais.

## 15.2 Versionamento

Registrar no resultado compartilhável:

- Identificador do tema.
- Versão do formato.
- Versão do algoritmo.
- Versão dos perfis.
- Valores resumidos dos eixos.

A reconstrução do resultado deverá usar a versão correta dos perfis e do algoritmo, ou informar quando ela não estiver mais disponível.

Não recalcular silenciosamente resultados antigos com perfis novos.

## 15.3 Privacidade

Informar que pessoas com o link poderão visualizar as características compartilhadas.

Não enviar respostas a serviços externos sem necessidade.

Evitar ferramentas de análise que coletem o conteúdo dos links.

Preferir, se tecnicamente viável, codificação dos dados no fragmento da URL, validando o funcionamento de compartilhamento e pré-visualizações sociais.

## 15.4 Imagem de resultado

Permitir gerar uma imagem contendo:

- Nome do projeto.
- Personagem vencedor.
- Afinidade.
- Características predominantes.
- Resumo do perfil.
- Endereço do site.

Usar geração local quando possível.

Evitar usar imagens de terceiros sem licença adequada.

---

# 16. PÁGINAS DA APLICAÇÃO

Implementar:

### `/`

Landing page.

### `/quiz`

Questionário.

### `/resultado`

Resultado individual ou compartilhado.

### `/personagens`

Catálogo de personagens.

### `/personagens/[slug]`

Página individual do personagem.

### `/metodologia`

Explicação do cálculo e limitações.

### `/privacidade`

Política de privacidade.

### `/sobre`

Informações sobre o projeto.

O site deverá ter navegação clara entre as páginas.

---

# 17. EXPERIÊNCIA MOBILE

Priorizar smartphones.

O questionário deverá funcionar confortavelmente em telas pequenas.

Garantir:

- Botões com áreas de toque adequadas.
- Textos legíveis.
- Ausência de rolagem horizontal.
- Barra de progresso visível.
- Respostas claramente separadas.
- Navegação simples.
- Gráficos responsivos.
- Compartilhamento compatível com dispositivos móveis.

---

# 18. ACESSIBILIDADE

Implementar boas práticas alinhadas à WCAG 2.2 AA, quando aplicáveis.

Incluir:

- HTML semântico.
- Hierarquia de títulos.
- Navegação por teclado.
- Foco visível.
- Labels.
- Contraste adequado.
- Textos alternativos.
- Gráficos acompanhados de dados textuais.
- Respeito a movimento reduzido.
- Feedback acessível de erros.
- Mensagens claras sobre progresso.

---

# 19. SEGURANÇA E PRIVACIDADE

O SouthMatch não exigirá autenticação.

Preferir processamento no cliente.

Não armazenar dados pessoais no servidor.

Validar:

- Configurações dos temas.
- Perguntas.
- Respostas.
- Perfis.
- URLs compartilhadas.
- Dados carregados do armazenamento local.

Não confiar em informações externas sem validação.

Não utilizar execução dinâmica de código.

Não utilizar `eval`.

Não inserir HTML arbitrário a partir de parâmetros da URL.

Aplicar boas práticas de segurança para aplicações Next.js.

Implementar política de privacidade coerente com os serviços efetivamente utilizados.

Evitar afirmar anonimato absoluto se a hospedagem ou terceiros processarem endereços IP e outros dados técnicos de conexão.

---

# 20. DESEMPENHO

A aplicação deverá ser rápida.

Adotar:

- Code splitting quando apropriado.
- Carregamento otimizado de imagens.
- Geração estática quando possível.
- Minimização de JavaScript desnecessário.
- Redução de dependências.
- Animações leves.
- Cache adequado de recursos estáticos.

O cálculo dos resultados deve ocorrer sem atrasos artificiais.

O usuário não deverá precisar esperar por requisições externas para descobrir seu personagem.

---

# 21. SEO E COMPARTILHAMENTO SOCIAL

Preparar:

- Títulos de páginas.
- Meta descriptions.
- Open Graph.
- Twitter Cards.
- Sitemap.
- Robots.
- URLs legíveis.
- Conteúdo semântico.

As páginas dos personagens devem ter metadados próprios.

Não prometer pré-visualização dinâmica de resultados individuais com arquitetura puramente client-side sem avaliar suas limitações.

Se for necessário um serviço para gerar previews personalizados, apresentar a proposta antes de implementá-lo.

---

# 22. TESTES OBRIGATÓRIOS

## 22.1 Testes matemáticos

Verificar:

1. Conversão das cinco respostas.
2. Tratamento de perguntas invertidas.
3. Aplicação de pesos.
4. Cálculo por eixo.
5. Limites de 0 a 100.
6. Distância entre perfis.
7. Afinidade.
8. Ordenação do ranking.
9. Tratamento de empates.
10. Determinismo.

## 22.2 Testes dos dados

Verificar:

1. Exatamente 45 perguntas no tema South Park.
2. Cinco perguntas por eixo.
3. Nove eixos válidos.
4. Vinte personagens.
5. IDs únicos.
6. Perfis completos.
7. Valores numéricos válidos.
8. Descrições obrigatórias.
9. Polaridades corretas.
10. Configuração consistente.

## 22.3 Testes arquiteturais

Verificar que:

- O motor não depende de South Park.
- O motor não depende de React.
- O motor funciona com um tema fictício mínimo.
- Não existem regras especiais por personagem.
- O algoritmo aceita diferentes quantidades de eixos e perguntas.
- O mesmo motor processa vários temas.

## 22.4 Testes de interface

Verificar:

- Iniciar teste.
- Selecionar resposta.
- Voltar.
- Alterar resposta.
- Avançar.
- Retomar progresso.
- Finalizar.
- Exibir resultado.
- Comparar personagens.
- Compartilhar.
- Reiniciar.

## 22.5 Testes de privacidade

Verificar:

- Ausência de envio indevido de respostas.
- Armazenamento local correto.
- Limpeza dos dados.
- Validação de links.
- Tratamento de links corrompidos.

## 22.6 Testes de calibração

Criar perfis simulados e avaliar a distribuição dos vencedores.

Verificar que todos os personagens podem ser alcançados por perfis válidos.

Verificar estabilidade e coerência dos rankings.

## 22.7 Validação final

Executar:

- Lint.
- TypeScript.
- Testes unitários.
- Testes de integração.
- Testes end-to-end.
- Build de produção.

Não declarar testes aprovados sem executá-los.

---

# 23. DOCUMENTAÇÃO OBRIGATÓRIA

Criar:

## `README.md`

Descrição, instalação, execução, testes e deploy.

## `docs/ARCHITECTURE.md`

Arquitetura modular, responsabilidades e contratos.

## `docs/METHODOLOGY.md`

Explicação dos eixos e do algoritmo.

## `docs/QUESTION_AUDIT.md`

Relação das 45 perguntas, classificação e revisão.

## `docs/CHARACTER_PROFILES.md`

Descrição e justificativas dos perfis dos 20 personagens.

## `docs/TESTING.md`

Testes, cenários de validação e resultados.

Documentar também:

- Como adicionar perguntas.
- Como adicionar personagens.
- Como criar novos temas.
- Como alterar pesos.
- Como versionar perfis.
- Como configurar recursos visuais.
- Como publicar na Vercel.

---

# 24. FASES DE IMPLEMENTAÇÃO

Executar o desenvolvimento nesta ordem.

## Fase 1 — Fundação

- Inspecionar o ambiente.
- Verificar se o diretório existe e se já contém trabalho.
- Não sobrescrever arquivos existentes sem avaliação.
- Inicializar Next.js.
- Configurar TypeScript.
- Configurar Tailwind.
- Configurar testes.
- Criar estrutura modular.
- Criar contratos genéricos.
- Criar documentação inicial.

## Fase 2 — Motor independente

- Implementar normalização.
- Implementar cálculo por eixo.
- Implementar pesos e polaridades.
- Implementar distância.
- Implementar afinidade.
- Implementar ranking.
- Implementar validações.
- Criar testes unitários.

## Fase 3 — Tema South Park

- Criar os nove eixos.
- Escrever as 45 afirmações.
- Definir os 20 personagens.
- Criar perfis.
- Criar descrições.
- Documentar justificativas.
- Validar integridade dos dados.

## Fase 4 — Experiência visual

- Implementar landing page.
- Criar design system.
- Implementar questionário.
- Implementar progresso.
- Implementar navegação.
- Implementar armazenamento local.
- Refinar responsividade.

## Fase 5 — Resultados

- Implementar cálculo final.
- Implementar personagem vencedor.
- Implementar ranking.
- Implementar gráficos.
- Implementar comparação.
- Implementar explicações.

## Fase 6 — Compartilhamento

- Implementar formato versionado.
- Implementar codificação.
- Implementar decodificação.
- Implementar compartilhamento.
- Implementar exportação de imagem.

## Fase 7 — Catálogo e conteúdo

- Implementar catálogo.
- Implementar páginas individuais.
- Implementar metodologia.
- Implementar privacidade.
- Implementar página sobre.

## Fase 8 — Calibração e qualidade

- Executar testes de distribuição.
- Revisar coerência dos resultados.
- Revisar textos.
- Corrigir problemas.
- Validar mobile.
- Validar acessibilidade.
- Otimizar carregamento.

## Fase 9 — Preparação para publicação

- Executar testes finais.
- Validar build.
- Preparar variáveis de ambiente, se necessárias.
- Preparar instruções de deploy.
- Revisar SEO.
- Revisar questões de direitos autorais.
- Entregar checklist de publicação.

Não executar o deploy sem autorização.

---

# 25. REGRAS DE SEGURANÇA DO DESENVOLVIMENTO

O desenvolvimento deverá ocorrer exclusivamente no projeto SouthMatch.

Diretório padrão:

`C:\Users\Ghebo\southmatch`

Não alterar:

`C:\Users\Ghebo\indika1-v3`

Não alterar outros projetos ou arquivos pessoais.

Antes de qualquer operação Git que possa eliminar alterações locais, verificar o estado do repositório.

Não executar automaticamente:

- `git reset --hard`.
- `git clean -fd`.
- Force push.
- Merge.
- Rebase destrutivo.
- Exclusão de branches.
- Deploy em produção.

Não fazer commits ou pushes sem minha autorização.

Não armazenar credenciais no repositório.

Não expor segredos em logs.

Utilizar comandos compatíveis com Windows PowerShell quando precisar apresentar instruções de terminal.

---

# 26. CRITÉRIOS DE ACEITAÇÃO DO MVP

O MVP será considerado funcional quando:

- O site abrir corretamente.
- A página inicial estiver finalizada.
- O usuário conseguir iniciar sem cadastro.
- Existirem 45 afirmações reais.
- As respostas puderem ser alteradas.
- O progresso for preservado localmente.
- Os nove eixos forem calculados corretamente.
- Os 20 personagens forem comparados.
- O personagem vencedor for determinado pelo algoritmo.
- Os cinco melhores resultados forem exibidos.
- Os gráficos funcionarem.
- As explicações forem coerentes.
- A comparação detalhada funcionar.
- O resultado puder ser compartilhado.
- A imagem do resultado puder ser exportada.
- O usuário puder reiniciar.
- A interface funcionar em mobile.
- O algoritmo funcionar com outro tema fictício sem alterações.
- Os testes principais estiverem aprovados.
- O build de produção funcionar.
- A documentação estiver completa.
- Não houver dependência de API paga.
- Os recursos gráficos estiverem adequados para publicação do ponto de vista de licenças e permissões.

---

# 27. INSTRUÇÃO FINAL PARA INICIAR O TRABALHO

Analise integralmente este documento.

Acesse https://12axes.vercel.app/ para compreender a experiência funcional de referência, quando o acesso estiver disponível.

Não copie o código, as perguntas, o design ou o conteúdo do site.

Antes de implementar, apresente um resumo técnico contendo:

1. Arquitetura escolhida.
2. Tecnologias e versões.
3. Estrutura de diretórios.
4. Contratos do motor genérico.
5. Modelo de dados dos temas.
6. Algoritmo matemático.
7. Estratégia de testes.
8. Sequência das fases.

Em seguida, inicie a **Fase 1 — Fundação**, criando os arquivos e configurações necessários.

Não encerre a execução apenas com um planejamento quando tiver capacidade de implementar.

Em cada entrega, informe:

- O que foi desenvolvido.
- O que está funcionando.
- Os arquivos criados ou modificados, incluindo seus diretórios.
- Os testes executados e seus resultados.
- Os problemas encontrados.
- As pendências.
- A próxima etapa.

Não declare conclusão de uma fase quando os critérios correspondentes não tiverem sido atendidos.

Se houver dependência de uma revisão manual de conteúdo ou recurso visual autorizado, registre a pendência e continue as partes independentes que puderem ser implementadas com segurança.

**OBJETIVO FINAL**

Entregar o SouthMatch como uma aplicação web de entretenimento, gratuita e anônima, que compara a personalidade do usuário com personagens de South Park utilizando um algoritmo matemático consistente, explicável e reutilizável.

O projeto deverá começar com South Park, mas sua arquitetura deverá permitir criar outros testes no futuro sem reescrever o motor de personalidade.

A aplicação deve ser divertida, visualmente marcante, tecnicamente organizada, fácil de manter e preparada para evoluir para uma plataforma de questionários e testes de afinidade.