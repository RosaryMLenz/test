import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  {
    ignores: [
      "**/lib/generated/prisma/**", // ✅ ignore Prisma generated files
    ],
  },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
];

// ✅ Fix import/no-anonymous-default-export by exporting a named variable
export default eslintConfig;
