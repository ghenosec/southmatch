import { Clock, Gift, ListChecks, ShieldCheck } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { SnowScene } from "./snow-scene";

export function Hero({
  title,
  subtitle,
  intro,
  questionCount,
  minutes,
}: {
  title: string;
  subtitle: string;
  intro: string;
  questionCount: number;
  minutes: { min: number; max: number };
}) {
  const facts = [
    { icon: ListChecks, label: `${questionCount} afirmações` },
    { icon: Clock, label: `Cerca de ${minutes.min} a ${minutes.max} minutos` },
    { icon: Gift, label: "Grátis" },
    { icon: ShieldCheck, label: "Sem cadastro" },
  ];

  return (
    <section className="relative overflow-hidden border-b-[3px] border-ink bg-gradient-to-b from-sky to-sky-pale pb-60 sm:pb-80">
      <SnowScene />
      <Container className="relative z-10 flex flex-col items-center pt-12 text-center sm:pt-20">
        <p className="mb-4 -rotate-2 rounded-full border-[3px] border-ink bg-sun px-4 py-1 text-sm font-extrabold shadow-paper-sm">
          Teste de personalidade
        </p>
        <h1 className="max-w-3xl font-display text-4xl leading-[1.05] text-ink sm:text-6xl">{title}</h1>
        <p className="mt-4 text-xl font-extrabold text-ink-soft sm:text-2xl">{subtitle}</p>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink sm:text-lg">{intro}</p>
        <ButtonLink href="/quiz" size="lg" className="mt-8">
          Começar teste
        </ButtonLink>
        <ul className="mt-6 flex flex-wrap justify-center gap-2 text-sm font-bold">
          {facts.map(({ icon: Icon, label }) => (
            <li key={label} className="flex items-center gap-1.5 rounded-full border-2 border-ink bg-snow px-3 py-1">
              <Icon aria-hidden className="size-4 text-sky-deep" strokeWidth={2.5} />
              {label}
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
