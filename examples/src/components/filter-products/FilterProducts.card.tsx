/* eslint-disable @typescript-eslint/no-explicit-any */
import { html } from 'lit-html';
import { ifDefined } from 'lit-html/directives/if-defined';
import { defineComponent } from '../../../../src/lib/Component.Reactive';
import { createElement, Fragment } from '../../../../src/lib/utils/bindings/JSX';
import { button } from '../button/Button';

const ProductCard = defineComponent({
  name: 'product-card',
  props: {},
  refs: {
    cta: 'button-cta',
  },
  setup(props, refs) {
    return [<refs.cta click={() => console.log('click cta')} />];
  },
});
export default ProductCard;

export type ProductCardProps = {
  title: string;
  description: string;
  image: string;
  ctaLabel: string;
  category: string;
  color: string;
};
export const productCard = (
  { title, description, image, ctaLabel, category, color }: ProductCardProps,
  ref?: string,
) => html`
  <div
    data-component=${ProductCard.displayName}
    data-ref=${ifDefined(ref)}
    data-category=${category}
    data-color=${color}
  >
    <img class="card-img-top" alt="..." src=${image} />
    <div class="card-body">
      <h5 class="card-title">${title}</h5>
      <p class="card-text">${description}</p>
      ${button({ label: ctaLabel }, 'button-cta')}
    </div>
  </div>
`;
