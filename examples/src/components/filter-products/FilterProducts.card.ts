/* eslint-disable @typescript-eslint/no-explicit-any,@typescript-eslint/naming-convention */
import { html } from '../../../../src/lib/utils/template/mhtml';
import { defineComponent } from '../../../../src/lib/Component.Reactive';
import { bind } from '../../../../src/lib/utils/bindings/bindingDefinitions';
import { button } from '../button/Button';

const ProductCard = defineComponent({
  name: 'product-card',
  props: {},
  refs: {
    cta: 'button-cta',
  },
  setup({ refs }) {
    return [bind(refs.cta, { click: () => console.log('click cta') })];
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
    data-ref=${ref}
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
