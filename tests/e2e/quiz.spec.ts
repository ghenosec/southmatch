import { expect, test, type Page } from "@playwright/test";

const KEY = "southmatch:progress:v1:south-park";
const TOTAL = 45;

function heading(page: Page) {
  return page.getByRole("heading", { level: 1 });
}

function option(page: Page, name: string) {
  return page.getByRole("radio", { name, exact: true });
}

const OPTION_VALUES: Record<string, string> = {
  "Discordo totalmente": "strongly-disagree",
  Discordo: "disagree",
  "Neutro / Não sei": "neutral",
  Concordo: "agree",
  "Concordo totalmente": "strongly-agree",
};

/** Clica no rótulo visível da opção, como um usuário faria. */
async function choose(page: Page, name: string) {
  await page.locator(`label:has(input[value="${OPTION_VALUES[name]}"])`).click();
}

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => localStorage.clear());
});

test("inicia o teste a partir da landing sem cadastro", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Começar teste" }).first().click();
  await expect(page).toHaveURL(/\/quiz$/);
  await expect(page.getByText(`Afirmação 1 de ${TOTAL}`)).toBeVisible();
  await expect(page.getByRole("radio")).toHaveCount(5);
});

test("opções têm nomes acessíveis e funcionam pelo teclado", async ({ page }) => {
  await page.goto("/quiz");
  for (const name of ["Discordo totalmente", "Discordo", "Neutro / Não sei", "Concordo", "Concordo totalmente"]) {
    await expect(option(page, name)).toBeAttached();
  }
  await expect(page.getByRole("group", { name: /Prefiro passar meu tempo/ })).toBeVisible();
  // Teclado: foca o grupo, seleciona com setas e confirma com Enter.
  await option(page, "Discordo totalmente").focus();
  await page.keyboard.press("ArrowDown");
  await expect(option(page, "Discordo")).toBeChecked();
  // Seleção por teclado não avança sozinha…
  await expect(page.getByText("Afirmação 1 de")).toBeVisible();
  // …Enter confirma.
  await page.keyboard.press("Enter");
  await expect(page.getByText("Afirmação 2 de")).toBeVisible();
  await expect(heading(page)).toBeFocused();
});

test("avança automaticamente, volta e altera respostas sem perdê-las", async ({ page }) => {
  await page.goto("/quiz");
  const first = await heading(page).textContent();
  await choose(page, "Concordo");
  await expect(page.getByText("Afirmação 2 de")).toBeVisible();
  await choose(page, "Discordo");
  await expect(page.getByText("Afirmação 3 de")).toBeVisible();

  await page.getByRole("button", { name: "Voltar" }).click();
  await page.getByRole("button", { name: "Voltar" }).click();
  await expect(heading(page)).toHaveText(first!);
  await expect(option(page, "Concordo")).toBeChecked();

  await choose(page, "Concordo totalmente");
  await expect(page.getByText("Afirmação 2 de")).toBeVisible();
  await expect(option(page, "Discordo")).toBeChecked();
  await expect(page.getByText("2 respondidas")).toBeVisible();
});

test("com avanço automático desligado, usa o botão Próxima", async ({ page }) => {
  await page.goto("/quiz");
  await page.getByLabel("Avançar automaticamente ao responder").uncheck();
  await expect(page.getByRole("button", { name: "Próxima" })).toBeDisabled();
  await choose(page, "Neutro / Não sei");
  await expect(page.getByText("Afirmação 1 de")).toBeVisible();
  await page.getByRole("button", { name: "Próxima" }).click();
  await expect(page.getByText("Afirmação 2 de")).toBeVisible();
});

test("salva o progresso localmente e oferece continuar ou recomeçar", async ({ page }) => {
  await page.goto("/quiz");
  await choose(page, "Concordo");
  await expect(page.getByText("Afirmação 2 de")).toBeVisible();
  await choose(page, "Discordo");
  await expect(page.getByText("Afirmação 3 de")).toBeVisible();

  const stored = JSON.parse((await page.evaluate((k) => localStorage.getItem(k), KEY))!);
  expect(Object.keys(stored.answers)).toHaveLength(2);
  expect(Object.keys(stored).sort()).toEqual(["answers", "index", "questionSignature", "themeId", "updatedAt", "v"]);

  await page.reload();
  await expect(page.getByRole("heading", { name: "Você já começou o teste" })).toBeVisible();
  await expect(page.getByText(`Você respondeu 2 de ${TOTAL}`)).toBeVisible();
  await page.getByRole("button", { name: "Continuar de onde parei" }).click();
  await expect(page.getByText("Afirmação 3 de")).toBeVisible();

  await page.reload();
  await page.getByRole("button", { name: "Recomeçar do zero" }).click();
  await expect(page.getByText("Afirmação 1 de")).toBeVisible();
  await expect.poll(() => page.evaluate((k) => localStorage.getItem(k), KEY)).toBeNull();
});

test("reiniciar pede confirmação e apaga as respostas", async ({ page }) => {
  await page.goto("/quiz");
  await choose(page, "Concordo");
  await expect(page.getByText("Afirmação 2 de")).toBeVisible();
  await page.getByRole("button", { name: "Reiniciar teste" }).click();
  await page.getByRole("button", { name: "Cancelar" }).click();
  await expect(page.getByText("1 respondidas")).toBeVisible();
  await page.getByRole("button", { name: "Reiniciar teste" }).click();
  await page.getByRole("button", { name: "Sim, reiniciar" }).click();
  await expect(page.getByText("Afirmação 1 de")).toBeVisible();
  await expect(page.getByText("0 respondidas")).toBeVisible();
  await expect.poll(() => page.evaluate((k) => localStorage.getItem(k), KEY)).toBeNull();
});

