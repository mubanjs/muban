/* eslint-disable react/jsx-key */
import { defineComponent } from '../../Component.Vue';
import { createElement, Fragment, ElementRef } from '../../JSX.Reactive';
import { computed, ref } from '@vue/reactivity';

type Props = {
  isExpanded: boolean;
};
type Refs = {
  expandButton: ElementRef<HTMLButtonElement>;
  expandContent: ElementRef<HTMLDivElement>;
};

const useToggle = (initialValue: boolean) => {
  const state = ref(initialValue);
  const toggle = () => (state.value = !state.value);
  return [state, toggle] as const;
};

export default defineComponent<Props, Refs>({
  name: 'toggle-expand',
  props: {
    isExpanded: Boolean,
  },
  refs: {
    expandButton: 'expand-button',
    expandContent: 'expand-content',
  },
  setup(props, refs) {
    const [isExpanded, toggleExpanded] = useToggle(props.isExpanded ?? false);
    const expandButtonLabel = computed(() => (isExpanded.value ? 'read less...' : 'read more...'));

    return [
      <refs.expandButton text={expandButtonLabel} click={toggleExpanded} />,
      <refs.expandContent
        style={computed(() => ({
          display: isExpanded.value ? 'block' : 'none',
        }))}
      />,
    ];
  },
});
