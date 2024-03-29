/* eslint-disable @typescript-eslint/no-explicit-any */
import { computed } from '@vue/reactivity';
import { bind } from '../../../../../src/lib/bindings/bindingDefinitions';
import { propType } from '../../../../../src/lib/props/propDefinitions';

import { defineComponent } from '../../../../../src/lib/Component';
import { refElement } from '../../../../../src/lib/refs/refDefinitions';
import { useToggle } from '../../../hooks/useToggle';

import './toggle-expand.scss';

const getButtonLabel = (isExpanded: boolean) => (isExpanded ? 'read less...' : 'read more...');

export const ToggleExpand = defineComponent({
  name: 'toggle-expand',
  props: {
    isExpanded: propType.boolean.defaultValue(true).source({ type: 'json' }),
  },
  refs: {
    expandButton: refElement((parent) => parent.querySelector('[data-ref="expand-button"]')),
    expandContent: (parent) => parent.querySelector('[data-ref="expand-content"]'),
  },
  setup({ props, refs }) {
    const [isExpanded, toggleExpanded] = useToggle(computed(() => props.isExpanded || false));
    const expandButtonLabel = computed(() => getButtonLabel(isExpanded.value));

    return [
      bind(refs.expandButton, {
        text: expandButtonLabel,
        event: { click: () => toggleExpanded() },
      }),
      bind(refs.self, {
        css: { isExpanded },
        debug: isExpanded,
      }),
    ];
  },
});
