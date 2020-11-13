/* eslint-disable @typescript-eslint/naming-convention */
import FilterProducts, { filterProducts, FilterProductsProps } from './FilterProducts';

export default {
  title: 'FilterProducts',
  argTypes: {},
};

export const Default = () => ({
  template: filterProducts,
  component: FilterProducts,
});
Default.args = {
  filters: [
    {
      id: 'category',
      label: 'Categories',
      options: [
        {
          id: 'A',
          label: 'Category A',
        },
        {
          id: 'B',
          label: 'Category B',
        },
        {
          id: 'C',
          label: 'Category C',
        },
        {
          id: 'D',
          label: 'Category D',
        },
      ],
      selected: ['A', 'C'],
    },
    {
      id: 'color',
      label: 'Colors',
      options: [
        {
          id: '1',
          label: 'Color 1',
        },
        {
          id: '2',
          label: 'Color 2',
        },
        {
          id: '3',
          label: 'Color 3',
        },
      ],
    },
  ],
  products: [
    {
      title: 'Product 1',
      description: 'Product 1 description',
      image: `https://picsum.photos/seed/${Math.random()}/640/480`,
      ctaLabel: 'See more...',
      category: 'A',
      color: '1',
    },
    {
      title: 'Product 2',
      description: 'Product 2 description',
      image: `https://picsum.photos/seed/${Math.random()}/640/480`,
      ctaLabel: 'See more...',
      category: 'B',
      color: '2',
    },
    {
      title: 'Product 3',
      description: 'Product 3 description',
      image: `https://picsum.photos/seed/${Math.random()}/640/480`,
      ctaLabel: 'See more...',
      category: 'C',
      color: '1',
    },
    {
      title: 'Product 4',
      description: 'Product 4 description',
      image: `https://picsum.photos/seed/${Math.random()}/640/480`,
      ctaLabel: 'See more...',
      category: 'A',
      color: '2',
    },
  ],
} as FilterProductsProps;
