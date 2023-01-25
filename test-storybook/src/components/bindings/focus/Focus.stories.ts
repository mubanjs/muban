import { html } from '@muban/template';
import type { Story } from '@muban/storybook/types-6-0';
import { bind, defineComponent, computed, ref, watchEffect } from '@muban/muban';
import { queryByRef, screen } from '@muban/testing-library';
import { expect } from '@storybook/jest';
import { waitFor } from '@storybook/testing-library';

export default {
  title: 'bindings/focus',
};

export const Default: Story = () => ({
  component: defineComponent({
    name: 'focus',
    refs: {
      info: 'info',
      field: 'field',
    },
    setup({ refs }) {
      const hasFocus = ref(false);

      watchEffect((onInvalidate) => {
        if (hasFocus.value === false) {
          const timeout = setTimeout(() => {
            hasFocus.value = true;
          }, 2000);

          onInvalidate(() => {
            clearTimeout(timeout);
          });
        }
      });

      return [
        bind(refs.info, { text: computed(() => (hasFocus.value ? 'yes' : 'no')) }),
        bind(refs.field, { hasFocus }),
      ];
    },
  }),
  template: () => html` <div data-component="focus" data-testid="focus-story">
    <p>Has focus: <span data-ref="info"></span></p>
    <div><input data-ref="field" /></div>
    <div><button>steal focus</button></div>
  </div>`,
});
Default.play = async () => {
  const storyContainer = screen.getByTestId('focus-story');
  const field = queryByRef(storyContainer, 'field') as HTMLInputElement;
  await waitFor(() => expect(document.activeElement).toBe(field), { timeout: 2100 });
};
