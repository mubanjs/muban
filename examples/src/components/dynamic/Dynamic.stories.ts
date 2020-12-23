/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Story } from '@muban/storybook/dist/client/preview/types-6-0';
import { lazy } from '../../../../src';
import { registerGlobalComponent } from '../../../../src/lib/utils/global';

import { ProductCard, ProductCardProps } from '../filter-products/FilterProducts.card';
import { ToggleExpand } from '../toggle-expand/ToggleExpand';
import type { ToggleExpandTemplateProps } from '../toggle-expand/ToggleExpand.template';
import { meta, DynamicProps } from './Dynamic';
import type { LazyTestTemplateProps } from './LazyTest';

export default {
  title: 'Dynamic',
  argTypes: {
    isExpanded: { control: 'boolean' },
  },
};

registerGlobalComponent(
  ToggleExpand,
  lazy(
    'product-card',
    () => import(/* webpackExports: "lazy" */ '../filter-products/FilterProducts.card'),
  ),
  lazy('lazy-test', () => import(/* webpackExports: "lazy" */ './LazyTest')),
);

export const Default: Story<DynamicProps> = () => meta;
Default.args = {
  blocks: [
    {
      name: ToggleExpand.displayName,
      props: { isExpanded: true } as ToggleExpandTemplateProps,
    },
    {
      name: ProductCard.displayName,
      props: {
        title: `Card 1`,
        description: `Product description 1`,
        color: '1',
        category: 'A',
        ctaLabel: 'read more...',
        image: `https://picsum.photos/seed/1/640/480`,
      } as ProductCardProps,
    },
    {
      name: 'lazy-test',
      props: {
        label: 'Click',
      } as LazyTestTemplateProps,
    },
  ],
};
