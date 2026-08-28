import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    // eslint-config-next 16.3 enables react-hooks v7 compiler rules as errors.
    // Existing loaders, Embla refs, and payload interfaces predate that; do not
    // rewrite them as part of the security patch.
    rules: {
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/refs": "off",
    },
  },
  {
    files: ["src/app/global-error.tsx", "src/app/not-found.tsx"],
    rules: {
      "@next/next/no-html-link-for-pages": "off",
    },
  },
  {
    files: ["src/types/index.ts"],
    rules: {
      "@typescript-eslint/no-empty-object-type": "off",
    },
  },
]);

export default eslintConfig;
