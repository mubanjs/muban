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

import { ref } from '@vue/reactivity';
import { html } from 'lit-html';
import { defineComponent } from '../../src';
import { bind } from '../../src/lib/utils/bindings/bindingDefinitions';
import { mount } from '../../src/lib/utils/mount';

const MyComponent = defineComponent({
  name: 'my-component',
  setup(props, refs) {
    console.log('refs', refs);
    return [bind(refs.self, { text: ref('Hello World') })];
  },
});

mount(MyComponent, document.body);
type MyComponentProps = {
  welcomeText: string;
};

function myComponentTemplate({ welcomeText }: MyComponentProps) {
  return html`<div data-component="my-component">${welcomeText}</div>`;
}

const appRoot = document.getElementById('app');
mount(MyComponent, appRoot, myComponentTemplate, {
  welcomeText: 'Hello',
});
