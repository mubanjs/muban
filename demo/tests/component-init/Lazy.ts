import { defineComponent, inject } from "@muban/muban";
import { createComponent } from './index';

const LazyChild = createComponent('lazy-child');

const Lazy = defineComponent({
  name: 'lazy',
  components: [LazyChild],
  setup({ element }) {
    const ctx = inject('ctx');

    console.log(ctx, element);
    return [];
  },
});
