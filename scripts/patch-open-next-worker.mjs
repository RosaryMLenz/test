import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const handlerPath = resolve(".open-next/server-functions/default/handler.mjs");
const marker = "__rf21CreateRequire";
const banner = `import { createRequire as ${marker} } from "node:module";\nconst require = ${marker}("file:///worker/handler.mjs");\n`;
const source = readFileSync(handlerPath, "utf8")
    .replace(
        `import { createRequire as ${marker} } from "node:module";\nconst require = ${marker}(import.meta.url);\n`,
        "",
    );

if (!source.includes(marker)) {
    writeFileSync(handlerPath, `${banner}${source}`);
}

const openNextRoot = resolve(".open-next");
const distRoot = resolve("dist");
const serverBundle = resolve(distRoot, "server", "open-next");

rmSync(distRoot, { recursive: true, force: true });
mkdirSync(resolve(distRoot, "server"), { recursive: true });
cpSync(openNextRoot, serverBundle, { recursive: true });
rmSync(resolve(serverBundle, "assets"), { recursive: true, force: true });
cpSync(resolve(openNextRoot, "assets"), resolve(distRoot, "client"), { recursive: true });
writeFileSync(
    resolve(distRoot, "server", "index.js"),
    'export { default } from "./open-next/worker.js";\nexport * from "./open-next/worker.js";\n',
);
