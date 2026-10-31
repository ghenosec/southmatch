"use client";

import Link from "next/link";
import { RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { use, useState } from "react";
import { browser } from "react-dom";
import { round } from "@/core";
import { browserStore, clearProgress, loadProgress } from "@/lib/storage/quiz-progress";
import { answeredCount, computeThemeResult, getActiveTheme, isComplete } from "@/services/quiz";
import { CharacterAvatar } from "@/components/characters/character-avatar";
import { Button, ButtonLink } from "@/components/ui/button";
import { AxisBar } from "./axis-bar";

/**
 * Resultado calculado a partir das respostas salvas neste dispositivo.
 * (Fase 4: versão básica. Gráficos, comparação e explicações chegam na Fase 5.)
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

  const { result, character } = outcome;
  const winner = character(result.winner);

  function restart() {
    clearProgress(browserStore(), theme);
    router.push("/quiz");
  }

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-8">
      <section aria-labelledby="vencedor" className="paper flex flex-col items-center gap-4 p-6 text-center sm:p-10">
        <CharacterAvatar character={winner} size={140} />
        <h1 id="vencedor" className="font-display text-3xl leading-tight sm:text-5xl">
          {winner.result.headline}
        </h1>
        <p className="rounded-full border-[3px] border-ink bg-sun px-5 py-1 text-xl font-extrabold">
          Afinidade: <span className="tabular-nums">{round(result.winner.affinity)}%</span>
        </p>
        <p className="max-w-xl text-lg leading-relaxed text-ink-soft">{winner.result.summary}</p>
        <ul className="flex flex-wrap justify-center gap-2">
          {winner.traits.map((t) => (
            <li key={t} className="rounded-full border-2 border-ink bg-sky-pale px-3 py-0.5 text-sm font-bold">
              {t}
            </li>
          ))}
        </ul>
        <p className="text-xs text-muted">
          A afinidade é um índice de semelhança entre perfis numéricos, não uma probabilidade nem um diagnóstico.
        </p>
      </section>

      <section aria-labelledby="top5" className="paper p-6 sm:p-8">
        <h2 id="top5" className="mb-4 font-display text-2xl">
          Seus {result.top.length} personagens mais compatíveis
        </h2>
        <ol className="flex flex-col gap-3">
          {result.top.map((r) => {
            const c = character(r);
            return (
              <li key={r.profileId} className="flex items-center gap-3 rounded-2xl border-2 border-line p-3">
                <span className="w-6 text-center font-display text-xl">{r.rank}</span>
                <CharacterAvatar character={c} size={52} decorative />
                <div className="min-w-0 flex-1">
                  <Link href={`/personagens/${c.slug}`} className="font-extrabold hover:underline">
                    {c.name}
                  </Link>
                  <p className="truncate text-sm text-ink-soft">{c.shortDescription}</p>
                </div>
                <span className="font-extrabold tabular-nums">{round(r.affinity)}%</span>
              </li>
            );
          })}
        </ol>
      </section>

      <section aria-labelledby="eixos" className="paper p-6 sm:p-8">
        <h2 id="eixos" className="mb-2 font-display text-2xl">
          Seu perfil nos {theme.axes.length} eixos
        </h2>
        <p className="mb-6 text-sm text-muted">
          Círculo amarelo: você. Losango: {winner.name}. A linha central marca o equilíbrio (50).
        </p>
        <div className="flex flex-col gap-6">
          {theme.axes.map((axis) => (
            <AxisBar
              key={axis.id}
              axis={axis}
              score={result.user.scores[axis.id]!}
              compareScore={winner.scores[axis.id]}
              compareLabel={winner.name}
            />
          ))}
        </div>
      </section>

      <div className="flex flex-col justify-center gap-3 sm:flex-row">
        <Button variant="secondary" onClick={restart}>
          <RotateCcw aria-hidden className="size-5" /> Refazer o teste
        </Button>
        <ButtonLink href="/metodologia" variant="ghost">
          Como o resultado é calculado?
        </ButtonLink>
      </div>
    </div>
  );
}
