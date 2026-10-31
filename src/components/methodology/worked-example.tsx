import {
  applyPolarity,
  computeUserProfile,
  normalizeAnswer,
  rankProfiles,
  round,
  type ThemeDefinition,
} from "@/core";

/**
 * Exemplo numérico calculado pelo próprio motor no build:
 * se perguntas ou perfis mudarem, o exemplo muda junto.
 */
const EXAMPLE_ANSWERS = ["agree", "disagree", "strongly-agree", "neutral", "agree"];

function fmt(n: number, digits = 2) {
  return n.toLocaleString("pt-BR", { minimumFractionDigits: 0, maximumFractionDigits: digits });
}

export function WorkedExample({ theme }: { theme: ThemeDefinition }) {
  const axis = theme.axes[0]!;
  const questions = theme.questions.filter((q) => q.axisId === axis.id);
  const rows = questions.map((q, i) => {
    const optionId = theme.scale.options.some((o) => o.id === EXAMPLE_ANSWERS[i % EXAMPLE_ANSWERS.length])
      ? EXAMPLE_ANSWERS[i % EXAMPLE_ANSWERS.length]!
      : theme.scale.options[Math.floor(theme.scale.options.length / 2)]!.id;
    const value = normalizeAnswer(optionId, theme.scale);
    return {
      q,
      optionId,
      label: theme.scale.options.find((o) => o.id === optionId)!.label,
      value,
      adjusted: applyPolarity(value, q.polarity),
    };
  });
  const answers = Object.fromEntries(rows.map((row) => [row.q.id, row.optionId]));
  const score = computeUserProfile(answers, questions, [axis], theme.scale).scores[axis.id]!;

  // Distância: um perfil totalmente equilibrado (50 em tudo) comparado ao primeiro personagem.
  const character = theme.characters[0]!;
  const neutral = Object.fromEntries(theme.axes.map((a) => [a.id, 50]));
  const [r] = rankProfiles(neutral, [character], theme.axes);
  const squares = r!.axes.map((a) => a.difference ** 2);
  const sum = squares.reduce((x, y) => x + y, 0);

  return (
    <>
      <h3 className="mt-4 text-lg font-extrabold">Exemplo: eixo {axis.name}</h3>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[34rem] border-collapse text-sm">
          <caption className="sr-only">Cálculo de exemplo do eixo {axis.name}</caption>
          <thead>
            <tr className="border-b-2 border-ink text-left">
              <th scope="col" className="py-2 pr-2">Afirmação</th>
              <th scope="col" className="px-2 py-2">Resposta</th>
              <th scope="col" className="px-2 py-2 text-right">Valor</th>
              <th scope="col" className="px-2 py-2">Tipo</th>
              <th scope="col" className="py-2 pl-2 text-right">Ajustado</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.q.id} className="border-b border-line align-top">
                <td className="py-2 pr-2">{row.q.text}</td>
                <td className="px-2 py-2 whitespace-nowrap">{row.label}</td>
                <td className="px-2 py-2 text-right tabular-nums">{fmt(row.value)}</td>
                <td className="px-2 py-2">{row.q.polarity === "direct" ? "Direta" : "Invertida"}</td>
                <td className="py-2 pl-2 text-right font-bold tabular-nums">{fmt(row.adjusted)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>
        Média dos valores ajustados: ({rows.map((x) => fmt(x.adjusted)).join(" + ")}) ÷ {rows.length} ={" "}
        {fmt(score / 100)}. Pontuação do eixo: 100 × {fmt(score / 100)} = <strong>{fmt(score, 1)}</strong>.
      </p>

      <h3 className="mt-4 text-lg font-extrabold">Exemplo: afinidade com {character.name}</h3>
      <p>
        Imagine alguém com 50 em todos os eixos. As diferenças para {character.name} são{" "}
        {r!.axes.map((a) => fmt(Math.abs(a.difference), 0)).join(", ")}. A soma dos quadrados é {fmt(sum, 0)}; dividida
        por {theme.axes.length} eixos dá {fmt(sum / theme.axes.length, 1)}; a raiz quadrada é{" "}
        {fmt(Math.sqrt(sum / theme.axes.length), 1)}; dividida por 100, a distância é {fmt(r!.distance, 3)}.
      </p>
      <p>
        Afinidade = 100 × (1 − {fmt(r!.distance, 3)}) = <strong>{round(r!.affinity)}%</strong>.
      </p>
    </>
  );
}
