import { defineComponent } from '../../lib/CycleComponent';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const ToggleExpand = defineComponent<Record<string, any>, Record<string, any>>({
  name: 'toggleExpand',
  props: {
    isExpanded: Boolean,
  },
  refs: {
    expandButton: 'expandButton',
    expandContent: 'expandContent',
  },
});
