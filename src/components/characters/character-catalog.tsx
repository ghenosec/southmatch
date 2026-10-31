"use client";

import Link from "next/link";
import { Search } from "lucide-react";
import { useState } from "react";
import { round } from "@/core";
import { getActiveTheme } from "@/services/quiz";
import { CharacterAvatar } from "./character-avatar";

type Sort = "name" | `${string}:${"asc" | "desc"}`;

function normalize(text: string) {
  return text.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

/** Catálogo com busca por nome/traço e ordenação por qualquer eixo. */
export function CharacterCatalog() {
  const theme = getActiveTheme();
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<Sort>("name");

  const [axisId, direction] = sort === "name" ? [null, null] : (sort.split(":") as [string, "asc" | "desc"]);
  const axis = axisId ? theme.axes.find((a) => a.id === axisId) : undefined;
  const q = normalize(query.trim());

  const list = theme.characters
    .filter((c) => !q || normalize([c.name, c.shortDescription, ...c.traits].join(" ")).includes(q))
    .sort((a, b) => {
      if (!axisId) return a.name.localeCompare(b.name, "pt-BR");
      const diff = a.scores[axisId]! - b.scores[axisId]!;
      return (direction === "asc" ? diff : -diff) || a.name.localeCompare(b.name, "pt-BR");
    });

  return (
    <>
      <div className="mx-auto mt-8 flex max-w-3xl flex-col gap-3 sm:flex-row">
        <label className="flex flex-1 flex-col gap-1 text-sm font-bold">
          Buscar
          <span className="relative">
            <Search aria-hidden className="absolute top-1/2 left-3 size-5 -translate-y-1/2 text-muted" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Nome ou traço (ex.: leal)"
              className="min-h-11 w-full rounded-xl border-[3px] border-ink bg-snow py-2 pr-3 pl-10 text-base font-normal"
            />
          </span>
        </label>
        <label className="flex flex-col gap-1 text-sm font-bold sm:w-72">
          Ordenar por
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
            className="min-h-11 rounded-xl border-[3px] border-ink bg-snow px-3 text-base"
          >
            <option value="name">Nome (A–Z)</option>
            {theme.axes.map((a) => (
              <optgroup key={a.id} label={a.name}>
                <option value={`${a.id}:desc`}>
                  Mais {a.highPole.toLowerCase()}
                </option>
                <option value={`${a.id}:asc`}>
                  Mais {a.lowPole.toLowerCase()}
                </option>
              </optgroup>
            ))}
          </select>
        </label>
      </div>

      <p role="status" aria-live="polite" className="mt-4 text-center text-sm text-muted">
        {list.length === theme.characters.length
          ? `${list.length} personagens`
          : `${list.length} de ${theme.characters.length} personagens`}
      </p>

      {list.length === 0 ? (
        <p className="mt-8 text-center font-bold">Nenhum personagem encontrado para “{query}”.</p>
      ) : (
        <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((c) => (
            <li key={c.id}>
              <Link
                href={`/personagens/${c.slug}`}
                className="paper flex h-full items-center gap-4 p-4 transition-transform hover:-translate-y-1"
              >
                <CharacterAvatar character={c} size={72} decorative />
                <span className="min-w-0 flex-1">
                  <span className="block text-lg font-extrabold">{c.name}</span>
                  <span className="block text-sm text-ink-soft">{c.shortDescription}</span>
                  {axis && (
                    <span className="mt-2 flex items-center gap-2 text-xs font-bold">
                      <span aria-hidden className="h-2 flex-1 rounded-full bg-line">
                        <span
                          className="block h-full rounded-full bg-series-user"
                          style={{ width: `${c.scores[axis.id]}%` }}
                        />
                      </span>
                      <span className="tabular-nums">
                        {axis.shortName ?? axis.name}: {round(c.scores[axis.id]!)}
                      </span>
                    </span>
                  )}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
