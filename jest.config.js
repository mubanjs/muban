module.exports = {
  preset: 'ts-jest/presets/js-with-babel',
  // testEnvironment: 'jsdom',
  transformIgnorePatterns: ['<rootDir>/node_modules/(?!lodash-es)'],
  setupFilesAfterEnv: ['<rootDir>/test-utils/setupTests.js'],
};
