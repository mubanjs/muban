import { defineComponent } from '../../Component.React';
import { createElement, Fragment, BindElement } from '../../JSX.React';
import { useState } from 'tng-hooks';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default defineComponent<Record<string, any>, Record<string, any>>({
  name: 'toggle-expand',
  props: {
    isExpanded: Boolean,
  },
  refs: {
    expandButton: 'expand-button',
    expandContent: 'expand-content',
  },
  render(props, refs, { element }) {
    console.log('toggle expand React:', props, refs, element);

    const [isExpanded, setIsExpanded] = useState(props.isExpanded ?? false);

    return (
      <>
        <BindElement
          ref={refs.expandButton}
          text={isExpanded ? 'read less...' : 'read more...'}
          click={() => setIsExpanded(!isExpanded)}
        />
        <BindElement
          ref={refs.expandContent}
          style={{
            display: isExpanded ? 'block' : 'none',
          }}
        />
      </>
    );
  },
});
