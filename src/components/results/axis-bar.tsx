import type { AxisDefinition } from "@/core/types";
import { findBand, round } from "@/core";

/**
 * Barra bipolar de um eixo: polos nas pontas, marcador central em 50,
 * marcador do usuário e, opcionalmente, de um personagem para comparação.
 * O texto alternativo descreve os mesmos dados da imagem.
 */
export function AxisBar({
  axis,
  score,
  compareScore,
  compareLabel,
  showDescription = true,
  showBandLabel = true,
}: {
  axis: AxisDefinition;
  score: number;
  compareScore?: number;
  compareLabel?: string;
  showDescription?: boolean;
  /** Rótulos de faixa são adjetivos no masculino; desligue ao descrever personagens. */
  showBandLabel?: boolean;
}) {
  const value = round(score);
  const band = findBand(axis, score);
  const srText =
    `${axis.name}: ${value} de 100, numa escala de ${axis.lowPole} (0) a ${axis.highPole} (100).${showBandLabel ? ` ${band.label}.` : ""}` +
    (compareScore !== undefined && compareLabel ? ` ${compareLabel}: ${round(compareScore)}.` : "");

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between gap-2">
        <h3 className="font-extrabold">{axis.name}</h3>
        <span className="text-sm font-extrabold tabular-nums">
          {value}
          <span className="text-muted">/100</span>
          {showBandLabel && <> · {band.label}</>}
        </span>
      </div>
      <p className="sr-only">{srText}</p>
      <div aria-hidden className="relative h-5 rounded-full border-[3px] border-ink bg-gradient-to-r from-sky via-snow to-action/80">
        <span className="absolute inset-y-0 left-1/2 w-0.5 -translate-x-1/2 bg-ink/40" />
        {compareScore !== undefined && (
          <span
            className="absolute top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rotate-45 border-2 border-ink bg-snow"
            style={{ left: `${compareScore}%` }}
          />
        )}
        <span
          className="absolute top-1/2 size-6 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-ink bg-sun"
          style={{ left: `${score}%` }}
        />
      </div>
      <div aria-hidden className="flex justify-between text-xs font-bold text-muted">
        <span>{axis.lowPole}</span>
        <span>{axis.highPole}</span>
      </div>
      {showDescription && <p className="text-sm leading-relaxed text-ink-soft">{band.description}</p>}
    </div>
  );
}
