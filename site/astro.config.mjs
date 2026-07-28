// @ts-check
import { defineConfig } from "astro/config";

// Domínio do build. Igual ao contrato do pipeline antigo: SITE_URL manda, e o
// default é produção. O robots.txt gerado bloqueia os robôs quando não é o
// domínio de produção (ver src/pages/robots.txt.ts).
const SITE = (process.env.SITE_URL || "https://setfree.com.br").replace(/\/+$/, "");

export default defineConfig({
  site: SITE,
  // /tecnologias/geister/index.html — casa com o try_files do nginx
  build: { format: "directory" },
});
