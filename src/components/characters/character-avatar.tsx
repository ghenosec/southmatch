import type { CharacterDefinition } from "@/core/types";
import { initialsOf } from "@/lib/initials";

/**
 * Avatar do personagem.
 *
 * - Com `image.src` (ilustração licenciada, com `image.license` preenchida —
 *   a validação do tema exige): mostra a imagem de public/themes/<tema>/.
 * - Sem imagem: "boneco de papel" genérico e original na cor do personagem,
 *   com as iniciais. Não reproduz o visual de nenhum personagem.
 */
export function CharacterAvatar({
  character,
  size = 96,
  decorative = false,
}: {
  character: Pick<CharacterDefinition, "name" | "color" | "image">;
  size?: number;
  decorative?: boolean;
}) {
  const initials = initialsOf(character.name);

  if (character.image.src && character.image.license) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- arquivos locais pequenos; evita otimização sob demanda
      <img
        src={character.image.src}
        alt={decorative ? "" : character.image.alt}
        width={size}
        height={size}
        loading="lazy"
        decoding="async"
        className="shrink-0 rounded-full border-[3px] border-ink bg-snow object-contain"
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      role={decorative ? undefined : "img"}
      aria-hidden={decorative || undefined}
      aria-label={decorative ? undefined : character.image.alt}
      className="shrink-0"
    >
      {/* corpo */}
      <path d="M18 100 C18 72 30 62 50 62 C70 62 82 72 82 100 Z" fill={character.color} stroke="var(--color-ink)" strokeWidth="3" />
      {/* cabeça */}
      <circle cx="50" cy="38" r="26" fill="#fde7d4" stroke="var(--color-ink)" strokeWidth="3" />
      {/* olhos */}
      <circle cx="41" cy="36" r="6" fill="#fff" stroke="var(--color-ink)" strokeWidth="2" />
      <circle cx="59" cy="36" r="6" fill="#fff" stroke="var(--color-ink)" strokeWidth="2" />
      <circle cx="42" cy="37" r="2" fill="var(--color-ink)" />
      <circle cx="58" cy="37" r="2" fill="var(--color-ink)" />
      {/* boca */}
      <path d="M44 50 Q50 54 56 50" fill="none" stroke="var(--color-ink)" strokeWidth="2" strokeLinecap="round" />
      {/* iniciais na camiseta */}
      <text
        x="50"
        y="88"
        textAnchor="middle"
        fontSize="16"
        fontWeight="900"
        fill="#fff"
        stroke="var(--color-ink)"
        strokeWidth="0.6"
        fontFamily="var(--font-display)"
      >
        {initials}
      </text>
    </svg>
  );
}
