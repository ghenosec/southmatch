"use client";

import { round, type AxisScores, type ThemeDefinition } from "@/core";
import { compareWithCharacter } from "@/services/quiz";
import { CharacterAvatar } from "@/components/characters/character-avatar";
import { LazyComparisonRadar, LazyDifferenceBars, WhenVisible } from "@/components/charts/lazy-charts";

/** Comparação detalhada entre o usuário e um personagem escolhido. */
export function ComparisonPanel({
  theme,
  userScores,
  selectedId,
  onSelect,
}: {
  theme: ThemeDefinition;
  userScores: AxisScores;
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  const character = theme.characters.find((c) => c.id === selectedId) ?? theme.characters[0]!;
  const cmp = compareWithCharacter(theme, userScores, character);
  const short = (id: string) => theme.axes.find((a) => a.id === id)?.shortName ?? cmp.rows.find((r) => r.axisId === id)!.axisName;
  const sorted = [...theme.characters].sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));

  return (
    <section id="comparar" aria-labelledby="comparar-titulo" className="paper scroll-mt-6 p-6 sm:p-8">
      <h2 id="comparar-titulo" className="font-display text-2xl">
        Compare com qualquer personagem
      </h2>

      <label className="mt-4 flex flex-col gap-1 font-bold sm:flex-row sm:items-center sm:gap-3">
        Personagem
        <select
          value={character.id}
          onChange={(e) => onSelect(e.target.value)}
          className="min-h-11 rounded-xl border-[3px] border-ink bg-snow px-3 font-bold"
        >
          {sorted.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </label>

      <div className="mt-6 flex items-center gap-4" aria-live="polite">
        <CharacterAvatar character={character} size={64} decorative />
        <p className="text-lg">
          Afinidade com <strong>{character.name}</strong>:{" "}
          <span className="rounded-full bg-sun px-3 py-0.5 font-extrabold tabular-nums">{round(cmp.affinity)}%</span>
        </p>
      </div>

      <div className="mt-6 grid gap-8 lg:grid-cols-2">
        <figure>
          <figcaption className="mb-2 font-extrabold">Os perfis lado a lado</figcaption>
          <WhenVisible height={340}>
            <LazyComparisonRadar
              characterName={character.name}
              data={cmp.rows.map((r) => ({ axis: short(r.axisId), user: r.user, character: r.character }))}
            />
          </WhenVisible>
        </figure>
        <figure>
          <figcaption className="mb-2 font-extrabold">Onde vocês mais diferem (pontos de diferença)</figcaption>
          <WhenVisible height={330}>
            <LazyDifferenceBars data={cmp.rows.map((r) => ({ axis: short(r.axisId), gap: Math.abs(r.difference) }))} />
          </WhenVisible>
        </figure>
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <div>
          <h3 className="font-extrabold">Principais semelhanças</h3>
          {cmp.similarities.length > 0 ? (
            <ul className="mt-2 flex flex-col gap-2">
              {cmp.similarities.map((s) => (
                <li key={s.axisId} className="rounded-xl bg-sky-pale p-3 text-sm leading-relaxed">{s.text}</li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-sm text-ink-soft">Nenhum eixo ficou muito próximo, com os dois do mesmo lado.</p>
          )}
        </div>
        <div>
          <h3 className="font-extrabold">Principais diferenças</h3>
          {cmp.differences.length > 0 ? (
            <ul className="mt-2 flex flex-col gap-2">
              {cmp.differences.map((d) => (
                <li key={d.axisId} className="rounded-xl bg-snow p-3 text-sm leading-relaxed ring-2 ring-line">{d.text}</li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-sm text-ink-soft">Nenhuma diferença grande (25 pontos ou mais) entre vocês.</p>
          )}
        </div>
      </div>

      <div className="mt-6 overflow-x-auto" tabIndex={0} role="region" aria-label="Tabela de pontuação por eixo (role para os lados se necessário)">
        <table className="w-full min-w-[22rem] border-collapse text-sm">
          <caption className="mb-2 text-left font-extrabold">Pontuação por eixo (0 a 100)</caption>
          <thead>
            <tr className="border-b-2 border-ink text-left">
              <th scope="col" className="py-2 pr-2">Eixo</th>
              <th scope="col" className="px-2 py-2 text-right">
                <span aria-hidden className="mr-1 inline-block size-2.5 rounded-full bg-series-user" />
                Você
              </th>
              <th scope="col" className="px-2 py-2 text-right">
                <span aria-hidden className="mr-1 inline-block size-2.5 rotate-45 bg-series-other" />
                {character.name}
              </th>
              <th scope="col" className="py-2 pl-2 text-right">Diferença</th>
            </tr>
          </thead>
          <tbody>
            {cmp.rows.map((r) => (
              <tr key={r.axisId} className="border-b border-line">
                <th scope="row" className="py-2 pr-2 text-left font-bold">{r.axisName}</th>
                <td className="px-2 py-2 text-right tabular-nums">{round(r.user)}</td>
                <td className="px-2 py-2 text-right tabular-nums">{round(r.character)}</td>
                <td className="py-2 pl-2 text-right tabular-nums">{round(Math.abs(r.difference))}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
