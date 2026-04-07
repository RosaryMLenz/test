import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

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
  ...nextCoreWebVitals,
  ...nextTypescript,

  // ✅ Override rules in scripts/
  {
    files: ["scripts/**/*.ts"],
    rules: {
      "@next/next/no-html-link-for-pages": "off",
    },
  },
];

export default eslintConfig;
