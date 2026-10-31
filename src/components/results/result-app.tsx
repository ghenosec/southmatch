"use client";

import { useRouter } from "next/navigation";
import { use, useState, useSyncExternalStore } from "react";
import { browser } from "react-dom";
import { readShareFragment } from "@/lib/sharing/share-link";
import { browserStore, clearProgress, loadProgress } from "@/lib/storage/quiz-progress";
import {
  answeredCount,
  computeThemeResult,
  getActiveTheme,
  isComplete,
  resolveSharedResult,
  SHARED_ERROR_MESSAGES,
} from "@/services/quiz";
import { ButtonLink } from "@/components/ui/button";
import { ResultView } from "./result-view";

function subscribeHash(onChange: () => void) {
  window.addEventListener("hashchange", onChange);
  return () => window.removeEventListener("hashchange", onChange);
}

/**
 * Decide o que mostrar em /resultado:
 * - `#r=…` no endereço → resultado compartilhado (validado e versionado);
 * - senão → resultado das respostas salvas neste dispositivo.
 * Só roda no navegador (fragmento da URL e localStorage).
 */
export function ResultApp() {
  use(browser("O resultado vem do fragmento da URL ou do localStorage."));
  // Reage também quando só o fragmento muda (a página não recarrega nesse caso).
  const hash = useSyncExternalStore(subscribeHash, () => location.hash, () => "");
  const shareCode = readShareFragment(hash);
  if (shareCode !== null) return <SharedResult key={shareCode} code={shareCode} />;
  return <LocalResult />;
}

function SharedResult({ code }: { code: string }) {
  const [outcome] = useState(() => resolveSharedResult(code));
  if (!outcome.ok) {
    return (
      <section className="paper mx-auto max-w-xl p-8 text-center">
        <h1 className="font-display text-3xl">Não foi possível abrir este resultado</h1>
        <p className="mt-3 text-ink-soft">{SHARED_ERROR_MESSAGES[outcome.error]}</p>
        <ButtonLink href="/quiz" className="mt-6">
          Fazer o teste
        </ButtonLink>
      </section>
    );
  }
  return <ResultView theme={outcome.theme} result={outcome.result} shared />;
}

function LocalResult() {
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
