/**
 * Imagem do resultado (PNG 1080×1350), gerada no navegador com Canvas.
 * Nada é enviado a servidores. Não usa imagens de terceiros: o avatar é
 * o mesmo boneco genérico e original da interface.
 *
 * `buildImageContent` é puro (testado em Vitest); `renderResultImage`
 * desenha no canvas (testado no E2E).
 */
import { findBand, interpretProfile, round, type QuizResult, type ThemeDefinition } from "@/core";
import { initialsOf } from "@/lib/initials";

export { initialsOf };

export const IMAGE_WIDTH = 1080;
export const IMAGE_HEIGHT = 1350;

export interface ImageContent {
  readonly brand: string;
  readonly kicker: string;
  readonly winnerName: string;
  readonly winnerColor: string;
  readonly initials: string;
  /** Imagem do personagem fornecida pelo responsável (mesma origem), se houver. */
  readonly imageSrc: string | null;
  readonly affinity: number;
  /** Até 3 características predominantes do usuário (rótulos de faixa). */
  readonly traits: readonly string[];
  readonly axes: readonly { readonly name: string; readonly score: number; readonly band: string }[];
  readonly url: string;
  readonly footnote: string;
}

export function buildImageContent(theme: ThemeDefinition, result: QuizResult, siteUrl: string): ImageContent {
  const winner = theme.characters.find((c) => c.id === result.winner.profileId)!;
  const interp = interpretProfile(result.user.scores, theme.axes);
  const traits = [...interp]
    .filter((i) => i.intensity !== "balanced")
    .sort((a, b) => Math.abs(b.score - 50) - Math.abs(a.score - 50))
    .slice(0, 3)
    .map((i) => i.band.label);
  return {
    brand: "SouthMatch",
    kicker: "Você é mais parecido com",
    winnerName: winner.name,
    winnerColor: winner.color,
    initials: initialsOf(winner.name),
    imageSrc: winner.image.src,
    affinity: round(result.winner.affinity),
    traits: traits.length > 0 ? traits : ["Perfil equilibrado"],
    axes: theme.axes.map((a) => {
      const score = result.user.scores[a.id]!;
      return { name: a.shortName ?? a.name, score: round(score), band: findBand(a, score).label };
    }),
    url: siteUrl.replace(/^https?:\/\//, ""),
    footnote: "Teste de entretenimento · projeto independente de fãs",
  };
}

export interface ImagePalette {
  readonly sky: string;
  readonly skyPale: string;
  readonly snow: string;
  readonly ink: string;
  readonly inkSoft: string;
  readonly action: string;
  readonly sun: string;
  readonly line: string;
  readonly series: string;
}

export interface ImageFonts {
  readonly display: string;
  readonly body: string;
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
}

function paperCard(ctx: CanvasRenderingContext2D, p: ImagePalette, x: number, y: number, w: number, h: number) {
  roundRect(ctx, x + 10, y + 12, w, h, 36);
  ctx.fillStyle = p.ink;
  ctx.fill();
  roundRect(ctx, x, y, w, h, 36);
  ctx.fillStyle = p.snow;
  ctx.fill();
  ctx.lineWidth = 6;
  ctx.strokeStyle = p.ink;
  ctx.stroke();
}

function fitText(ctx: CanvasRenderingContext2D, text: string, font: (size: number) => string, start: number, maxWidth: number) {
  let size = start;
  ctx.font = font(size);
  while (ctx.measureText(text).width > maxWidth && size > 24) {
    size -= 2;
    ctx.font = font(size);
  }
  return size;
}

function avatar(ctx: CanvasRenderingContext2D, p: ImagePalette, f: ImageFonts, cx: number, top: number, c: ImageContent) {
  const s = 1.9; // escala do boneco de 100×100
  const X = (v: number) => cx + (v - 50) * s;
  const Y = (v: number) => top + v * s;
  ctx.lineWidth = 5;
  ctx.strokeStyle = p.ink;
  // corpo
  ctx.beginPath();
  ctx.moveTo(X(18), Y(100));
  ctx.bezierCurveTo(X(18), Y(72), X(30), Y(62), X(50), Y(62));
  ctx.bezierCurveTo(X(70), Y(62), X(82), Y(72), X(82), Y(100));
  ctx.closePath();
  ctx.fillStyle = c.winnerColor;
  ctx.fill();
  ctx.stroke();
  // cabeça
  ctx.beginPath();
  ctx.arc(X(50), Y(38), 26 * s, 0, Math.PI * 2);
  ctx.fillStyle = "#fde7d4";
  ctx.fill();
  ctx.stroke();
  // olhos
  for (const ex of [41, 59]) {
    ctx.beginPath();
    ctx.arc(X(ex), Y(36), 6 * s, 0, Math.PI * 2);
    ctx.fillStyle = "#ffffff";
    ctx.fill();
    ctx.lineWidth = 3.5;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(X(ex + (ex < 50 ? 1 : -1)), Y(37), 2 * s, 0, Math.PI * 2);
    ctx.fillStyle = p.ink;
    ctx.fill();
  }
  // boca
  ctx.beginPath();
  ctx.moveTo(X(44), Y(50));
  ctx.quadraticCurveTo(X(50), Y(54), X(56), Y(50));
  ctx.lineWidth = 3.5;
  ctx.lineCap = "round";
  ctx.stroke();
  // iniciais
  ctx.font = `30px ${f.display}`;
  ctx.textAlign = "center";
  ctx.fillStyle = "#ffffff";
  ctx.strokeStyle = p.ink;
  ctx.lineWidth = 2;
  ctx.strokeText(c.initials, X(50), Y(90));
  ctx.fillText(c.initials, X(50), Y(90));
}

/** Desenha a imagem do personagem num círculo com borda; cabe em 190×190 a partir de (cx, top). */
function characterImage(ctx: CanvasRenderingContext2D, p: ImagePalette, img: HTMLImageElement, cx: number, top: number) {
  const size = 190;
  const r = size / 2;
  const cy = top + r;
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fillStyle = p.snow;
  ctx.fill();
  ctx.clip();
  const scale = Math.min(size / img.naturalWidth, size / img.naturalHeight);
  const w = img.naturalWidth * scale;
  const h = img.naturalHeight * scale;
  ctx.drawImage(img, cx - w / 2, cy - h / 2, w, h);
  ctx.restore();
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.lineWidth = 6;
  ctx.strokeStyle = p.ink;
  ctx.stroke();
}

export function renderResultImage(
  canvas: HTMLCanvasElement,
  c: ImageContent,
  p: ImagePalette,
  f: ImageFonts,
  characterImg: HTMLImageElement | null = null,
): void {
  canvas.width = IMAGE_WIDTH;
  canvas.height = IMAGE_HEIGHT;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D indisponível.");
  const W = IMAGE_WIDTH;

  // fundo: céu + montanhas simples
  const sky = ctx.createLinearGradient(0, 0, 0, IMAGE_HEIGHT);
  sky.addColorStop(0, p.sky);
  sky.addColorStop(1, p.skyPale);
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, W, IMAGE_HEIGHT);
  ctx.beginPath();
  ctx.moveTo(0, 1350);
  ctx.lineTo(0, 1180);
  ctx.lineTo(220, 1020);
  ctx.lineTo(420, 1160);
  ctx.lineTo(640, 980);
  ctx.lineTo(860, 1150);
  ctx.lineTo(1080, 1040);
  ctx.lineTo(1080, 1350);
  ctx.closePath();
  ctx.fillStyle = "#ffffff";
  ctx.fill();
  ctx.lineWidth = 6;
  ctx.strokeStyle = p.ink;
  ctx.stroke();

  // marca
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  ctx.font = `64px ${f.display}`;
  const brandW = ctx.measureText(c.brand).width;
  ctx.fillStyle = p.ink;
  ctx.fillText("South", W / 2 - brandW / 2 + ctx.measureText("South").width / 2, 110);
  ctx.fillStyle = p.action;
  ctx.fillText("Match", W / 2 + brandW / 2 - ctx.measureText("Match").width / 2, 110);

  // cartão principal
  paperCard(ctx, p, 70, 150, W - 140, 1080);
  if (characterImg) characterImage(ctx, p, characterImg, W / 2, 190);
  else avatar(ctx, p, f, W / 2, 185, c);

  ctx.fillStyle = p.inkSoft;
  ctx.font = `bold 38px ${f.body}`;
  ctx.fillText(c.kicker, W / 2, 445);
  ctx.fillStyle = p.ink;
  const nameSize = fitText(ctx, c.winnerName, (s) => `${s}px ${f.display}`, 92, W - 220);
  ctx.fillText(c.winnerName, W / 2, 445 + nameSize + 8);

  // afinidade
  const pillY = 590;
  ctx.font = `bold 44px ${f.body}`;
  const pillText = `Afinidade: ${c.affinity}%`;
  const pillW = ctx.measureText(pillText).width + 80;
  roundRect(ctx, W / 2 - pillW / 2, pillY, pillW, 76, 38);
  ctx.fillStyle = p.sun;
  ctx.fill();
  ctx.lineWidth = 5;
  ctx.strokeStyle = p.ink;
  ctx.stroke();
  ctx.fillStyle = p.ink;
  ctx.fillText(pillText, W / 2, pillY + 54);

  // características predominantes
  ctx.font = `bold 30px ${f.body}`;
  const gap = 16;
  const widths = c.traits.map((t) => ctx.measureText(t).width + 44);
  let x = W / 2 - (widths.reduce((a, b) => a + b, 0) + gap * (widths.length - 1)) / 2;
  c.traits.forEach((t, i) => {
    roundRect(ctx, x, 700, widths[i]!, 54, 27);
    ctx.fillStyle = p.skyPale;
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = p.ink;
    ctx.stroke();
    ctx.fillStyle = p.ink;
    ctx.textAlign = "center";
    ctx.fillText(t, x + widths[i]! / 2, 737);
    x += widths[i]! + gap;
  });

  // perfil nos eixos
  ctx.textAlign = "left";
  ctx.font = `34px ${f.display}`;
  ctx.fillStyle = p.ink;
  ctx.fillText("Seu perfil", 130, 815);
  const rowH = 42;
  c.axes.forEach((a, i) => {
    const y = 850 + i * rowH;
    ctx.font = `bold 26px ${f.body}`;
    ctx.fillStyle = p.ink;
    ctx.textAlign = "left";
    ctx.fillText(a.name, 130, y + 22);
    const bx = 330;
    const bw = 520;
    roundRect(ctx, bx, y + 4, bw, 22, 11);
    ctx.fillStyle = p.line;
    ctx.fill();
    roundRect(ctx, bx, y + 4, Math.max(22, (bw * a.score) / 100), 22, 11);
    ctx.fillStyle = p.series;
    ctx.fill();
    // marca do centro (50): os eixos são bipolares
    ctx.fillStyle = p.ink;
    ctx.fillRect(bx + bw / 2 - 1.5, y, 3, 30);
    ctx.textAlign = "right";
    ctx.fillStyle = p.ink;
    ctx.fillText(String(a.score), 950, y + 24);
  });

  // rodapé
  ctx.textAlign = "center";
  ctx.font = `bold 34px ${f.body}`;
  ctx.fillStyle = p.ink;
  ctx.fillText(c.url, W / 2, 1290);
  ctx.font = `24px ${f.body}`;
  ctx.fillStyle = p.inkSoft;
  ctx.fillText(c.footnote, W / 2, 1328);
}

