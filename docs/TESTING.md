# Testes

## Comandos

```powershell
npm run lint           # ESLint
npm run typecheck      # gera tipos de rota do Next + tsc --noEmit
npm test               # Vitest (core, themes, integration)
npm run test:coverage  # Vitest com cobertura (relatório em coverage/)
npm run test:e2e       # Playwright (faz build de produção e sobe na porta 3100)
npm run check          # lint + typecheck + test + build
```

Primeira execução do Playwright: `npx playwright install chromium`.

## Organização

| Pasta | O que cobre |
|---|---|
| `tests/core/scoring.test.ts` | conversão das 5 respostas, polaridade, pesos, média por eixo, limites, respostas ausentes |
| `tests/core/affinity.test.ts` | distância (fórmula, simetria, pesos), afinidade 0–100 em 10.000 pares aleatórios |
| `tests/core/ranking.test.ts` | ordenação, desempates, independência da ordem, determinismo, `runQuiz` |
| `tests/core/interpretation.test.ts` | faixas, intensidade, traços em comum/diferenças, coerência, templates |
| `tests/core/validation.test.ts` | 14 tipos de tema inválido, faixas, respostas vindas de fora |
| `tests/core/architecture.test.ts` | motor sem React/Next/navegador/temas; temas sem lógica; 1–12 eixos; tema de exemplo |
| `tests/integration/quiz-service.test.ts` | serviço que liga tema e motor |
| `tests/integration/quiz-state.test.ts` | navegação do quiz: responder, avançar, voltar, alterar, limites, reiniciar |
| `tests/integration/quiz-progress.test.ts` | armazenamento local: chave versionada, 12 tipos de dado inválido, expiração, armazenamento indisponível |
| `tests/integration/explanations.test.ts` | coerência das explicações em 3.000 perfis: traços em comum, diferenças, seções, pontos fortes, contradições, aviso de equilíbrio; comparação com os 20 personagens; resumo sem respostas individuais |
| `tests/integration/sharing.test.ts` | formato do link (ida e volta, tamanho, caracteres, 9 tipos de link inválido, valores forjados), reconstrução idêntica em 200 perfis, recusa de versões antigas |
| `tests/integration/result-image.test.ts` | conteúdo da imagem: vencedor, afinidade, características predominantes, eixos, endereço |
| `tests/e2e/sharing.spec.ts` | link aberto em outro contexto sem dados locais, copiar link, troca só do fragmento, 5 links inválidos sem executar conteúdo, PNG 1080×1350 baixado sem requisições externas |
| `tests/e2e/quiz.spec.ts` | iniciar, teclado e nomes acessíveis, avanço automático, voltar/alterar, retomar, reiniciar, progresso corrompido, 45 respostas até o resultado, ausência de requisições externas; resultado: explicação, perfil comportamental, ranking completo, comparação pelo seletor e pelo top 5, copiar resumo, refazer |
| `tests/e2e/pages.spec.ts` | todas as páginas carregam sem rolagem horizontal (também a 360 px), elementos da landing, catálogo, 404 real, link de pular conteúdo |
| `tests/themes/south-park.test.ts` | 45 perguntas, 5 por eixo, 9 eixos, 20 personagens, IDs únicos, polaridades 23/22, múltiplos de 5, textos, licença de imagens |
| `tests/themes/calibration.test.ts` | alcance de todos os personagens, pares parecidos, distribuição de vencedores, empates, estabilidade |

Cenários aleatórios usam um gerador com semente fixa (`seededRandom` em `tests/fixtures.ts`)
para serem reprodutíveis.

## Último resultado (Fase 6, 30/10/2026)

| Verificação | Resultado |
|---|---|
| Lint | ✅ sem erros |
| TypeScript | ✅ sem erros |
| Vitest | ✅ 14 arquivos, 233 testes |
| Build de produção | ✅ todas as rotas estáticas |
| Playwright | ✅ 79 testes (desktop, mobile 412 px, mobile 360 px) |

Relatório de calibração: `npx vitest run tests/themes/calibration.test.ts --silent=false`
(resultados em `docs/CHARACTER_PROFILES.md`).

## Pendente

- Auditoria automatizada de acessibilidade (ex.: axe) — Fase 8.
- Calibração com respostas reais (teste-piloto) e correlação entre eixos — Fase 8.
