import Link from "next/link";
import { Container } from "@/components/ui/container";

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
      </Container>
    </footer>
  );
}
