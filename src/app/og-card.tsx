/**
 * Cartão visual compartilhado pelas imagens de Open Graph (renderizadas no build).
 * Arte original: céu, montanhas e "boneco de papel" genérico. Sem imagens de terceiros.
 */
export const OG_SIZE = { width: 1200, height: 630 };

const INK = "#13294b";

export function OgCard({
  kicker,
  title,
  subtitle,
  color,
  initials,
  imageDataUrl = null,
}: {
  kicker: string;
  title: string;
  subtitle: string;
  color: string;
  initials: string;
  /** Imagem do personagem (data URL), se fornecida pelo responsável. */
  imageDataUrl?: string | null;
}) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        background: "linear-gradient(180deg, #7cc8f0 0%, #e4f4fc 100%)",
        position: "relative",
        fontFamily: "sans-serif",
      }}
    >
      {/* montanhas */}
      <svg width="1200" height="630" viewBox="0 0 1200 630" style={{ position: "absolute", left: 0, top: 0 }}>
        <path d="M0 630 L0 470 L230 300 L420 450 L640 270 L860 440 L1050 330 L1200 420 L1200 630 Z" fill="#ffffff" stroke={INK} strokeWidth="6" />
      </svg>
      <div
        style={{
          position: "absolute",
          left: 70,
          top: 70,
          right: 70,
          bottom: 70,
          display: "flex",
          alignItems: "center",
          gap: 56,
          padding: "40px 56px",
          background: "#fbfdff",
          border: `6px solid ${INK}`,
          borderRadius: 40,
          boxShadow: `10px 12px 0 ${INK}`,
        }}
      >
        {imageDataUrl ? (
          // eslint-disable-next-line @next/next/no-img-element -- ImageResponse (Satori) só aceita <img>
          <img
            src={imageDataUrl}
            alt=""
            width={220}
            height={220}
            style={{ objectFit: "contain", borderRadius: 110, border: `6px solid ${INK}`, background: "#fbfdff" }}
          />
        ) : (
        <div style={{ display: "flex", position: "relative", width: 220, height: 220 }}>
          <svg width="220" height="220" viewBox="0 0 100 100">
            <path d="M18 100 C18 72 30 62 50 62 C70 62 82 72 82 100 Z" fill={color} stroke={INK} strokeWidth="3" />
            <circle cx="50" cy="38" r="26" fill="#fde7d4" stroke={INK} strokeWidth="3" />
            <circle cx="41" cy="36" r="6" fill="#fff" stroke={INK} strokeWidth="2" />
            <circle cx="59" cy="36" r="6" fill="#fff" stroke={INK} strokeWidth="2" />
            <circle cx="42" cy="37" r="2" fill={INK} />
            <circle cx="58" cy="37" r="2" fill={INK} />
            <path d="M44 50 Q50 54 56 50" fill="none" stroke={INK} strokeWidth="2" strokeLinecap="round" />
          </svg>
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 172,
              display: "flex",
              justifyContent: "center",
              fontSize: 34,
              fontWeight: 900,
              color: "#ffffff",
            }}
          >
            {initials}
          </div>
        </div>
        )}
        <div style={{ display: "flex", flexDirection: "column", flex: 1, color: INK }}>
          <div style={{ display: "flex", fontSize: 36, fontWeight: 900 }}>
            <span>South</span>
            <span style={{ color: "#d7263d" }}>Match</span>
          </div>
          <div style={{ fontSize: 28, marginTop: 18, color: "#2c4470" }}>{kicker}</div>
          <div style={{ fontSize: 64, fontWeight: 900, lineHeight: 1.05, marginTop: 6 }}>{title}</div>
          <div style={{ fontSize: 26, marginTop: 18, color: "#2c4470" }}>{subtitle}</div>
        </div>
      </div>
    </div>
  );
}
