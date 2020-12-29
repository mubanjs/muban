module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        modules: false,
        useBuiltIns: 'entry',
        corejs: { version: 3, proposals: true },
      },
    ],
  ],
  plugins: [
    [
      '@babel/transform-runtime',
      {
        corejs: false,
        helpers: true,
        regenerator: true,
        useESModules: true,
      },
    ],
    '@babel/plugin-proposal-nullish-coalescing-operator',
    '@babel/plugin-proposal-optional-chaining',
    '@babel/syntax-dynamic-import',
  ],
  env: {
    test: {
      presets: [['@babel/preset-env', { targets: { node: 'current' } }]],
      plugins: [
        '@babel/plugin-transform-modules-commonjs',
        ['@babel/transform-runtime', false],
      ],
    },
  },
  sourceType: 'unambiguous',
};
