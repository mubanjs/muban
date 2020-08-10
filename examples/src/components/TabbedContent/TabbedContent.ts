import { defineComponent } from '../../Component.Cycle';
import type { BindProps } from '../../JSX.Reactive';

export const elementBinding = <T extends HTMLElement>(
  props: BindProps<T>,
): { type: 'element'; props: BindProps<HTMLElement> } => {
  return {
    type: 'element',
    props: props,
  };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const TabbedContentCycle = defineComponent<Record<string, any>, Record<string, any>>({
  name: 'TabbedContent',
  props: {
    isExpanded: Boolean,
  },
  refs: {
    tab: 'tab',
    tabContent: 'tabContent',
  },
});
