import type { Story } from '@muban/storybook/types-6-0';
import { html } from '@muban/template';
import { queryByRef, queryAllByRef, queryAllByAttribute, screen } from '@muban/testing-library';
import { userEvent } from '@storybook/testing-library';
import { expect, jest } from '@storybook/jest';
import {
  bind,
  bindMap,
  bindTemplate,
  defineComponent,
  inject,
  refCollection,
  refComponent,
  refComponents,
  computed,
  ref,
} from '@muban/muban';
import { BindMapItem, BindMapItem2, bindMapItem2Template, bindMapItemTemplate } from './Item';
import { wait, waitToBe } from '../../../utils/timers';

export default {
  title: 'core/bind/bindMap',
};

/**
 * element collection
 * component collection
 * array
 * live collection
 */
export const BindMapElements: Story = () => ({
  component: defineComponent({
    name: 'bindMap',
    refs: {
      activateButtons: refCollection('activateButton'),
    },
    setup({ refs }) {
      const activeIndex = ref<number | null>(null);
      return [
        ...bindMap(refs.activateButtons, (ref, index) => ({
          text: computed(() => `activate${index === activeIndex.value ? ' [active]' : ''}`),
          click: () => {
            activeIndex.value = index;
          },
        })),
      ];
    },
  }),
  template: () => html` <div data-component="bindMap" data-testid="ref-collection-story">
    ${['foo', 'bar', 'baz'].map(
      (item) =>
        html` <p><span>${item} </span><button data-ref="activateButton">activate</button></p>`,
    )}
  </div>`,
});
BindMapElements.storyName = 'refCollection';
BindMapElements.play = async () => {
  const storyContainer = screen.getByTestId('ref-collection-story');
  const activateButtons = queryAllByRef(storyContainer, 'activateButton');
  for (const currentButton of activateButtons) {
    userEvent.click(currentButton);
    const otherButtons = activateButtons.filter((button) => button !== currentButton);
    await waitToBe(currentButton, 'textContent', 'activate [active]');
    otherButtons.forEach((otherButton) => {
      expect(otherButton.textContent).toBe('activate');
    });
  }
};

export const BindMapComponents: Story = () => {
  return {
    component: defineComponent({
      name: 'bindMap',
      refs: {
        items: refComponents(BindMapItem),
      },
      setup({ refs }) {
        const activeValue = ref<string | null>(null);
        return [
          ...bindMap(refs.items, (ref) => ({
            isActive: computed(() => activeValue.value === ref.component?.props.value),
            onActivate() {
              activeValue.value = ref.component?.props.value ?? null;
            },
            $element: {
              event: {
                mouseenter: () => console.log('mouse enter'),
              },
            },
          })),
        ];
      },
    }),
    template: () => html` <div data-component="bindMap" data-testid="ref-components-story">
      ${['foo', 'bar', 'baz'].map((label) => bindMapItemTemplate({ label }))}
    </div>`,
  };
};
BindMapComponents.storyName = 'refComponents';
BindMapComponents.play = async () => {
  const storyContainer = screen.getByTestId('ref-components-story');
  const components = queryAllByAttribute('data-component', storyContainer, 'item');
  for (const component of components) {
    const button = queryByRef(component, 'btn')!;
    userEvent.click(button);
    await waitToBe(button, 'textContent', `${component.dataset.value} [active]`);
  }
};

const componentsMultipleHandleMouseEnter = jest.fn();

