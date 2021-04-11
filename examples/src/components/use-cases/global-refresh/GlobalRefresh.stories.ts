import { html } from '@muban/template';
import type { Story } from '@muban/storybook/dist/client/preview/types-6-0';
import { computed, ref } from '@vue/reactivity';
import { bind, defineComponent, propType, refComponent } from '../../../../../src';

export default {
  title: 'use-cases/global-refresh',
};

const Tooltip = defineComponent({
  name: 'tooltip',
  props: {
    content: propType.string.defaultValue('').source({ type: 'text', target: 'self' }),
  },
  setup({ props }) {
    console.log('Tooltip init', props.content);
    return [];
  },
});
const Child = defineComponent({
  name: 'child',
  refs: {
    content: 'content',
  },
  props: {
    content: propType.string.source({ type: 'html', target: 'content' }),
  },
  setup({ refs, props }) {
    return [bind(refs.content, { html: computed(() => props.content) })];
  },
});

export const GlobalRefresh: Story = () => ({
  appComponents: [Tooltip],
  component: defineComponent({
    name: 'global-refresh',
    refs: {
      child: refComponent(Child),
    },
    setup({ refs }) {
      const updatedContent = ref(
        refs.child.component?.props.content?.replace(
          /##([a-z\d]+)##/gi,
          (match, content) => `<span data-component="tooltip"><strong>${content}</strong></span>`,
        ) ?? '',
      );

      return [bind(refs.child, { content: updatedContent })];
    },
  }),
  template: () => html` <div data-component="global-refresh">
    <div data-component="child">
      <h1>Test</h1>
      <div data-ref="content">Foo ##tooltip1## bar ##tooltip2##.</div>
    </div>
  </div>`,
});
