# Arquitetura do SouthMatch

## Visão geral

Aplicação **orientada a dados** em três camadas, com dependências em um único sentido:

```text
            ┌────────────────────────────┐
            │  C. Interface (src/app,    │
            │     src/components)        │
            └─────────────┬──────────────┘
                          │ usa
            ┌─────────────▼──────────────┐
            │  Serviços (src/services,   │   ← liga tema + motor
            │  src/lib)                  │
            └──────┬──────────────┬──────┘
                   │ usa          │ usa
     ┌─────────────▼───┐   ┌──────▼──────────────┐
     │ B. Temas         │──▶│ A. Motor (src/core) │
     │ (src/themes)     │ só│ funções puras       │
     │ conteúdo + dados │tipos                    │
     └──────────────────┘   └─────────────────────┘
```

| Camada | Pasta | Pode importar | Não pode importar |
|---|---|---|---|
| A. Motor | `src/core` | apenas arquivos do próprio `src/core` | React, Next, temas, navegador, rede |
| B. Temas | `src/themes` | `@/core/types`, `@/core/version` | lógica do motor, componentes, serviços |
| Serviços | `src/services`, `src/lib` | motor e temas | componentes |
| C. Interface | `src/app`, `src/components` | serviços, temas, tipos | — (mas nunca contém fórmulas) |

Essas regras são verificadas automaticamente em `tests/core/architecture.test.ts`
(análise dos `import` e de palavras proibidas como `window`, `react`, `Math.random`, nomes de personagens).

## Stack

| Item | Versão |
|---|---|
| Node.js | ≥ 22 (desenvolvido em 24.13) |
| Next.js (App Router, Turbopack, Cache Components) | 16.4.3 |
| React | 19.3 |
| TypeScript (strict + `noUncheckedIndexedAccess`) | 5.x |
| Tailwind CSS | 4.x |
| Lucide React | 1.x |
| Recharts | 3.x |
| Vitest (+ coverage v8) | 5.x |
| Playwright | 1.64 |

Sem banco de dados, sem autenticação, sem APIs externas em tempo de execução.
Todo cálculo roda no navegador do usuário.

## Estrutura

```text
src/
  app/                 rotas (App Router)
  core/                A. motor genérico
    types/             contratos (engine.ts, theme.ts)
    scoring/           respostas → pontuação por eixo
    affinity/          distância e afinidade
    ranking/           ordenação e desempate
    interpretation/    números → categorias interpretáveis + templates
    validation/        validação de temas e respostas
    engine.ts          runQuiz(): ponto de entrada
    version.ts         DATA_FORMAT_VERSION, ALGORITHM_VERSION
  themes/              B. pacotes de conteúdo
    registry.ts        lista de temas
    shared/            peças reutilizáveis (escala Likert pt-BR)
    example-theme/     tema fictício mínimo (3 eixos, 6 perguntas, 3 perfis)
    south-park/        tema principal (Fase 3)
  services/quiz/       tema + motor → resultado pronto para a interface
  lib/storage|sharing|export   persistência local, links, imagem (Fases 4–6)
  components/          C. componentes de interface (Fases 4–7)
tests/
  core/  themes/  integration/  e2e/
```

Ajustes em relação à estrutura de referência:

- `src/styles/` foi omitida: com Tailwind 4 os tokens de design ficam em `src/app/globals.css` (`@theme`).
- `src/themes/shared/` foi adicionada para conteúdo reutilizável entre temas (escala de respostas).
- `src/core/engine.ts` concentra o fluxo completo para que serviços não precisem orquestrar módulos.

## Contratos principais (`src/core/types`)

| Tipo | Papel |
|---|---|
| `AxisDefinition` | eixo: id, nome, polos, descrição, faixas interpretativas, peso |
| `QuestionDefinition` | pergunta: id estável, texto, eixo, polaridade, peso, grupo |
| `AnswerDefinition` / `AnswerOption` | escala de respostas com valores 0–1 |
| `ProfileDefinition` | o mínimo comparável: `id` + `scores` |
| `CharacterDefinition` | perfil + conteúdo editorial (descrições, traços, cor, imagem, justificativa) |
| `ThemeDefinition` | pacote completo: metadados, versões, visual, textos, escala, eixos, perguntas, personagens |
| `UserProfile` | pontuação calculada + cobertura por eixo |
| `AffinityResult` | afinidade, distância, posição, comparação por eixo |
| `QuizResult` | versões, perfil, ranking, vencedor, top N |
| `InterpretationResult` | faixas, direção/intensidade, traços em comum e diferenças |

O motor **não assume** quantidades: aceita qualquer número de eixos, perguntas e perfis
(testado com 1, 2, 3, 5, 9 e 12 eixos).

## Versionamento

| Versão | Onde | Muda quando |
|---|---|---|
| Formato de dados | `DATA_FORMAT_VERSION` (core) e `theme.versions.dataFormat` | o contrato de tipos muda de forma incompatível |
| Algoritmo | `ALGORITHM_VERSION` (core) | qualquer fórmula muda o resultado numérico |
| Perfis do tema | `theme.versions.profiles` (ex.: `2026.10.0`) | qualquer valor/texto de personagem muda |

`validateTheme` rejeita temas com formato diferente do suportado. Links compartilhados (Fase 6)
guardam as três versões para não recalcular resultados antigos com perfis novos.

## Como fazer

### Criar um tema
1. Crie `src/themes/<id>/index.ts` exportando um `ThemeDefinition`.
2. Registre em `src/themes/registry.ts`.
3. Rode `npm test`: o teste arquitetural valida todos os temas registrados.

Nenhuma alteração em `src/core` deve ser necessária. Se for, a mudança é de contrato e exige
incremento de `DATA_FORMAT_VERSION`.

### Adicionar perguntas
Inclua itens em `questions` com **ID novo** (nunca reutilize IDs). Mantenha o equilíbrio de
polaridades por eixo e atualize `docs/QUESTION_AUDIT.md`.

### Adicionar personagens
Inclua em `characters` com valores para **todos** os eixos (0–100), justificativa editorial e
imagem (`src: null` usa placeholder). Incremente `versions.profiles`.

### Alterar pesos
- Por pergunta: campo `weight` (exige justificativa documentada).
- Por eixo: `defaultWeight` do eixo, ou `weights` em `runQuiz` para experimentos.

### Configurar visual
Cores do tema ficam em `theme.visual.colors`; tokens globais em `src/app/globals.css`.
