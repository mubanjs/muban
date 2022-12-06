/* eslint-disable @typescript-eslint/no-explicit-any */
import { useToggle } from '@muban/hooks';
import { expect, jest } from '@storybook/jest';
import { screen, queryByAttribute, waitForElementToBeRemoved } from '@storybook/testing-library';
import type { Story } from '@muban/storybook';
import { html } from '@muban/template';
import {
  bind,
  bindTemplate,
  defineComponent,
  refComponent,
  onUnmounted,
  watchEffect,
  watch,
  ref,
} from '@muban/muban';

export default {
  title: 'core/watch/watch',
};

const watchEffectMock = jest.fn();

const Test = defineComponent({
  name: 'test',
  setup() {
    const num = ref(0);
    watchEffect(() => {
      watchEffectMock();
      console.log('watchEffect', num.value);
    });
    watch(
      () => num.value,
      (value) => {
        console.log('watch', value);
      },
    );
    watch(
      () => num.value,
      (value) => {
        console.log('watchImmediate', value);
      },
      { immediate: true },
    );
    watch(
      () => [num.value, num.value],
      (value) => {
        console.log('watchMultiple', value);
      },
    );

    setInterval(() => {
      console.log('--');
      ++num.value;
    }, 1000);

    console.log('test mounted');
    onUnmounted(() => {
      console.log('test unmounted');
    });

    return [];
  },
});

export const Default: Story = {
  render() {
    return {
      component: defineComponent({
        name: 'story',
        // components: [Test],
        refs: {
          btnMount: 'btnMount',
          btnUnmount: 'btnUnmount',
          container: 'container',
          test: refComponent(Test, { isRequired: false }),
        },
        setup({ refs }) {
          const [isMounted, toggleMounted] = useToggle(true);
          return [
            bind(refs.btnMount, {
              click() {
                toggleMounted(true);
              },
            }),
            bind(refs.btnUnmount, {
              click() {
                toggleMounted(false);
              },
            }),
            bindTemplate(refs.container, () => {
              return isMounted.value ? html`<div data-component="test">Alive</div>` : '';
            }),
          ];
        },
      }),
      template: () => html` <div data-component="story" data-testid="watch-story">
        <p style="max-width: 350px">
          Watch the console.log. After unmounting the component, the logging should stop. Even
          thought the interval keeps updating the ref, the watchEffect is not being executed
          anymore.
        </p>
        <button data-ref="btnMount">mount</button>
        <button data-ref="btnUnmount">unmount</button>
        <div data-ref="container"></div>
      </div>`,
    };
  },
};

Default.play = async () => {
  const storyContainer = screen.getByTestId('watch-story');
  const mountButton = queryByAttribute('data-ref', storyContainer, 'btnMount');
  const unmountButton = queryByAttribute('data-ref', storyContainer, 'btnUnmount');
  const waitASecond = () => new Promise((r) => setTimeout(r, 1000));
  const getComponent = () => queryByAttribute('data-component', storyContainer, 'test');

  unmountButton?.click();
  await waitForElementToBeRemoved(getComponent());
  await waitASecond();
  expect(watchEffectMock).toBeCalledTimes(0);

  mountButton?.click();
  await getComponent();
  await waitASecond();
  expect(watchEffectMock).toBeCalledTimes(1);
};
