/**
 * Página inicial provisória (Fase 1).
 * A landing completa — hero, eixos, catálogo, FAQ — chega na Fase 4.
 */
export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 bg-gradient-to-b from-sky to-snow px-4 py-16 text-center">
      <p className="rounded-full bg-sun px-4 py-1 text-sm font-bold text-ink">Em desenvolvimento</p>
      <h1 className="max-w-2xl text-4xl font-black tracking-tight text-ink sm:text-5xl">
        Qual personagem de South Park você seria?
      </h1>
      <p className="max-w-xl text-lg text-ink-soft">Descubra quem mais combina com a sua personalidade.</p>
      <p className="max-w-xl text-sm text-muted">
        SouthMatch é um projeto independente de fãs, sem afiliação com os titulares de South Park.
      </p>
    </main>
  );
}
