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

      <h2>Como é feito</h2>
      <ul>
        <li>Sem cadastro, sem banco de dados e sem serviços pagos: perguntas, eixos e perfis ficam no próprio código do site.</li>
        <li>O cálculo roda no seu navegador, com um algoritmo determinístico e testado automaticamente.</li>
        <li>
          Os perfis dos personagens são interpretações editoriais de comportamentos recorrentes na série, com a
          justificativa publicada em cada página de personagem.
        </li>
        <li>As ilustrações são originais e provisórias; nenhuma imagem oficial é usada.</li>
      </ul>

      <h2>Projeto independente</h2>
      <p>{theme.texts.disclaimer}</p>
      <p>
        O aviso de independência não é uma autorização de uso. Se você representa os titulares dos direitos e tem
        alguma objeção, o conteúdo pode ser ajustado ou removido.
      </p>
    </ContentPage>
  );
}
