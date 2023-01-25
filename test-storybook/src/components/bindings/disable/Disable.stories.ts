import { html } from '@muban/template';
import type { Story } from '@muban/storybook/types-6-0';
import { bind, defineComponent, computed, ref } from '@muban/muban';
import { queryByRef, screen } from '@muban/testing-library';
import { userEvent, waitFor } from '@storybook/testing-library';
import { expect } from '@storybook/jest';

export default {
  title: 'bindings/disable',
};

export const Default: Story = () => ({
  component: defineComponent({
    name: 'disable',
    refs: {
      check: 'check',
      info: 'info',
      field: 'field',
      btn: 'btn',
    },
    setup({ refs }) {
      const isEnabled = ref(true);

      return [
        bind(refs.check, { checked: isEnabled }),
        bind(refs.info, { text: computed(() => (isEnabled.value ? 'yes' : 'no')) }),
        bind(refs.field, { disable: isEnabled }),
        bind(refs.btn, { enable: computed(() => !isEnabled.value) }),
      ];
    },
  }),
  template: () => html` <div data-component="disable" data-testid="disabled-story">
    <div>
      <label><input type="checkbox" data-ref="check" /> Is Enabled?</label>
    </div>
    <p>Is enabled: <span data-ref="info"></span></p>
    <div><input data-ref="field" /></div>
    <div><button data-ref="btn">do something</button></div>
  </div>`,
});
Default.play = async () => {
  const storyContainer = screen.getByTestId('disabled-story');
  const check = queryByRef(storyContainer, 'check') as HTMLInputElement;
  const field = queryByRef(storyContainer, 'field') as HTMLInputElement;
  userEvent.click(check);
  await waitFor(() => expect(field).not.toBeDisabled());
  userEvent.click(check);
  await waitFor(() => expect(field).toBeDisabled());
};
