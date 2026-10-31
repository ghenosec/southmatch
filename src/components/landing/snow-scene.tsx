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

/**
 * Cordilheira (x, y) em um desenho bem mais largo que alto (viewBox 7,5:1).
 * Com "slice", telas largas cortam só as laterais — nunca o topo dos picos.
 */
const RIDGE: readonly (readonly [number, number])[] = [
  [-920, 300], [-700, 125], [-560, 235], [-380, 110], [-200, 245], [-40, 160], [60, 225], [170, 120],
  [300, 235], [460, 110], [640, 260], [800, 125], [980, 250], [1110, 130], [1260, 245], [1420, 115],
  [1580, 235], [1740, 130], [1880, 250], [2000, 120], [2120, 300],
];

/** Capa de neve recortada sobre cada pico, seguindo as encostas vizinhas. */
function snowCaps(): string {
  const caps: string[] = [];
  for (let i = 1; i < RIDGE.length - 1; i++) {
    const [ax, ay] = RIDGE[i - 1]!;
    const [px, py] = RIDGE[i]!;
    const [bx, by] = RIDGE[i + 1]!;
    if (py > ay || py > by) continue; // não é pico
    const t = 0.3;
    const L = [px + (ax - px) * t, py + (ay - py) * t];
    const R = [px + (bx - px) * t, py + (by - py) * t];
    const cy = Math.max(L[1]!, R[1]!) + 6;
    const ml = [(L[0]! + px) / 2, cy - 12];
    const mr = [(R[0]! + px) / 2, cy - 12];
    const pts = [[px, py], R, mr, [px, cy], ml, L].map(([x, y]) => `${x!.toFixed(0)} ${y!.toFixed(0)}`);
    caps.push(`M${pts.join(" L")} Z`);
  }
  return caps.join(" ");
}

const RIDGE_PATH = `M${RIDGE.map(([x, y]) => `${x} ${y}`).join(" L")} Z`;
const CAPS_PATH = snowCaps();

const PINES: readonly [number, number, number][] = [
  [-620, 326, 1.1], [-470, 318, 1], [-260, 330, 1.2], [90, 330, 1.2], [150, 318, 1], [330, 322, 0.9],
  [880, 318, 1.1], [950, 328, 1], [1110, 322, 1.3], [1330, 326, 1], [1480, 318, 1.2], [1800, 330, 1.1], [1960, 320, 1],
];

export function SnowScene() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <svg
        className="absolute inset-x-0 bottom-0 h-[48%] w-full sm:h-[52%]"
        viewBox="-900 0 3000 400"
        preserveAspectRatio="xMidYMax slice"
      >
        {/* montanhas ao fundo */}
        <path d={RIDGE_PATH} fill="var(--color-rock)" stroke="var(--color-ink)" strokeWidth="3" strokeLinejoin="round" />
        <path d={CAPS_PATH} fill="#fff" stroke="var(--color-ink)" strokeWidth="2" strokeLinejoin="round" />
        {/* colinas */}
        <path
          d="M-920 400 V300 Q-700 250 -460 290 T-20 280 T420 290 T820 280 T1240 290 T1660 280 T2120 290 V400 Z"
          fill="#fff"
          stroke="var(--color-ink)"
          strokeWidth="3"
        />
        {/* cidade */}
        <House x={470} y={318} color="#e57373" />
        <House x={530} y={322} color="#64b5f6" />
        <House x={660} y={316} color="#ffb74d" />
        <House x={720} y={320} color="#81c784" />
        {/* pinheiros */}
        {PINES.map(([x, y, s]) => (
          <Pine key={x} x={x} y={y} s={s} />
        ))}
        <path
          d="M-920 400 V360 Q-600 330 -300 352 T300 352 T900 352 T1500 352 T2120 350 V400 Z"
          fill="var(--color-sky-pale)"
          stroke="var(--color-ink)"
          strokeWidth="3"
        />
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
