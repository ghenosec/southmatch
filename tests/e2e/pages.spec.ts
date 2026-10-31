import { expect, test } from "@playwright/test";

const PAGES = [
  ["/", "Qual personagem de South Park você seria?"],
  ["/personagens", "Personagens"],
  ["/personagens/stan-marsh", "Stan Marsh"],
  ["/metodologia", "Como funciona"],
  ["/privacidade", "Privacidade"],
  ["/sobre", "Sobre o SouthMatch"],
] as const;

for (const [path, title] of PAGES) {
  test(`${path} carrega com título e sem rolagem horizontal`, async ({ page }) => {
    await page.goto(path);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(title);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
  });
}

test("landing tem os elementos obrigatórios", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("45 afirmações").first()).toBeVisible();
  await expect(page.getByText(/Cerca de 7 a 10 minutos/)).toBeVisible();
  await expect(page.getByText("Grátis")).toBeVisible();
  await expect(page.getByText("Sem cadastro")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Como funciona" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "O que o teste avalia" })).toBeVisible();
  await expect(page.getByRole("region", { name: "O que o teste avalia" }).getByRole("listitem")).toHaveCount(9);
  await expect(page.getByRole("heading", { name: "Perguntas frequentes" })).toBeVisible();
  await expect(page.getByRole("link", { name: "SouthMatch" })).toBeVisible();
  await expect(page.getByRole("contentinfo").getByRole("link", { name: "Privacidade" })).toBeVisible();
  await expect(page.getByRole("contentinfo").getByRole("link", { name: "Metodologia" })).toBeVisible();
  await expect(page.getByRole("contentinfo").getByText(/projeto independente de fãs/i)).toBeVisible();
});

test("catálogo lista 20 personagens com links válidos", async ({ page }) => {
  await page.goto("/personagens");
  const links = page.getByRole("main").getByRole("link");
  await expect(links).toHaveCount(20);
  await links.first().click();
  await expect(page.getByRole("heading", { name: /Perfil nos 9 eixos/ })).toBeVisible();
});

test("slug inexistente responde 404", async ({ page }) => {
  const res = await page.goto("/personagens/nao-existe");
  expect(res?.status()).toBe(404);
  await expect(page.getByRole("heading", { name: "Página não encontrada" })).toBeVisible();
});

test("rota inexistente responde 404", async ({ page }) => {
  const res = await page.goto("/rota-que-nao-existe");
  expect(res?.status()).toBe(404);
});

test("link para pular ao conteúdo aparece com o teclado", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Pular para o conteúdo" })).toBeFocused();
});
