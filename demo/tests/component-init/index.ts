import { defineComponent, lazy, provide, inject, createApp } from '../../src';
import type { ComponentFactory } from '../../src';

const App = defineComponent({
  name: 'app',
  setup() {
    console.log('[setup] app');
    provide('ctx', 42);

    return [];
  },
});

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

const app = createApp(App);
app.component(
  createComponent('app-1'),
  createComponent('app-1-1'),
  createComponent('app-2'),
  createComponent('app-3'),
  lazy('lazy', () => import(/* webpackExports: "lazy" */ './Lazy')),
);

const appRoot = document.getElementById('app');
if (appRoot) {
  app.mount(appRoot);
}
