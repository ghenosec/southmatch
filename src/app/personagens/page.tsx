import type { Metadata } from "next";
import { CharacterCatalog } from "@/components/characters/character-catalog";
import { Container } from "@/components/ui/container";
import { getActiveTheme } from "@/services/quiz";

const theme = getActiveTheme();

export const metadata: Metadata = {
  title: "Personagens",
  description: `Conheça os ${theme.characters.length} personagens de South Park comparados no teste e seus perfis de personalidade em ${theme.axes.length} eixos.`,
};

export default function CharactersPage() {
  return (
    <main className="flex-1 bg-gradient-to-b from-sky-pale to-snow py-10 sm:py-14">
      <Container>
        <h1 className="text-center font-display text-4xl sm:text-5xl">Personagens</h1>
        <p className="mx-auto mt-3 max-w-2xl text-center text-lg text-ink-soft">
          Os perfis com quem suas respostas são comparadas. Ordene por qualquer eixo para ver quem fica em cada ponta.
        </p>
        <CharacterCatalog />
        <p className="mt-8 text-center text-xs text-muted">
          Ilustrações provisórias e originais, sem uso de imagens oficiais. Os perfis são interpretações editoriais.
        </p>
      </Container>
    </main>
  );
}
