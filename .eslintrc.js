var typeScriptSettings = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
  },
  extends: [
    'plugin:@typescript-eslint/recommended',
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended',
    'plugin:import/typescript',
  ],
  rules: {
    '@typescript-eslint/array-type': ['error', { default: 'generic', readonly: 'generic' }],
    '@typescript-eslint/ban-ts-comment': 'error',
    '@typescript-eslint/consistent-type-assertions': 'error',
    '@typescript-eslint/explicit-member-accessibility': 'error',
    '@typescript-eslint/indent': 'off',
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: 'default',
        format: ['camelCase'],
        leadingUnderscore: 'forbid',
        trailingUnderscore: 'forbid',
      },
      {
        selector: 'typeLike',
        format: ['PascalCase'],
      },
      {
        selector: 'variable',
        format: ['camelCase', 'UPPER_CASE', 'PascalCase'],
      },
      {
        selector: 'enumMember',
        format: ['PascalCase'],
      },
      {
        selector: 'parameter',
        format: ['camelCase', 'PascalCase'],
      },
    ],
    '@typescript-eslint/no-empty-function': 'error',
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/no-inferrable-types': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
      { vars: 'all', args: 'after-used', ignoreRestSiblings: true, varsIgnorePattern: "Fragment" },
    ],
    'no-use-before-define': 'off',
    '@typescript-eslint/no-use-before-define': ['error', { functions: false }],
    '@typescript-eslint/prefer-interface': 'off',
    '@typescript-eslint/prefer-readonly': 'error',
    camelcase: 'off',
  },
};

const reactSettings = {
  // parserOptions: {
  //   ecmaFeatures: {
  //     jsx: true,
  //   },
  // },
  // extends: ['prettier/react'],
  // rules: {
  //   // 'react/jsx-key': 2,
  //   'react/jsx-no-comment-textnodes': 2,
  //   'react/jsx-no-duplicate-props': 2,
  //   'react/jsx-no-target-blank': 2,
  //   'react/jsx-no-undef': 2,
  //   'react/jsx-uses-react': 2,
  //   'react/jsx-uses-vars': 2,
  //   'react/jsx-boolean-value': 'error',
  //   'react/jsx-curly-brace-presence': ['error', { props: 'never', children: 'never' }],
  //   'react/jsx-filename-extension': ['error', { extensions: ['.jsx', '.tsx'] }],
  // },
};

const mhtmlSettings = {
  extends: ['plugin:lit/recommended', 'plugin:lit-a11y/recommended'],
  rules: {
    "lit/no-legacy-template-syntax": 'off',
    "lit/no-private-properties": 'off',
    "lit/no-property-change-update": 'off',
    "lit/no-template-map": 'off',
    "lit/binding-positions": 'off',
    "lit/no-invalid-html": 'off',

    // "lit/attribute-value-entities": 'off',
    // "lit/no-duplicate-template-bindings": 'off',
    // "lit/no-invalid-escape-sequences": 'off',
    // "lit/no-template-arrow": 'off',
    // "lit/no-template-bind": 'off',
    // "lit/no-value-attribute": 'off',
  }
}

module.exports = {
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: ['import', 'unicorn', 'babel', 'react', 'lit', 'lit-a11y'],
  env: {
    browser: true,
    es6: true,
  },
  globals: {
    require: true,
    process: true,
  },
  settings: {
    react: {
      createClass: 'createReactClass', // Regex for Component Factory to use,
      // default to "createReactClass"
      pragma: 'createElement', // Pragma to use, default to "React"
      version: 'detect', // React version. "detect" automatically picks the version you have installed.
      // You can also use `16.0`, `16.3`, etc, if you want to override the detected value.
      // default to latest and warns if missing
      // It will default to "detect" in the future
      flowVersion: '0.53', // Flow version
    },
  },
  rules: {
    'no-console': 'warn',
  },
  overrides: [
    {
      files: ['*.ts'],
      ...typeScriptSettings,
      ...mhtmlSettings,
      extends: [...typeScriptSettings.extends, ...mhtmlSettings.extends],
      rules: {
        ...typeScriptSettings.rules,
        ...mhtmlSettings.rules,
      },
    },
    {
      files: ['*.tsx'],
      ...typeScriptSettings,
      parserOptions: {
        ...typeScriptSettings.parserOptions,
        ...reactSettings.parserOptions,
      },
      rules: {
        ...typeScriptSettings.rules,
        ...reactSettings.rules,
        '@typescript-eslint/naming-convention': [
          'error',
          {
            selector: 'default',
            format: ['camelCase'],
            leadingUnderscore: 'forbid',
            trailingUnderscore: 'forbid',
          },
          {
            selector: 'typeLike',
            format: ['PascalCase'],
          },
          {
            selector: 'variable',
            // Exception for FunctionComponents
            format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
          },
          {
            selector: 'function',
            // Exception for FunctionComponents
            format: ['camelCase', 'PascalCase'],
          },
          {
            selector: 'enumMember',
            format: ['PascalCase'],
          },
        ],
      },
    },
  ],
};
