import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { Container } from "@/components/ui/container";
import { AUTHOR, COPYRIGHT_START_YEAR, SITE_NAME } from "@/lib/site";

// Ano calculado no build (páginas estáticas); um novo deploy atualiza.
const BUILD_YEAR = new Date().getFullYear();
const YEARS = BUILD_YEAR > COPYRIGHT_START_YEAR ? `${COPYRIGHT_START_YEAR}–${BUILD_YEAR}` : String(COPYRIGHT_START_YEAR);

export function SiteFooter({ disclaimer }: { disclaimer: string }) {
  return (
    <footer className="mt-auto border-t-[3px] border-ink bg-ink text-snow">
      <Container className="flex flex-col gap-6 py-10">
        <nav aria-label="Rodapé">
          <ul className="flex flex-wrap gap-x-6 gap-y-2 font-bold">
            <li><Link className="hover:text-sun" href="/quiz">Fazer o teste</Link></li>
            <li><Link className="hover:text-sun" href="/personagens">Personagens</Link></li>
            <li><Link className="hover:text-sun" href="/metodologia">Metodologia</Link></li>
            <li><Link className="hover:text-sun" href="/privacidade">Privacidade</Link></li>
            <li><Link className="hover:text-sun" href="/sobre">Sobre</Link></li>
          </ul>
        </nav>
        <p className="max-w-3xl text-sm leading-relaxed text-snow/80">{disclaimer}</p>
        <p className="text-sm text-snow/70">
          Teste de entretenimento. Não tem valor psicológico, clínico ou científico.
        </p>
        <div className="flex flex-col gap-3 border-t border-snow/20 pt-6 text-sm sm:flex-row sm:items-center sm:justify-between">
          <p className="text-snow/80">
            © {YEARS} {SITE_NAME}. Todos os direitos reservados sobre o código e o conteúdo original do site.
          </p>
          <a
            href={AUTHOR.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-bold hover:text-sun"
          >
            Feito por {AUTHOR.name} no GitHub
            <ExternalLink aria-hidden className="size-4" />
            <span className="sr-only"> (abre o GitHub em nova aba)</span>
          </a>
        </div>
      </Container>
    </footer>
  );
}
