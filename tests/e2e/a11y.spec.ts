/**
 * Auditoria automática de acessibilidade (axe-core) com regras WCAG 2.0/2.1/2.2 A e AA.
 * Cobre todas as rotas e os estados principais do quiz e do resultado.
 */
import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { encodeSharedResult } from "@/lib/sharing/share-link";

const TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];

async function audit(page: Page) {
  const results = await new AxeBuilder({ page }).withTags(TAGS).analyze();
  const summary = results.violations.map((v) => ({
    id: v.id,
    impact: v.impact,
    help: v.help,
    nodes: v.nodes.slice(0, 3).map((n) => n.target.join(" ")),
  }));
  expect(summary, JSON.stringify(summary, null, 2)).toEqual([]);
}

const STATIC_PAGES = ["/", "/personagens", "/personagens/wendy-testaburger", "/metodologia", "/privacidade", "/sobre", "/nao-existe"];

for (const path of STATIC_PAGES) {
  test(`sem violações WCAG em ${path}`, async ({ page }) => {
    await page.goto(path);
    await audit(page);
  });
}

test("sem violações WCAG no quiz (inicial, respondido e revisão aberta)", async ({ page }) => {
  await page.goto("/quiz");
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await audit(page);
  await page.locator('label:has(input[value="agree"])').click();
  await expect(page.getByText("Afirmação 2 de")).toBeVisible();
  await page.getByText("Revisar respostas").click();
  await audit(page);
});

test("sem violações WCAG no resultado (com gráficos e painéis)", async ({ page }) => {
  const code = encodeSharedResult({
    themeId: "south-park",
    algorithm: 1,
    profilesVersion: "2026.10.0",
    scores: [20, 50, 20, 20, 80, 40, 60, 60, 40],
  });
  await page.goto(`/resultado#r=${code}`);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Você é mais parecido com");
  await page.getByText(/Ver o ranking completo/).click();
  await audit(page);
});
