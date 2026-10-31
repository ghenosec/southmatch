import type { Metadata } from "next";
import Link from "next/link";
import { CharacterAvatar } from "@/components/characters/character-avatar";
import { Container } from "@/components/ui/container";
import { getActiveTheme } from "@/services/quiz";

const theme = getActiveTheme();

export const metadata: Metadata = {
  title: "Personagens",
  description: `Conheça os ${theme.characters.length} personagens de South Park comparados no teste e seus perfis de personalidade.`,
};

export default function CharactersPage() {
  const characters = [...theme.characters].sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
  return (
    <main className="flex-1 bg-gradient-to-b from-sky-pale to-snow py-10 sm:py-14">
      <Container>
        <h1 className="text-center font-display text-4xl sm:text-5xl">Personagens</h1>
        <p className="mx-auto mt-3 max-w-2xl text-center text-lg text-ink-soft">
          Os {characters.length} perfis com quem suas respostas são comparadas.
        </p>
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {characters.map((c) => (
            <li key={c.id}>
              <Link
                href={`/personagens/${c.slug}`}
                className="paper flex h-full items-center gap-4 p-4 transition-transform hover:-translate-y-1"
              >
                <CharacterAvatar character={c} size={72} decorative />
                <span>
                  <span className="block text-lg font-extrabold">{c.name}</span>
                  <span className="block text-sm text-ink-soft">{c.shortDescription}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-8 text-center text-xs text-muted">Ilustrações provisórias e originais, sem uso de imagens oficiais.</p>
      </Container>
    </main>
  );
}
