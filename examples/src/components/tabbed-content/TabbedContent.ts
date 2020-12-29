/* eslint-disable @typescript-eslint/naming-convention */
import { computed, ref } from '@vue/reactivity';
import classNames from 'classnames';
import { defineComponent } from '../../../../src/lib/Component';
import { bindMap } from '../../../../src/lib/bindings/bindingDefinitions';
import { propType } from '../../../../src/lib/props/propDefinitions';
import { refCollection } from '../../../../src/lib/refs/refDefinitions';
import { html, unsafeHTML } from '../../../../src/lib/template/mhtml';

export const TabbedContent = defineComponent({
  name: 'tabbed-content',
  props: {
    selectedIndex: propType.number.defaultValue(0),
  },
  refs: {
    tabs: refCollection('tab'),
    tabContentItems: refCollection('tab-content'),
  },
  setup({ props, refs }) {
    const selectedIndex = ref(props.selectedIndex);

    return [
      ...bindMap(refs.tabs, (ref, index) => ({
        css: computed(() => ({ active: index === selectedIndex.value })),
        click: () => (selectedIndex.value = index),
      })),
      ...bindMap(refs.tabContentItems, (ref, index) => ({
        style: computed(() => ({ display: index === selectedIndex.value ? 'block' : 'none' })),
      })),
    ];
  },
});

type TabButtonProps = {
  label: string;
  index: number;
  isActive?: boolean;
};
export const tabButton = ({ label, index, isActive }: TabButtonProps, ref?: string): string => html`
  <li class="nav-item">
    <button
      class="nav-link ${classNames({ active: !!isActive })}"
      data-ref=${ref}
      data-index=${index}
    >
      ${label}
    </button>
  </li>
`;

type TabContentItemProps = {
  content: string;
  index: number;
};

export const tabContentItem = ({ content, index }: TabContentItemProps, ref?: string): string =>
  html`<div class="tab-content" data-ref=${ref} data-index=${index}>${unsafeHTML(content)}</div>`;

export type TabbedContentProps = {
  items: Array<Omit<TabButtonProps & TabContentItemProps, 'index'>>;
  selectedIndex?: number;
};

export const tabbedContent = (
  { items, selectedIndex }: TabbedContentProps,
  ref?: string,
): string => html`
  <div
    data-component=${TabbedContent.displayName}
    data-ref=${ref}
    data-selected-index=${selectedIndex}
  >
    <ul class="nav nav-tabs">
      ${items.map((item, index) => tabButton({ ...item, index }, 'tab'))}
    </ul>
    ${items.map((item, index) => tabContentItem({ ...item, index }, 'tab-content'))}
  </div>
`;

export const meta = {
  component: TabbedContent,
  template: tabbedContent,
};
