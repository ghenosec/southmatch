# SouthMatch

Teste de personalidade gratuito e anônimo: responda a afirmações sobre seu jeito de pensar e agir
e descubra com qual personagem de South Park você mais se parece.

> Projeto independente de fãs, sem afiliação com os titulares de South Park.

## Status

| Fase | Situação |
|---|---|
| 1. Fundação | ✅ concluída |
| 2. Motor independente | ✅ concluída |
| 3. Tema South Park | ✅ concluída (aguarda revisão editorial) |
| 4. Experiência visual | ✅ concluída |
| 5. Resultados | ✅ concluída |
| 6. Compartilhamento | ✅ concluída |
| 7. Catálogo e conteúdo | ✅ concluída |
| 8. Calibração e qualidade | ✅ concluída |
| 9. Preparação para publicação | ✅ concluída (deploy aguardando autorização) |

Detalhes em [`docs/DEVELOPMENT_PROGRESS.md`](docs/DEVELOPMENT_PROGRESS.md).

## Requisitos

- Node.js 22 ou superior
- npm

## Instalação e execução

```powershell
npm install
npm run dev
```

Abra http://localhost:3000.

## Testes

```powershell
npm test               # testes unitários e de integração
npm run test:e2e       # testes de interface (primeira vez: npx playwright install chromium)
npm run check          # lint + tipos + testes + build
```

Mais em [`docs/TESTING.md`](docs/TESTING.md).

## Arquitetura em uma frase

Um **motor** genérico de funções puras (`src/core`) calcula afinidade entre vetores; **temas**
(`src/themes`) só fornecem dados; a **interface** (`src/app`, `src/components`) só exibe.
Ver [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) e [`docs/METHODOLOGY.md`](docs/METHODOLOGY.md).

## Deploy na Vercel

O projeto não precisa de banco de dados nem de segredos. Única variável recomendada:
`NEXT_PUBLIC_SITE_URL` (ver `.env.example`).

Guia completo, checklist de publicação e revisão de direitos autorais e de marca:
[`docs/DEPLOY.md`](docs/DEPLOY.md).

> Nenhum deploy foi feito. Publicar somente após autorização e após as pendências de conteúdo e de
> direitos listadas em `docs/DEPLOY.md`.

## Documentação

| Documento | Conteúdo |
|---|---|
| [ARCHITECTURE](docs/ARCHITECTURE.md) | camadas, contratos, como criar temas, perguntas e personagens |
| [METHODOLOGY](docs/METHODOLOGY.md) | eixos, fórmulas, explicações e limitações |
| [QUESTION_AUDIT](docs/QUESTION_AUDIT.md) | as 45 afirmações e a revisão editorial |
| [CHARACTER_PROFILES](docs/CHARACTER_PROFILES.md) | os 20 perfis, justificativas e calibração |
| [TESTING](docs/TESTING.md) | comandos, cobertura e resultados |
| [DEPLOY](docs/DEPLOY.md) | publicação, checklist e revisão de direitos |
