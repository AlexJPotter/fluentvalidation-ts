import js from '@eslint/js';
import globals from 'globals';
import { defineConfig } from 'eslint/config';
import importPlugin from 'eslint-plugin-import';
import tseslint from 'typescript-eslint';

const ignores = ['website/', 'coverage/', 'dist/'];

export default defineConfig([
  {
    ignores,
  },
  {
    plugins: { js },
    extends: ['js/recommended'],
  },
  {
    languageOptions: {
      globals: globals.browser,
    },
  },
  tseslint.configs.recommended,
  {
    extends: [
      importPlugin.flatConfigs.recommended,
      importPlugin.flatConfigs.typescript,
    ],
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      'import/order': 'error',
      'import/no-unresolved': 'off',
    },
  },
  {
    files: ['test/**/*.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
    },
  },
]);
