// Gera types/openapi.generated.ts direto do backend, sem servidor de pé: o schema sai
// do stdout do export_openapi.py e chega aqui em memória.
import { execFileSync } from "node:child_process";
import { writeFile } from "node:fs/promises";
import path from "node:path";

import openapiTS, { astToString } from "openapi-typescript";

const root = path.resolve(import.meta.dirname, "..");
const repoRoot = path.join(root, "..");
const target = path.join(root, "types", "openapi.generated.ts");

const schema = JSON.parse(
  execFileSync("uv", ["run", "python", "scripts/export_openapi.py"], {
    cwd: repoRoot,
    encoding: "utf-8",
    stdio: ["ignore", "pipe", "inherit"],
  }),
);

const ast = await openapiTS(schema);

const output = astToString(ast);

await writeFile(target, output, "utf-8");
console.log("types/openapi.generated.ts gerado a partir do backend");
