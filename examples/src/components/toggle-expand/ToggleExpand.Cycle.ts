import { Stream } from 'xstream';
import { defineComponent } from '../../Component.Cycle';
import type { BindProps } from '../../JSX.Reactive';

const xs = Stream;

export const elementBinding = <T extends HTMLElement>(
  props: BindProps<T>,
): { type: 'element'; props: BindProps<HTMLElement> } => {
  return {
    type: 'element',
    props: props,
  };
};

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
});
