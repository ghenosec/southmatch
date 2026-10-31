import type { Metadata } from "next";
import { Suspense } from "react";
import { QuizApp } from "@/components/quiz/quiz-app";
import { Container } from "@/components/ui/container";

export const metadata: Metadata = {
  title: "Teste",
  description: "Responda às afirmações e descubra com qual personagem de South Park você mais se parece.",
};

function QuizLoading() {
  return (
    <div className="paper mx-auto max-w-3xl p-8 text-center" role="status">
      <p className="font-display text-2xl">Preparando o teste…</p>
    </div>
  );
}

export default function QuizPage() {
  return (
    <main className="flex-1 bg-gradient-to-b from-sky-pale to-snow py-8 sm:py-12">
      <Container>
        <Suspense fallback={<QuizLoading />}>
          <QuizApp />
        </Suspense>
      </Container>
    </main>
  );
}
