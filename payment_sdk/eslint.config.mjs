import { fixupConfigRules } from "@eslint/compat";
import pluginJs from "@eslint/js";
import pluginImport from "eslint-plugin-import";
import pluginReactConfig from "eslint-plugin-react/configs/recommended.js";
import globals from "globals";
import tseslint from "typescript-eslint";

export default [
  {
    ignores: [
      "node_modules/",
      "dist/*",
      "*.config.js",
      "*.config.mjs",
      "babel.config.js",
      "setupTests.js",
      "src/__tests__/*",
    ]
  },
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions:
      { globals: globals.browser }
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  ...fixupConfigRules(pluginReactConfig),
  {
    plugins: {
      import: pluginImport,
    },
    rules: {
      "import/order": [
        "error",
        {
          groups: [
            ["builtin", "external", "internal"],
            ["parent", "sibling", "index"],
            []
          ],
          pathGroups: [
            {
              pattern: "react",
              group: "external",
              position: "before"
            },
            {
              pattern: "react-native",
              group: "external",
              position: "before"
            },
            {
              pattern: "react-native-*",
              group: "external",
              position: "before"
            },
            {
              pattern: "@context/**",
              group: "internal",
              position: "after"
            },
            {
              pattern: "@components/**",
              group: "internal",
              position: "after"
            },
            {
              pattern: "@services/**",
              group: "internal",
              position: "after"
            },
            {
              pattern: "@util/**",
              group: "internal",
              position: "after"
            },
            {
              pattern: "@assets/**",
              group: "internal",
              position: "after"
            }
          ],
          pathGroupsExcludedImportTypes: ["react", "react-native"],
          "newlines-between": "always",
          alphabetize: {
            order: "asc",
            caseInsensitive: true
          }
        }
      ]
    }
  }
];