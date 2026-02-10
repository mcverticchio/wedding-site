import nextConfig from 'eslint-config-next';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';

const eslintConfig = [
  { ignores: ['convex/_generated/**'] },
  ...nextConfig,
  {
    files: ['**/*.ts', '**/*.tsx'],
    plugins: {
      '@typescript-eslint': tseslint,
    },
    languageOptions: {
      parser: tsparser,
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      '@next/next/no-img-element': 'off',
    },
  },
];

export default eslintConfig;
