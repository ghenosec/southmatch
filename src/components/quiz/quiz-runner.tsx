"use client";

import { ArrowLeft, ArrowRight, RotateCcw, Sparkles } from "lucide-react";
import { useEffect, useMemo, useReducer, useRef, useState } from "react";
import type { ThemeDefinition } from "@/core/types";
import { browserStore, clearProgress, saveProgress } from "@/lib/storage/quiz-progress";
import {
  answeredCount,
  createQuizReducer,
  EMPTY_QUIZ_STATE,
  firstUnansweredIndex,
  isComplete,
  type QuizState,
} from "@/services/quiz";
import { Button, ButtonLink } from "@/components/ui/button";
import { LikertOptions } from "./likert-options";
import { ProgressBar } from "./progress-bar";

const AUTO_ADVANCE_KEY = "southmatch:prefs:auto-advance";
/** Pausa para o usuário ver a seleção antes do avanço automático. */
const ADVANCE_DELAY_MS = 280;

function readAutoAdvance(): boolean {
  try {
    return globalThis.localStorage?.getItem(AUTO_ADVANCE_KEY) !== "0";
  } catch {
    return true;
  }
}

export function QuizRunner({ theme, initial }: { theme: ThemeDefinition; initial: QuizState | null }) {
  const questions = theme.questions;
  const total = questions.length;
  const reducer = useMemo(() => createQuizReducer(questions), [questions]);
  const [state, dispatch] = useReducer(reducer, initial ?? EMPTY_QUIZ_STATE);
  const [autoAdvance, setAutoAdvance] = useState(readAutoAdvance);
  const [confirmReset, setConfirmReset] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  const headingRef = useRef<HTMLHeadingElement>(null);
  const firstRender = useRef(true);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const question = questions[state.index]!;
  const selected = state.answers[question.id];
  const answered = answeredCount(state, questions);
  const complete = isComplete(state, questions);
  const isLast = state.index === total - 1;

  // Salva o progresso a cada mudança (apenas neste dispositivo).
  useEffect(() => {
    const store = browserStore();
    if (answeredCount(state, questions) === 0) clearProgress(store, theme);
    else saveProgress(store, theme, state.answers, state.index, Date.now());
  }, [state, questions, theme]);

  // Move o foco para a nova afirmação (exceto no primeiro carregamento).
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    headingRef.current?.focus();
  }, [state.index]);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  function select(optionId: string, viaPointer: boolean) {
    if (timer.current) clearTimeout(timer.current);
    dispatch({ type: "answer", questionId: question.id, optionId, advance: false });
    const label = theme.scale.options.find((o) => o.id === optionId)?.label ?? "";
    setAnnouncement(`Resposta registrada: ${label}.`);
    if (autoAdvance && viaPointer && !isLast) {
      timer.current = setTimeout(() => dispatch({ type: "next" }), ADVANCE_DELAY_MS);
    }
  }

  function toggleAutoAdvance(value: boolean) {
    setAutoAdvance(value);
    try {
      globalThis.localStorage?.setItem(AUTO_ADVANCE_KEY, value ? "1" : "0");
    } catch {
      /* preferência não persistida */
    }
  }

  function reset() {
    if (timer.current) clearTimeout(timer.current);
    dispatch({ type: "reset" });
    setConfirmReset(false);
    setAnnouncement("Respostas apagadas. Teste reiniciado.");
  }

  const reachable = firstUnansweredIndex(state.answers, questions);

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
      <div className="flex flex-col gap-2">
        <div className="flex items-baseline justify-between text-sm font-extrabold">
          <span>
            Afirmação <span className="tabular-nums">{state.index + 1}</span> de {total}
          </span>
          <span className="text-muted tabular-nums">{answered} respondidas</span>
        </div>
        <ProgressBar answered={answered} total={total} />
      </div>

      <form
        className="paper p-5 sm:p-8"
        onSubmit={(e) => {
          e.preventDefault();
          if (selected && !isLast) dispatch({ type: "next" });
        }}
      >
        <fieldset>
          <legend className="contents">
            <h1
              ref={headingRef}
              tabIndex={-1}
              className="mb-6 font-display text-2xl leading-snug text-ink outline-none sm:text-3xl"
            >
              {question.text}
            </h1>
          </legend>
          <LikertOptions
            name={question.id}
            options={theme.scale.options}
            value={selected}
            onSelect={select}
            onConfirm={() => {
              if (!isLast) dispatch({ type: "next" });
            }}
          />
        </fieldset>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <Button
            variant="secondary"
            onClick={() => dispatch({ type: "prev" })}
            disabled={state.index === 0}
          >
            <ArrowLeft aria-hidden className="size-5" /> Voltar
          </Button>
          {isLast && complete ? (
            <ButtonLink href="/resultado" size="lg">
              <Sparkles aria-hidden className="size-5" /> Ver meu resultado
            </ButtonLink>
          ) : (
            <Button type="submit" disabled={!selected || isLast}>
              Próxima <ArrowRight aria-hidden className="size-5" />
            </Button>
          )}
        </div>
        {isLast && !complete && (
          <p className="mt-4 text-sm font-bold text-action">
            Ainda há afirmações sem resposta. Use a revisão abaixo para encontrá-las.
          </p>
        )}
      </form>

      <p role="status" aria-live="polite" className="sr-only">
        {announcement}
      </p>

      <div className="flex flex-col gap-4 text-sm sm:flex-row sm:items-center sm:justify-between">
        <label className="flex cursor-pointer items-center gap-2 font-bold">
          <input
            type="checkbox"
            checked={autoAdvance}
            onChange={(e) => toggleAutoAdvance(e.target.checked)}
            className="size-5 accent-action"
          />
          Avançar automaticamente ao responder
        </label>
        {confirmReset ? (
          <div role="group" aria-label="Confirmar reinício" className="flex flex-wrap items-center gap-2">
            <span className="font-bold">Apagar todas as respostas?</span>
            <Button size="md" onClick={reset}>Sim, reiniciar</Button>
            <Button size="md" variant="secondary" onClick={() => setConfirmReset(false)}>Cancelar</Button>
          </div>
        ) : (
          <Button variant="ghost" onClick={() => setConfirmReset(true)} disabled={answered === 0}>
            <RotateCcw aria-hidden className="size-4" /> Reiniciar teste
          </Button>
        )}
      </div>

      <details className="paper p-0">
        <summary className="cursor-pointer p-4 font-extrabold">Revisar respostas</summary>
        <ol className="grid grid-cols-5 gap-2 px-4 pb-4 sm:grid-cols-9">
          {questions.map((q, i) => {
            const done = Object.hasOwn(state.answers, q.id);
            const current = i === state.index;
            return (
              <li key={q.id}>
                <button
                  type="button"
                  disabled={i > reachable}
                  onClick={() => dispatch({ type: "goto", index: i })}
                  aria-current={current ? "step" : undefined}
                  aria-label={`Afirmação ${i + 1}${done ? ", respondida" : ", sem resposta"}`}
                  className={`flex h-11 w-full items-center justify-center rounded-lg border-2 font-extrabold tabular-nums disabled:opacity-40 ${
                    current ? "border-ink bg-sun" : done ? "border-ink bg-sky" : "border-line bg-snow"
                  }`}
                >
                  {i + 1}
                </button>
              </li>
            );
          })}
        </ol>
      </details>
    </div>
  );
}
