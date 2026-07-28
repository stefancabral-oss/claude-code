// Mesmo contrato do pipeline antigo: fora do domínio de produção, o robots
// bloqueia tudo — um ambiente de teste com o conteúdo igual ao do site real
// vira conteúdo duplicado competindo com o domínio de verdade.
import type { APIRoute } from "astro";

const PROD = "https://setfree.com.br";

const ROBOS_IA = [
  "GPTBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-User",
  "anthropic-ai",
  "PerplexityBot",
  "Google-Extended",
  "Applebot-Extended",
  "cohere-ai",
  "CCBot",
];

export const GET: APIRoute = ({ site }) => {
  const base = site!.href.replace(/\/+$/, "");

  if (base !== PROD) {
    return new Response(`# build de ${base} (nao-producao)\nUser-agent: *\nDisallow: /\n`, {
      headers: { "content-type": "text/plain; charset=utf-8" },
    });
  }

  const corpo = [
    "User-agent: *",
    "Allow: /",
    "",
    "# Crawlers de IA — acesso explícito",
    ...ROBOS_IA.flatMap((r) => [`User-agent: ${r}`, "Allow: /"]),
    "",
    `Sitemap: ${base}/sitemap.xml`,
    "",
  ].join("\n");

  return new Response(corpo, { headers: { "content-type": "text/plain; charset=utf-8" } });
};
