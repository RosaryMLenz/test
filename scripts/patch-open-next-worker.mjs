import { readFileSync, writeFileSync } from "node:fs";
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
