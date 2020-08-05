import { defineComponent } from '../../Component.Vue';
import { createElement, Fragment, BindElement } from '../../JSX.Reactive';
import { computed, ref } from '@vue/reactivity';

// eslint-disable-next-line @typescript-eslint/ban-types
type Props = {
  isExpanded: boolean;
};
type Refs = {
  expandButton: HTMLButtonElement;
  expandContent: HTMLDivElement;
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
        <BindElement
          ref={refs.expandButton}
          text={expandButtonLabel}
          click={() => (isExpanded.value = !isExpanded.value)}
        />
        <BindElement
          ref={refs.expandContent}
          style={computed(() => ({
            display: isExpanded.value ? 'block' : 'none',
          }))}
        />
      </>
    );
  },
});
