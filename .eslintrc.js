module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
  },
  extends: [
    '@muban/eslint-config',
  ],
  rules: {
    "import/no-extraneous-dependencies": ["error", {"devDependencies": ["**/*.test.ts", "**/test-utils/**/*.ts"]}]
  },
};
