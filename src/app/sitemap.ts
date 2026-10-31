import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { getActiveTheme } from "@/services/quiz";

/** Páginas públicas indexáveis. /resultado fica de fora (conteúdo pessoal, noindex). */
export default function sitemap(): MetadataRoute.Sitemap {
  const theme = getActiveTheme();
  const pages: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_URL}/quiz`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/personagens`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/metodologia`, changeFrequency: "yearly", priority: 0.5 },
    { url: `${SITE_URL}/privacidade`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/sobre`, changeFrequency: "yearly", priority: 0.3 },
  ];
  return [
    ...pages,
    ...theme.characters.map((c) => ({
      url: `${SITE_URL}/personagens/${c.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
