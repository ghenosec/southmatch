import type { Metadata, Viewport } from "next";
import { Lilita_One, Nunito } from "next/font/google";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { themeVariables } from "@/components/layout/theme-variables";
import { getActiveTheme } from "@/services/quiz";
import "./globals.css";

const nunito = Nunito({ variable: "--font-nunito", subsets: ["latin"] });
const lilita = Lilita_One({ variable: "--font-lilita", subsets: ["latin"], weight: "400" });

const theme = getActiveTheme();

export const metadata: Metadata = {
  title: {
    default: `SouthMatch — ${theme.texts.title}`,
    template: "%s | SouthMatch",
  },
  description:
    "Teste gratuito e anônimo: responda a 45 afirmações e descubra com qual personagem de South Park você mais se parece.",
  applicationName: "SouthMatch",
};

export const viewport: Viewport = {
  themeColor: theme.visual.colors.primary,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${nunito.variable} ${lilita.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans" style={themeVariables(theme.visual)}>
        <a
          href="#conteudo"
          className="sr-only z-50 rounded-md bg-sun px-4 py-2 font-bold text-ink focus:not-sr-only focus:fixed focus:top-2 focus:left-2"
        >
          Pular para o conteúdo
        </a>
        <SiteHeader />
        <div id="conteudo" className="flex flex-1 flex-col">
          {children}
        </div>
        <SiteFooter disclaimer={theme.texts.disclaimer} />
      </body>
    </html>
  );
}
