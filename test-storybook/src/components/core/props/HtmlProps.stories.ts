/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Story } from '@muban/storybook/types-6-0';
import { html } from '@muban/template';
import { bind, defineComponent, propType, computed } from '@muban/muban';
import type { PropTypeDefinition, ComponentRefItem } from '@muban/muban';

export default {
  title: 'core/props/html',
};

const getInfoBinding = (refs: any, props: any) =>
  bind(refs.info, {
    text: computed(() => JSON.stringify(props, null, 2)),
  });

const createPropsComponent = (
  props: Record<string, PropTypeDefinition>,
  refs: Record<string, ComponentRefItem> = {},
) => {
  return defineComponent({
    name: 'props',
    refs: {
      info: 'info',
      props: 'props',
      ...refs,
    },
    props,
    setup({ props, refs }) {
      return [getInfoBinding(refs, props)];
    },
  });
};

export const HtmlString: Story = () => ({
  component: createPropsComponent(
    {
      statusValue: propType.string.source({ type: 'html', target: 'props' }),
      statusValue2: propType.string.source({ type: 'html', target: 'props2' }),
    },
    {
      props2: 'props2',
    },
  ),
  template: () => html` <div data-component="props">
    <div data-ref="props">success</div>
    <div data-ref="props2">Hello <strong>world</strong>!</div>
    <pre data-ref="info"></pre>
  </div>`,
});
