import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
    // components/ui is shadcn-owned, CLI-generated code — we never hand-edit it,
  // so it is not held to our lint rules.
  globalIgnores(['dist', 'src/components/ui']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
  },
  {
    // a context file exports its provider plus the hook that reads it; that pairing
    // is the point of the file, so fast-refresh's one-export rule does not apply
    files: ['src/context/**/*.jsx'],
    rules: { 'react-refresh/only-export-components': 'off' },
  },
])
