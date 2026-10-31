"use client";

import { Bar, BarChart, CartesianGrid, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export interface DifferenceRow {
  readonly axis: string;
  /** |você − personagem|, 0 a 100 */
  readonly gap: number;
}

/**
 * "Onde vocês mais diferem": magnitude da diferença por eixo, ordenada.
 * Uma única cor (é magnitude, não identidade); valor rotulado em cada barra.
 */
export function DifferenceBars({ data }: { data: readonly DifferenceRow[] }) {
  const sorted = [...data].sort((a, b) => b.gap - a.gap);
  return (
    <div aria-hidden className="w-full" style={{ height: sorted.length * 34 + 30 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={sorted} layout="vertical" margin={{ top: 4, right: 36, bottom: 4, left: 4 }} barCategoryGap={6}>
          <CartesianGrid horizontal={false} stroke="var(--color-line)" />
          <XAxis type="number" domain={[0, 100]} ticks={[0, 25, 50, 75, 100]} tick={{ fill: "var(--color-muted)", fontSize: 11 }} />
          <YAxis
            type="category"
            dataKey="axis"
            width={78}
            tick={{ fill: "var(--color-ink)", fontSize: 12, fontWeight: 700 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            cursor={{ fill: "var(--color-sky-pale)" }}
            formatter={(value) => [`${Math.round(Number(value))} pontos`, "Diferença"]}
            contentStyle={{ borderRadius: 12, border: "2px solid var(--color-ink)", fontWeight: 700 }}
          />
          <Bar dataKey="gap" fill="var(--color-series-user)" radius={[0, 4, 4, 0]} isAnimationActive={false}>
            <LabelList
              dataKey="gap"
              position="right"
              formatter={(v) => Math.round(Number(v))}
              style={{ fill: "var(--color-ink)", fontSize: 12, fontWeight: 700 }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
