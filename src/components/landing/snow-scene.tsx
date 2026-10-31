/**
 * Cena de inverno original (montanhas, pinheiros, cidadezinha) em SVG puro.
 * Decorativa: escondida de leitores de tela. A neve para com
 * prefers-reduced-motion (regra global em globals.css).
 */
const FLAKES = Array.from({ length: 28 }, (_, i) => ({
  x: (i * 37) % 100,
  delay: -((i * 1.7) % 9),
  size: 2 + (i % 3),
  duration: 7 + (i % 5),
}));

function Pine({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x="-3" y="0" width="6" height="10" fill="var(--color-ink)" />
      <path d="M0 -44 L18 -14 H9 L22 4 H-22 L-9 -14 H-18 Z" fill="var(--color-pine)" stroke="var(--color-ink)" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M0 -44 L8 -31 L3 -33 L0 -29 L-3 -33 L-8 -31 Z" fill="#fff" />
    </g>
  );
}

function House({ x, y, color }: { x: number; y: number; color: string }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x="0" y="-26" width="38" height="26" fill={color} stroke="var(--color-ink)" strokeWidth="2.5" />
      <path d="M-5 -24 L19 -44 L43 -24 Z" fill="#fff" stroke="var(--color-ink)" strokeWidth="2.5" strokeLinejoin="round" />
      <rect x="7" y="-19" width="9" height="9" fill="var(--color-sun)" stroke="var(--color-ink)" strokeWidth="2" />
      <rect x="22" y="-15" width="9" height="15" fill="var(--color-ink-soft)" stroke="var(--color-ink)" strokeWidth="2" />
    </g>
  );
}

export function SnowScene() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <svg className="absolute inset-x-0 bottom-0 h-[48%] w-full sm:h-[52%]" viewBox="0 0 1200 400" preserveAspectRatio="xMidYMax slice">
        {/* montanhas ao fundo */}
        <path d="M-20 300 L170 90 L300 230 L460 60 L640 260 L800 110 L980 250 L1110 120 L1240 300 Z" fill="var(--color-rock)" stroke="var(--color-ink)" strokeWidth="3" strokeLinejoin="round" />
        <path d="M170 90 L215 140 L190 132 L170 150 L150 128 L128 138 Z M460 60 L515 122 L485 112 L460 135 L438 112 L410 120 Z M800 110 L848 162 L822 155 L800 172 L780 152 L755 160 Z M1110 120 L1150 166 L1128 160 L1110 176 L1092 158 L1072 164 Z" fill="#fff" stroke="var(--color-ink)" strokeWidth="2" strokeLinejoin="round" />
        {/* colinas */}
        <path d="M-20 400 V300 Q200 240 420 290 T820 280 T1240 290 V400 Z" fill="#fff" stroke="var(--color-ink)" strokeWidth="3" />
        {/* cidade */}
        <House x={470} y={318} color="#e57373" />
        <House x={530} y={322} color="#64b5f6" />
        <House x={660} y={316} color="#ffb74d" />
        <House x={720} y={320} color="#81c784" />
        {/* pinheiros */}
        <Pine x={90} y={330} s={1.2} />
        <Pine x={150} y={318} />
        <Pine x={330} y={322} s={0.9} />
        <Pine x={880} y={318} s={1.1} />
        <Pine x={950} y={328} />
        <Pine x={1110} y={322} s={1.3} />
        <path d="M-20 400 V360 Q300 330 600 352 T1240 350 V400 Z" fill="var(--color-sky-pale)" stroke="var(--color-ink)" strokeWidth="3" />
      </svg>
      {FLAKES.map((f, i) => (
        <span
          key={i}
          className="absolute top-0 h-full animate-snow motion-reduce:hidden"
          style={{ left: `${f.x}%`, animationDelay: `${f.delay}s`, animationDuration: `${f.duration}s` }}
        >
          <span className="block rounded-full bg-white/90" style={{ width: f.size * 2, height: f.size * 2 }} />
        </span>
      ))}
    </div>
  );
}
