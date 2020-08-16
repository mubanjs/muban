/* eslint-disable react/jsx-key */
import { isBoolean, optional } from 'isntnt';
import { defineComponent } from '../../Component.Vue';
import { createElement, Fragment, ElementRef } from '../../JSX.Vue';
import { computed, ref } from '@vue/reactivity';
import { propType } from '../../prop-types';

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

export default defineComponent({
  name: 'toggle-expand',
  props: {
    isExpanded: propType.boolean.validate(optional(isBoolean)),
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
