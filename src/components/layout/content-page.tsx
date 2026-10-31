import type { ReactNode } from "react";
import { Container } from "@/components/ui/container";

/** Página de texto (metodologia, privacidade, sobre). */
export function ContentPage({ title, lead, children }: { title: string; lead?: string; children: ReactNode }) {
  return (
    <main className="flex-1 bg-gradient-to-b from-sky-pale to-snow py-10 sm:py-14">
      <Container className="max-w-3xl">
        <article className="paper p-6 sm:p-10">
          <h1 className="font-display text-4xl leading-tight sm:text-5xl">{title}</h1>
          {lead && <p className="mt-4 text-lg leading-relaxed text-ink-soft">{lead}</p>}
          <div className="mt-8 flex flex-col gap-4 leading-relaxed [&_h2]:mt-6 [&_h2]:font-display [&_h2]:text-2xl [&_li]:ml-5 [&_li]:list-disc [&_a]:font-bold [&_a]:underline [&_code]:rounded [&_code]:bg-sky-pale [&_code]:px-1">
            {children}
          </div>
        </article>
      </Container>
    </main>
  );
}
