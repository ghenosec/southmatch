import Link from "next/link";
import { Snowflake } from "lucide-react";
import { Container } from "@/components/ui/container";

const NAV = [
  { href: "/personagens", label: "Personagens" },
  { href: "/metodologia", label: "Como funciona" },
  { href: "/sobre", label: "Sobre" },
] as const;

export function SiteHeader() {
  return (
    <header className="relative z-20 border-b-[3px] border-ink bg-snow">
      <Container className="flex items-center justify-between gap-2 py-3">
        <Link href="/" className="flex items-center gap-2 font-display text-xl tracking-wide text-ink sm:text-2xl">
          <Snowflake aria-hidden className="hidden size-6 text-sky-deep min-[400px]:block" strokeWidth={2.5} />
          <span>
            South<span className="text-action">Match</span>
          </span>
        </Link>
        <nav aria-label="Principal">
          <ul className="flex items-center text-[13px] font-bold sm:gap-4 sm:text-base">
            {NAV.map((item) => (
              <li key={item.href} className={item.href === "/sobre" ? "hidden sm:block" : ""}>
                <Link href={item.href} className="rounded-md px-1.5 py-2 whitespace-nowrap text-ink-soft hover:text-action sm:px-2">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </Container>
    </header>
  );
}
