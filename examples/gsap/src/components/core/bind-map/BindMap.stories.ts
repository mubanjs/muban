import type { Story } from '@muban/storybook/dist/client/preview/types-6-0';
import { computed, ref } from '@vue/reactivity';
import { html } from '@muban/template';
import {
  bind,
  bindMap,
  bindTemplate,
  defineComponent,
  inject,
  refCollection,
  refComponent,
  refComponents,
} from '../../../../../src';
import { BindMapItem, bindMapItemTemplate } from './Item';

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
  template: () => html` <div data-component="bindMap">
    ${['foo', 'bar', 'baz'].map(
      (item) =>
        html` <p><span>${item} </span><button data-ref="activateButton">activate</button></p>`,
    )}
  </div>`,
});
BindMapElements.storyName = 'refCollection';

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
            onActivate: () => (activeValue.value = ref.component?.props.value ?? null),
          })),
        ];
      },
    }),
    template: () => html` <div data-component="bindMap">
      ${['foo', 'bar', 'baz'].map((label) => bindMapItemTemplate({ label }))}
    </div>`,
  };
};
BindMapComponents.storyName = 'refComponents';

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
  template: () => html` <div data-component="bindMap">
    ${['foo', 'bar', 'baz'].map(
      (item) => html` <p><span>${item} </span><button data-ref=${item}>activate</button></p>`,
    )}
  </div>`,
});
BindMapElementArray.storyName = 'refElement Array';

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
    template: () => html` <div data-component="bindMap">
      ${['foo', 'bar', 'baz'].map((label) => bindMapItemTemplate({ label }, label))}
    </div>`,
  };
};
BindMapComponentsArray.storyName = 'refComponent Array';

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
          click: () => (data.value = data.value.concat(Math.random().toString())),
        }),
        ...bindMap(refs.removeButton, (ref, index) => ({
          click: () => {
            data.value = data.value.filter((item, i) => i !== index);
          },
        })),
        bindTemplate(refs.container, data, (items) =>
          items.map(
            (item) =>
              html`<p><span>${item}</span><button data-ref="removeButton">remove</button></p>`,
          ),
        ),
      ];
    },
  }),
  template: () => html` <div data-component="bindMap">
    <div><button data-ref="addButton">add item</button></div>
    <div data-ref="container"></div>
  </div>`,
});
BindMapLiveList.storyName = 'Reactive updates to refs';
