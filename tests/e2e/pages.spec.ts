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
  const links = page.getByRole("main").getByRole("listitem").getByRole("link");
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

test("catálogo: busca por nome ou traço e ordenação por eixo", async ({ page }) => {
  await page.goto("/personagens");
  const cards = page.getByRole("main").getByRole("listitem");
  // "leal" está nos traços de alguns personagens (ex.: Stan), não necessariamente no card.
  await page.getByLabel("Buscar").fill("leal");
  await expect(page.getByText(/de 20 personagens/)).toBeVisible();
  await expect(cards.filter({ hasText: "Stan Marsh" })).toHaveCount(1);
  await expect(cards.filter({ hasText: "Eric Cartman" })).toHaveCount(0);

  await page.getByLabel("Buscar").fill("zzzz");
  await expect(page.getByText("Nenhum personagem encontrado")).toBeVisible();

  await page.getByLabel("Buscar").fill("");
  await page.getByLabel("Ordenar por").selectOption("conflict:desc");
  await expect(cards.first()).toContainText("PC Principal");
  await expect(cards.first()).toContainText("Conflito: 95");
  await page.getByLabel("Ordenar por").selectOption("conflict:asc");
  await expect(cards.first()).toContainText("Butters Stotch");
});

test("página de personagem: parecidos, confiança e navegação", async ({ page }) => {
  await page.goto("/personagens/timmy-burch");
  await expect(page.getByText("Confiança baixa.")).toBeVisible();
  const similar = page.getByRole("region", { name: "Personagens com perfil parecido" }).getByRole("link");
  await expect(similar).toHaveCount(3);
  await expect(similar.first()).toContainText("Clyde Donovan");
  await expect(similar.first()).toContainText(/\d+% de afinidade/);
  const nav = page.getByRole("navigation", { name: "Personagem anterior e próximo" });
  await nav.getByRole("link").last().click();
  await expect(page.getByRole("heading", { level: 1 })).not.toHaveText("Timmy Burch");
});

test("páginas de personagens não usam adjetivos no masculino para descrever personagens", async ({ page }) => {
  await page.goto("/personagens/wendy-testaburger");
  const main = page.getByRole("main");
  await expect(main.getByRole("listitem").filter({ hasText: "Motivação: 85" })).toBeVisible();
  for (const label of ["Muito ambicioso", "Muito analítico", "Confrontador ·", "Empático ·"]) {
    await expect(main.getByText(label, { exact: false })).toHaveCount(0);
  }
});

test("metodologia mostra exemplo numérico calculado", async ({ page }) => {
  await page.goto("/metodologia");
  await expect(page.getByRole("heading", { name: "Exemplo: eixo Sociabilidade" })).toBeVisible();
  await expect(page.getByRole("table").getByRole("row")).toHaveCount(6);
  await expect(page.getByText(/Afinidade = 100 × \(1 − 0,\d+\) = \d+%/)).toBeVisible();
  await expect(page.getByRole("heading", { name: "6. Calibração" })).toBeVisible();
});

test("privacidade: apaga os dados do site neste navegador", async ({ page }) => {
  await page.goto("/privacidade");
  await page.evaluate(() => {
    localStorage.setItem("southmatch:progress:v1:south-park", "{}");
    localStorage.setItem("southmatch:prefs:auto-advance", "0");
    localStorage.setItem("outro-site", "manter");
  });
  await page.getByRole("button", { name: "Apagar meus dados deste navegador" }).click();
  await expect(page.getByText("Pronto: 2 itens apagados deste navegador.")).toBeVisible();
  expect(await page.evaluate(() => Object.keys(localStorage))).toEqual(["outro-site"]);
  await page.getByRole("button", { name: "Apagar meus dados deste navegador" }).click();
  await expect(page.getByText("Não havia dados do SouthMatch salvos neste navegador.")).toBeVisible();
});
