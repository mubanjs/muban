import { defineComponent } from '../../Component.Vue';
import { createElement, Fragment, BindElement } from '../../JSX.Reactive';
import { ref } from '@vue/reactivity';

export default defineComponent({
  name: 'toggle-expand',
  props: {
    isExpanded: Boolean,
  },
  refs: {
    expandButton: 'expand-button',
    expandContent: 'expand-content',
  },
  setup(props, refs, { element }) {
    console.log('toggle expand Vue:', props, refs, element);

    const isExpanded = ref(props.isExpanded ?? false);

    return (
      <>
        <BindElement
          ref={refs.expandButton}
          text={() => (isExpanded.value ? 'read less...' : 'read more...')}
          click={() => (isExpanded.value = !isExpanded.value)}
        />
        <BindElement
          ref={refs.expandContent}
          style={() => ({
            display: isExpanded.value ? 'block' : 'none',
          })}
        />
      </>
    );
  },
});
