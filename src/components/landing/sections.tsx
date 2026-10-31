import Link from "next/link";
import { BarChart3, MessageSquareText, Trophy } from "lucide-react";
import type { AxisDefinition, CharacterDefinition } from "@/core/types";
import { CharacterAvatar } from "@/components/characters/character-avatar";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

function SectionTitle({ id, children, kicker }: { id: string; children: string; kicker?: string }) {
  return (
    <div className="mb-8 text-center">
      {kicker && <p className="mb-2 text-sm font-extrabold tracking-widest text-action uppercase">{kicker}</p>}
      <h2 id={id} className="font-display text-3xl text-ink sm:text-4xl">
        {children}
      </h2>
    </div>
  );
}

export function HowItWorks({ questionCount, axisCount }: { questionCount: number; axisCount: number }) {
  const steps = [
    {
      icon: MessageSquareText,
      title: "Responda",
      text: `Diga o quanto concorda com ${questionCount} afirmações sobre o seu dia a dia. Não há resposta certa.`,
    },
    {
      icon: BarChart3,
      title: "Calculamos seu perfil",
      text: `Suas respostas viram uma pontuação em ${axisCount} eixos de personalidade, de 0 a 100.`,
    },
    {
      icon: Trophy,
      title: "Descubra seu personagem",
      text: "Comparamos seu perfil com o de cada personagem e mostramos quem mais se parece com você — e por quê.",
    },
  ];
  return (
    <section aria-labelledby="como-funciona" className="py-16">
      <Container>
        <SectionTitle id="como-funciona" kicker="Simples assim">
          Como funciona
        </SectionTitle>
        <ol className="grid gap-6 sm:grid-cols-3">
          {steps.map(({ icon: Icon, title, text }, i) => (
            <li key={title} className={`paper p-6 ${i === 1 ? "sm:rotate-1" : "sm:-rotate-1"}`}>
              <div className="mb-3 flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-full border-[3px] border-ink bg-sun font-display text-lg">
                  {i + 1}
                </span>
                <Icon aria-hidden className="size-6 text-sky-deep" strokeWidth={2.5} />
              </div>
              <h3 className="text-xl font-extrabold">{title}</h3>
              <p className="mt-2 leading-relaxed text-ink-soft">{text}</p>
            </li>
          ))}
        </ol>
        <p className="mt-8 text-center text-sm text-muted">
          O cálculo acontece no seu navegador.{" "}
          <Link href="/metodologia" className="font-bold text-ink underline underline-offset-2">
            Veja a metodologia
          </Link>
          .
        </p>
      </Container>
    </section>
  );
}

export function AxesPreview({ axes }: { axes: readonly AxisDefinition[] }) {
  return (
    <section aria-labelledby="eixos" className="border-y-[3px] border-ink bg-sky-pale py-16">
      <Container>
        <SectionTitle id="eixos" kicker={`${axes.length} dimensões`}>
          O que o teste avalia
        </SectionTitle>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {axes.map((axis) => (
            <li key={axis.id} className="paper p-5">
              <h3 className="text-lg font-extrabold">{axis.name}</h3>
              <p className="mt-1 text-sm leading-relaxed text-ink-soft">{axis.description}</p>
              <div className="mt-4 flex items-center justify-between gap-2 text-xs font-extrabold">
                <span className="rounded-full bg-sky px-2 py-0.5">{axis.lowPole}</span>
                <span aria-hidden className="h-1 flex-1 rounded-full bg-gradient-to-r from-sky to-action" />
                <span className="rounded-full bg-action px-2 py-0.5 text-white">{axis.highPole}</span>
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-center text-sm text-muted">Nenhum polo é melhor ou pior que o outro.</p>
      </Container>
    </section>
  );
}

export function CharactersPreview({ characters, total }: { characters: readonly CharacterDefinition[]; total: number }) {
  return (
    <section aria-labelledby="personagens" className="py-16">
      <Container>
        <SectionTitle id="personagens" kicker={`${total} personagens`}>
          Com quem você vai combinar?
        </SectionTitle>
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {characters.map((c, i) => (
            <li key={c.id}>
              <Link
                href={`/personagens/${c.slug}`}
                className={`paper flex h-full flex-col items-center gap-2 p-4 text-center transition-transform hover:-translate-y-1 ${
                  i % 2 ? "rotate-1" : "-rotate-1"
                }`}
              >
                <CharacterAvatar character={c} size={72} decorative />
                <span className="font-extrabold leading-tight">{c.name}</span>
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-8 flex justify-center">
          <ButtonLink href="/personagens" variant="secondary">
            Ver todos os personagens
          </ButtonLink>
        </div>
        <p className="mt-4 text-center text-xs text-muted">
          Ilustrações provisórias e originais, sem uso de imagens oficiais.
        </p>
      </Container>
    </section>
  );
}

const FAQ = [
  {
    q: "Preciso me cadastrar?",
    a: "Não. O teste não pede nome, e-mail, telefone nem qualquer cadastro.",
  },
  {
    q: "Minhas respostas são enviadas para algum lugar?",
    a: "Não. O cálculo acontece no seu navegador, e o progresso fica salvo apenas no seu dispositivo. Você pode apagá-lo quando quiser reiniciando o teste.",
  },
  {
    q: "O resultado tem valor científico?",
    a: "Não. É um teste de entretenimento. A porcentagem de afinidade é um índice de semelhança calculado entre o seu perfil e o perfil atribuído a cada personagem — não é diagnóstico nem probabilidade.",
  },
  {
    q: "Preciso conhecer South Park?",
    a: "Não. As afirmações falam sobre você, não sobre a série. Nenhuma pergunta cita personagens.",
  },
  {
    q: "Posso mudar uma resposta?",
    a: "Sim. Você pode voltar a qualquer pergunta já respondida e alterar a resposta antes de ver o resultado.",
  },
  {
    q: "Este site é oficial?",
    a: "Não. É um projeto independente de fãs, sem afiliação com os criadores ou detentores dos direitos de South Park.",
  },
] as const;

export function Faq() {
  return (
    <section aria-labelledby="faq" className="border-t-[3px] border-ink bg-sky-pale py-16">
      <Container className="max-w-3xl">
        <SectionTitle id="faq" kicker="Dúvidas">
          Perguntas frequentes
        </SectionTitle>
        <div className="flex flex-col gap-3">
          {FAQ.map(({ q, a }) => (
            <details key={q} className="paper group p-0">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 text-lg font-extrabold [&::-webkit-details-marker]:hidden">
                {q}
                <span aria-hidden className="font-display text-2xl text-action transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="px-5 pb-5 leading-relaxed text-ink-soft">{a}</p>
            </details>
          ))}
        </div>
        <div className="mt-10 flex justify-center">
          <ButtonLink href="/quiz" size="lg">
            Começar teste
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
