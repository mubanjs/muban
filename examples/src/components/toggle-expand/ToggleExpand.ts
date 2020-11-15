/* eslint-disable react/jsx-key */
import { isBoolean, optional } from 'isntnt';
import { html } from 'lit-html';
import { bind } from '../../../../src/lib/utils/bindings/bindingDefinitions';
import { propType } from '../../../../src/lib/utils/props/propDefinitions';

import { defineComponent } from '../../../../src/lib/Component.Reactive';
import { computed, ref } from '@vue/reactivity';
import { refElement } from '../../../../src/lib/utils/refs/refDefinitions';
import { button } from '../button/Button';

import './toggle-expand.css';

export const useToggle = (initialValue: boolean) => {
  const state = ref(initialValue);
  const toggle = (force?: boolean) => (state.value = force === undefined ? !state.value : force);
  return [state, toggle] as const;
};

const getButtonLabel = (isExpanded: boolean) => (isExpanded ? 'read less...' : 'read more...');

export default defineComponent({
  name: 'toggle-expand',
  props: {
    isExpanded: propType.boolean.validate(optional(isBoolean)),
  },
  refs: {
    expandButton: refElement('expand-button'),
    expandContent: 'expand-content',
  },
  setup(props, refs) {
    const [isExpanded, toggleExpanded] = useToggle(props.isExpanded ?? false);
    const expandButtonLabel = computed(() => getButtonLabel(isExpanded.value));

    return [
      bind(refs.expandButton, { text: expandButtonLabel, click: () => toggleExpanded() }),
      bind(refs.self, {
        css: { isExpanded },
      }),
    ];
  },
});

export type ToggleExpandProps = {
  isExpanded?: boolean;
};

export const toggleExpand = ({ isExpanded = false }: ToggleExpandProps = {}) => {
  return html`<div data-component="toggle-expand" class=${isExpanded ? 'isExpanded' : ''}>
    <script type="application/json">
      {
        "isExpanded": ${isExpanded}
      }
    </script>
    <p>
      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Atque consequatur cum laboriosam
      voluptate voluptatibus. Alias aut autem eligendi perspiciatis provident quae quisquam sapiente
      sequi, vero voluptatibus. Dolores dolorum exercitationem voluptate.
    </p>
    <p>${button({ label: getButtonLabel(isExpanded) }, 'expand-button')}</p>
    <p data-ref="expand-content">
      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Distinctio error incidunt
      necessitatibus repellendus sint. A, deleniti ducimus ex facere ipsam libero quae quas
      temporibus voluptas voluptates. Blanditiis consequatur deserunt facere!
    </p>
  </div>`;
};
