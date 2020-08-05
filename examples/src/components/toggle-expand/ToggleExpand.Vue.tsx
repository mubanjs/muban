import { defineComponent } from '../../Component.Vue';
import { createElement, Fragment, ElementRef } from '../../JSX.Reactive';
import { computed, ref } from '@vue/reactivity';

type Props = {
  isExpanded: boolean;
};
type Refs = {
  expandButton: ElementRef<HTMLButtonElement>;
  expandContent: ElementRef<HTMLDivElement>;
};

export default defineComponent<Props, Refs>({
  name: 'toggle-expand',
  props: {
    isExpanded: Boolean,
  },
  refs: {
    expandButton: 'expand-button',
    expandContent: 'expand-content',
  },
  setup(props, refs) {
    const isExpanded = ref(props.isExpanded ?? false);
    const expandButtonLabel = computed(() => (isExpanded.value ? 'read less...' : 'read more...'));

    return (
      <>
        <refs.expandButton
          text={expandButtonLabel}
          click={() => (isExpanded.value = !isExpanded.value)}
        />
        <refs.expandContent
          style={computed(() => ({
            display: isExpanded.value ? 'block' : 'none',
          }))}
        />
      </>
    );
  },
});
