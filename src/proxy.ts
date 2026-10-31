import { NextResponse, type NextRequest } from "next/server";
import { getActiveTheme } from "@/services/quiz";

/**
 * Com Cache Components, a página de personagem começa a ser transmitida
 * antes de `notFound()`, o que resultaria em status 200 ("soft 404").
 * Aqui o slug é verificado antes da renderização para responder 404 de verdade.
 */
const slugs = new Set(getActiveTheme().characters.map((c) => c.slug));

export const config = {
  matcher: "/personagens/:slug",
};

export function proxy(request: NextRequest) {
  const slug = request.nextUrl.pathname.split("/")[2] ?? "";
  if (!slugs.has(decodeURIComponent(slug))) {
    // Rota inexistente: o Next.js renderiza app/not-found.tsx com status 404.
    return NextResponse.rewrite(new URL("/_nao-encontrado", request.url));
  }
  return NextResponse.next();
}
