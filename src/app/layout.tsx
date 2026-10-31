import type { Metadata, Viewport } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "SouthMatch — Qual personagem de South Park você seria?",
    template: "%s | SouthMatch",
  },
  description:
    "Teste gratuito e anônimo: responda a 45 afirmações e descubra com qual personagem de South Park você mais se parece.",
  applicationName: "SouthMatch",
};

export const viewport: Viewport = {
  themeColor: "#7cc8f0",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${nunito.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">{children}</body>
    </html>
  );
}
