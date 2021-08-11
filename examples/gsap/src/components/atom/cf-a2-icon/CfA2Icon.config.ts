import type { Predicate } from 'isntnt';

export const svgContext = require.context('./svg/?inline', false, /\.svg/);

export const icons = svgContext.keys().reduce<Array<string>>((icons, path = '') => {
  icons.push((path.split('/').pop() ?? '').split('.').shift() ?? '');
  return icons;
}, []);

export const isIcon: Predicate<string> = (value: unknown): value is string =>
  typeof value === 'string' && icons.includes(value);
