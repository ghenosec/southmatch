import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ShieldCheck } from "lucide-react";
import { round } from "@/core";
import { CharacterAvatar } from "@/components/characters/character-avatar";
import { AxisBar } from "@/components/results/axis-bar";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import {
  adjacentCharacters,
  characterHighlights,
  CONFIDENCE_LABELS,
  getActiveTheme,
  similarCharacters,
} from "@/services/quiz";

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
  const description = `${c.name}: ${c.shortDescription} Veja o perfil de personalidade usado no SouthMatch.`;
  return {
    title: c.name,
    description,
    openGraph: { title: `${c.name} | SouthMatch`, description, type: "profile" },
    alternates: { canonical: `/personagens/${c.slug}` },
  };
}

function List({ title, items }: { title: string; items: readonly string[] }) {
  return (
    <div>
      <h2 className="font-display text-xl">{title}</h2>
      <ul className="mt-2 flex flex-col gap-1">
        {items.map((i) => (
          <li key={i} className="ml-5 list-disc">
            {i}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default async function CharacterPage({ params }: PageProps<"/personagens/[slug]">) {
  const c = findCharacter((await params).slug);
  if (!c) notFound();

  const highlights = characterHighlights(theme, c);
  const similar = similarCharacters(theme, c.id, 3);
  const { previous, next } = adjacentCharacters(theme, c.id);
  const confidence = c.confidence ? CONFIDENCE_LABELS[c.confidence] : null;

  return (
    <main className="flex-1 bg-gradient-to-b from-sky-pale to-snow py-10 sm:py-14">
      <Container className="flex max-w-3xl flex-col gap-8">
        <div className="text-sm font-bold">
          <Link href="/personagens" className="underline-offset-4 hover:underline">
            ← Todos os personagens
          </Link>
        </div>

        <section className="paper flex flex-col items-center gap-4 p-6 text-center sm:p-10">
          <CharacterAvatar character={c} size={140} />
          <h1 className="font-display text-4xl sm:text-5xl">{c.name}</h1>
          <p className="text-lg font-bold text-ink-soft">{c.shortDescription}</p>
          {highlights.length > 0 && (
            <ul className="flex flex-wrap justify-center gap-2" aria-label="Traços mais marcantes no teste">
              {highlights.map((h) => (
                <li key={h.axisId} className="rounded-full border-2 border-ink bg-sun px-3 py-0.5 text-sm font-bold">
                  {theme.axes.find((a) => a.id === h.axisId)!.name}: {round(h.score)}
                </li>
              ))}
            </ul>
          )}
          <p className="max-w-2xl text-left leading-relaxed sm:text-center">{c.longDescription}</p>
        </section>

        <section className="paper grid gap-6 p-6 sm:grid-cols-2 sm:p-8">
          <List title="Traços" items={c.traits} />
          <List title="Pontos fortes" items={c.strengths} />
          <List title="Limitações" items={c.limitations} />
          <List title="Contradições" items={c.contradictions} />
        </section>

        <section aria-labelledby="perfil" className="paper p-6 sm:p-8">
          <h2 id="perfil" className="mb-6 font-display text-2xl">
            Perfil nos {theme.axes.length} eixos
          </h2>
          <div className="grid gap-x-10 gap-y-6 md:grid-cols-2">
            {theme.axes.map((axis) => (
              <AxisBar
                key={axis.id}
                axis={axis}
                score={c.scores[axis.id]!}
                showDescription={false}
                showBandLabel={false}
              />
            ))}
          </div>
          <div className="mt-8 rounded-2xl bg-sky-pale p-4">
            <h3 className="font-extrabold">Por que estes valores?</h3>
            <p className="mt-1 text-sm leading-relaxed text-ink-soft">{c.editorialRationale}</p>
            {confidence && (
              <p className="mt-3 flex items-start gap-2 text-sm">
                <ShieldCheck aria-hidden className="mt-0.5 size-4 shrink-0" />
                <span>
                  <strong>{confidence.label}.</strong> {confidence.description}
                </span>
              </p>
            )}
          </div>
        </section>

        <section aria-labelledby="parecidos" className="paper p-6 sm:p-8">
          <h2 id="parecidos" className="font-display text-2xl">
            Personagens com perfil parecido
          </h2>
          <p className="mt-1 text-sm text-muted">Pela mesma afinidade usada no teste.</p>
          <ul className="mt-4 grid gap-3 sm:grid-cols-3">
            {similar.map(({ character, affinity }) => (
              <li key={character.id}>
                <Link
                  href={`/personagens/${character.slug}`}
                  className="flex h-full flex-col items-center gap-2 rounded-2xl border-2 border-line p-4 text-center hover:border-ink"
                >
                  <CharacterAvatar character={character} size={56} decorative />
                  <span className="font-extrabold">{character.name}</span>
                  <span className="text-sm tabular-nums text-ink-soft">{round(affinity)}% de afinidade</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <div className="flex flex-col items-center gap-6">
          <ButtonLink href="/quiz" size="lg">
            Descobrir meu personagem
          </ButtonLink>
          {previous && next && (
            <nav aria-label="Personagem anterior e próximo" className="flex w-full justify-between gap-4 text-sm font-bold">
              <Link href={`/personagens/${previous.slug}`} className="flex items-center gap-1 hover:underline">
                <ArrowLeft aria-hidden className="size-4" /> {previous.name}
              </Link>
              <Link href={`/personagens/${next.slug}`} className="flex items-center gap-1 text-right hover:underline">
                {next.name} <ArrowRight aria-hidden className="size-4" />
              </Link>
            </nav>
          )}
        </div>
      </Container>
    </main>
  );
}
