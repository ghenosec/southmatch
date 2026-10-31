"use client";

import { Check } from "lucide-react";
import { useRef } from "react";
import type { AnswerOption } from "@/core/types";

/** Tamanho visual do círculo: maior nos extremos, menor no neutro. */
const SIZES = ["size-9", "size-7", "size-5", "size-7", "size-9"];
/** Cor do círculo: discordância à esquerda, concordância à direita. */
const TONES = ["bg-sky-deep", "bg-sky", "bg-rock", "bg-action/70", "bg-action"];

export function LikertOptions({
  name,
  options,
  value,
  onSelect,
  onConfirm,
}: {
  /** Nome do grupo de rádio (ID da pergunta). */
  name: string;
  options: readonly AnswerOption[];
  value: string | undefined;
  /** `viaPointer` indica clique/toque (usado para o avanço automático). */
  onSelect: (optionId: string, viaPointer: boolean) => void;
  /** Enter sobre uma opção selecionada. */
  onConfirm: () => void;
}) {
  const pointer = useRef(false);

  return (
    <div className="grid grid-cols-1 gap-2 md:grid-cols-5 md:gap-3">
      {options.map((option, i) => {
        const id = `${name}-${option.id}`;
        const checked = value === option.id;
        return (
          <label
            key={option.id}
            htmlFor={id}
            onPointerDown={() => (pointer.current = true)}
            className={`group relative flex min-h-14 cursor-pointer items-center gap-3 rounded-2xl border-[3px] px-4 py-3 font-bold transition-colors md:flex-col md:justify-center md:gap-2 md:px-2 md:py-4 md:text-center ${
              checked
                ? "animate-pop border-ink bg-sun shadow-paper-sm"
                : "border-line bg-snow hover:border-ink hover:bg-sky-pale"
            } has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-action`}
          >
            <input
              id={id}
              type="radio"
              name={name}
              value={option.id}
              checked={checked}
              className="sr-only"
              onChange={() => {
                onSelect(option.id, pointer.current);
                pointer.current = false;
              }}
              onKeyDown={(e) => {
                pointer.current = false;
                if (e.key === "Enter" && checked) {
                  e.preventDefault();
                  onConfirm();
                }
              }}
            />
            <span className="flex size-10 shrink-0 items-center justify-center">
              <span
                aria-hidden
                className={`flex items-center justify-center rounded-full border-[3px] border-ink ${SIZES[i] ?? "size-7"} ${
                  checked ? "bg-ink" : TONES[i] ?? "bg-rock"
                }`}
              >
                {checked && <Check className="size-4 text-sun" strokeWidth={4} />}
              </span>
            </span>
            <span className="text-base leading-tight md:text-sm">{option.label}</span>
          </label>
        );
      })}
    </div>
  );
}
