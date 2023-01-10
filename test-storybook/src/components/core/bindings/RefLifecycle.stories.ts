/* eslint-disable @typescript-eslint/no-explicit-any,no-param-reassign */
import type { Story } from '@muban/storybook/types-6-0';
import { html } from '@muban/template';
import {
  bind,
  bindMap,
  defineComponent,
  onMounted,
  onUnmounted,
  refCollection,
  refElement,
} from '@muban/muban';
import { queryByRef, queryAllByRef, screen } from '@muban/testing-library';
import { userEvent } from '@storybook/testing-library';
import { expect, jest } from '@storybook/jest';
import { wait } from '../../../utils/timers';

export default {
  title: 'core/bindings/ref-lifecycle',
};

const playFunction =
  (containerId: string, howManyToAdd = 1) =>
  async () => {
    const logSpy = jest.spyOn(console, 'log');
    const storyContainer = screen.getByTestId(containerId);
    const addButton = queryByRef(storyContainer, 'btnAdd')!;
    const removeButton = queryByRef(storyContainer, 'btnRemove')!;
    const getTestButtons = () => queryAllByRef(storyContainer, 'testButton');

    for (let index = 0; index < howManyToAdd; index++) userEvent.click(addButton);

    await wait();
    const testButtons = getTestButtons()!;
    expect(testButtons.length).toBe(howManyToAdd);

    for (const testButton of testButtons) {
      userEvent.click(testButton);
      await wait();
      expect(logSpy).toHaveBeenCalledWith(expect.stringMatching(/^test/));
    }

    userEvent.click(removeButton);
    await wait();
    expect(getTestButtons().length).toBe(0);
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
  template: () => html` <div
    data-component="ref-lifecycle"
    data-testid="ref-lifecycle-element-story"
  >
    <button data-ref="btnAdd">add</button>
    <button data-ref="btnRemove">remove</button>
    <button data-ref="btnDestroy">destroy</button>
    <div data-ref="container"></div>
  </div>`,
});
Element.play = playFunction('ref-lifecycle-element-story');

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
  template: () => html` <div
    data-component="ref-lifecycle"
    data-testid="ref-lifecycle-collection-story"
  >
    <button data-ref="btnAdd">add</button>
    <button data-ref="btnRemove">remove</button>
    <button data-ref="btnDestroy">destroy</button>
    <div data-ref="container"></div>
  </div>`,
});
Collection.play = playFunction('ref-lifecycle-collection-story');

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
  template: () => html` <div data-component="ref-lifecycle" data-testid="ref-lifecycle-map-story">
    <button data-ref="btnAdd">add</button>
    <button data-ref="btnRemove">remove</button>
    <button data-ref="btnDestroy">destroy</button>
    <div data-ref="container"></div>
  </div>`,
});
Map.play = playFunction('ref-lifecycle-map-story', 5);
