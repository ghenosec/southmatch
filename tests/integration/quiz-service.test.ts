import { describe, expect, it } from "vitest";
import { assertValidTheme, computeThemeResult, ThemeValidationError } from "@/services/quiz/quiz-service";
import { exampleTheme } from "@/themes/example-theme";

describe("quiz-service", () => {
  it("valida o tema de exemplo", () => {
    expect(() => assertValidTheme(exampleTheme)).not.toThrow();
  });

  it("rejeita tema inválido com mensagem descritiva", () => {
    const broken = { ...exampleTheme, characters: [] };
    expect(() => assertValidTheme(broken)).toThrow(ThemeValidationError);
  });

  it("calcula resultado, interpretação e resolve personagens", () => {
    const answers = Object.fromEntries(
      exampleTheme.questions.map((q) => [q.id, q.polarity === "direct" ? "strongly-agree" : "strongly-disagree"]),
    );
    const out = computeThemeResult(exampleTheme, answers);
    expect(out.result.user.scores).toEqual({ energy: 100, order: 100, warmth: 100 });
    expect(out.profilesVersion).toBe(exampleTheme.versions.profiles);
    expect(out.character(out.result.winner).name).toBeTruthy();
    expect(out.interpretation.user).toHaveLength(3);
    expect(out.interpretation.dominantAxes).toEqual(["energy", "order", "warmth"]);
  });
});
