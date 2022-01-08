module.exports = {
  core: {
    builder: "webpack5",
  },
  features: {
    previewCsfV3: true,
  },
  // 'stories': [
  //   { directory: '../src', files: '**/*.stories.@(js|jsx|ts|tsx)', titlePrefix: '' }
  // ],
  'stories': [
    '../src/**/*.stories.mdx',
    '../src/**/*.stories.@(js|jsx|ts|tsx)',
  ],
  'addons': [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-postcss',
  ],
  // staticDirs: ['../public'],
};
