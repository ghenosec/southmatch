import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export default function NotFound() {
  return (
    <main className="flex flex-1 items-center bg-gradient-to-b from-sky-pale to-snow py-16">
      <Container className="max-w-xl">
        <div className="paper p-8 text-center">
          <p className="font-display text-6xl text-action">404</p>
          <h1 className="mt-2 font-display text-3xl">Página não encontrada</h1>
          <p className="mt-3 text-ink-soft">Parece que esta página foi soterrada pela neve.</p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <ButtonLink href="/">Voltar ao início</ButtonLink>
            <ButtonLink href="/personagens" variant="secondary">
              Ver personagens
            </ButtonLink>
          </div>
        </div>
      </Container>
    </main>
  );
}
