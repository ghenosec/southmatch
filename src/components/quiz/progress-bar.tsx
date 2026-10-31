export function ProgressBar({ answered, total }: { answered: number; total: number }) {
  const percent = total === 0 ? 0 : Math.round((answered / total) * 100);
  return (
    <div className="flex items-center gap-3">
      <div
        role="progressbar"
        aria-label="Progresso do teste"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={answered}
        aria-valuetext={`${answered} de ${total} respondidas`}
        className="h-4 flex-1 overflow-hidden rounded-full border-[3px] border-ink bg-snow"
      >
        <div className="h-full bg-action transition-[width] duration-300" style={{ width: `${percent}%` }} />
      </div>
      <span className="w-12 text-right text-sm font-extrabold tabular-nums">{percent}%</span>
    </div>
  );
}
