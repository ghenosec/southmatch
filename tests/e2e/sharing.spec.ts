import { readFile } from "node:fs/promises";
import { expect, test, type Page } from "@playwright/test";
import { encodeSharedResult } from "@/lib/sharing/share-link";

const KEY = "southmatch:progress:v1:south-park";

/** Grava respostas completas e válidas (atalho para chegar ao resultado). */
async function seedCompleteAnswers(page: Page) {
  await page.goto("/quiz");
  await page.locator('label:has(input[value="agree"])').click();
  await expect(page.getByText("Afirmação 2 de")).toBeVisible();
  await page.evaluate((key) => {
    const stored = JSON.parse(localStorage.getItem(key)!);
    const prefixes = ["soc", "emp", "aut", "dec", "con", "amb", "hum", "loy", "wor"];
    const opts = ["strongly-disagree", "disagree", "neutral", "agree", "strongly-agree"];
    const answers: Record<string, string> = {};
    prefixes.forEach((p, i) => {
      for (let n = 1; n <= 5; n++) answers[`${p}-${n}`] = opts[(i * 3 + n * 2) % 5]!;
    });
    localStorage.setItem(key, JSON.stringify({ ...stored, answers, index: 44, updatedAt: Date.now() }));
  }, KEY);
}

function winnerOf(text: string | null) {
  return text!.replace("Você é mais parecido com ", "").replace(/!$/, "");
}

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => localStorage.clear());
});

test("link compartilhado abre o mesmo resultado em outro navegador, sem dados locais", async ({ page, browser }) => {
  await seedCompleteAnswers(page);
  await page.goto("/resultado");
  const winner = winnerOf(await page.getByRole("heading", { level: 1 }).textContent());
  const affinity = await page.getByText(/^Afinidade: \d+%$/).first().textContent();

  const panel = page.getByRole("region", { name: "Compartilhar" });
  await expect(panel.getByText(/Quem tiver o link verá seu personagem/)).toBeVisible();
  const url = await panel.getByLabel("Link do seu resultado").inputValue();
  expect(url).toMatch(/\/resultado#r=1~south-park~\d+~[\w.-]+~[0-9a-z]+~[0-9a-z]+$/);
  expect(url).not.toMatch(/agree|soc-1/);

  const other = await browser.newContext();
  const visitor = await other.newPage();
  await visitor.goto(url);
  await expect(visitor.getByText("Resultado compartilhado.")).toBeVisible();
  await expect(visitor.getByRole("heading", { level: 1 })).toHaveText(`Você é mais parecido com ${winner}!`);
  await expect(visitor.getByText(affinity!, { exact: true }).first()).toBeVisible();
  // O visitante não vê o painel de compartilhar nem "Refazer"; vê o convite para fazer o teste.
  await expect(visitor.getByRole("region", { name: "Compartilhar" })).toHaveCount(0);
  await expect(visitor.getByRole("link", { name: "Fazer o meu teste" })).toBeVisible();
  // Abrir o link não grava nada no armazenamento do visitante.
  expect(await visitor.evaluate(() => localStorage.length)).toBe(0);
  await other.close();
});

test("copiar link coloca a URL na área de transferência", async ({ page, context, browserName }) => {
  test.skip(browserName !== "chromium", "permissões de área de transferência");
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await seedCompleteAnswers(page);
  await page.goto("/resultado");
  await page.getByRole("button", { name: "Copiar link" }).click();
  await expect(page.getByText("Link copiado para a área de transferência.")).toBeVisible();
  const copied = await page.evaluate(() => navigator.clipboard.readText());
  expect(copied).toContain("/resultado#r=");
});

test("trocar só o fragmento na mesma aba mostra o resultado compartilhado", async ({ page }) => {
  await page.goto("/resultado");
  await expect(page.getByRole("heading", { name: "Ainda não há resultado" })).toBeVisible();
  const code = encodeSharedResult({
    themeId: "south-park",
    algorithm: 1,
    profilesVersion: "2026.10.0",
    scores: [65, 90, 90, 30, 10, 20, 10, 80, 10], // vetor exato de Butters
  });
  await page.evaluate((c) => (location.hash = `r=${c}`), code);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Você é mais parecido com Butters Stotch!");
  await expect(page.getByText("Afinidade: 100%")).toBeVisible();
});

test.describe("links inválidos", () => {
  const valid = encodeSharedResult({ themeId: "south-park", algorithm: 1, profilesVersion: "2026.10.0", scores: Array(9).fill(50) });
  const cases: [string, string, RegExp][] = [
    ["corrompido", valid.slice(0, -2), /incompleto ou foi alterado/],
    ["lixo", "abc<script>alert(1)</script>", /incompleto ou foi alterado/],
    [
      "perfis antigos",
      encodeSharedResult({ themeId: "south-park", algorithm: 1, profilesVersion: "2025.01.0", scores: Array(9).fill(50) }),
      /versão anterior dos perfis/,
    ],
    [
      "algoritmo diferente",
      encodeSharedResult({ themeId: "south-park", algorithm: 99, profilesVersion: "2026.10.0", scores: Array(9).fill(50) }),
      /versão anterior do algoritmo/,
    ],
    [
      "tema inexistente",
      encodeSharedResult({ themeId: "outro-tema", algorithm: 1, profilesVersion: "2026.10.0", scores: Array(9).fill(50) }),
      /não existe mais/,
    ],
  ];
  for (const [name, code, message] of cases) {
    test(`link ${name} mostra mensagem clara`, async ({ page }) => {
      const dialogs: string[] = [];
      page.on("dialog", (d) => {
        dialogs.push(d.message());
        void d.dismiss();
      });
      await page.goto(`/resultado#r=${encodeURIComponent(code)}`);
      await expect(page.getByRole("heading", { name: "Não foi possível abrir este resultado" })).toBeVisible();
      await expect(page.getByText(message)).toBeVisible();
      expect(dialogs).toEqual([]);
    });
  }
});

test("baixa a imagem do resultado gerada localmente (PNG)", async ({ page }) => {
  const external: string[] = [];
  page.on("request", (r) => {
    if (new URL(r.url()).hostname !== "localhost" && !r.url().startsWith("blob:") && !r.url().startsWith("data:")) {
      external.push(r.url());
    }
  });
  await seedCompleteAnswers(page);
  await page.goto("/resultado");
  const winner = winnerOf(await page.getByRole("heading", { level: 1 }).textContent());
  const slug = winner.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/\W+/g, "-");

  const [download] = await Promise.all([
    page.waitForEvent("download"),
    page.getByRole("button", { name: "Baixar imagem" }).click(),
  ]);
  expect(download.suggestedFilename()).toBe(`southmatch-${slug}.png`);
  const bytes = await readFile((await download.path())!);
  expect(bytes.subarray(0, 8).toString("hex")).toBe("89504e470d0a1a0a"); // assinatura PNG
  expect(bytes.readUInt32BE(16)).toBe(1080); // largura
  expect(bytes.readUInt32BE(20)).toBe(1350); // altura
  expect(bytes.length).toBeGreaterThan(20_000);
  await expect(page.getByText("Imagem gerada e baixada.")).toBeVisible();
  expect(external).toEqual([]);
});
