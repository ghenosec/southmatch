import { expect, test } from "@playwright/test";

test("cabeçalhos de segurança presentes", async ({ request }) => {
  const res = await request.get("/");
  const h = res.headers();
  expect(h["content-security-policy"]).toContain("default-src 'self'");
  expect(h["content-security-policy"]).toContain("frame-ancestors 'none'");
  expect(h["content-security-policy"]).not.toContain("unsafe-eval");
  expect(h["x-content-type-options"]).toBe("nosniff");
  expect(h["referrer-policy"]).toBe("strict-origin-when-cross-origin");
  expect(h["x-frame-options"]).toBe("DENY");
  expect(h["x-powered-by"]).toBeUndefined();
});

test("nenhuma violação de CSP ao usar o site", async ({ page }) => {
  const violations: string[] = [];
  page.on("console", (m) => {
    if (/Content Security Policy|Refused to/i.test(m.text())) violations.push(m.text());
  });
  for (const path of ["/", "/quiz", "/personagens", "/personagens/stan-marsh", "/metodologia"]) {
    await page.goto(path);
  }
  await page.goto("/quiz");
  await page.locator('label:has(input[value="agree"])').click();
  await expect(page.getByText("Afirmação 2 de")).toBeVisible();
  expect(violations).toEqual([]);
});

test("metadados de SEO e Open Graph", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/SouthMatch/);
  const meta = (sel: string) => page.locator(sel).first().getAttribute("content");
  expect(await meta('meta[name="description"]')).toMatch(/45 afirmações/);
  expect(await meta('meta[property="og:title"]')).toMatch(/SouthMatch/);
  expect(await meta('meta[property="og:locale"]')).toBe("pt_BR");
  expect(await meta('meta[property="og:image"]')).toMatch(/\/opengraph-image/);
  expect(await meta('meta[name="twitter:card"]')).toBe("summary_large_image");
  // A canônica da raiz é o próprio domínio (o Next remove a barra final).
  expect(await page.locator('link[rel="canonical"]').getAttribute("href")).toMatch(/^https?:\/\/[^/]+\/?$/);

  await page.goto("/personagens/stan-marsh");
  await expect(page).toHaveTitle("Stan Marsh | SouthMatch");
  expect(await meta('meta[property="og:image"]')).toMatch(/\/personagens\/stan-marsh\/opengraph-image/);
  expect(await page.locator('link[rel="canonical"]').getAttribute("href")).toMatch(/\/personagens\/stan-marsh$/);
});

test("resultado não é indexável", async ({ page }) => {
  await page.goto("/resultado");
  expect(await page.locator('meta[name="robots"]').first().getAttribute("content")).toMatch(/noindex/);
});

test("imagens de Open Graph são PNG 1200×630", async ({ request }) => {
  for (const path of ["/opengraph-image", "/personagens/butters-stotch/opengraph-image"]) {
    const res = await request.get(path);
    expect(res.status()).toBe(200);
    expect(res.headers()["content-type"]).toBe("image/png");
    const body = await res.body();
    expect(body.readUInt32BE(16)).toBe(1200);
    expect(body.readUInt32BE(20)).toBe(630);
  }
});

test("sitemap, robots, manifesto e ícone", async ({ request }) => {
  const sitemap = await (await request.get("/sitemap.xml")).text();
  expect(sitemap.match(/<url>/g)).toHaveLength(26); // 6 páginas + 20 personagens
  expect(sitemap).not.toContain("/resultado");
  const robots = await (await request.get("/robots.txt")).text();
  expect(robots).toContain("Disallow: /resultado");
  expect(robots).toMatch(/Sitemap: .*\/sitemap\.xml/);
  expect((await request.get("/manifest.webmanifest")).status()).toBe(200);
  expect((await request.get("/icon.svg")).status()).toBe(200);
});