test("progresso corrompido é descartado com segurança", async ({ page }) => {
  await page.evaluate((k) => localStorage.setItem(k, "{corrompido"), KEY);
  await page.goto("/quiz");
  await expect(page.getByText("Afirmação 1 de")).toBeVisible();
  await expect.poll(() => page.evaluate((k) => localStorage.getItem(k), KEY)).toBeNull();
});

test("responde as 45 afirmações e vê o resultado calculado", async ({ page }) => {
  test.setTimeout(90_000);
  await page.goto("/quiz");
  const choices = ["Concordo totalmente", "Discordo", "Concordo", "Discordo totalmente", "Neutro / Não sei"];
  for (let i = 0; i < TOTAL; i++) {
    await expect(page.getByText(`Afirmação ${i + 1} de ${TOTAL}`)).toBeVisible();
    await choose(page, choices[i % choices.length]!);
  }
  await expect(page.getByText(`${TOTAL} respondidas`)).toBeVisible();
  await page.getByRole("link", { name: "Ver meu resultado" }).click();
  await expect(page).toHaveURL(/\/resultado$/);
  await expect(heading(page)).toContainText("Você é mais parecido com");
  await expect(page.getByText(/Afinidade: \d+%/)).toBeVisible();
  await expect(page.getByRole("heading", { name: /personagens mais compatíveis/ })).toBeVisible();
  await expect(page.locator("ol").first().locator("li")).toHaveCount(5);
});

test("resultado sem teste completo orienta a responder", async ({ page }) => {
  await page.goto("/resultado");
  await expect(page.getByRole("heading", { name: "Ainda não há resultado" })).toBeVisible();
  await page.getByRole("link", { name: "Começar teste" }).last().click();
  await expect(page).toHaveURL(/\/quiz$/);
});

test("nenhuma requisição externa durante o teste", async ({ page }) => {
  const external: string[] = [];
  page.on("request", (r) => {
    const url = new URL(r.url());
    if (url.hostname !== "localhost") external.push(r.url());
  });
  await page.goto("/quiz");
  await choose(page, "Concordo");
  await expect(page.getByText("Afirmação 2 de")).toBeVisible();
  expect(external).toEqual([]);
});

/** Respostas completas e válidas gravadas direto no armazenamento (atalho para testar o resultado). */
async function seedCompleteAnswers(page: Page) {
  await page.goto("/quiz");
  await choose(page, "Concordo");
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

test.describe("página de resultado", () => {
  test("mostra explicação, perfil comportamental e ranking completo", async ({ page }) => {
    await seedCompleteAnswers(page);
    await page.goto("/resultado");
    const winner = (await heading(page).textContent())!.replace("Você é mais parecido com ", "").replace(/!$/, "");
    await expect(page.getByRole("heading", { name: `Por que ${winner}?` })).toBeVisible();
    await expect(page.getByText(/Entre os 20 personagens/)).toBeVisible();
    await expect(page.getByRole("heading", { name: "Seu perfil comportamental" })).toBeVisible();
    for (const t of ["Seu jeito de lidar com pessoas", "Sua reação a conflitos", "Seus pontos fortes", "Suas contradições"]) {
      await expect(page.getByRole("heading", { name: t })).toBeVisible();
    }
    await page.getByText("Ver o ranking completo (20)").click();
    await expect(page.getByText("Ver o ranking completo (20)").locator("xpath=../ol/li")).toHaveCount(20);
  });

  test("compara com outro personagem pelo seletor e pelo botão do top 5", async ({ page }) => {
    await seedCompleteAnswers(page);
    await page.goto("/resultado");
    const panel = page.getByRole("region", { name: "Compare com qualquer personagem" });
    await panel.getByLabel("Personagem").selectOption({ label: "Butters Stotch" });
    await expect(panel.getByText(/Afinidade com Butters Stotch/)).toBeVisible();
    await expect(panel.getByRole("table").getByRole("row")).toHaveCount(10);
    await expect(panel.getByRole("columnheader", { name: "Butters Stotch" })).toBeVisible();
    // Os gráficos são carregados sob demanda quando o painel entra na tela.
    await panel.scrollIntoViewIfNeeded();
    await expect(panel.locator(".recharts-wrapper")).toHaveCount(2);

    const second = page.getByRole("region", { name: /personagens mais compatíveis/ }).getByRole("listitem").nth(1);
    const name = (await second.getByRole("link").textContent())!;
    await second.getByRole("button", { name: `Comparar com ${name}` }).click();
    await expect(panel.getByLabel("Personagem")).toHaveValue(/.+/);
    await expect(panel.getByText(`Afinidade com ${name}`)).toBeVisible();
  });

  test("copia um resumo sem as respostas individuais", async ({ page, context, browserName }) => {
    test.skip(browserName !== "chromium", "permissões de área de transferência");
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await seedCompleteAnswers(page);
    await page.goto("/resultado");
    await page.getByRole("button", { name: "Copiar resultado" }).click();
    await expect(page.getByText("Resumo copiado para a área de transferência.")).toBeVisible();
    const text = await page.evaluate(() => navigator.clipboard.readText());
    expect(text).toContain("Meu resultado no SouthMatch:");
    expect(text).toContain("Sociabilidade:");
    expect(text).not.toMatch(/soc-1|strongly-agree/);
  });

  test("refazer limpa as respostas e volta ao teste", async ({ page }) => {
    await seedCompleteAnswers(page);
    await page.goto("/resultado");
    await page.getByRole("button", { name: "Refazer o teste" }).click();
    await expect(page).toHaveURL(/\/quiz$/);
    await expect(page.getByText("Afirmação 1 de")).toBeVisible();
    await expect.poll(() => page.evaluate((k) => localStorage.getItem(k), KEY)).toBeNull();
  });
});
