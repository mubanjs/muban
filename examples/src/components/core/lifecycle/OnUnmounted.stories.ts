import { html } from '@muban/template';
import type { Story } from '@muban/storybook/dist/client/preview/types-6-0';
import { ref } from '@vue/reactivity';
import { computed } from '@vue/runtime-core';
import { bind, defineComponent, onMounted, onUnmounted } from '../../../../../src';

export default {
  title: 'core/lifecycle/onUnmounted',
};

const Child = defineComponent({
  name: 'child',
  setup() {
    console.log('setup');
    onMounted(() => {
      console.log('+ child mounted');
    });
    onUnmounted(() => {
      console.log('- child unmounted');
    });
    return [];
  },
});

/**
 * Tries to test if a child component stays mounted when parent is set to display:none
 */
export const Default: Story = () => ({
  component: defineComponent({
    name: 'onUnmounted',
    components: [Child],
    refs: {
      content: 'content',
      toggle: 'toggle',
    },
    setup({ refs }) {
      const isVisible = ref<boolean>(true);

      return [
        bind(refs.toggle, {
          checked: isVisible,
        }),
        bind(refs.content, {
          style: { display: computed(() => (isVisible.value ? 'block' : 'none')) },
        }),
      ];
    },
  }),
  template: () => html` <div data-component="onUnmounted">
    <div><input data-ref="toggle" type="checkbox" />toggle</div>
    <div data-ref="content">
      <div data-component="child">Child content</div>
    </div>
  </div>`,
});
