"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var packageJson = require('../../../package.json');

var _default = {
  packageJson: packageJson,
  framework: 'muban',
  frameworkPath: '../muban-storybook/dist/client/index.js',
  frameworkPresets: [require.resolve('./framework-preset-html.js')]
};
exports.default = _default;
