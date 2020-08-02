/* eslint-disable no-restricted-properties */
import './index.css';
import { importAll, init, register } from './utils';

// register meta stuff
const r = require.context('./components/', true, /meta.ts$/);
r.keys().forEach((key) => {
  const componentName = /\/(.*)\//gi.exec(key)?.[1];
  register(componentName, r(key).default);
});

// register html files
importAll(require.context('./components/', true, /\.html$/));
// At build-time cache will be populated with all required modules.

init();
