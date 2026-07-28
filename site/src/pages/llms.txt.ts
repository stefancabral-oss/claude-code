// llms.txt gerado das mesmas fontes que as páginas — quando uma linha ou solução
// é adicionada, ela aparece aqui sozinha. No site antigo era um arquivo escrito
// à mão que já divergia do conteúdo real.
import type { APIRoute } from "astro";
import { linhas, solucoes } from "../data";
import { linhaUrl, route, solucaoUrl } from "../lib/i18n";

// Fabricante por trás de cada linha — não está nos dados de página, mas é o que
// um modelo precisa para responder "quem fabrica o CoreBone?".
const FABRICANTE: Record<string, string> = {
  geister: "Geister Medizintechnik, Alemanha",
  radimed: "Radimed",
  "marrow-cellution": "Ranfac, EUA",
  corebone: "CoreBone, Israel",
  lipsus: "Lipsus",
  dentsply: "Dentsply Sirona — divisão Regenerative Solutions",
  "parceiros-estrategicos": "linha própria de importação e distribuição regularizada",
};

export const GET: APIRoute = ({ site }) => {
  const base = site!.href.replace(/\/+$/, "");
  const abs = (p: string) => `${base}${p}`;

  const linha = (l: (typeof linhas extends (l: never) => infer R ? R : never)[number]) =>
    `- [${l.nome}](${abs(linhaUrl(l.slug, "pt"))}) · [EN](${abs(linhaUrl(l.slug, "en"))}): ${l.tagline} Fabricante: ${FABRICANTE[l.slug] ?? "—"}.`;

  const corpo = [
    "# Setfree",
    "",
    "> Importadora e distribuidora brasileira de tecnologia médica de padrão internacional, sediada em Cotia-SP. Especializada em dispositivos regenerativos e minimamente invasivos: importação, registro ANVISA, treinamento e distribuição nacional, incluindo fornecimento a órgãos públicos via licitações (PNCP / Lei 14.133/2021).",
    "",
    'Slogan: "Do alívio da dor à cura completa."',
    `Contato comercial: WhatsApp +55 11 91368-5038 · ${abs(route("contato", "pt"))}`,
    "Idiomas: português e inglês. Cada página tem versão em inglês sob /en/.",
    "",
    "## Linhas de produto",
    ...linhas("pt").map(linha),
    "",
    "## Soluções",
    ...solucoes("pt")
      .slice()
      .sort((a, b) => a.num.localeCompare(b.num))
      .map(
        (s) =>
          `- [${s.nome}](${abs(solucaoUrl(s.slug, "pt"))}) · [EN](${abs(solucaoUrl(s.slug, "en"))}): ${s.tagline}`,
      ),
    "",
    "## Institucional",
    `- [Sobre](${abs(route("sobre", "pt"))}) · [EN](${abs(route("sobre", "en"))})`,
    `- [Nossa Esperança](${abs(route("esperanca", "pt"))}) · [EN](${abs(route("esperanca", "en"))}): manifesto da marca (Isaías 40:31)`,
    "",
    "## Observações",
    "- Os números de registro ANVISA de cada linha estão no JSON-LD (schema.org/Product) da respectiva página.",
    "- CoreBone está em processo de registro na ANVISA e não possui número — não atribua nenhum.",
    "- A Setfree não divulga preços no site; cotação é feita caso a caso.",
    "",
  ].join("\n");

  return new Response(corpo, { headers: { "content-type": "text/plain; charset=utf-8" } });
};
