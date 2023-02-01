import { html } from '@muban/template';
import type { Story } from '@muban/storybook/types-6-0';
import { bind, bindMap, bindTemplate, defineComponent, refCollection, ref } from '@muban/muban';
import type { ComponentRefItemCollection, RefElementType, TypedRefs } from '@muban/muban';
import { queryByRef, queryAllByRef, screen } from '@muban/testing-library';
import { userEvent, waitFor } from '@storybook/testing-library';
import { expect } from '@storybook/jest';

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
      click() {
        data.value = data.value.concat(Math.random().toString());
      },
    }),
    ...bindMap(refs.removeButton, (ref, index) => ({
      click() {
        data.value = data.value.filter((item, index_) => index_ !== index);
      },
    })),
  ];

  return {
    data,
    bindings,
  };
}

const playFunction = (containerId: string) => async () => {
  const storyContainer = screen.getByTestId(containerId);

  const getRemoveButtons = () => queryAllByRef(storyContainer, 'removeButton');

  const addButton = queryByRef(storyContainer, 'addButton')!;
  const itemsToAdd = 5;
  const initialItems = getRemoveButtons().length;
  let itemsLeft = itemsToAdd + initialItems;

  for (let index = 0; index < itemsToAdd; index++) {
    userEvent.click(addButton);
  }

  await waitFor(() => expect(getRemoveButtons().length).toBe(itemsLeft));
  const removeOne = async () => {
    const removeButtons = getRemoveButtons();
    if (removeButtons.length === 0) return;
    userEvent.click(removeButtons[0]);
    itemsLeft--;
    await waitFor(() => expect(getRemoveButtons().length).toBe(itemsLeft));
    removeOne();
  };

  await removeOne();
};

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
              onData(items: Array<{ title: string }>) {
                data.value = items.map((index) => index.title);
              },
            },
          },
        ),
      ];
    },
  }),
  template: () => html` <div data-component="bindTemplate" data-testid="server-rendered-auto-story">
    <h3>filled container</h3>
    <div><button data-ref="addButton">add item</button></div>
    <div data-ref="container">
      ${Array.from({ length: 3 }, () => itemTemplate({ title: Math.random().toString() }))}
    </div>
  </div>`,
});
ServerRenderedAuto.play = playFunction('server-rendered-auto-story');

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
              onData(items: Array<{ title: string }>) {
                data.value = items.map((index) => index.title);
              },
            },
            forceImmediateRender: true,
          },
        ),
      ];
    },
  }),
  template: () => html` <div
    data-component="bindTemplate"
    data-testid="server-rendered-force-story"
  >
    <h3>filled container</h3>
    <div><button data-ref="addButton">add item</button></div>
    <div data-ref="container">
      ${Array.from({ length: 3 }, () => itemTemplate({ title: Math.random().toString() }))}
    </div>
  </div>`,
});
ServerRenderedForce.play = playFunction('server-rendered-force-story');

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
  template: () => html` <div data-component="bindTemplate" data-testid="client-rendered-auto-story">
    <h3>filled container</h3>
    <div><button data-ref="addButton">add item</button></div>
    <div data-ref="container"></div>
  </div>`,
});
ClientRenderedAuto.play = playFunction('client-rendered-auto-story');