// TODO: type of `getProps` doesn't intersect correctly
export const BindMapComponentsMultiple: Story = () => {
  return {
    component: defineComponent({
      name: 'bindMap',
      refs: {
        items: refComponents([BindMapItem, BindMapItem2]),
      },
      setup({ refs }) {
        const activeValue = ref<string | null>(null);
        return [
          ...bindMap(refs.items, (ref) => ({
            isActive: computed(() => activeValue.value === ref.component?.props.value),
            onActivate() {
              activeValue.value = ref.component?.props.value ?? null;
            },
            $element: {
              event: {
                mouseenter: () => {
                  componentsMultipleHandleMouseEnter();
                  console.log('mouse enter');
                },
              },
            },
          })),
        ];
      },
    }),
    template: () => html` <div data-component="bindMap" data-testid="ref-components-multiple-story">
      ${['foo', 'bar', 'baz'].map((label) => bindMapItemTemplate({ label }))}
      ${['foo', 'bar', 'baz'].map((label) => bindMapItem2Template({ label }))}
    </div>`,
  };
};
BindMapComponentsMultiple.storyName = 'refComponents multiple';
BindMapComponentsMultiple.play = async () => {
  const storyContainer = screen.getByTestId('ref-components-multiple-story');
  const items = queryAllByAttribute('data-component', storyContainer, 'item');
  const items2 = queryAllByAttribute('data-component', storyContainer, 'item2');
  const allItems = [...items, ...items2];
  let mouseEnterCounter = 0;
  for (const item of allItems) {
    mouseEnterCounter++;
    userEvent.hover(item);
    expect(componentsMultipleHandleMouseEnter).toBeCalledTimes(mouseEnterCounter);
  }

  for (const item of items) {
    const button = queryByRef(item, 'btn')!;
    userEvent.click(button);
    await waitToBe(item, 'textContent', `${item.dataset.value} [active]`);
  }

  for (const item of items2) {
    const button = queryByRef(item, 'btn')!;
    userEvent.click(button);
    await waitToBe(item, 'textContent', item.dataset.value);
  }
};

export const BindMapElementArray: Story = () => ({
  component: defineComponent({
    name: 'bindMap',
    refs: {
      fooButton: 'foo',
      barButton: 'bar',
      bazButton: 'baz',
    },
    setup({ refs }) {
      const activeIndex = ref<number | null>(null);
      return [
        ...bindMap([refs.fooButton, refs.barButton, refs.bazButton], (ref, index) => ({
          text: computed(() => `activate${index === activeIndex.value ? ' [active]' : ''}`),
          click: () => {
            activeIndex.value = index;
          },
        })),
      ];
    },
  }),
  template: () => html` <div data-component="bindMap" data-testid="ref-element-array-story">
    ${['foo', 'bar', 'baz'].map(
      (item) => html` <p><span>${item} </span><button data-ref=${item}>activate</button></p>`,
    )}
  </div>`,
});
BindMapElementArray.storyName = 'refElement Array';
BindMapElementArray.play = async () => {
  const storyContainer = screen.getByTestId('ref-element-array-story');
  for (const ref of ['foo', 'bar', 'baz']) {
    const element = queryByRef(storyContainer, ref)!;
    userEvent.click(element);
    await waitToBe(element, 'textContent', `activate [active]`);
  }
};

export const BindMapComponentsArray: Story = () => {
  return {
    component: defineComponent({
      name: 'bindMap',
      refs: {
        fooButton: refComponent(BindMapItem, { ref: 'foo' }),
        barButton: refComponent(BindMapItem, { ref: 'bar' }),
        bazButton: refComponent(BindMapItem, { ref: 'baz' }),
      },
      setup({ refs }) {
        const activeValue = ref<string | null>(null);
        return [
          ...bindMap([refs.fooButton, refs.barButton, refs.bazButton], (ref) => ({
            isActive: computed(() => activeValue.value === ref.component?.props.value),
            onActivate: () => {
              console.log('activate');
              activeValue.value = ref.component?.props.value ?? null;
            },
          })),
        ];
      },
    }),
    template: () => html` <div data-component="bindMap" data-testid="ref-component-array-story">
      ${['foo', 'bar', 'baz'].map((label) => bindMapItemTemplate({ label }, label))}
    </div>`,
  };
};
BindMapComponentsArray.storyName = 'refComponent Array';
BindMapComponentsArray.play = async () => {
  const storyContainer = screen.getByTestId('ref-component-array-story');
  const components = queryAllByAttribute('data-component', storyContainer, 'item');
  for (const component of components) {
    const button = queryByRef(component, 'btn')!;
    userEvent.click(button);
    await waitToBe(button, 'textContent', `${component.dataset.value} [active]`);
    const otherComponents = components.filter((otherComponent) => otherComponent != component);
    otherComponents.forEach((otherComponent) =>
      expect(otherComponent.textContent).toBe(otherComponent.dataset.value),
    );
  }
};

