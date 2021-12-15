/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Story } from '@muban/storybook/dist/client/preview/types-6-0';
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
} from '../../../../../src';
import { useToggle } from '../../../hooks/useToggle';

export default {
  title: 'core/watch/watch',
};

const Test = defineComponent({
  name: 'test',
  setup() {
    const num = ref(0);
    watchEffect(() => {
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

export const Default: Story = () => ({
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
  template: () => html` <div data-component="story">
    <p style="max-width: 350px">
      Watch the console.log. After unmounting the component, the logging should stop. Even thought
      the interval keeps updating the ref, the watchEffect is not being executed anymore.
    </p>
    <button data-ref="btnMount">mount</button>
    <button data-ref="btnUnmount">unmount</button>
    <div data-ref="container"></div>
  </div>`,
});
