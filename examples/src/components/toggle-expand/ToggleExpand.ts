import { observable } from 'knockout';
import { bind, defineComponent } from '../../Component';

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

    bind(refs.expandButton, {
      text: () => (isExpanded() ? 'read less...' : 'read more...'),
      click: () => () => {
        isExpanded(!isExpanded());
      },
    });

    bind(refs.expandContent, {
      style: () => (isExpanded() ? { display: 'block' } : { display: 'none' }),
    });
  },
});
