import type { Metadata } from "next";
import { Suspense } from "react";
import { ResultApp } from "@/components/results/result-app";
import { Container } from "@/components/ui/container";

export const metadata: Metadata = {
  title: "Seu resultado",
  description: "Veja com qual personagem de South Park você mais se parece e seu perfil nos nove eixos.",
  robots: { index: false },
};

export default function ResultPage() {
  return (
    <main className="flex-1 bg-gradient-to-b from-sky-pale to-snow py-8 sm:py-12">
      <Container>
        <Suspense
          fallback={
            <p role="status" className="paper mx-auto max-w-xl p-8 text-center font-display text-2xl">
              Calculando seu resultado…
            </p>
          }
        >
          <ResultApp />
        </Suspense>
      </Container>
    </main>
  );
}
