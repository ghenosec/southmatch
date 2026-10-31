import type { Metadata } from "next";
import { ContentPage } from "@/components/layout/content-page";

export const metadata: Metadata = {
  title: "Privacidade",
  description: "O que o SouthMatch faz (e não faz) com os seus dados.",
};

export default function PrivacyPage() {
  return (
    <ContentPage
      title="Privacidade"
      lead="O SouthMatch foi feito para funcionar sem saber quem você é."
    >
      <h2>O que não coletamos</h2>
      <ul>
        <li>Não pedimos nome, e-mail, telefone nem qualquer cadastro.</li>
        <li>Não usamos cookies de rastreamento, ferramentas de análise ou anúncios.</li>
        <li>Suas respostas não são enviadas para nenhum servidor: o cálculo acontece no seu navegador.</li>
      </ul>

      <h2>O que fica salvo no seu dispositivo</h2>
      <p>
        Para você poder continuar o teste depois, guardamos no armazenamento local do navegador (<code>localStorage</code>)
        as suas respostas, a pergunta em que você parou e a sua preferência de avanço automático. Esses dados nunca
        saem do seu dispositivo, expiram em 30 dias e são apagados quando você reinicia o teste. Você também pode
        apagá-los limpando os dados do site no navegador.
      </p>

      <h2>Dados técnicos de conexão</h2>
      <p>
        Como qualquer site, o SouthMatch é entregue por um serviço de hospedagem, que pode registrar dados técnicos
        da conexão — como endereço IP, data e hora e tipo de navegador — para operação e segurança. Esses dados não
        incluem suas respostas. Por isso, falamos em teste <strong>sem cadastro</strong>, e não em anonimato absoluto.
      </p>

      <h2>Compartilhamento</h2>
      <p>
        Nada é compartilhado automaticamente. Quando o recurso de compartilhamento estiver disponível, o link gerado
        conterá um resumo do seu perfil (as pontuações dos eixos, não as respostas individuais), e qualquer pessoa com o
        link poderá vê-lo.
      </p>

      <h2>Mudanças</h2>
      <p>Se esta política mudar — por exemplo, com a inclusão de algum serviço novo —, esta página será atualizada antes.</p>
    </ContentPage>
  );
}
