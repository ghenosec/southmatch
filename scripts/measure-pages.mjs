/**
 * Mede o peso de cada página (JS e total transferido) e o LCP em um servidor já rodando.
 * Uso: npm run build && npx next start -p 3200, depois node scripts/measure-pages.mjs http://localhost:3200
 */
import { chromium } from "@playwright/test";
const base = process.argv[2];
const paths = ["/", "/quiz", "/resultado#r=1~south-park~1~2026.10.0~0k1e0k0k28141o1o14~19e77et", "/personagens", "/personagens/stan-marsh", "/metodologia"];
const browser = await chromium.launch();
for (const p of paths) {
  const page = await browser.newPage();
  let js = 0, total = 0, jsRaw = 0;
  const pending = [];
  page.on("requestfinished", (req) => {
    pending.push((async () => {
      const sizes = await req.sizes();
      const resp = await req.response();
      const isJs = req.url().endsWith(".js") || (resp?.headers()["content-type"] ?? "").includes("javascript");
      total += sizes.responseBodySize;
      if (isJs) {
        js += sizes.responseBodySize;
        try { jsRaw += (await resp.body()).length; } catch {}
      }
    })());
  });
  await page.goto(base + p, { waitUntil: "networkidle" });
  const lcp = await page.evaluate(() => new Promise((res) => {
    new PerformanceObserver((l) => { const e = l.getEntries(); res(Math.round(e[e.length - 1].startTime)); }).observe({ type: "largest-contentful-paint", buffered: true });
    setTimeout(() => res(-1), 1500);
  }));
  await Promise.all(pending);
  console.log(`${p.split("#")[0].padEnd(26)} JS ${(js / 1024).toFixed(0).padStart(4)} KB comprimido (${(jsRaw / 1024).toFixed(0).padStart(4)} KB)  total ${(total / 1024).toFixed(0).padStart(4)} KB  LCP ${lcp} ms`);
  await page.close();
}
await browser.close();
