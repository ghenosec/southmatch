import type { Metadata } from "next";
import { ContentPage } from "@/components/layout/content-page";
import { getActiveTheme } from "@/services/quiz";

const theme = getActiveTheme();

export const metadata: Metadata = {
  title: "Sobre",
  description: "O que é o SouthMatch e quem está por trás dele.",
};

export default function AboutPage() {
  return (
    <ContentPage
      title="Sobre o SouthMatch"
      lead="Um teste de personalidade gratuito, sem cadastro e feito por fãs, para descobrir qual personagem de South Park mais combina com você."
    >
      <h2>A ideia</h2>
      <p>
        Em vez de associar respostas diretamente a personagens, o SouthMatch mede seu jeito de ser em{" "}
        {theme.axes.length} dimensões e compara esse perfil com o de cada personagem. Assim o resultado mostra não só
        quem mais se parece com você, mas também por quê.
      </p>

      <h2>Feito para crescer</h2>
      <p>
        O motor de cálculo não sabe nada sobre South Park: ele funciona com qualquer conjunto de eixos, perguntas e
        perfis. South Park é o primeiro tema; outros podem vir no futuro sem reescrever o algoritmo.
      </p>

      <h2>Projeto independente</h2>
      <p>{theme.texts.disclaimer}</p>
      <p>
        Nenhuma imagem oficial é usada. As ilustrações do site são originais e provisórias.
      </p>
    </ContentPage>
  );
}
