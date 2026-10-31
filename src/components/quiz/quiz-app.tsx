"use client";

import { use, useState } from "react";
import { browser } from "react-dom";
import { RotateCcw, Play } from "lucide-react";
import { browserStore, clearProgress, loadProgress } from "@/lib/storage/quiz-progress";
import { answeredCount, getActiveTheme, isComplete, type QuizState } from "@/services/quiz";
import { Button, ButtonLink } from "@/components/ui/button";
import { QuizRunner } from "./quiz-runner";

/**
 * Raiz do questionário. Só renderiza no navegador, porque depende do
 * progresso salvo em localStorage (o servidor mostra o fallback do Suspense).
 */
export function QuizApp() {
  use(browser("O progresso do teste fica salvo no localStorage do navegador."));
  const theme = getActiveTheme();
  const [saved] = useState(() => loadProgress(browserStore(), theme, Date.now()));
  const savedState: QuizState | null = saved ? { answers: saved.answers, index: saved.index } : null;
  const savedCount = savedState ? answeredCount(savedState, theme.questions) : 0;
  const [mode, setMode] = useState<"resume" | "run" | "fresh">(savedCount > 0 ? "resume" : "fresh");

  if (mode === "resume" && savedState) {
    const done = isComplete(savedState, theme.questions);
    const restart = () => {
      clearProgress(browserStore(), theme);
      setMode("fresh");
    };
    return (
      <section aria-labelledby="retomar" className="paper mx-auto max-w-xl p-6 text-center sm:p-8">
        <h1 id="retomar" className="font-display text-3xl">
          {done ? "Você já terminou o teste" : "Você já começou o teste"}
        </h1>
        <p className="mt-3 text-ink-soft">
          {done
            ? "Suas respostas estão salvas neste dispositivo."
            : `Você respondeu ${savedCount} de ${theme.questions.length} afirmações neste dispositivo.`}
        </p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          {done ? (
            <ButtonLink href="/resultado">
              <Play aria-hidden className="size-5" /> Ver meu resultado
            </ButtonLink>
          ) : (
            <Button onClick={() => setMode("run")}>
              <Play aria-hidden className="size-5" /> Continuar de onde parei
            </Button>
          )}
          <Button variant="secondary" onClick={restart}>
            <RotateCcw aria-hidden className="size-5" /> {done ? "Refazer o teste" : "Recomeçar do zero"}
          </Button>
        </div>
      </section>
    );
  }

  return <QuizRunner theme={theme} initial={mode === "run" ? savedState : null} />;
}
