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
      "dist/**",                    // ✅ ignore compiled output
      '**/node_modules/**',
      '**/.next/**',
      '**/dist/**',
      '**/build/**',
      '**/public/**',
      '**/scripts/makeModels_cached.json', // if you want to ignore generated file
    ],
  },
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  // ✅ Override rules in scripts/
  {
    files: ["scripts/**/*.ts"],
    rules: {
      "@next/next/no-html-link-for-pages": "off",
    },
  },
];

export default eslintConfig;
