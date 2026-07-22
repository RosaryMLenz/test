import {
    cpSync,
    lstatSync,
    mkdirSync,
    readFileSync,
    readdirSync,
    realpathSync,
    rmSync,
    writeFileSync,
} from "node:fs";
import { resolve } from "node:path";

const handlerPath = resolve(".open-next/server-functions/default/handler.mjs");
const serverFunctionRoot = resolve(".open-next/server-functions/default");
const marker = "__rf21CreateRequire";
const banner = `import { createRequire as ${marker} } from "node:module";\nconst require = ${marker}("file:///worker/handler.mjs");\n`;
const source = readFileSync(handlerPath, "utf8")
    .replace(banner, "")
    .replace(
        `import { createRequire as ${marker} } from "node:module";\nconst require = ${marker}(import.meta.url);\n`,
        "",
    )
    .replaceAll(`${serverFunctionRoot}/`, "./");

if (!source.includes(marker)) {
    writeFileSync(handlerPath, `${banner}${source}`);
}

const openNextRoot = resolve(".open-next");
const distRoot = resolve("dist");
const serverBundle = resolve(distRoot, "server", "open-next");

function replaceSymlinks(directory) {
    for (const entryName of readdirSync(directory)) {
        const entry = resolve(directory, entryName);

        if (lstatSync(entry).isSymbolicLink()) {
            const target = realpathSync(entry);
            rmSync(entry);
            cpSync(target, entry, { recursive: true, dereference: true });
        }

        if (lstatSync(entry).isDirectory()) {
            replaceSymlinks(entry);
        }
    }
}

rmSync(distRoot, { recursive: true, force: true });
mkdirSync(resolve(distRoot, "server"), { recursive: true });
cpSync(openNextRoot, serverBundle, { recursive: true, dereference: true });
rmSync(resolve(serverBundle, "assets"), { recursive: true, force: true });
cpSync(resolve(openNextRoot, "assets"), resolve(distRoot, "client"), { recursive: true, dereference: true });
replaceSymlinks(distRoot);
writeFileSync(
    resolve(distRoot, "server", "index.js"),
    'export { default } from "./open-next/worker.js";\nexport * from "./open-next/worker.js";\n',
);
