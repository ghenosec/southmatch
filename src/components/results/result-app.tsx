"use client";

import { useRouter } from "next/navigation";
import { use, useState } from "react";
import { browser } from "react-dom";
import { browserStore, clearProgress, loadProgress } from "@/lib/storage/quiz-progress";
import { answeredCount, computeThemeResult, getActiveTheme, isComplete } from "@/services/quiz";
import { ButtonLink } from "@/components/ui/button";
import { ResultView } from "./result-view";

/**
 * Carrega as respostas salvas neste dispositivo, calcula o resultado
 * e entrega para a ResultView. Só roda no navegador (localStorage).
 */
export function ResultApp() {
  use(browser("O resultado é calculado com as respostas salvas no localStorage."));
  const theme = getActiveTheme();
  const router = useRouter();
  const [saved] = useState(() => loadProgress(browserStore(), theme, Date.now()));
  const state = saved ? { answers: saved.answers, index: saved.index } : null;
  const [outcome] = useState(() =>
    state && isComplete(state, theme.questions) ? computeThemeResult(theme, state.answers) : null,
  );

  if (!outcome) {
    const count = state ? answeredCount(state, theme.questions) : 0;
    return (
      <section className="paper mx-auto max-w-xl p-8 text-center">
        <h1 className="font-display text-3xl">Ainda não há resultado</h1>
        <p className="mt-3 text-ink-soft">
          {count > 0
            ? `Você respondeu ${count} de ${theme.questions.length} afirmações. Termine o teste para ver seu personagem.`
            : "Responda ao teste para descobrir com qual personagem você mais se parece."}
        </p>
        <ButtonLink href="/quiz" className="mt-6">
          {count > 0 ? "Continuar o teste" : "Começar teste"}
        </ButtonLink>
      </section>
    );
  }

  return (
    <ResultView
      theme={theme}
      result={outcome.result}
      onRestart={() => {
        clearProgress(browserStore(), theme);
        router.push("/quiz");
      }}
    />
  );
}
