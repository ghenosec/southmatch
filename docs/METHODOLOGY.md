# Metodologia

> O SouthMatch é entretenimento. O índice de afinidade é uma medida de **similaridade calculada**
> entre vetores numéricos — não é probabilidade, diagnóstico psicológico nem conclusão clínica.

Versão do algoritmo: **1** (`ALGORITHM_VERSION`).

## 1. Conversão das respostas

| Resposta | Valor |
|---|---|
| Discordo totalmente | 0 |
| Discordo | 0,25 |
| Neutro / Não sei | 0,50 |
| Concordo | 0,75 |
| Concordo totalmente | 1 |

Perguntas **invertidas**: `valor_ajustado = 1 − valor_original`.

## 2. Pontuação por eixo

```
eixo = 100 × Σ(valor_ajustado × peso) / Σ(peso)
```

- Só entram perguntas respondidas daquele eixo.
- Por padrão o cálculo exige todas as respostas; a versão parcial existe para uso interno e
  falha se algum eixo ficar sem nenhuma resposta (evita divisão por zero).
- Pesos precisam ser números finitos maiores que zero. O resultado é limitado a 0–100.
- A ordem de exibição das perguntas não altera o resultado (testado).

## 3. Distância e afinidade

```
distância = sqrt( Σ peso_eixo × (usuário − perfil)² / Σ peso_eixo ) / 100
afinidade = 100 × (1 − distância)
```

Como cada diferença está entre 0 e 100, a distância fica entre 0 e 1 e a afinidade entre 0 e 100.
Isso é verificado em teste com 10.000 pares aleatórios. Pesos iniciais dos eixos: todos iguais a 1.

## 4. Ranking e desempate

1. Maior afinidade.
2. Empate (diferença < 1e-9): menor **maior diferença em um único eixo** — favorece o perfil
   uniformemente próximo em vez de um muito próximo em quase tudo e muito distante em um eixo.
3. Empate persistente: ID do perfil em ordem alfabética (estável e neutro).

Popularidade nunca é critério. O resultado independe da ordem dos perfis na lista.

## 5. Interpretação

Limiares padrão (`DEFAULT_THRESHOLDS`):

| Conceito | Regra |
|---|---|
| Equilibrado | \|pontuação − 50\| < 10 |
| Tendência moderada | 10 ≤ \|pontuação − 50\| < 25 |
| Tendência forte | \|pontuação − 50\| ≥ 25 |
| Traço em comum | diferença ≤ 12 **e** mesmo lado do eixo |
| Diferença relevante | diferença ≥ 25 |
| Oposição | diferença ≥ 40 **e** lados opostos |

Explicações são montadas por templates de texto preenchidos com esses dados (sem IA generativa).
Um teste garante que nenhuma interpretação aponte para o polo contrário ao da pontuação.

## 6. Limitações conhecidas

- Os perfis dos personagens são **atribuições editoriais**, não medições.
- Cinco perguntas por eixo é pouco para confiabilidade psicométrica; o teste não foi validado
  cientificamente.
- Eixos podem se sobrepor na prática (ex.: sociabilidade e lealdade ao grupo). A sobreposição
  será analisada na calibração (Fase 8).
- Respostas "Neutro" puxam todos os eixos para 50, favorecendo personagens de perfil moderado.

## 7. Os nove eixos do tema South Park

Definidos em `src/themes/south-park/axes.ts` (textos das faixas em `descriptions.ts`).
Todos de 0 a 100, centro 50, peso 1. Cada eixo tem 5 afirmações e 5 faixas interpretativas
(0–20, 21–40, 41–59, 60–79, 80–100).

| ID | Eixo | 0 | 100 |
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

Como cada eixo tem 5 perguntas e a escala anda em passos de 0,25, as pontuações possíveis são
múltiplos de 5 (0, 5, …, 100). Os perfis dos personagens também usam múltiplos de 5, então todo
personagem pode ser alcançado exatamente.

Sobreposições entre eixos estão em `docs/QUESTION_AUDIT.md`; a calibração e o viés para o centro
estão em `docs/CHARACTER_PROFILES.md`.
