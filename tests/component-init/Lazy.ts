import { defineComponent, inject } from '../../src';
import { supportLazy } from '../../src/lib/utils/lazy';
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

export const lazy = supportLazy(Lazy);
