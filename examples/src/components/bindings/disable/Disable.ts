import { computed, ref } from '@vue/reactivity';
import { defineComponent, bind } from '../../../../../src';

export const Disable = defineComponent({
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
});
