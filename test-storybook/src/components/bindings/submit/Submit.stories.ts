import { html } from '@muban/template';
import type { Story } from '@muban/storybook/types-6-0';
import { bind, defineComponent, ref } from '@muban/muban';
import { expect, jest } from '@storybook/jest';
import { queryByRef, screen } from '@muban/testing-library';
import { userEvent } from '@storybook/testing-library';
import { wait } from '../../../utils/timers';

export default {
  title: 'bindings/submit',
};

const onSubmit = jest.fn();

export const Default: Story = () => ({
  component: defineComponent({
    name: 'submit',
    refs: {
      info: 'info',
      form: 'user-form',
    },
    setup({ refs }) {
      const submitted = ref('');
      return [
        bind(refs.form, {
          submit: () => {
            console.log('call submit');
            submitted.value = 'submitted';
            onSubmit();

            setTimeout(() => {
              submitted.value = '';
            }, 2000);
          },
        }),
        bind(refs.info, { text: submitted }),
      ];
    },
  }),
  template: () => html` <div data-component="submit" data-testid="submit-story">
    <p>Use any means to submit this form (press the button, hit enter in the input)</p>
    <form data-ref="user-form" action="#" method="get">
      <div><input type="text" /></div>
      <div><button type="submit" data-ref="submit">submit</button></div>
    </form>
    <p data-ref="info"></p>
  </div>`,
});
Default.play = async () => {
  const storyContainer = screen.getByTestId('submit-story');
  const submit = queryByRef(storyContainer, 'submit') as HTMLInputElement;
  userEvent.click(submit);
  await wait();
  expect(onSubmit).toBeCalled();
};
