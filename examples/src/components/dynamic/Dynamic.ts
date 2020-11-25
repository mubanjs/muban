/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ComponentTemplate } from '../../../../src/lib/Component.types';
import { lazy } from '../../../../src/lib/utils/lazy';
import { html } from '../../../../src/lib/utils/template/mhtml';
import { defineComponent } from '../../../../src/lib/Component.Reactive';
import ProductCard, { productCard } from '../filter-products/FilterProducts.card';
import { ToggleExpand, toggleExpand } from '../toggle-expand/ToggleExpand';

export default defineComponent({
  name: 'dynamic',
  components: [ToggleExpand, lazy(() => import('../filter-products/FilterProducts.card'))],
  setup() {
    return [];
  },
});

const componentMap: Record<string, ComponentTemplate> = {
  [ToggleExpand.displayName]: toggleExpand,
  [ProductCard.displayName]: productCard,
};

export type DynamicProps = {
  blocks: Array<{ name: string; props: Record<string, unknown> }>;
};

export function dynamicTemplate({ blocks }: DynamicProps): string {
  return html`<div data-component="dynamic">
    ${blocks.map((block) => componentMap[block.name]?.(block.props) || '')}
  </div>`;
}
