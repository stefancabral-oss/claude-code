// uploads/ vive na raiz do repositório (é conteúdo, não código do site) e são
// 30 MB — copiar para site/public duplicaria tudo no git. O build joga direto
// no dist/, menos o que não deve ser publicado.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
// No repositório, uploads/ fica na raiz. No Docker o contexto é outro, então o
// caminho pode vir por env em vez de depender da posição relativa.
const SRC = process.env.UPLOADS_DIR
  ? path.resolve(process.env.UPLOADS_DIR)
  : path.resolve(HERE, "..", "..", "uploads");
const DEST = path.resolve(HERE, "..", "dist", "uploads");

if (!fs.existsSync(SRC)) {
  console.error(`✖ uploads/ não encontrado em ${SRC}`);
  process.exit(1);
}

fs.cpSync(SRC, DEST, { recursive: true });

// o Brandbook e as capturas de tela não vão para o ar
let removidos = 0;
for (const f of fs.readdirSync(DEST)) {
  if (f.endsWith(".pdf") || f.startsWith("Captura de Tela") || f === "Brandbook") {
    fs.rmSync(path.join(DEST, f), { recursive: true, force: true });
    removidos++;
  }
}

const conta = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).reduce(
    (n, e) => n + (e.isDirectory() ? conta(path.join(dir, e.name)) : 1),
    0,
  );

console.log(`• uploads → dist/uploads (${conta(DEST)} arquivos, ${removidos} removidos do publicado)`);