/** Lê cores e fontes reais da página (tokens do tema e next/font). */
export function readPageStyle(): { palette: ImagePalette; fonts: ImageFonts } {
  const css = getComputedStyle(document.body);
  const root = getComputedStyle(document.documentElement);
  const v = (name: string, fallback: string) => css.getPropertyValue(name).trim() || fallback;
  return {
    palette: {
      sky: v("--color-sky", "#7cc8f0"),
      skyPale: v("--color-sky-pale", "#e4f4fc"),
      snow: v("--color-snow", "#fbfdff"),
      ink: v("--color-ink", "#13294b"),
      inkSoft: v("--color-ink-soft", "#2c4470"),
      action: v("--color-action", "#d7263d"),
      sun: v("--color-sun", "#ffd23f"),
      line: v("--color-line", "#d5e2f0"),
      series: v("--color-series-user", "#2a7fc1"),
    },
    fonts: {
      display: root.getPropertyValue("--font-lilita").trim() || "sans-serif",
      body: root.getPropertyValue("--font-nunito").trim() || "sans-serif",
    },
  };
}

async function loadImage(src: string): Promise<HTMLImageElement | null> {
  try {
    const img = new Image();
    img.decoding = "async";
    img.src = src;
    await img.decode();
    return img;
  } catch {
    return null; // arquivo ausente ou inválido: usa o avatar genérico
  }
}

/** Gera o PNG e retorna o Blob. */
export async function createResultImage(content: ImageContent): Promise<Blob> {
  await document.fonts.ready;
  const canvas = document.createElement("canvas");
  const { palette, fonts } = readPageStyle();
  const img = content.imageSrc ? await loadImage(content.imageSrc) : null;
  renderResultImage(canvas, content, palette, fonts, img);
  return new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("Falha ao gerar imagem."))), "image/png"),
  );
}
