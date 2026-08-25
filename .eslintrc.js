module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin', 'simple-import-sort'],
  extends: [
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'simple-import-sort/imports': 'error',
  },
  overrides: [
    {
      // One rule, not the plugin's recommended preset. `require-guards`
      // reports a route handler with no guard anywhere in its chain — the
      // gap this PR's first commit closed on `GET /users/:id` and
      // `PATCH /users/:id`.
      //
      // `src/app.controller.ts` is excluded: its `getHello` root route is
      // the scaffold endpoint from `nest new` and is public on purpose.
      files: ['src/**/*.controller.ts'],
      excludedFiles: ['src/app.controller.ts'],
      plugins: ['nestjs-security'],
      rules: {
        'nestjs-security/require-guards': 'error',
      },
    },
  ],
};
