/* eslint-disable no-restricted-properties */
import './index.css';
import { importMeta, importTemplates, init } from './utils';
// import './hooks';

// register meta stuff
importMeta(require.context('./components/', true, /meta.ts$/));

// register html files
importTemplates(require.context('./components/', true, /\.html$/));

init();
