# Publicação — guia e checklist

> Nenhum deploy foi feito. Este documento prepara a publicação na Vercel, que só deve acontecer após
> autorização e após as pendências de direitos marcadas abaixo.

## 1. Pré-requisitos

- Repositório no GitHub (a branch de trabalho é `develop`; publicar a partir de `main` após merge).
- Conta na Vercel.
- Node.js 22 ou superior (o projeto declara `"engines": { "node": ">=22" }`).

## 2. Variáveis de ambiente

| Variável | Obrigatória | Uso |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Recomendada | Domínio público, sem barra final (ex.: `https://southmatch.exemplo`). Usada em URLs canônicas, Open Graph, sitemap e robots. Se ausente, a Vercel fornece `VERCEL_PROJECT_PRODUCTION_URL` automaticamente. |

Não há segredos, chaves de API ou banco de dados. Modelo em `.env.example`.

## 3. Deploy na Vercel (quando autorizado)

1. Na Vercel: **Add New → Project → Import** o repositório do GitHub.
2. Framework detectado: **Next.js**. Build: `npm run build` (padrão). Saída: padrão.
3. Em **Settings → Environment Variables**, defina `NEXT_PUBLIC_SITE_URL` para Production.
4. Em **Settings → Git**, defina a branch de produção (`main`).
5. Deploy. Depois, se houver domínio próprio, configure em **Settings → Domains** e atualize
   `NEXT_PUBLIC_SITE_URL`, fazendo um novo deploy.

Pela linha de comando (alternativa): `npx vercel` (pré-visualização) e `npx vercel --prod` (produção).

## 4. Checklist antes de publicar

### Qualidade (automatizável)

- [x] `npm run check` — lint, TypeScript, Vitest e build sem erros
- [x] `npm run test:e2e` — Playwright em desktop, 412 px e 360 px
- [x] Auditoria axe sem violações WCAG A/AA
- [x] `npm audit --omit=dev` sem vulnerabilidades
- [x] Sitemap, robots, Open Graph, Twitter Card, ícone e manifesto gerados
- [x] Cabeçalhos de segurança (CSP, nosniff, Referrer-Policy, frame-ancestors, Permissions-Policy)
- [x] Nenhuma requisição a terceiros; nenhuma ferramenta de análise

### Conteúdo (revisão humana — pendente)

- [ ] Revisar os 20 perfis, com prioridade para Scott e Heidi (viés para o centro; ver `CHARACTER_PROFILES.md`)
- [ ] Revisar as 45 afirmações com 3 a 5 leitores (clareza, ideia única)
- [ ] Decidir sobre rótulos no masculino genérico no resultado do usuário
- [ ] Teste-piloto com pessoas reais: duração (estimativa 7–10 min) e distribuição de resultados
- [ ] Teste com leitor de tela real (NVDA ou VoiceOver)

### Direitos autorais e marca (pendente — decisão do responsável)

- [ ] Consulta jurídica sobre o uso do nome **SouthMatch** e da marca **South Park**
- [ ] Busca de anterioridade de marca no INPI (Brasil) e, se houver público internacional, USPTO/EUIPO
- [ ] Confirmar que o projeto continua sem fins comerciais (sem anúncios, doações vinculadas ou venda)
- [ ] Imagens dos personagens: licença/autorização obtida pelo responsável e registrada via `npm run images:sync`
- [x] Aviso de projeto independente de fãs em todas as páginas (rodapé) e na página Sobre
- [x] Personagens descritos com texto próprio; perguntas não citam a série

## 5. Revisão de direitos autorais e de marca

Esta seção registra o que foi verificado tecnicamente. **Não é parecer jurídico.**

**O que o projeto usa da obra:** nomes de personagens, o nome "South Park" em títulos e textos descritivos, e
descrições originais de comportamentos recorrentes. Não usa imagens, logotipos, fontes, falas, áudio,
capturas de tela ou ilustrações derivadas.

**O que o projeto evita:**
- dizer ou insinuar que é oficial, patrocinado ou aprovado (aviso explícito em todas as páginas);
- registrar marca ou direitos sobre elementos da obra;
- uso comercial.

**Riscos identificados:**
1. **Nome "SouthMatch".** Uma pesquisa na web (30/10/2026) não encontrou produto com esse nome. Ainda assim:
   - o nome evoca diretamente a marca *South Park*, o que pode ser visto como aproveitamento de marca alheia;
   - o termo "Match" já foi objeto de disputas movidas pelo Match Group (dono do Tinder e do Match.com) contra
     apps de relacionamento. O caso mais conhecido é o do Muzmatch, que perdeu no Reino Unido e mudou de nome.
     O SouthMatch não é app de relacionamento, o que reduz esse risco, mas não o elimina.
