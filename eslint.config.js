import js from "@eslint/js";
import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  // React hooks rules for src only
  {
    files: ["src/**/*.{ts,tsx}"],
    plugins: { "react-hooks": reactHooks },
    rules: {
      ...reactHooks.configs.recommended.rules,
      // SSR guard pattern (setMounted in useEffect) is intentional
      "react-hooks/set-state-in-effect": "off",
      // useCallback self-reference in pointer event handlers is intentional
      "react-hooks/immutability": "off",
      // Zustand store actions are stable — safe to omit from deps
      "react-hooks/exhaustive-deps": "warn",
    },
  },
  // Node.js globals for server files
  {
    files: ["server/**/*.js", "bin/**/*.js"],
    languageOptions: {
      globals: {
        console: "readonly",
        process: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
        setInterval: "readonly",
        clearInterval: "readonly",
        Buffer: "readonly",
        __dirname: "readonly",
        __filename: "readonly",
      },
    },
    rules: {
      // ANSI escape code stripping in runTest.js is intentional
      "no-control-regex": "off",
    },
  },
  // Test files — allow any types, console, and unused vars in stubs
  {
    files: ["tests/**/*.ts"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "off",
    },
  },
  {
    ignores: ["dist/**", "node_modules/**"],
  }
);
