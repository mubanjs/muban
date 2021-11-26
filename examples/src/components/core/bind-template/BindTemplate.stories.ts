import { html } from '@muban/template';
import type { Story } from '@muban/storybook/dist/client/preview/types-6-0';
import { ref } from '@vue/reactivity';
import { bind, bindMap, bindTemplate, defineComponent, refCollection } from '../../../../../src';
import type {
  ComponentRefItemCollection,
  RefElementType,
  TypedRefs,
} from '../../../../../src/lib/refs/refDefinitions.types';

export default {
  title: 'core/bind/bindTemplate',
};

function itemTemplate({ title }: { title: string }): string {
  return html`<p><span>${title}</span><button data-ref="removeButton">remove</button></p>`;
}

function useItemControls({
  refs,
  initialData = [],
}: {
  refs: TypedRefs<{ addButton: string; removeButton: ComponentRefItemCollection<RefElementType> }>;
  initialData?: Array<string>;
}) {
  const data = ref<Array<string>>(initialData);

  const bindings = [
    bind(refs.addButton, {
      click: () => (data.value = data.value.concat(Math.random().toString())),
    }),
    ...bindMap(refs.removeButton, (ref, index) => ({
      click: () => {
        data.value = data.value.filter((item, i) => i !== index);
      },
    })),
  ];

  return {
    data,
    bindings,
  };
}

export const ServerRenderedAuto: Story = () => ({
  component: defineComponent({
    name: 'bindTemplate',
    refs: {
      container: 'container',
      addButton: 'addButton',
      removeButton: refCollection('removeButton'),
    },
    setup({ refs }) {
      const { data, bindings } = useItemControls({ refs });

      return [
        ...bindings,
        bindTemplate(
          refs.container,
          () => data.value.map((item) => itemTemplate({ title: item })),
          {
            extract: {
              config: { query: 'p', list: true, data: { title: 'span' } },
              onData: (items: Array<{ title: string }>) => (data.value = items.map((i) => i.title)),
            },
          },
        ),
      ];
    },
  }),
  template: () => html` <div data-component="bindTemplate">
    <h3>filled container</h3>
    <div><button data-ref="addButton">add item</button></div>
    <div data-ref="container">
      ${Array.from({ length: 3 }, () => itemTemplate({ title: Math.random().toString() }))}
    </div>
  </div>`,
});

export const ServerRenderedForce: Story = () => ({
  component: defineComponent({
    name: 'bindTemplate',
    refs: {
      container: 'container',
      addButton: 'addButton',
      removeButton: refCollection('removeButton'),
    },
    setup({ refs }) {
      const { data, bindings } = useItemControls({ refs });

      return [
        ...bindings,
        bindTemplate(
          refs.container,
          () => data.value.map((item) => itemTemplate({ title: item })),
          {
            extract: {
              config: { query: 'p', list: true, data: { title: 'span' } },
              onData: (items: Array<{ title: string }>) => (data.value = items.map((i) => i.title)),
            },
            forceImmediateRender: true,
          },
        ),
      ];
    },
  }),
  template: () => html` <div data-component="bindTemplate">
    <h3>filled container</h3>
    <div><button data-ref="addButton">add item</button></div>
    <div data-ref="container">
      ${Array.from({ length: 3 }, () => itemTemplate({ title: Math.random().toString() }))}
    </div>
  </div>`,
});

export const ClientRenderedAuto: Story = () => ({
  component: defineComponent({
    name: 'bindTemplate',
    refs: {
      container: 'container',
      addButton: 'addButton',
      removeButton: refCollection('removeButton'),
    },
    setup({ refs }) {
      const { data, bindings } = useItemControls({
        refs,
        initialData: [Math.random().toString(), Math.random().toString()],
      });

      return [
        ...bindings,
        bindTemplate(refs.container, () => data.value.map((item) => itemTemplate({ title: item }))),
      ];
    },
  }),
  template: () => html` <div data-component="bindTemplate">
    <h3>filled container</h3>
    <div><button data-ref="addButton">add item</button></div>
    <div data-ref="container"></div>
  </div>`,
});
