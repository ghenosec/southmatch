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
| `tests/e2e/smoke.spec.ts` | página inicial em desktop e mobile, sem rolagem horizontal |
| `tests/themes/south-park.test.ts` | 45 perguntas, 5 por eixo, 9 eixos, 20 personagens, IDs únicos, polaridades 23/22, múltiplos de 5, textos, licença de imagens |
| `tests/themes/calibration.test.ts` | alcance de todos os personagens, pares parecidos, distribuição de vencedores, empates, estabilidade |

Cenários aleatórios usam um gerador com semente fixa (`seededRandom` em `tests/fixtures.ts`)
para serem reprodutíveis.

## Último resultado (Fase 3, 30/10/2026)

| Verificação | Resultado |
|---|---|
| Lint | ✅ sem erros |
| TypeScript | ✅ sem erros |
| Vitest | ✅ 9 arquivos, 162 testes |
| Build de produção | ✅ |
| Playwright | ✅ 4 testes (desktop + mobile) |

Relatório de calibração: `npx vitest run tests/themes/calibration.test.ts --silent=false`
(resultados em `docs/CHARACTER_PROFILES.md`).

## Pendente

- Testes de interface do quiz, resultado, compartilhamento — Fases 4–6.
- Testes de privacidade (armazenamento, links corrompidos) — Fases 4 e 6.
- Calibração com respostas reais (teste-piloto) e correlação entre eixos — Fase 8.