2. **Aviso de independência não é autorização.** Ele reduz confusão, mas não concede direito de uso.
3. **Não há diretrizes públicas de fan content específicas de South Park** encontradas. As diretrizes da
   Paramount para fan films de Star Trek (sem fins comerciais, sem registrar marca, sem a palavra "oficial")
   são uma referência razoável de boa conduta, mas não se aplicam formalmente.

**Mitigações já aplicadas:** arte 100% original e genérica; aviso de independência; página Sobre com canal para
ajustes ou remoção do conteúdo a pedido dos titulares; nenhuma monetização.

**Alternativa de menor risco:** publicar com um nome que não contenha "South" nem "Match" (ex.: um nome próprio
do projeto) e manter "South Park" apenas como descrição do tema.

## 5.1 Imagens dos personagens

As imagens são fornecidas pelo responsável do projeto, que responde pelas licenças e autorizações. O código
não baixa nem gera imagens de personagens.

1. Copie um arquivo por personagem para `public/themes/south-park/`, com o nome `<slug>.png`
   (aceita também `.webp`, `.jpg`, `.jpeg`, `.svg`). Recomendado: quadrado, 512×512, fundo transparente.
2. Registre a origem e a licença: `npm run images:sync -- --license "origem e termos da licença"`.
   Isso gera `src/themes/south-park/images.generated.ts`.
3. Confira: `npm run images:check` e `npm run check`.

| Personagem | Arquivo |
|---|---|
| Eric Cartman | `eric-cartman.png` |
| Stan Marsh | `stan-marsh.png` |
| Kyle Broflovski | `kyle-broflovski.png` |
| Kenny McCormick | `kenny-mccormick.png` |
| Butters Stotch | `butters-stotch.png` |
| Randy Marsh | `randy-marsh.png` |
| Wendy Testaburger | `wendy-testaburger.png` |
| Craig Tucker | `craig-tucker.png` |
| Tweek Tweak | `tweek-tweak.png` |
| Jimmy Valmer | `jimmy-valmer.png` |
| Timmy Burch | `timmy-burch.png` |
| Tolkien Black | `tolkien-black.png` |
| Clyde Donovan | `clyde-donovan.png` |
| Bebe Stevens | `bebe-stevens.png` |
| Mr. Garrison | `mr-garrison.png` |
| Chef | `chef.png` |
| PC Principal | `pc-principal.png` |
| Scott Malkinson | `scott-malkinson.png` |
| Heidi Turner | `heidi-turner.png` |
| Gerald Broflovski | `gerald-broflovski.png` |

Onde a imagem aparece: avatares em todo o site (landing, catálogo, página do personagem, resultado,
comparação), imagem PNG do resultado e prévia de Open Graph da página do personagem. Personagem sem arquivo
continua com o avatar genérico.

## 6. Depois do deploy

- [ ] Abrir `/`, `/quiz`, `/resultado`, `/personagens`, uma página de personagem e `/metodologia` no domínio final
- [ ] Fazer o teste completo no celular e compartilhar um link; abri-lo em outro aparelho
- [ ] Conferir `https://<domínio>/sitemap.xml` e `/robots.txt` com o domínio correto
- [ ] Validar a pré-visualização do link em um validador de Open Graph (ex.: o depurador de compartilhamento da plataforma desejada)
- [ ] Conferir os cabeçalhos de segurança: `curl -I https://<domínio>/`
- [ ] (Opcional) Enviar o sitemap ao Google Search Console

## 7. Reverter

Na Vercel: **Deployments → selecionar o deploy anterior → Promote to Production** (reversão instantânea,
sem novo build).

## 8. Fontes consultadas na revisão de marca

- Caso Muzmatch × Match Group: [City A.M.](https://www.cityam.com/?p=1866928),
  [Salaam Gateway](https://salaamgateway.com/story/dating-app-muzmatch-loses-trademark-infringement-case),
  [Global Dating Insights](https://www.globaldatinginsights.com/news/muzmatch-loses-legal-battle-against-match-group/)
- Diretrizes de fan films de Star Trek (Paramount), como referência:
  [The Legal Artist](https://thelegalartist.com/blog/paramount-releases-star-trek-fan-film-guidelines-shows-other-studios-how-to-interact-with-fans)
