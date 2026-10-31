# Auditoria das perguntas — tema South Park

Versão editorial: `2026.10.0` · 45 afirmações · 5 por eixo · 23 diretas / 22 invertidas · todas com peso 1.

## Critérios de revisão

Cada afirmação foi conferida contra as regras da especificação (seção 10):

| Critério | Como foi verificado |
|---|---|
| Original, pt-BR natural | Escrita própria; nenhuma copiada de outro teste. Os itens `soc-1`, `emp-1`, `aut-1`, `dec-1`, `con-1`, `amb-1`, `hum-1`, `loy-1` e `wor-1` vêm dos exemplos da própria especificação |
| Uma ideia por frase | Revisão manual (ver notas abaixo) |
| Sem personagens nem a série | Teste automático (`tests/themes/south-park.test.ts`) |
| Equilíbrio direta/invertida | 2 ou 3 de cada tipo por eixo — teste automático |
| Frases curtas | ≤ 100 caracteres — teste automático |
| Ordem não interfere | Apresentação intercalada (rodadas de 9, um item por eixo); o motor agrega por eixo — teste automático |
| Sem pesos diferentes | Todas com peso 1 — teste automático |

**Direta:** concordar puxa para o polo 100 do eixo. **Invertida:** concordar puxa para o polo 0.

## As 45 afirmações

| ID | Afirmação | Eixo | Polaridade | Peso | Grupo |
|---|---|---|---|---|---|
| `soc-1` | Prefiro passar meu tempo com um grupo de pessoas do que ficar sozinho. | Sociabilidade | Direta | 1 | rodada-1 |
| `soc-2` | Depois de um dia cheio de gente, preciso de um tempo sozinho para recarregar. | Sociabilidade | Invertida | 1 | rodada-2 |
| `soc-3` | Em uma festa, costumo puxar conversa com pessoas que não conheço. | Sociabilidade | Direta | 1 | rodada-3 |
| `soc-4` | Em um grupo, prefiro ouvir a falar. | Sociabilidade | Invertida | 1 | rodada-4 |
| `soc-5` | Fico animado quando um plano de fim de semana envolve muita gente. | Sociabilidade | Direta | 1 | rodada-5 |
| `emp-1` | Quando alguém está passando por dificuldades, costumo me colocar no lugar dessa pessoa. | Empatia | Direta | 1 | rodada-1 |
| `emp-2` | Cada um deve resolver os próprios problemas sem esperar ajuda dos outros. | Empatia | Invertida | 1 | rodada-2 |
| `emp-3` | Percebo rapidamente quando alguém ao meu redor está chateado. | Empatia | Direta | 1 | rodada-3 |
| `emp-4` | Se uma decisão me beneficia, não me preocupo muito com quem sai prejudicado. | Empatia | Invertida | 1 | rodada-4 |
| `emp-5` | Histórias tristes de desconhecidos raramente mexem comigo. | Empatia | Invertida | 1 | rodada-5 |
| `aut-1` | Se considero uma regra injusta, tenho dificuldade em simplesmente obedecê-la. | Regras e autoridade | Invertida | 1 | rodada-1 |
| `aut-2` | Sigo as regras mesmo quando ninguém está olhando. | Regras e autoridade | Direta | 1 | rodada-2 |
| `aut-3` | Respeito a decisão de quem está no comando, mesmo quando discordo dela. | Regras e autoridade | Direta | 1 | rodada-3 |
| `aut-4` | Gosto de testar até onde posso ir antes de levar uma bronca. | Regras e autoridade | Invertida | 1 | rodada-4 |
| `aut-5` | Cumprir horários e combinados é muito importante para mim. | Regras e autoridade | Direta | 1 | rodada-5 |
| `dec-1` | Antes de tomar uma decisão importante, costumo analisar as possíveis consequências. | Tomada de decisão | Direta | 1 | rodada-1 |
| `dec-2` | Costumo agir primeiro e pensar depois. | Tomada de decisão | Invertida | 1 | rodada-2 |
| `dec-3` | Gosto de comparar várias opções antes de escolher uma. | Tomada de decisão | Direta | 1 | rodada-3 |
| `dec-4` | Muitas vezes compro coisas por impulso. | Tomada de decisão | Invertida | 1 | rodada-4 |
| `dec-5` | Quando uma ideia me empolga, começo a colocá-la em prática na mesma hora. | Tomada de decisão | Invertida | 1 | rodada-5 |
| `con-1` | Não tenho medo de confrontar alguém quando discordo de suas atitudes. | Conflitos | Direta | 1 | rodada-1 |
| `con-2` | Prefiro deixar uma discussão de lado a correr o risco de brigar. | Conflitos | Invertida | 1 | rodada-2 |
| `con-3` | Defendo minha opinião com firmeza, mesmo quando todos pensam diferente. | Conflitos | Direta | 1 | rodada-3 |
| `con-4` | Quando meus amigos brigam, costumo ser quem tenta acalmar os ânimos. | Conflitos | Invertida | 1 | rodada-4 |
| `con-5` | Quando alguém me provoca, costumo responder à altura. | Conflitos | Direta | 1 | rodada-5 |
| `amb-1` | Gosto de competir e alcançar objetivos que outras pessoas consideram difíceis. | Motivação | Direta | 1 | rodada-1 |
| `amb-2` | Para mim, ter uma vida tranquila é mais importante do que ter sucesso. | Motivação | Invertida | 1 | rodada-2 |
| `amb-3` | Tenho planos claros sobre onde quero chegar nos próximos anos. | Motivação | Direta | 1 | rodada-3 |
| `amb-4` | Não me incomodo em ficar em segundo lugar. | Motivação | Invertida | 1 | rodada-4 |
| `amb-5` | Raramente penso em conquistar reconhecimento. | Motivação | Invertida | 1 | rodada-5 |
| `hum-1` | Costumo usar sarcasmo para tornar conversas mais divertidas. | Humor | Direta | 1 | rodada-1 |
| `hum-2` | Prefiro uma conversa séria a uma conversa cheia de piadas. | Humor | Invertida | 1 | rodada-2 |
| `hum-3` | Acho graça em piadas que outras pessoas consideram de mau gosto. | Humor | Direta | 1 | rodada-3 |
| `hum-4` | Fico incomodado quando alguém faz piada com um assunto sério. | Humor | Invertida | 1 | rodada-4 |
| `hum-5` | Muitas vezes faço uma piada para sair de uma situação constrangedora. | Humor | Direta | 1 | rodada-5 |
| `loy-1` | Mesmo quando discordo de um amigo, tento permanecer ao lado dele. | Lealdade | Direta | 1 | rodada-1 |
| `loy-2` | Se meu grupo toma uma decisão que considero errada, sigo meu próprio caminho. | Lealdade | Invertida | 1 | rodada-2 |
| `loy-3` | Faço sacrifícios pessoais pelo bem dos meus amigos. | Lealdade | Direta | 1 | rodada-3 |
| `loy-4` | Prefiro resolver as coisas sozinho a depender de um grupo. | Lealdade | Invertida | 1 | rodada-4 |
| `loy-5` | Troco de turma com facilidade quando algo deixa de me agradar. | Lealdade | Invertida | 1 | rodada-5 |
| `wor-1` | Para mim, uma solução prática geralmente vale mais do que uma ideia bonita. | Visão de mundo | Direta | 1 | rodada-1 |
| `wor-2` | Vale a pena lutar por uma causa mesmo quando a chance de vitória é pequena. | Visão de mundo | Invertida | 1 | rodada-2 |
| `wor-3` | Às vezes é preciso abrir mão de princípios para conseguir resultados. | Visão de mundo | Direta | 1 | rodada-3 |
| `wor-4` | Acredito que o mundo pode melhorar muito se as pessoas se esforçarem. | Visão de mundo | Invertida | 1 | rodada-4 |
| `wor-5` | Desconfio de discursos que prometem mudar o mundo. | Visão de mundo | Direta | 1 | rodada-5 |


