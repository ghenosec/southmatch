/**
 * Endereço público do site, usado em metadados, sitemap e Open Graph.
 *
 * Ordem: NEXT_PUBLIC_SITE_URL (defina em produção) → domínio de produção
 * da Vercel (variável automática) → localhost.
 */
function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return explicit.replace(/\/+$/, "");
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (vercel) return `https://${vercel}`;
  return "http://localhost:3000";
}

export const SITE_URL = resolveSiteUrl();
export const SITE_NAME = "SouthMatch";
