import type { Metadata } from "next";
import { ContentPage } from "@/components/layout/content-page";
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

      <h2>4. O que a porcentagem significa (e o que não significa)</h2>
      <p>
        A afinidade é um <strong>índice de semelhança</strong> entre dois perfis numéricos. Ela não é uma
        probabilidade, um diagnóstico psicológico, uma medida de identidade nem uma conclusão clínica.
      </p>

      <h2>5. Limitações</h2>
      <ul>
        <li>Os perfis dos personagens são interpretações editoriais, não medições.</li>
        <li>Poucas afirmações por eixo não bastam para uma avaliação psicológica; o teste não foi validado cientificamente.</li>
        <li>Alguns eixos podem se sobrepor (por exemplo, sociabilidade e lealdade ao grupo).</li>
        <li>Muitas respostas “Neutro” deixam o perfil perto do centro, o que favorece personagens de perfil moderado.</li>
      </ul>

      <p className="text-sm text-muted">
        Versão do algoritmo: {ALGORITHM_VERSION} · Versão dos perfis: {theme.versions.profiles}
      </p>
    </ContentPage>
  );
}
