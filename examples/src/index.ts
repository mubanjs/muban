// /* eslint-disable no-restricted-properties,@typescript-eslint/no-explicit-any */
// import './index.css';
// import { importMeta, importTemplates, init } from './utils';
// // import './hooks';
//
// // register meta stuff
// importMeta(require.context('./components/', true, /meta.ts$/));
//
// // register html files
// importTemplates(require.context('./components/', true, /\.html$/));
//
// init();

import { mount } from '../../src/lib/utils/mount';
import ToggleExpand, { toggleExpand } from './components/toggle-expand/ToggleExpand';

mount(ToggleExpand, document.getElementById('app')!, toggleExpand, { isExpanded: true });
