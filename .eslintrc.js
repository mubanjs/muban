module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
  },
  extends: ['@muban/eslint-config'],
  rules: {
    'import/no-extraneous-dependencies': [
      'error',
      { devDependencies: ['**/*.test.ts', '**/test-utils/**/*.ts'] },
    ],
    'no-underscore-dangle': [
      'error',
      {
        allow: [
          '__muban__',
          '__MUBAN__',
          '__MUBAN_DEVTOOLS_GLOBAL_HOOK__',
          '__instance',
          '__mubanInstance',
          '_instance',
          '_container',
        ],
      },
    ],
    'unicorn/prevent-abbreviations': [
      'error',
      {
        checkShorthandImports: false,
        allowList: { fn: true },
        replacements: {
          ref: false,
          refs: false,
          params: false,
          param: false,
          props: false,
          prop: false,
        },
      },
    ],
    'consistent-return': 'off',
    'import/no-cycle': 'off',
  },
  ignorePatterns: [".eslintrc.js", "*.types.test.ts"],
};
