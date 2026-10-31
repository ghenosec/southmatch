"use client";

import {
  Legend,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

export interface RadarRow {
  readonly axis: string;
  readonly user: number;
  readonly character: number;
}

/**
 * Radar "você × personagem". Identidade nunca só por cor: o personagem usa
 * linha tracejada, há legenda, e a tabela ao lado traz os mesmos valores.
 */
export function ComparisonRadar({ data, characterName }: { data: readonly RadarRow[]; characterName: string }) {
  return (
    <div aria-hidden className="h-[320px] w-full sm:h-[380px]">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart accessibilityLayer={false} data={[...data]} outerRadius="72%" margin={{ top: 8, right: 24, bottom: 8, left: 24 }}>
          <PolarGrid stroke="var(--color-line)" />
          <PolarAngleAxis dataKey="axis" tick={{ fill: "var(--color-ink)", fontSize: 12, fontWeight: 700 }} />
          <PolarRadiusAxis domain={[0, 100]} tickCount={3} tick={false} axisLine={false} />
          <Radar
            name="Você"
            dataKey="user"
            stroke="var(--color-series-user)"
            strokeWidth={2}
            fill="var(--color-series-user)"
            fillOpacity={0.18}
            dot={{ r: 4, fill: "var(--color-series-user)", stroke: "var(--color-snow)", strokeWidth: 2 }}
            isAnimationActive={false}
          />
          <Radar
            name={characterName}
            dataKey="character"
            stroke="var(--color-series-other)"
            strokeWidth={2}
            strokeDasharray="6 4"
            fill="var(--color-series-other)"
            fillOpacity={0.08}
            dot={{ r: 4, fill: "var(--color-series-other)", stroke: "var(--color-snow)", strokeWidth: 2 }}
            isAnimationActive={false}
          />
          <Tooltip
            formatter={(value) => `${Math.round(Number(value))}/100`}
            contentStyle={{ borderRadius: 12, border: "2px solid var(--color-ink)", fontWeight: 700 }}
          />
          {/* Ordem de declaração (Você primeiro) e texto na cor de texto, não na da série. */}
          <Legend
            itemSorter={null}
            wrapperStyle={{ fontWeight: 700 }}
            formatter={(value) => <span style={{ color: "var(--color-ink)" }}>{value}</span>}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
