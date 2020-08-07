/* eslint-disable @typescript-eslint/no-explicit-any */
import { observable } from 'knockout';
import { defineComponent } from '../../Component.Knockout';
import { createElement, Fragment, ElementRef } from '../../JSX.Reactive';

type Props = {
  isExpanded: boolean;
};
type Refs = {
  expandButton: ElementRef<HTMLButtonElement>;
  expandContent: ElementRef<HTMLDivElement>;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default defineComponent<Props, Refs>({
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
        <refs.expandButton
          text={(() => (isExpanded() ? 'read less...' : 'read more...')) as any}
          click={() => isExpanded(!isExpanded())}
        />
        <refs.expandContent
          style={
            (() => ({
              display: isExpanded() ? 'block' : 'none',
            })) as any
          }
        />
      </>
    );
  },
});
