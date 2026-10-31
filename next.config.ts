import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

/**
 * Política de segurança de conteúdo sem nonce (o site é estático).
 * - Nenhum script, fonte ou conexão de terceiros: tudo vem do próprio domínio.
 * - 'unsafe-inline' em scripts é exigido pelo bootstrap do Next.js em páginas estáticas;
 *   o site não insere HTML vindo de URL ou de usuário (ver docs/ARCHITECTURE.md).
 * - blob:/data: em imagens: imagem do resultado gerada localmente.
 * HTTPS e HSTS ficam a cargo da Vercel.
 */
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' blob: data:",
  "font-src 'self'",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()",
  },
];

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  poweredByHeader: false,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
};

export default nextConfig;