// TODO: type of `getProps` doesn't intersect correctly
export const BindMapComponentsArrayMultiple: Story = () => {
  return {
    component: defineComponent({
      name: 'bindMap',
      refs: {
        fooButton: refComponent(BindMapItem, { ref: 'foo' }),
        barButton: refComponent(BindMapItem, { ref: 'bar' }),
        bazButton: refComponent(BindMapItem2, { ref: 'baz' }),
      },
      setup({ refs }) {
        const activeValue = ref<string | null>(null);
        return [
          ...bindMap([refs.fooButton, refs.barButton, refs.bazButton], (ref) => ({
            isActive: computed(() => activeValue.value === ref.component?.props.value),
            onActivate: () => {
              console.log('activate');
              activeValue.value = ref.component?.props.value ?? null;
            },
          })),
        ];
      },
    }),
    template: () => html` <div
      data-component="bindMap"
      data-testid="ref-component-array-multiple-story"
    >
      ${['foo', 'bar'].map((label) => bindMapItemTemplate({ label }, label))}
      ${['baz'].map((label) => bindMapItem2Template({ label }, label))}
    </div>`,
  };
};
BindMapComponentsArrayMultiple.storyName = 'refComponent Array Multiple';
BindMapComponentsArrayMultiple.play = async () => {
  const storyContainer = screen.getByTestId('ref-component-array-multiple-story');
  const items = queryAllByAttribute('data-component', storyContainer, 'item');
  const items2 = queryAllByAttribute('data-component', storyContainer, 'item2');
  for (const item of items) {
    const button = queryByRef(item, 'btn')!;
    userEvent.click(button);
    await waitToBe(button, 'textContent', `${item.dataset.value} [active]`);
    const otherItems = items.filter((otherItem) => otherItem != item);
    otherItems.forEach((otherItem) => expect(otherItem.textContent).toBe(otherItem.dataset.value));
  }
  for (const item of items2) {
    const button = queryByRef(item, 'btn')!;
    userEvent.click(button);
    await waitToBe(button, 'textContent', `${item.dataset.value}`);
  }
};

export const BindMapLiveList: Story = () => ({
  component: defineComponent({
    name: 'bindMap',
    refs: {
      container: 'container',
      addButton: 'addButton',
      removeButton: refCollection('removeButton'),
    },
    setup({ refs }) {
      const data = ref<Array<string>>([]);

      console.log('CONTEXT', inject('testContext', 'DEFAULT NOOOOOOOO'));

      return [
        bind(refs.addButton, {
          click() {
            data.value = data.value.concat(Math.random().toString());
          },
        }),
        ...bindMap(refs.removeButton, (ref, index) => ({
          click() {
            data.value = data.value.filter((item, index_) => index_ !== index);
          },
        })),
        bindTemplate(refs.container, () =>
          data.value.map(
            (item) =>
              html`<p><span>${item}</span><button data-ref="removeButton">remove</button></p>`,
          ),
        ),
      ];
    },
  }),
  template: () => html` <div data-component="bindMap" data-testid="reactive-updates-to-refs-story">
    <div><button data-ref="addButton">add item</button></div>
    <div data-ref="container"></div>
  </div>`,
});
BindMapLiveList.storyName = 'Reactive updates to refs';
BindMapLiveList.play = async () => {
  const storyContainer = screen.getByTestId('reactive-updates-to-refs-story');
  const addButton = queryByRef(storyContainer, 'addButton')!;
  const itemsToAdd = 5;
  for (let index = 0; index < itemsToAdd; index++) {
    userEvent.click(addButton);
  }
  await wait();
  const getRemoveButtons = () => queryAllByRef(storyContainer, 'removeButton');
  expect(getRemoveButtons().length).toBe(itemsToAdd);
  let itemsLeft = 5;
  const removeOne = async () => {
    const removeButtons = getRemoveButtons();
    if (removeButtons.length === 0) return;
    userEvent.click(removeButtons[0]);
    itemsLeft--;
    await wait();
    expect(getRemoveButtons().length).toBe(itemsLeft);
    removeOne();
  };
  removeOne();
};
