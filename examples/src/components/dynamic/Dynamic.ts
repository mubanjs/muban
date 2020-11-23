/* eslint-disable @typescript-eslint/no-explicit-any */
import { html } from '../../../../src/lib/utils/template/mhtml';
import { defineComponent } from '../../../../src/lib/Component.Reactive';
import ProductCard, { productCard } from '../filter-products/FilterProducts.card';
import { ToggleExpand, toggleExpand } from '../toggle-expand/ToggleExpand';

export default defineComponent({
  name: 'dynamic',
  components: [ToggleExpand, ProductCard],
  setup() {
    return [];
  },
});

const componentMap = {
  [ToggleExpand.displayName]: toggleExpand,
  [ProductCard.displayName]: productCard,
};

export type DynamicProps = {
  blocks: Array<{ name: string; props: Record<string, unknown> }>;
};

export function dynamicTemplate({ blocks }: DynamicProps): string {
  return html`<div data-component="dynamic">
    ${blocks.map((block) => componentMap[block.name](block.props as any))}
  </div>`;
}
