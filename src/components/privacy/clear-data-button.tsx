"use client";

import { Trash2 } from "lucide-react";
import { useState } from "react";
import { clearAllSiteData } from "@/lib/storage/quiz-progress";
import { Button } from "@/components/ui/button";

/** Apaga progresso e preferências do SouthMatch salvos neste navegador. */
export function ClearDataButton() {
  const [message, setMessage] = useState("");
  function clear() {
    let store: Storage | null = null;
    try {
      store = globalThis.localStorage ?? null;
    } catch {
      store = null;
    }
    const removed = clearAllSiteData(store);
    setMessage(
      removed > 0
        ? `Pronto: ${removed} ${removed === 1 ? "item apagado" : "itens apagados"} deste navegador.`
        : "Não havia dados do SouthMatch salvos neste navegador.",
    );
  }
  return (
    <div className="flex flex-col items-start gap-2">
      <Button variant="secondary" onClick={clear}>
        <Trash2 aria-hidden className="size-5" /> Apagar meus dados deste navegador
      </Button>
      <p role="status" aria-live="polite" className="text-sm font-bold">
        {message}
      </p>
    </div>
  );
}
