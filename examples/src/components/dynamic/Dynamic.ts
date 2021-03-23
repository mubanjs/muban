/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ComponentTemplate } from '../../../../src';
import { html } from '../../../../src/lib/template/mhtml';
import { defineComponent } from '../../../../src/lib/Component';
import { ProductCard, productCard } from '../filter-products/FilterProducts.card';
import { ToggleExpand } from '../toggle-expand/ToggleExpand';
import { toggleExpandTemplate } from '../toggle-expand/ToggleExpand.template';
import type { LazyTestTemplateProps } from './LazyTest';

export const Dynamic = defineComponent({
  name: 'dynamic',
  components: [
    // ToggleExpand,
    // lazy(
    //   'product-card',
    //   () => import(/* webpackExports: "lazy" */ '../filter-products/FilterProducts.card'),
    // ),
    // lazy('lazy-test', () => import(/* webpackExports: "lazy" */ './LazyTest')),
  ],
  setup() {
    return [];
  },
});

const componentMap: Record<string, ComponentTemplate> = {
  [ToggleExpand.displayName]: toggleExpandTemplate,
  [ProductCard.displayName]: productCard,
  // can't import the template if we want to test this code splitting in dev
  ['lazy-test']: ({ label }: LazyTestTemplateProps) =>
    html`<button data-component="lazy-test" class="btn btn-primary">${label}</button>`,
};

export type DynamicProps = {
  blocks: Array<{ name: string; props: Record<string, unknown> }>;
};

export function dynamicTemplate({ blocks }: DynamicProps): string {
  return html`<div data-component="dynamic">
    ${blocks.map((block) => componentMap[block.name]?.(block.props) || '')}
  </div>`;
}

export const meta = {
  component: Dynamic,
  template: dynamicTemplate,
};
