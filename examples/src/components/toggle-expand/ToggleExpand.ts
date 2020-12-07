/* eslint-disable react/jsx-key */
import { isBoolean, optional } from 'isntnt';
import { templateComponentFactory } from '../../../../src/lib/utils/template/templateComponentFactory';
import { html } from '../../../../src/lib/utils/template/mhtml';
import { bind } from '../../../../src/lib/utils/bindings/bindingDefinitions';
import { propType } from '../../../../src/lib/utils/props/propDefinitions';

import { defineComponent } from '../../../../src/lib/Component.Reactive';
import { computed, Ref, ref } from '@vue/reactivity';
import { refElement } from '../../../../src/lib/utils/refs/refDefinitions';
import { button } from '../button/Button';

import './toggle-expand.css';
import { useToggle } from '../../hooks/useToggle';

const getButtonLabel = (isExpanded: boolean) => (isExpanded ? 'read less...' : 'read more...');

export const ToggleExpand = defineComponent({
  name: 'toggle-expand',
  props: {
    isExpanded: propType.boolean.validate(optional(isBoolean)),
  },
  refs: {
    expandButton: refElement((parent) => parent.querySelector('[data-ref="expand-button"]')),
    expandContent: (parent) => parent.querySelector('[data-ref="expand-content"]'),
  },
  setup({ props, refs }) {
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

export const toggleExpand = templateComponentFactory<ToggleExpandProps>({
  component: ToggleExpand,
  jsonProps(props) {
    return props;
  },
  children({ isExpanded = false }) {
    return html`
      <p>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Atque consequatur cum laboriosam
        voluptate voluptatibus. Alias aut autem eligendi perspiciatis provident quae quisquam
        sapiente sequi, vero voluptatibus. Dolores dolorum exercitationem voluptate.
      </p>
      <p>${button({ label: getButtonLabel(isExpanded) }, 'expand-button')}</p>
      <p data-ref="expand-content">
        Lorem ipsum <strong>dolor</strong> sit <em>amet</em>, consectetur adipisicing elit.
        Distinctio error incidunt necessitatibus repellendus sint. A, deleniti ducimus ex facere
        ipsam libero quae quas temporibus voluptas voluptates. Blanditiis consequatur deserunt
        facere!
      </p>
    `;
  },
});

export const meta = {
  component: ToggleExpand,
  template: toggleExpand,
};
