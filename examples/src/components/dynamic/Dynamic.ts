/* eslint-disable @typescript-eslint/no-explicit-any */
import { html, TemplateResult } from 'lit-html';
import { defineComponent } from '../../../../src/lib/Component.Reactive';
import ProductCard, { productCard } from '../filter-products/FilterProducts.card';
import ToggleExpand, { toggleExpand } from '../toggle-expand/ToggleExpand';

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

export function dynamicTemplate({ blocks }: DynamicProps): TemplateResult {
  return html`<div data-component="dynamic">
    ${blocks.map((block) => componentMap[block.name](block.props as any))}
  </div>`;
}
