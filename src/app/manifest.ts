import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "SouthMatch",
    short_name: "SouthMatch",
    description: "Teste de personalidade com personagens de South Park.",
    lang: "pt-BR",
    start_url: "/",
    display: "standalone",
    background_color: "#fbfdff",
    theme_color: "#7cc8f0",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
