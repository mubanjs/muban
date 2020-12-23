import { defineComponent, lazy, mount, provide, inject } from '../../src';
import type { ComponentFactory } from '../../src/lib/Component.types';
import { registerGlobalComponent } from '../../src/lib/utils/global';

const App = defineComponent({
  name: 'app',
  setup() {
    console.log('[setup] app');
    provide('ctx', 42);

    return [];
  },
});

registerGlobalComponent(createComponent('app-1'));
registerGlobalComponent(createComponent('app-1-1'));
registerGlobalComponent(createComponent('app-2'));
registerGlobalComponent(createComponent('app-3'));
registerGlobalComponent(lazy('lazy', () => import(/* webpackExports: "lazy" */ './Lazy')));

export function createComponent(name: string): ComponentFactory {
  return defineComponent({
    name,
    setup({ element }) {
      const ctx = inject('ctx');
      console.log(ctx, element);
      return [];
    },
  });
}

const appRoot = document.getElementById('app');
mount(App, appRoot);
