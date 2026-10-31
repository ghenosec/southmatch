import { ImageResponse } from "next/og";
import { initialsOf } from "@/lib/initials";
import { getActiveTheme } from "@/services/quiz";
import { OG_SIZE, OgCard } from "../../og-card";

export const alt = "Perfil de personagem no SouthMatch";
export const size = OG_SIZE;
export const contentType = "image/png";

export function generateStaticParams() {
  return getActiveTheme().characters.map((c) => ({ slug: c.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = getActiveTheme().characters.find((x) => x.slug === slug);
  return new ImageResponse(
    (
      <OgCard
        kicker="Perfil de personalidade"
        title={c?.name ?? "Personagem"}
        subtitle={c?.shortDescription ?? "Descubra qual personagem combina com você."}
        color={c?.color ?? "#7cc8f0"}
        initials={c ? initialsOf(c.name) : "?"}
      />
    ),
    size,
  );
}
