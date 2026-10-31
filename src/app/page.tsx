import { Hero } from "@/components/landing/hero";
import { AxesPreview, CharactersPreview, Faq, HowItWorks } from "@/components/landing/sections";
import { estimatedMinutes, getActiveTheme } from "@/services/quiz";

const theme = getActiveTheme();

/** Personagens em destaque na landing (por ID, sem critério de popularidade no cálculo). */
const FEATURED = ["stan", "kyle", "cartman", "kenny", "butters", "wendy"];

export default function Home() {
  const featured = FEATURED.map((id) => theme.characters.find((c) => c.id === id)).filter(
    (c): c is NonNullable<typeof c> => c !== undefined,
  );

  return (
    <main>
      <Hero
        title={theme.texts.title}
        subtitle={theme.texts.subtitle}
        intro={theme.texts.intro}
        questionCount={theme.questions.length}
        minutes={estimatedMinutes(theme)}
      />
      <HowItWorks questionCount={theme.questions.length} axisCount={theme.axes.length} />
      <AxesPreview axes={theme.axes} />
      <CharactersPreview characters={featured} total={theme.characters.length} />
      <Faq />
    </main>
  );
}