## Notas editoriais e riscos

- **`amb-5`** ("Raramente penso em conquistar reconhecimento") mede o desejo de status; foi simplificada de uma versão com três ideias (dinheiro, fama, reconhecimento).
- **`dec-4`** (compras por impulso) é concreta e reconhecível, mas pode ser influenciada por renda; mantida por ser um indicador clássico de impulsividade.
- **`loy-4`** ("resolver as coisas sozinho") pode se sobrepor a Sociabilidade. A sobreposição será medida na Fase 8.
- **`emp-4`** é a afirmação com maior risco de desejabilidade social: poucas pessoas admitem prejudicar outros. Avaliar com dados reais.
- **`hum-3`** ("piadas de mau gosto") é deliberadamente o item que mais distingue humor ácido de bom humor leve.
- **`wor-2`** e **`wor-4`** medem idealismo pelo lado do otimismo. Isso pode misturar otimismo com idealismo; está registrado como limitação do eixo.

## Sobreposições conhecidas entre eixos

| Eixos | Risco |
|---|---|
| Sociabilidade × Lealdade | Gostar de grupos ≠ ser leal a um grupo, mas os dois tendem a andar juntos |
| Empatia × Conflitos | Pessoas empáticas tendem a evitar confrontos |
| Regras × Visão de mundo | Pragmatismo pode incluir "quebrar regras quando convém" (`wor-3`) |
| Tomada de decisão × Motivação | Planejamento de longo prazo (`amb-3`) também é traço analítico |

## Pendências

- Revisão humana de clareza e naturalidade (recomendado: 3 a 5 leitores).
- Teste-piloto para medir duração real (estimativa: 7 a 10 minutos) e correlação entre eixos.
