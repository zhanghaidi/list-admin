import js from '@eslint/js';
import importPlugin from 'eslint-plugin-import';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['node_modules', 'dist'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 'latest', // ✅ 最新 ECMAScript 语法
      sourceType: 'module', // ✅ 允许 import/export
      globals: globals.browser, // ✅ 允许浏览器全局变量
    },
    settings: {
      react: {
        version: 'detect', // ✅ 自动检测 React 版本
      },
      'import/resolver': {
        alias: {
          map: [['@', './src']], // ✅ 允许 `@/xxx` 作为路径别名
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
        },
      },
    },
    files: ['**/*.{ts,tsx,js,jsx}'],
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      import: importPlugin,
    },
    rules: {
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      'no-console': 'warn', // ✅ 避免 console.log
      'no-debugger': 'warn', // ✅ 避免 debugger
      'react/prop-types': 'off', // ✅ TypeScript 代替 prop-types
      'react-hooks/rules-of-hooks': 'error', // ✅ 确保 Hooks 规则正确
      'react-hooks/exhaustive-deps': 'warn', // ✅ 确保 useEffect 依赖数组完整
      '@typescript-eslint/no-explicit-any': 'off', // 允许 any 类型
      '@typescript-eslint/no-unused-expressions': 'off', // 允许无赋值表达式
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'object', 'type'],
          pathGroups: [{ pattern: '@/**', group: 'internal', position: 'after' }],
          distinctGroup: true,
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],
    },
  },
);
