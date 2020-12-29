import { computed, ref } from '@vue/reactivity';
import { watchEffect } from '@vue/runtime-core';
import { defineComponent, bind } from '../../../../../src';

export const Focus = defineComponent({
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
      bind(refs.field, { hasFocus: hasFocus }),
    ];
  },
});
