"use client";

import Link from "next/link";
import { BookOpen, Check, Copy, GitCompare, Info, RotateCcw } from "lucide-react";
import { useState } from "react";
import { round, type QuizResult, type ThemeDefinition } from "@/core";
import { buildExplanation, resultSummaryText } from "@/services/quiz";
import { CharacterAvatar } from "@/components/characters/character-avatar";
import { Button, ButtonLink } from "@/components/ui/button";
import { AxisBar } from "./axis-bar";
import { ComparisonPanel } from "./comparison-panel";

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section aria-labelledby={id} className="paper p-6 sm:p-8">
      <h2 id={id} className="mb-4 font-display text-2xl">
        {title}
      </h2>
      {children}
    </section>
  );
}

/** Exibe um resultado já calculado (local ou, na Fase 6, compartilhado). */
export function ResultView({
  theme,
  result,
  onRestart,
}: {
  theme: ThemeDefinition;
  result: QuizResult;
  onRestart: () => void;
}) {
  const byId = new Map(theme.characters.map((c) => [c.id, c]));
  const winner = byId.get(result.winner.profileId)!;
  const explanation = buildExplanation(theme, result, winner);
  const [compareId, setCompareId] = useState(winner.id);
  const [copied, setCopied] = useState<"idle" | "ok" | "error">("idle");

  function compare(id: string) {
    setCompareId(id);
    document.getElementById("comparar")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function copy() {
    const names = result.top.map((r) => byId.get(r.profileId)!.name);
    const text = `${resultSummaryText(theme, result, winner, names)}\n\n${location.origin}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied("ok");
    } catch {
      setCopied("error");
    }
  }

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8">
      {/* Resultado principal */}
      <section aria-labelledby="vencedor" className="paper flex flex-col items-center gap-4 p-6 text-center sm:p-10">
        <CharacterAvatar character={winner} size={140} />
        <h1 id="vencedor" className="font-display text-3xl leading-tight sm:text-5xl">
          {winner.result.headline}
        </h1>
        <p className="rounded-full border-[3px] border-ink bg-sun px-5 py-1 text-xl font-extrabold">
          Afinidade: <span className="tabular-nums">{round(result.winner.affinity)}%</span>
        </p>
        <p className="max-w-2xl text-lg leading-relaxed text-ink-soft">{winner.result.summary}</p>
        <ul className="flex flex-wrap justify-center gap-2" aria-label={`Traços de ${winner.name}`}>
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

      {explanation.balancedNote && (
        <aside className="flex gap-3 rounded-2xl border-[3px] border-ink bg-sun/40 p-4" role="note">
          <Info aria-hidden className="mt-0.5 size-5 shrink-0" />
          <p className="leading-relaxed">{explanation.balancedNote}</p>
        </aside>
      )}

      {/* Por que este personagem */}
      <Section id="por-que" title={`Por que ${winner.name}?`}>
        <p className="leading-relaxed">{explanation.justification}</p>
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <div>
            <h3 className="font-extrabold">O que vocês têm em comum</h3>
            {explanation.winner.similarities.length > 0 ? (
              <ul className="mt-2 flex flex-col gap-2">
                {explanation.winner.similarities.map((s) => (
                  <li key={s.axisId} className="rounded-xl bg-sky-pale p-3 leading-relaxed">{s.text}</li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-ink-soft">
                Nenhum eixo isolado ficou muito próximo; a semelhança vem do conjunto do perfil.
              </p>
            )}
          </div>
          <div>
            <h3 className="font-extrabold">Onde vocês diferem</h3>
            {explanation.winner.differences.length > 0 ? (
              <ul className="mt-2 flex flex-col gap-2">
                {explanation.winner.differences.map((d) => (
                  <li key={d.axisId} className="rounded-xl p-3 leading-relaxed ring-2 ring-line">{d.text}</li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-ink-soft">Nenhuma diferença grande entre vocês em nenhum eixo.</p>
            )}
          </div>
        </div>
      </Section>

      {/* Top 5 */}
      <Section id="top5" title={`Seus ${result.top.length} personagens mais compatíveis`}>
        <ol className="flex flex-col gap-3">
          {result.top.map((r) => {
            const c = byId.get(r.profileId)!;
            return (
              <li key={r.profileId} className="flex flex-wrap items-center gap-3 rounded-2xl border-2 border-line p-3">
                <span className="w-6 text-center font-display text-xl">{r.rank}</span>
                <CharacterAvatar character={c} size={52} decorative />
                <div className="min-w-0 flex-1">
                  <Link href={`/personagens/${c.slug}`} className="font-extrabold hover:underline">
                    {c.name}
                  </Link>
                  <p className="text-sm text-ink-soft">{c.shortDescription}</p>
                </div>
                <span className="font-extrabold tabular-nums">{round(r.affinity)}%</span>
                <Button variant="secondary" className="!min-h-9 !px-3 !py-1 text-sm" onClick={() => compare(c.id)}>
                  <GitCompare aria-hidden className="size-4" /> Comparar<span className="sr-only"> com {c.name}</span>
                </Button>
              </li>
            );
          })}
        </ol>
        <details className="mt-4">
          <summary className="cursor-pointer font-bold">Ver o ranking completo ({result.ranking.length})</summary>
          <ol className="mt-3 flex flex-col gap-1.5">
            {result.ranking.map((r) => {
              const c = byId.get(r.profileId)!;
              const value = round(r.affinity);
              return (
                <li key={r.profileId} className="grid grid-cols-[1.75rem_minmax(0,9rem)_1fr_3rem] items-center gap-2 text-sm">
                  <span className="text-right font-bold text-muted tabular-nums">{r.rank}</span>
                  <span className="truncate font-bold">{c.name}</span>
                  <span aria-hidden className="h-3 rounded-r bg-line">
                    <span
                      className={`block h-full rounded-r ${r.rank === 1 ? "bg-series-user" : "bg-rock"}`}
                      style={{ width: `${value}%` }}
                    />
                  </span>
                  <span className="text-right font-extrabold tabular-nums">{value}%</span>
                </li>
              );
            })}
          </ol>
        </details>
      </Section>

      {/* Nove eixos */}
      <Section id="eixos" title={`Seu perfil nos ${theme.axes.length} eixos`}>
        <p className="mb-6 -mt-2 text-sm text-muted">O círculo marca sua pontuação; a linha central, o equilíbrio (50).</p>
        <div className="grid gap-x-10 gap-y-7 md:grid-cols-2">
          {theme.axes.map((axis) => (
            <AxisBar key={axis.id} axis={axis} score={result.user.scores[axis.id]!} />
          ))}
        </div>
      </Section>

      {/* Perfil comportamental */}
      <Section id="perfil" title="Seu perfil comportamental">
        <div className="grid gap-6 md:grid-cols-2">
          {explanation.sections.map((s) => (
            <div key={s.id}>
              <h3 className="font-extrabold">{s.title}</h3>
              {s.paragraphs.map((p) => (
                <p key={p} className="mt-1 leading-relaxed text-ink-soft">{p}</p>
              ))}
            </div>
          ))}
          {explanation.strengths.length > 0 && (
            <div>
              <h3 className="font-extrabold">Seus pontos fortes</h3>
              <ul className="mt-1 flex flex-col gap-1">
                {explanation.strengths.map((s) => (
                  <li key={s} className="ml-5 list-disc leading-relaxed text-ink-soft">{s}</li>
                ))}
              </ul>
            </div>
          )}
          {explanation.contradictions.length > 0 && (
            <div>
              <h3 className="font-extrabold">Suas contradições</h3>
              <ul className="mt-1 flex flex-col gap-1">
                {explanation.contradictions.map((c) => (
                  <li key={c} className="ml-5 list-disc leading-relaxed text-ink-soft">{c}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </Section>

      <ComparisonPanel theme={theme} userScores={result.user.scores} selectedId={compareId} onSelect={setCompareId} />

      {/* Ações */}
      <section aria-label="Ações" className="flex flex-col flex-wrap items-center justify-center gap-3 sm:flex-row">
        <Button onClick={copy}>
          {copied === "ok" ? <Check aria-hidden className="size-5" /> : <Copy aria-hidden className="size-5" />}
          {copied === "ok" ? "Resultado copiado" : "Copiar resultado"}
        </Button>
        <Button variant="secondary" onClick={() => compare(compareId)}>
          <GitCompare aria-hidden className="size-5" /> Comparar personagens
        </Button>
        <Button variant="secondary" onClick={onRestart}>
          <RotateCcw aria-hidden className="size-5" /> Refazer o teste
        </Button>
        <ButtonLink href="/metodologia" variant="ghost">
          <BookOpen aria-hidden className="size-5" /> Ver metodologia
        </ButtonLink>
      </section>
      <p role="status" aria-live="polite" className="-mt-4 text-center text-sm font-bold">
        {copied === "ok" && "Resumo copiado para a área de transferência."}
        {copied === "error" && "Não foi possível copiar automaticamente. Seu navegador bloqueou o acesso à área de transferência."}
      </p>
    </div>
  );
}
