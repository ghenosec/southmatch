"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Os gráficos usam Recharts (~125 KB comprimidos). Eles só são baixados quando
 * a área do gráfico se aproxima da tela, para não atrasar o resultado principal.
 */
function ChartPlaceholder({ height }: { height: number }) {
  return <div aria-hidden className="w-full animate-pulse rounded-2xl bg-sky-pale" style={{ height }} />;
}

export const LazyComparisonRadar = dynamic(
  () => import("./comparison-radar").then((m) => m.ComparisonRadar),
  { ssr: false, loading: () => <ChartPlaceholder height={340} /> },
);

export const LazyDifferenceBars = dynamic(
  () => import("./difference-bars").then((m) => m.DifferenceBars),
  { ssr: false, loading: () => <ChartPlaceholder height={330} /> },
);

/** Renderiza os filhos só depois que o elemento chega perto da área visível. */
export function WhenVisible({ children, height }: { children: ReactNode; height: number }) {
  const ref = useRef<HTMLDivElement>(null);
  // Sem IntersectionObserver (navegadores muito antigos), mostra direto.
  const [visible, setVisible] = useState(() => typeof IntersectionObserver === "undefined");

  useEffect(() => {
    const el = ref.current;
    if (!el || visible) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "400px 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [visible]);

  return <div ref={ref}>{visible ? children : <ChartPlaceholder height={height} />}</div>;
}
