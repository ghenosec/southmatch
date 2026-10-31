"use client";

import { Check, Copy, Download, Share2 } from "lucide-react";
import { useState } from "react";
import type { QuizResult, ThemeDefinition } from "@/core";
import { buildImageContent, createResultImage } from "@/lib/export/result-image";
import { shareUrl } from "@/lib/sharing/share-link";
import { encodeThemeResult } from "@/services/quiz";
import { Button } from "@/components/ui/button";

type Status = { kind: "idle" } | { kind: "ok" | "error"; message: string };

/**
 * Compartilhar link e baixar imagem. O aviso de privacidade fica visível
 * antes de qualquer ação: o link expõe as pontuações dos eixos.
 */
export function SharePanel({ theme, result }: { theme: ThemeDefinition; result: QuizResult }) {
  const url = shareUrl(location.origin, encodeThemeResult(theme, result));
  const winner = theme.characters.find((c) => c.id === result.winner.profileId)!;
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [busy, setBusy] = useState(false);
  const canNativeShare = typeof navigator.share === "function";

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setStatus({ kind: "ok", message: "Link copiado para a área de transferência." });
    } catch {
      setStatus({ kind: "error", message: "Não foi possível copiar. Selecione o link acima e copie manualmente." });
    }
  }

  async function nativeShare() {
    try {
      await navigator.share({ title: "Meu resultado no SouthMatch", text: `Deu ${winner.name} no SouthMatch!`, url });
    } catch {
      /* usuário cancelou */
    }
  }

  async function downloadImage() {
    setBusy(true);
    try {
      const blob = await createResultImage(buildImageContent(theme, result, location.origin));
      const href = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = href;
      a.download = `southmatch-${winner.slug}.png`;
      document.body.append(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(href), 10_000);
      setStatus({ kind: "ok", message: "Imagem gerada e baixada." });
    } catch {
      setStatus({ kind: "error", message: "Não foi possível gerar a imagem neste navegador." });
    } finally {
      setBusy(false);
    }
  }

  return (
    <section aria-labelledby="compartilhar" className="paper p-6 sm:p-8">
      <h2 id="compartilhar" className="font-display text-2xl">
        Compartilhar
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-ink-soft">
        Quem tiver o link verá seu personagem e suas pontuações nos {theme.axes.length} eixos. Suas respostas
        individuais não fazem parte do link, e nada é enviado a servidores: o resultado fica codificado no próprio
        endereço.
      </p>
      <label className="mt-4 block text-sm font-bold">
        Link do seu resultado
        <input
          readOnly
          value={url}
          onFocus={(e) => e.currentTarget.select()}
          className="mt-1 block w-full truncate rounded-xl border-2 border-line bg-sky-pale px-3 py-2 font-mono text-xs"
        />
      </label>
      <div className="mt-4 flex flex-col flex-wrap gap-3 sm:flex-row">
        {canNativeShare && (
          <Button onClick={nativeShare}>
            <Share2 aria-hidden className="size-5" /> Compartilhar
          </Button>
        )}
        <Button variant={canNativeShare ? "secondary" : "primary"} onClick={copyLink}>
          {status.kind === "ok" && status.message.startsWith("Link") ? (
            <Check aria-hidden className="size-5" />
          ) : (
            <Copy aria-hidden className="size-5" />
          )}
          Copiar link
        </Button>
        <Button variant="secondary" onClick={downloadImage} disabled={busy}>
          <Download aria-hidden className="size-5" /> {busy ? "Gerando imagem…" : "Baixar imagem"}
        </Button>
      </div>
      <p role="status" aria-live="polite" className={`mt-3 text-sm font-bold ${status.kind === "error" ? "text-action" : ""}`}>
        {status.kind !== "idle" && status.message}
      </p>
    </section>
  );
}
