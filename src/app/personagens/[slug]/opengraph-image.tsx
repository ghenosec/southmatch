import { readFile } from "node:fs/promises";
import { extname, join } from "node:path";
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

const MIME: Record<string, string> = {
  ".png": "image/png",
  ".webp": "image/webp",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
};

/** Lê a imagem do personagem de public/ (build) como data URL; null se não houver. */
async function imageDataUrl(src: string | null): Promise<string | null> {
  if (!src) return null;
  try {
    const data = await readFile(join(process.cwd(), "public", src));
    return `data:${MIME[extname(src).toLowerCase()] ?? "image/png"};base64,${data.toString("base64")}`;
  } catch {
    return null;
  }
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = getActiveTheme().characters.find((x) => x.slug === slug);
  const picture = c?.image.license ? await imageDataUrl(c.image.src) : null;
  return new ImageResponse(
    (
      <OgCard
        kicker="Perfil de personalidade"
        title={c?.name ?? "Personagem"}
        subtitle={c?.shortDescription ?? "Descubra qual personagem combina com você."}
        color={c?.color ?? "#7cc8f0"}
        initials={c ? initialsOf(c.name) : "?"}
        imageDataUrl={picture}
      />
    ),
    size,
  );
}
