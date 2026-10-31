import type { ThemeTexts, ThemeVersions, ThemeVisualConfig } from "@/core/types";
import { DATA_FORMAT_VERSION } from "@/core/version";

export const id = "south-park";
export const name = "South Park";
export const description =
  "Descubra com qual personagem de South Park você mais se parece em nove dimensões de personalidade.";

/** Incremente `profiles` sempre que qualquer valor ou texto de personagem mudar. */
export const versions: ThemeVersions = {
  dataFormat: DATA_FORMAT_VERSION,
  profiles: "2026.10.0",
};

export const visual: ThemeVisualConfig = {
  colors: {
    primary: "#7cc8f0",
    primaryContrast: "#13294b",
    surface: "#fbfdff",
    ink: "#13294b",
    accent: "#d7263d",
    highlight: "#ffd23f",
    muted: "#5b6b82",
  },
};

export const texts: ThemeTexts = {
  title: "Qual personagem de South Park você seria?",
  subtitle: "Descubra quem mais combina com a sua personalidade.",
  intro:
    "Responda a 45 afirmações sobre seu jeito de pensar, agir e lidar com o mundo. No final, descubra qual personagem de South Park mais se parece com você.",
  disclaimer:
    "SouthMatch é um projeto independente de fãs, sem afiliação, patrocínio ou aprovação dos criadores, da Comedy Central ou da Paramount. South Park e seus personagens pertencem aos respectivos titulares de direitos.",
};
