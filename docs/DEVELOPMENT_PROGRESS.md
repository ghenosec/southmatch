# Progresso do desenvolvimento

## 30/10/2026 — Fases 1 e 2

### Feito
- Next.js 16.4.3 + React 19.3 + TypeScript estrito + Tailwind 4, gerado com `create-next-app`
  (em pasta temporária, para não tocar em `docs/`) e copiado para o projeto.
- Vitest 5 (com cobertura) e Playwright 1.64 (desktop + mobile, contra build de produção).
- Contratos genéricos em `src/core/types`.
- Motor completo: pontuação, polaridade, pesos, distância, afinidade, ranking com desempate
  estável, interpretação, templates, validação de tema e de respostas, versões.
- Tema fictício mínimo (3 eixos, 6 perguntas, 3 personagens) rodando no mesmo motor.
- Serviço `computeThemeResult` ligando tema e motor.
- Layout base em pt-BR, tokens de cor, foco visível, movimento reduzido; página inicial provisória.
- Documentação: README, ARCHITECTURE, METHODOLOGY, TESTING (+ esqueletos de QUESTION_AUDIT e CHARACTER_PROFILES).

### Verificado
Lint ✅ · TypeScript ✅ · 132 testes Vitest ✅ · build ✅ · 4 testes Playwright ✅

### Decisões
- Validação manual (sem Zod) para manter o motor sem dependências.
- `src/styles/` omitida (tokens em `src/app/globals.css`, padrão do Tailwind 4).
- Repositório Git inicializado depois, com autorização (ver Fase 3).

### Pendências
- Revisar conflito de marca do nome "SouthMatch" antes de publicar.
- Ilustrações: usar apenas placeholders/arte original até haver recursos licenciados.

## 30/10/2026 — Fase 3: tema South Park

### Feito
- Git inicializado (branch `main` e branch de trabalho `develop`), sem commits.
- `src/themes/south-park/`: `config.ts`, `axes.ts`, `descriptions.ts`, `questions.ts`,
  `characters.ts`, `assets.ts`, `index.ts`; tema registrado em `registry.ts`.
- 9 eixos com 5 faixas interpretativas cada (45 textos).
- 45 afirmações originais, 23 diretas / 22 invertidas, apresentação intercalada por rodadas.
- 20 personagens com descrição curta e longa, traços, pontos fortes, limitações, contradições,
  vetor, justificativa, cor, placeholder de imagem e texto de resultado.
- Testes de integridade (`south-park.test.ts`) e de calibração (`calibration.test.ts`).
- `docs/QUESTION_AUDIT.md` e `docs/CHARACTER_PROFILES.md` completos (tabelas geradas a partir dos dados).

### Verificado
Lint ✅ · TypeScript ✅ · 162 testes Vitest ✅ · build ✅ · 4 testes Playwright ✅

### Achados da calibração
- Todos os 20 personagens são alcançáveis; nenhum par tem afinidade ≥ 90.
- Com perfis uniformes, todos vencem (0,9% a 12,2%).
- Com respostas aleatórias/neutras há **viés para o centro**: Heidi vence 31,6%. Causa: perfis de
  baixa confiança com valores moderados. Não foi "corrigido" artificialmente; ver opções em
  CHARACTER_PROFILES.md.

### Pendências
- **Revisão editorial humana** dos 20 perfis e das 45 afirmações (sobretudo Heidi, Scott, Timmy, Bebe).
- Teste-piloto com pessoas reais (duração, distribuição, correlação entre eixos).

## 30/10/2026 — Fase 4: experiência visual

### Feito
- Design system: tokens em `globals.css` sobrescritos pelas cores do tema, fontes Nunito + Lilita One,
  cartões de "papel recortado", botões, foco visível, movimento reduzido.
- Landing completa: hero com cena de inverno original em SVG, como funciona, os 9 eixos, prévia de
  personagens, FAQ, rodapé com aviso de independência e links.
- Questionário: uma afirmação por vez, 5 opções acessíveis (rádio nativo), avanço automático opcional
  (só por clique/toque; teclado confirma com Enter), voltar, revisão de respostas, reiniciar com confirmação,
  progresso salvo e retomada, anúncios para leitor de tela, foco gerenciado.
- Armazenamento local versionado, com expiração de 30 dias e descarte de dados inválidos.
- Resultado básico real: vencedor, afinidade, top 5 e 9 barras bipolares (Fase 5 amplia).
- Páginas de apoio funcionais: catálogo, personagem individual, metodologia, privacidade, sobre, 404.
- `proxy.ts` para 404 real em personagens inexistentes.

### Verificado
Lint ✅ · TypeScript ✅ · 191 testes Vitest ✅ · build ✅ · 53 testes Playwright ✅ · inspeção visual em 375 px e desktop

### Problemas encontrados e corrigidos
- Cabeçalho estourava a largura a 375 px → ajustado e coberto por teste a 360 px.
- `notFound()` devolvia 200 com Cache Components → resolvido no Proxy.

### Pendências
- Fase 5: gráficos (Recharts), comparação detalhada, explicações personalizadas e perfil comportamental.
- Estimativa de 7–10 minutos ainda não validada com usuários.

## 30/10/2026 — Fase 5: resultados

### Feito
- Contrato `ThemeExplanations` (opcional) + validação; textos do tema South Park em `explanations.ts`.
- Gerador genérico de explicações: justificativa, traços em comum, diferenças, 7 seções de perfil
  comportamental, pontos fortes, contradições por combinação de eixos, aviso de perfil equilibrado
  (atende a opção 2 do achado de viés para o centro).
- Página de resultado completa: vencedor, "Por que X?", top 5 com botão de comparar, ranking completo,
  9 barras bipolares, perfil comportamental, comparação com qualquer personagem (radar, barras de
  diferença, semelhanças, diferenças e tabela), copiar resumo, refazer, metodologia.
- `AxisDefinition.shortName` opcional para rótulos de gráficos.

### Verificado
Lint ✅ · TypeScript ✅ · 207 testes Vitest ✅ · build ✅ · 61 testes Playwright ✅ · inspeção visual desktop e 375 px

### Pendências
- Fase 6: link compartilhável versionado e imagem do resultado (os botões ainda não existem na página).
