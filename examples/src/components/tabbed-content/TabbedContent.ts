/* eslint-disable @typescript-eslint/naming-convention */
import { computed, ref } from '@vue/reactivity';
import { classMap } from 'lit-html/directives/class-map';
import { ifDefined } from 'lit-html/directives/if-defined';
import { unsafeHTML } from 'lit-html/directives/unsafe-html';
import { html, TemplateResult } from 'lit-html';
import { defineComponent } from '../../../../src/lib/Component.Reactive';
import { bindMap } from '../../../../src/lib/utils/bindings/bindingDefinitions';
import { propType } from '../../../../src/lib/utils/props/propDefinitions';
import { refCollection } from '../../../../src/lib/utils/refs/refDefinitions';

const TabbedContent = defineComponent({
  name: 'tabbed-content',
  props: {
    selectedIndex: propType.number.defaultValue(0),
  },
  refs: {
    tabs: refCollection('tab'),
    tabContentItems: refCollection('tab-content'),
  },
  setup(props, refs) {
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

export default TabbedContent;

type TabButtonProps = {
  label: string;
  index: number;
  isActive?: boolean;
};
export const tabButton = (
  { label, index, isActive }: TabButtonProps,
  ref?: string,
): TemplateResult => html`
  <li class="nav-item">
    <button
      class="nav-link ${classMap({ active: !!isActive })}"
      data-ref=${ifDefined(ref)}
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
export const tabContentItem = (
  { content, index }: TabContentItemProps,
  ref?: string,
): TemplateResult => html`
  <div class="tab-content" data-ref=${ifDefined(ref)} data-index=${index}>
    ${unsafeHTML(content)}
  </div>
`;

type TabbedContentProps = {
  items: Array<TabButtonProps & TabContentItemProps>;
  selectedIndex?: number;
};

export const tabbedContent = (
  { items, selectedIndex }: TabbedContentProps,
  ref?: string,
): TemplateResult => html`
  <div
    data-component=${TabbedContent.displayName}
    data-ref=${ifDefined(ref)}
    data-selected-index=${ifDefined(selectedIndex)}
  >
    <ul class="nav nav-tabs">
      ${items.map((item, index) => tabButton({ ...item, index }, 'tab'))}
    </ul>
    ${items.map((item, index) => tabContentItem({ ...item, index }, 'tab-content'))}
  </div>
`;
