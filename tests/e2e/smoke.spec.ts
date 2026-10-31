import { expect, test } from "@playwright/test";

test("página inicial carrega em pt-BR com título principal", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("lang", "pt-BR");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Qual personagem de South Park você seria?",
  );
  await expect(page.getByText("projeto independente de fãs")).toBeVisible();
});

test("sem rolagem horizontal", async ({ page }) => {
  await page.goto("/");
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(0);
});
