import { ref } from '@vue/reactivity';
import { html } from '@muban/template';
import { defineComponent, lazy, refComponent, provide, createApp } from '../../../src';
import {
  FilterProducts,
  filterProducts,
} from './components/examples/filter-products/FilterProducts';
import { CfM4Select } from './components/molecule/cf-m4-select/CfM4Select';
import { cfM4Select } from './components/molecule/cf-m4-select/CfM4Select.template';
import { ToggleExpand } from './components/examples/toggle-expand/ToggleExpand';
import { toggleExpandTemplate } from './components/examples/toggle-expand/ToggleExpand.template';

import './style/main.scss';

const MyComponent = defineComponent({
  name: 'my-component',
  components: [
    lazy(
      'lazy-test',
      () => import(/* webpackExports: "lazy" */ './components/examples/dynamic/LazyTest'),
    ),
  ],
  refs: {
    toggleExpand: refComponent(ToggleExpand),
    select: refComponent(CfM4Select),
    products: refComponent(FilterProducts),
  },
  setup() {
    const life = ref(42);
    provide('life', life);
    return [];
  },
});

// mount(MyComponent, document.body);

type MyComponentProps = {
  welcomeText: string;
};

const dummyProductProps = {
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
};

function myComponentTemplate({ welcomeText }: MyComponentProps) {
  return html`<div data-component="my-component">
    <h1>${welcomeText}</h1>
    <div>${toggleExpandTemplate({})}</div>
    <div style="margin-bottom: 40px;">
      ${cfM4Select({
        name: 'select',
        options: [{ label: 'Foo', value: 'foo' }],
        placeholder: 'Select a value',
      })}
    </div>
    <div>${filterProducts(dummyProductProps)}</div>
  </div>`;
}

const app = createApp(MyComponent);
const appRoot = document.getElementById('app2');
if (appRoot) {
  app.mount(appRoot, myComponentTemplate, {
    welcomeText: 'Hello',
  });
}
