import { computed, ref } from '@vue/reactivity';
import { html } from '@muban/template';
import { defineComponent } from '../../../../../../src/lib/Component';
import { bind, bindTemplate } from '../../../../../../src/lib/bindings/bindingDefinitions';
import { refComponent, refComponents } from '../../../../../../src/lib/refs/refDefinitions';
import { buttonTemplate } from '../button/Button.template';
import { ProductCard, productCard } from '../filter-products/FilterProducts.card';
import { ToggleExpand } from '../toggle-expand/ToggleExpand';
import { toggleExpandTemplate } from '../toggle-expand/ToggleExpand.template';

export const Test = defineComponent({
  name: 'test',
  refs: {
    toggleExpandUnmount: 'toggle-expand-unmount',
    toggleExpandRemount: 'toggle-expand-remount',
    toggleExpandContainer: 'toggle-expand-container',
    toggleExpand: refComponent(ToggleExpand, { isRequired: false }),
    cardsAll: 'cards-all',
    cardsOne: 'cards-one',
    cardsNone: 'cards-none',
    cardsContainer: 'cards-container',
    cards: refComponents(ProductCard),
  },
  setup({ refs }) {
    const shouldRenderToggleExpand = ref(true);
    const cardsRenderCount = ref<0 | 1 | 2>(2);

    return [
      bind(refs.toggleExpandUnmount, { click: () => (shouldRenderToggleExpand.value = false) }),
      bind(refs.toggleExpandRemount, { click: () => (shouldRenderToggleExpand.value = true) }),
      bindTemplate(
        refs.toggleExpandContainer,
        computed(() => ({ shouldRender: shouldRenderToggleExpand.value })),
        renderToggleExpand,
      ),
      bind(refs.cardsAll, { click: () => (cardsRenderCount.value = 2) }),
      bind(refs.cardsOne, { click: () => (cardsRenderCount.value = 1) }),
      bind(refs.cardsNone, { click: () => (cardsRenderCount.value = 0) }),
      bindTemplate(
        refs.cardsContainer,
        computed(() => ({ renderCount: cardsRenderCount.value })),
        renderCards,
      ),
    ];
  },
});

function renderToggleExpand({ shouldRender }: { shouldRender: boolean }) {
  return shouldRender
    ? toggleExpandTemplate({ isExpanded: false })
    : html`<span class="badge badge-secondary">Unmounted</span>`;
}

function renderCards({ renderCount }: { renderCount: 0 | 1 | 2 }): string {
  if (renderCount === 0) {
    return html`<span class="badge badge-secondary">no cards</span>`;
  }
  return html`<div class="container-fluid">
    <div class="row">
      ${Array.from(
        { length: renderCount },
        (item, index) => html`
          <div class="col-sm-12 col-md-6 col-lg-4 mb-4">
            ${productCard({
              title: `Card ${index}`,
              description: `Product description ${index}`,
              color: '1',
              category: 'A',
              ctaLabel: 'read more...',
              image: `https://picsum.photos/seed/${index}/640/480`,
            })}
          </div>
        `,
      )}
    </div>
  </div>`;
}

export const testTemplate = (): string => html`
  <div data-component="test">
    <div>
      <h2>
        Toggle Expand ${buttonTemplate({ label: 'unmount' }, 'toggle-expand-unmount')}
        ${buttonTemplate({ label: 'remount' }, 'toggle-expand-remount')}
      </h2>
    </div>
    <div data-ref="toggle-expand-container">${renderToggleExpand({ shouldRender: true })}</div>
    <hr />
    <div>
      <h2>
        Cards ${buttonTemplate({ label: 'Show All' }, 'cards-all')}
        ${buttonTemplate({ label: 'Show 1' }, 'cards-one')}
        ${buttonTemplate({ label: 'Show None' }, 'cards-none')}
      </h2>
    </div>
    <div data-ref="cards-container">${renderCards({ renderCount: 2 })}</div>
    <hr />
  </div>
`;
