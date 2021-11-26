/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Story } from '@muban/storybook/dist/client/preview/types-6-0';
import { html } from '@muban/template';
import {
  bind,
  bindMap,
  defineComponent,
  onMounted,
  onUnmounted,
  refCollection,
  refElement,
} from '../../../../../src';

export default {
  title: 'core/bindings/ref-lifecycle',
};

export const Element: Story = () => ({
  component: defineComponent({
    name: 'ref-lifecycle',
    refs: {
      container: 'container',
      btnAdd: 'btnAdd',
      btnRemove: 'btnRemove',
      btnDestroy: 'btnDestroy',
      testButton: refElement('testButton', { isRequired: false }),
    },
    setup({ refs }) {
      onMounted(() => {
        console.log('[mounted]');
      });
      onUnmounted(() => {
        console.log('[unmounted]');
      });
      return [
        bind(refs.btnAdd, {
          click() {
            if (refs.container.element) {
              refs.container.element.innerHTML = html`<button data-ref="testButton">test</button>`;
            }
          },
        }),
        bind(refs.btnRemove, {
          click() {
            if (refs.container.element) {
              refs.container.element.innerHTML = '';
            }
          },
        }),
        bind(refs.btnDestroy, {
          click() {
            if (refs.self.element?.parentElement) {
              refs.self.element.parentElement.innerHTML = '';
            }
          },
        }),
        bind(refs.testButton, { click: () => console.log('test') }),
      ];
    },
  }),
  template: () => html` <div data-component="ref-lifecycle">
    <button data-ref="btnAdd">add</button>
    <button data-ref="btnRemove">remove</button>
    <button data-ref="btnDestroy">destroy</button>
    <div data-ref="container"></div>
  </div>`,
});

export const Collection: Story = () => ({
  component: defineComponent({
    name: 'ref-lifecycle',
    refs: {
      container: 'container',
      btnAdd: 'btnAdd',
      btnRemove: 'btnRemove',
      btnDestroy: 'btnDestroy',
      testButton: refCollection('testButton'),
    },
    setup({ refs }) {
      onMounted(() => {
        console.log('[mounted]');
      });
      onUnmounted(() => {
        console.log('[unmounted]');
      });
      return [
        bind(refs.btnAdd, {
          click() {
            console.log('refs.container.element', refs.container.element);
            if (refs.container.element) {
              console.log('append');
              refs.container.element.innerHTML += html`<button data-ref="testButton">test</button>`;
            }
          },
        }),
        bind(refs.btnRemove, {
          click() {
            if (refs.container.element) {
              refs.container.element.innerHTML = '';
            }
          },
        }),
        bind(refs.btnDestroy, {
          click() {
            if (refs.self.element?.parentElement) {
              refs.self.element.parentElement.innerHTML = '';
            }
          },
        }),
        bind(refs.testButton, { click: () => console.log('test') }),
      ];
    },
  }),
  template: () => html` <div data-component="ref-lifecycle">
    <button data-ref="btnAdd">add</button>
    <button data-ref="btnRemove">remove</button>
    <button data-ref="btnDestroy">destroy</button>
    <div data-ref="container"></div>
  </div>`,
});

export const Map: Story = () => ({
  component: defineComponent({
    name: 'ref-lifecycle',
    refs: {
      container: 'container',
      btnAdd: 'btnAdd',
      btnRemove: 'btnRemove',
      btnDestroy: 'btnDestroy',
      testButton: refCollection('testButton'),
    },
    setup({ refs }) {
      onMounted(() => {
        console.log('[mounted]');
      });
      onUnmounted(() => {
        console.log('[unmounted]');
      });
      return [
        bind(refs.btnAdd, {
          click() {
            console.log('refs.container.element', refs.container.element);
            if (refs.container.element) {
              console.log('append');
              refs.container.element.innerHTML += html`<button data-ref="testButton">test</button>`;
            }
          },
        }),
        bind(refs.btnRemove, {
          click() {
            if (refs.container.element) {
              refs.container.element.innerHTML = '';
            }
          },
        }),
        bind(refs.btnDestroy, {
          click() {
            if (refs.self.element?.parentElement) {
              refs.self.element.parentElement.innerHTML = '';
            }
          },
        }),
        ...bindMap(refs.testButton, (ref, index) => ({ click: () => console.log('test', index) })),
      ];
    },
  }),
  template: () => html` <div data-component="ref-lifecycle">
    <button data-ref="btnAdd">add</button>
    <button data-ref="btnRemove">remove</button>
    <button data-ref="btnDestroy">destroy</button>
    <div data-ref="container"></div>
  </div>`,
});
