import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CharacterAvatar } from "@/components/characters/character-avatar";
import { AxisBar } from "@/components/results/axis-bar";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { getActiveTheme } from "@/services/quiz";

const theme = getActiveTheme();

function findCharacter(slug: string) {
  return theme.characters.find((c) => c.slug === slug);
}

export function generateStaticParams() {
  return theme.characters.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/personagens/[slug]">): Promise<Metadata> {
  const c = findCharacter((await params).slug);
  if (!c) return { title: "Personagem não encontrado" };
  return {
    title: c.name,
    description: `${c.name}: ${c.shortDescription} Veja o perfil de personalidade usado no SouthMatch.`,
  };
}

function List({ title, items }: { title: string; items: readonly string[] }) {
  return (
    <div>
      <h2 className="font-display text-xl">{title}</h2>
      <ul className="mt-2 flex flex-col gap-1">
        {items.map((i) => (
          <li key={i} className="ml-5 list-disc">{i}</li>
        ))}
      </ul>
    </div>
  );
}

export default async function CharacterPage({ params }: PageProps<"/personagens/[slug]">) {
  const c = findCharacter((await params).slug);
  if (!c) notFound();

  return (
    <main className="flex-1 bg-gradient-to-b from-sky-pale to-snow py-10 sm:py-14">
      <Container className="flex max-w-3xl flex-col gap-8">
        <section className="paper flex flex-col items-center gap-4 p-6 text-center sm:p-10">
          <CharacterAvatar character={c} size={140} />
          <h1 className="font-display text-4xl sm:text-5xl">{c.name}</h1>
          <p className="text-lg font-bold text-ink-soft">{c.shortDescription}</p>
          <p className="max-w-2xl text-left leading-relaxed sm:text-center">{c.longDescription}</p>
        </section>

        <section className="paper grid gap-6 p-6 sm:grid-cols-2 sm:p-8">
          <List title="Traços" items={c.traits} />
          <List title="Pontos fortes" items={c.strengths} />
          <List title="Limitações" items={c.limitations} />
          <List title="Contradições" items={c.contradictions} />
        </section>

        <section aria-labelledby="perfil" className="paper p-6 sm:p-8">
          <h2 id="perfil" className="mb-6 font-display text-2xl">Perfil nos {theme.axes.length} eixos</h2>
          <div className="flex flex-col gap-6">
            {theme.axes.map((axis) => (
              <AxisBar key={axis.id} axis={axis} score={c.scores[axis.id]!} showDescription={false} />
            ))}
          </div>
          <details className="mt-6">
            <summary className="cursor-pointer font-bold">Por que estes valores?</summary>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">{c.editorialRationale}</p>
          </details>
        </section>

        <div className="flex justify-center">
          <ButtonLink href="/quiz" size="lg">Descobrir meu personagem</ButtonLink>
        </div>
      </Container>
    </main>
  );
}
