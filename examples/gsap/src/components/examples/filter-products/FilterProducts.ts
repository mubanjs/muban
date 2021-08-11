/* eslint-disable @typescript-eslint/no-explicit-any,@typescript-eslint/naming-convention */
import { computed, reactive } from '@vue/reactivity';
import { html } from '@muban/template';
import { defineComponent } from '../../../../../src/lib/Component';
import type { ComponentApi } from '../../../../../src/lib/Component.types';
import { bind, bindMap, bindTemplate } from '../../../../../src/lib/bindings/bindingDefinitions';
import { refComponents, refElement } from '../../../../../src/lib/refs/refDefinitions';
import { ProductCard, productCard, ProductCardProps } from './FilterProducts.card';
import {
  FilterProductsChecklist,
  filterProductsChecklist,
  FilterProductsChecklistProps,
} from './FilterProducts.checklist';

import './filter-products.scss';

const extractConfig = {
  query: '[data-ref=card]',
  list: true,
  self: {
    category: 'data-category',
    color: 'data-color',
  },
  data: {
    title: '.card-title',
    description: '.card-text',
    image: { query: '.card-img-top', attr: 'src' },
    ctaLabel: '.btn-primary',
  },
};

const useFilters = (
  filterRefs: Array<ComponentApi<typeof FilterProductsChecklist>>,
  productData: Array<ProductCardProps>,
) => {
  const activeFilters = reactive<Array<{ id: string; active: Array<string> }>>(
    filterRefs.map((component) => ({
      id: component.props.categoryId,
      active: (component.props.selected || undefined)?.split(',') || [],
    })),
  );

  const filteredProducts = computed(() => {
    return activeFilters.reduce((sum, filter) => sum + filter.active.length, 0) === 0
      ? productData
      : productData.filter((product) =>
          activeFilters.some((filter) =>
            filter.active.includes(product[filter.id as keyof typeof product]),
          ),
        );
  });

  const resetFilters = () => {
    activeFilters.every((filter) => (filter.active = []));
  };

  return {
    activeFilters,
    filteredProducts,
    resetFilters,
  };
};

export const FilterProducts = defineComponent({
  name: 'filter-products',
  props: {},
  refs: {
    productsContainer: 'products-container',
    filters: refComponents(FilterProductsChecklist, { ref: 'checklist-filters' }),
    cards: refComponents(ProductCard),
    resetButton: refElement('btn-reset', { isRequired: false }),
  },
  setup({ refs }) {
    const productData = reactive<Array<ProductCardProps>>([]);
    const { activeFilters, filteredProducts, resetFilters } = useFilters(
      refs.filters.getComponents(),
      productData,
    );

    return [
      ...bindMap(refs.filters, (ref) => ({
        onChange: (filter, value) => {
          const activeFilter = activeFilters.find((f) => f.id === filter);
          if (activeFilter) {
            activeFilter.active = value;
          }
        },
        selected: computed(
          () =>
            activeFilters
              .find((filter) => filter.id === ref.component?.props.categoryId)
              ?.active.join(',') || '',
        ),
      })),
      bind(refs.resetButton, { click: resetFilters }),
      bindTemplate(
        refs.productsContainer,
        computed(() => ({ products: filteredProducts.value })),
        productList,
        {
          extract: { config: extractConfig, onData: (products) => productData.push(...products) },
          renderImmediate: true,
        },
      ),
    ];
  },
});

function productList({ products }: { products: Array<ProductCardProps> }) {
  if (products.length === 0) {
    return html`<div class="card-body text-center">
      <h5 class="card-title">Oops</h5>
      <p class="card-text">There aren't any products with these filters!</p>
      <button class="btn btn-primary" data-ref="btn-reset">Reset filters</button>
    </div>`;
  }
  return products.map(
    (product) => html`
      <div class="col-sm-12 col-md-6 col-lg-4 mb-4">${productCard(product, 'card')}</div>
    `,
  );
}

export type FilterProductsProps = {
  products: Array<ProductCardProps>;
  filters: Array<FilterProductsChecklistProps>;
};
export const filterProducts = (
  { products, filters }: FilterProductsProps,
  ref?: string,
): string => html`
  <div data-component=${FilterProducts.displayName} data-ref=${ref}>
    <div class="row">
      <form class="col-sm-4" action="#">
        ${filters.map((filter) => filterProductsChecklist(filter, 'checklist-filters'))}
        <fieldset class="form-fieldset">
          <legend>Pricing</legend>
          <div class="form-group">
            <select class="custom-select">
              <option selected>All prices</option>
              <option value="max100">&lt; 100</option>
              <option value="max500">&lt; 500</option>
              <option value="min500">&gt; 500</option>
            </select>
          </div>
        </fieldset>
      </form>

      <div class="col-sm-8">
        <div class="container-fluid">
          <div class="row" data-ref="products-container">${productList({ products })}</div>
        </div>
      </div>
    </div>
  </div>
`;

export const meta = {
  component: FilterProducts,
  template: filterProducts,
};
