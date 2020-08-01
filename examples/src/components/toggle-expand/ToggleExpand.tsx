import { observable } from 'knockout';
import { defineComponent } from '../../Component';
import { createElement, Fragment, BindElement } from '../../JSX';

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
    console.log('toggle expand!', props, refs, element);

    const isExpanded = observable(props.isExpanded ?? false);

    return (
      <>
        <BindElement
          ref={refs.expandButton}
          text={() => (isExpanded() ? 'read less...' : 'read more...')}
          click={() => isExpanded(!isExpanded())}
        />
        <BindElement
          ref={refs.expandContent}
          style={() => ({
            display: isExpanded() ? 'block' : 'none',
          })}
        />
      </>
    );
  },
});
