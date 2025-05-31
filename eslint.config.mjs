import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import { defineConfig } from "eslint/config";
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname,
});

const eslintConfig = [
    ...compat.extends("eslint-config-prettier"),
    ...tseslint.config(
        eslint.configs.recommended,
        tseslint.configs.recommended,
    ),
    ...defineConfig({
        rules: {
            "@typescript-eslint/no-unused-vars": [
                "error",
                { varsIgnorePattern: "^_" },
            ],
            "comma-style": ["error", "last"],
            "array-bracket-spacing": ["error", "never"],
            "no-trailing-spaces": ["error"],
            "spaced-comment": ["error", "always"],
            "comma-dangle": ["error", "always-multiline"],
            semi: ["error", "always"],
            "object-curly-spacing": ["error", "always"],
            "line-comment-position": ["error", "above"],
            curly: ["error", "multi-line"],
        },
    }),
];

export default eslintConfig;
