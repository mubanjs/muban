/* eslint-disable no-restricted-properties,@typescript-eslint/no-explicit-any */
import './index.scss';
import RequireContext = __WebpackModuleApi.RequireContext;

export function importStyles(r: RequireContext): void {
  r.keys().forEach(r);
}
// register styles
importStyles(require.context('./components/', true, /\.css$/));

(window as any).__MUBAN_STORYBOOK__ = { components: {} };

export function importComponents(r: RequireContext): void {
  r.keys().forEach((key) => {
    const componentName = /\/(.*)\//gi.exec(key)?.[1];
    if (componentName) {
      (window as any).__MUBAN_STORYBOOK__.components[componentName] = r(key).default;
    }
  });
}
// register styles
importComponents(require.context('./components/', true, /\.tsx$/));

if (module.hot) {
  module.hot.decline();
}
