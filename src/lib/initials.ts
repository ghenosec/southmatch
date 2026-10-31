/** Iniciais de um nome para avatares provisórios ("Mr. Garrison" → "MG"). */
export function initialsOf(name: string): string {
  return name
    .replace(/^(Mr\.|PC)\s+/, (m) => m.trim().charAt(0) + " ")
    .split(/\s+/)
    .map((w) => w.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();
}
