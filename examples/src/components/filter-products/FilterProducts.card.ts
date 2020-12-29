/* eslint-disable @typescript-eslint/no-explicit-any,@typescript-eslint/naming-convention */
import { supportLazy } from '../../../../src/lib/api/apiLazy';
import { html } from '../../../../src/lib/template/mhtml';
import { defineComponent } from '../../../../src/lib/Component';
import { bind } from '../../../../src/lib/bindings/bindingDefinitions';
import { buttonTemplate } from '../button/Button.template';

export const ProductCard = defineComponent({
  name: 'product-card',
  props: {},
  refs: {
    cta: 'button-cta',
  },
  setup({ refs }) {
    // eslint-disable-next-line no-console
    return [bind(refs.cta, { click: () => console.log('click cta') })];
  },
});

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
): string => html`
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
      ${buttonTemplate({ label: ctaLabel }, 'button-cta')}
    </div>
  </div>
`;

export const meta = {
  component: ProductCard,
  template: productCard,
};

export const lazy = supportLazy(ProductCard);
