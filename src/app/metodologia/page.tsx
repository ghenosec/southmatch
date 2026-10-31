import type { Metadata } from "next";
import Link from "next/link";
import { ContentPage } from "@/components/layout/content-page";
import { WorkedExample } from "@/components/methodology/worked-example";
import { ALGORITHM_VERSION } from "@/core";
import { getActiveTheme } from "@/services/quiz";

const theme = getActiveTheme();

export const metadata: Metadata = {
  title: "Metodologia",
  description: "Como o SouthMatch calcula seu perfil e sua afinidade com os personagens, e quais são os limites do teste.",
};

export default function MethodologyPage() {
  const perAxis = theme.questions.length / theme.axes.length;
  return (
    <ContentPage
      title="Como funciona"
      lead="O resultado é calculado por um algoritmo determinístico e auditável: as mesmas respostas sempre geram o mesmo resultado. Não há sorteio nem inteligência artificial."
    >
      <h2>1. Suas respostas viram números</h2>
      <p>
        Cada afirmação tem cinco opções: Discordo totalmente (0), Discordo (0,25), Neutro (0,5), Concordo (0,75) e
        Concordo totalmente (1). Algumas afirmações são “invertidas”: concordar com elas puxa o eixo para o lado
        oposto, e o valor usado passa a ser <code>1 − resposta</code>.
      </p>

      <h2>2. Os números viram {theme.axes.length} eixos</h2>
      <p>
        Cada eixo reúne {Number.isInteger(perAxis) ? perAxis : "algumas"} afirmações. A pontuação do eixo é a média
        das respostas ajustadas, de 0 a 100: <code>eixo = 100 × média ponderada</code>. O centro, 50, indica
        equilíbrio. Nenhum lado é melhor que o outro.
      </p>
      <ul>
        {theme.axes.map((a) => (
          <li key={a.id}>
            <strong>{a.name}</strong>: de {a.lowPole} (0) a {a.highPole} (100). {a.description}
          </li>
        ))}
      </ul>

      <h2>3. Seu perfil é comparado com cada personagem</h2>
      <p>
        Cada personagem tem um perfil nos mesmos eixos, atribuído por análise editorial de seus comportamentos
        recorrentes na série. Calculamos a distância entre o seu perfil e o de cada personagem (distância euclidiana
        normalizada, com o mesmo peso para todos os eixos) e a convertemos em afinidade:
      </p>
      <p>
        <code>afinidade = 100 × (1 − distância)</code>
      </p>
      <p>
        Quanto mais parecidos os perfis, maior a afinidade. Em caso de empate, vence o personagem cuja maior
        diferença em um único eixo é menor; persistindo o empate, usa-se a ordem alfabética do identificador.
        Popularidade nunca entra no cálculo.
      </p>

      <h2>Exemplo com números</h2>
      <p>Os valores abaixo são calculados pelo mesmo código que gera o seu resultado.</p>
      <WorkedExample theme={theme} />

      <h2>4. O que a porcentagem significa (e o que não significa)</h2>
      <p>
        A afinidade é um <strong>índice de semelhança</strong> entre dois perfis numéricos. Ela não é uma
        probabilidade, um diagnóstico psicológico, uma medida de identidade nem uma conclusão clínica.
      </p>

      <h2>5. Como as explicações são escolhidas</h2>
      <p>
        As frases do resultado não são escritas por inteligência artificial: cada uma aparece apenas quando os números
        a sustentam.
      </p>
      <ul>
        <li>
          <strong>Traço em comum:</strong> diferença de até 12 pontos no eixo, com você e o personagem do mesmo lado.
        </li>
        <li>
          <strong>Diferença:</strong> 25 pontos ou mais no eixo.
        </li>
        <li>
          <strong>Perfil comportamental:</strong> o texto da faixa (0–20, 21–40, 41–59, 60–79 ou 80–100) em que sua
          pontuação está.
        </li>
        <li>
          <strong>Contradições:</strong> combinações de eixos que costumam puxar em direções opostas, como ser sociável
          e, ao mesmo tempo, independente do grupo.
        </li>
        <li>
          <strong>Perfil equilibrado:</strong> se no máximo 2 eixos se afastam do centro, o resultado avisa que
          personagens de perfil moderado tendem a aparecer no topo.
        </li>
      </ul>

      <h2>6. Calibração</h2>
      <p>
        Antes de publicar, os perfis são testados com dezenas de milhares de perfis simulados. Os testes verificam que:
      </p>
      <ul>
        <li>todos os {theme.characters.length} personagens podem ser o resultado de alguém;</li>
        <li>nenhum personagem vence a maioria dos testes;</li>
        <li>nenhum par de personagens tem perfis praticamente idênticos;</li>
        <li>mudar uma única resposta altera pouco o resultado.</li>
      </ul>
      <p>
        Um achado conhecido: quem responde quase tudo “Neutro” fica perto do centro em todos os eixos, e personagens de
        perfil moderado ficam mais prováveis. Isso não foi “corrigido” mexendo nos números para equilibrar a
        frequência dos personagens.
      </p>

      <h2>7. Limitações</h2>
      <ul>
        <li>Os perfis dos personagens são interpretações editoriais, não medições.</li>
        <li>Poucas afirmações por eixo não bastam para uma avaliação psicológica; o teste não foi validado cientificamente.</li>
        <li>Alguns eixos podem se sobrepor (por exemplo, sociabilidade e lealdade ao grupo).</li>
        <li>Muitas respostas “Neutro” deixam o perfil perto do centro, o que favorece personagens de perfil moderado.</li>
      </ul>

      <p>
        Veja também os <Link href="/personagens">perfis de cada personagem</Link>, com a justificativa de cada valor.
      </p>

      <p className="text-sm text-muted">
        Versão do algoritmo: {ALGORITHM_VERSION} · Versão dos perfis: {theme.versions.profiles}
      </p>
    </ContentPage>
  );
}
