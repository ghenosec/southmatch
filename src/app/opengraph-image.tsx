import { ImageResponse } from "next/og";
import { getActiveTheme } from "@/services/quiz";
import { OG_SIZE, OgCard } from "./og-card";

export const alt = "SouthMatch — teste de personalidade com personagens de South Park";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  const theme = getActiveTheme();
  return new ImageResponse(
    (
      <OgCard
        kicker="Teste de personalidade grátis"
        title={theme.texts.title}
        subtitle={`${theme.questions.length} afirmações · ${theme.axes.length} eixos · sem cadastro`}
        color="#d7263d"
        initials="?"
      />
    ),
    size,
  );
}
