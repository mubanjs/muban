/* eslint-disable @typescript-eslint/no-explicit-any,@typescript-eslint/naming-convention */
import { computed, reactive, toRaw } from '@vue/reactivity';
import { html } from 'lit-html';
import { ifDefined } from 'lit-html/directives/if-defined';
import { defineComponent } from '../../../../src/lib/Component.Reactive';
import type { ComponentApi } from '../../../../src/lib/Component.types';
import { Template } from '../../../../src/lib/utils/bindings/bindingDefinitions';
import { refComponents, refElement } from '../../../../src/lib/utils/refs/refDefinitions';
import { createElement, Fragment } from '../../../../src/lib/utils/bindings/JSX';
import { useTransitionController } from '../../useTransitionController';
import ProductCard, { productCard, ProductCardProps } from './FilterProducts.card';
import FilterProductsChecklist, {
  filterProductsChecklist,
  FilterProductsChecklistProps,
} from './FilterProducts.checklist';

import './filter-products.css';

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

const FilterProducts = defineComponent({
  name: 'filter-products',
  props: {},
  refs: {
    productsContainer: 'products-container',
    filters: refComponents(FilterProductsChecklist, { ref: 'checklist-filters' }),
    cards: refComponents(ProductCard),
    resetButton: refElement('btn-reset', { isRequired: false }),
  },
  setup(props, refs, { element }) {
    useTransitionController(refs, {
      setupTransitionInTimeline(timeline) {
        timeline.fromTo(element, 2, { opacity: 0 }, { opacity: 1 });
      },
      setupTransitionOutTimeline(timeline) {
        timeline.fromTo(element, 2, { opacity: 1 }, { opacity: 0 });
      },
    });

    const productData = reactive<Array<ProductCardProps>>([]);
    const { activeFilters, filteredProducts, resetFilters } = useFilters(
      refs.filters.value,
      productData,
    );

    return [
      ...refs.filters.refs.map((Ref) => (
        <Ref
          onChange={(filter, value) => {
            const activeFilter = activeFilters.find((f) => f.id === filter);
            if (activeFilter) {
              activeFilter.active = value;
            }
          }}
          selected={computed(
            () =>
              activeFilters
                .find((filter) => filter.id === Ref.value.props.categoryId)
                ?.active.join(',') || '',
          )}
        />
      )),
      <refs.resetButton click={resetFilters} />,
      <Template
        ref={refs.productsContainer}
        extract={{ config: extractConfig, onData: (products) => productData.push(...products) }}
        data={computed(() => ({ products: filteredProducts.value }))}
        template={productList}
      />,
    ];
  },
});

export default FilterProducts;

function productList({ products }: { products: Array<ProductCardProps> }) {
  if (products.length === 0) {
    return html`<div class="card-body text-center">
      <h5 class="card-title">Oops</h5>
      <p class="card-text">
        There aren't any products with these filters!
      </p>
      <button class="btn btn-primary" data-ref="btn-reset">Reset filters</button>
    </div>`;
  }
  return products.map(
    (product) => html`
      <div class="col-sm-12 col-md-6 col-lg-4 mb-4">
        ${productCard(product, 'card')}
      </div>
    `,
  );
}

export type FilterProductsProps = {
  products: Array<ProductCardProps>;
  filters: Array<FilterProductsChecklistProps>;
};
export const filterProducts = ({ products, filters }: FilterProductsProps, ref?: string) => html`
  <div data-component=${FilterProducts.displayName} data-ref=${ifDefined(ref)}>
    <div class="row">
      <form class="col-sm-4" action="#">
        ${filters.map((filter) => filterProductsChecklist(filter, 'checklist-filters'))}
        <fieldset class="form-fieldset">
          <legend>Pricing</legend>
          <div class="form-group">
            <select class="custom-select">
              <option selected>All prices</option>
              <option value="max100">< 100</option>
              <option value="max500">< 500</option>
              <option value="min500">> 500</option>
            </select>
          </div>
        </fieldset>
      </form>

      <div class="col-sm-8">
        <div class="container-fluid">
          <div class="row" data-ref="products-container">
            ${productList({ products })}
          </div>
        </div>
      </div>
    </div>
  </div>
`;
