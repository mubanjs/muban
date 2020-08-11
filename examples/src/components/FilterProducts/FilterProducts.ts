import { defineComponent } from '../../lib/CycleComponent';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const FiltersProducts = defineComponent<Record<string, any>, Record<string, any>>({
  name: 'TabbedContent',
  props: {
    isExpanded: Boolean,
  },
  refs: {
    tab: 'tab',
    tabContent: 'tabContent',
  },
});
