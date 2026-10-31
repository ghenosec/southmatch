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
| 8. Calibração e qualidade | ⏳ próxima |
| 9. Publicação | pendente |

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

O projeto não precisa de variáveis de ambiente nem de banco de dados.

1. Envie o repositório para o GitHub.
2. Na Vercel, importe o repositório (framework detectado: Next.js).
3. Comando de build: `npm run build` (padrão). Node 22+.

> Nenhum deploy foi feito. Publicar somente após revisão de direitos autorais e de marca
> (ver checklist da Fase 9).
