import { defineComponent } from '../../Component.Knockout';

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
  setup(props, refs, { element }) {
    console.log('toggle expand!', props, refs, element);

    // const isExpanded = observable(props.isExpanded ?? false);

    return null;
    // return (
    //   <>
    //     <BindElement
    //       ref={refs.expandButton}
    //       text={() => (isExpanded() ? 'read less...' : 'read more...')}
    //       click={() => isExpanded(!isExpanded())}
    //     />
    //     <BindElement
    //       ref={refs.expandContent}
    //       style={() => ({
    //         display: isExpanded() ? 'block' : 'none',
    //       })}
    //     />
    //   </>
    // );
  },
});
