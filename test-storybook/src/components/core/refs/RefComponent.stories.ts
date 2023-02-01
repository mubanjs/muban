/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Story } from '@muban/storybook/types-6-0';
import { html } from '@muban/template';
import { bind, defineComponent, propType, refComponent, refElement, computed } from '@muban/muban';
import { queryByRef, screen, queryByAttribute, queryAllByAttribute } from '@muban/testing-library';
import { userEvent } from '@storybook/testing-library';
import { expect, jest } from '@storybook/jest';

export default {
  title: 'core/refs/refComponent',
};

const Button = defineComponent({
  name: 'button',
  props: {
    label: propType.string.optional,
    to: propType.string.optional,
  },
  setup({ refs, props }) {
    return [bind(refs.self, { text: computed(() => props.label) })];
  },
});

function buttonTemplate(props: any, ref?: string) {
  return html`<button data-component="button" data-ref=${ref}></button>`;
}

const Link = defineComponent({
  name: 'link',
  props: {
    label: propType.string.optional,
    href: propType.string.optional,
  },
  setup({ refs, props }) {
    return [
      bind(refs.self, {
        text: computed(() => props.label),
        attr: { href: computed(() => props.href) },
      }),
    ];
  },
});

function linkTemplate(props: any, ref?: string) {
  // eslint-disable-next-line lit-a11y/anchor-is-valid,lit-a11y/anchor-has-content
  return html`<a data-component="link" data-ref=${ref}></a>`;
}

export const Default: Story = () => ({
  component: defineComponent({
    name: 'ref-component',
    refs: {
      btnComponent: refComponent(Button),
      btnRef: refComponent(Button, { ref: 'btn' }),
      lnkComponent: refComponent(Link),
      lnkRef: refComponent(Link, { ref: 'lnk' }),
      // finds the ref, and inits the related component
      btnTarget: refComponent([Button, Link], { ref: 'btnTarget' }),
      linkTarget: refComponent([Button, Link], { ref: 'linkTarget' }),
    },
    setup({ refs }) {
      return [
        bind(refs.btnComponent, {
          label: computed(() => 'label1'),
          to: computed(() => 'to1'),
          $element: {
            event: {
              click: () => console.log('clicked'),
            },
          },
        }),
        bind(refs.btnRef, { label: computed(() => 'label2'), to: computed(() => 'to2') }),
        bind(refs.lnkComponent, { label: computed(() => 'label3'), href: computed(() => '#to3') }),
        bind(refs.lnkRef, { label: computed(() => 'label4'), href: computed(() => '#to4') }),
        bind(refs.btnTarget, {
          label: computed(() => 'label5'),
          // href: computed(() => '#to5'), // gives error! :)
        }),
        bind(refs.linkTarget, {
          label: computed(() => 'label6'),
          // to: computed(() => 'to6'), // gives error! :)
          // href: computed(() => '#to6'), // gives error! :)
        }),
      ];
    },
  }),
  template: () => html` <div data-component="ref-component" data-testid="ref-component-story">
    <div>${buttonTemplate({})}</div>
    <div>${buttonTemplate({}, 'btn')}</div>
    <div>${buttonTemplate({}, 'btn2')}</div>
    <div>${linkTemplate({})}</div>
    <div>${linkTemplate({}, 'lnk')}</div>
    <div>${buttonTemplate({}, 'btnTarget')}</div>
    <div>${linkTemplate({}, 'linkTarget')}</div>
  </div>`,
});
Default.play = async () => {
  const storyContainer = screen.getByTestId('ref-component-story')!;
  const buttons = queryAllByAttribute(
    'data-component',
    storyContainer,
    'button',
  ) as Array<HTMLButtonElement>;
  const links = queryAllByAttribute(
    'data-component',
    storyContainer,
    'link',
  ) as Array<HTMLAnchorElement>;
  const expectedButtonLabels = ['label1', 'label2', '', 'label5'];
  const expectedLinkLabels = ['label3', 'label4', 'label6'];
  expect(buttons.map((button) => button.textContent)).toStrictEqual(expectedButtonLabels);
  expect(links.map((link) => link.textContent)).toStrictEqual(expectedLinkLabels);
};

export const Default2: Story = () => ({
  component: defineComponent({
    name: 'ref-component',
    refs: {
      btnTarget: refComponent([Button, Link], { ref: 'btnTarget' }),
      linkTarget: refComponent([Button, Link], { ref: 'linkTarget' }),
    },
    setup({ refs }) {
      return [
        bind(refs.btnTarget, {
          label: computed(() => 'label5'),
          // href: computed(() => '#to5'), // gives error! :)
        }),
        bind(refs.linkTarget, {
          label: computed(() => 'label6'),
          // to: computed(() => 'to6'), // gives error! :)
          // href: computed(() => '#to6'), // gives error! :)
        }),
      ];
    },
  }),
  template: () => html` <div data-component="ref-component" data-testid="multi-with-ref-story">
    <div>${buttonTemplate({}, 'btnTarget')}</div>
    <div>${linkTemplate({}, 'linkTarget')}</div>
  </div>`,
});
Default2.storyName = 'Multi with ref';
Default2.play = async () => {
  const storyContainer = screen.getByTestId('multi-with-ref-story')!;
  const button = queryByAttribute('data-component', storyContainer, 'button');
  const link = queryByAttribute('data-component', storyContainer, 'link');
  expect(button).toHaveTextContent('label5');
  expect(link).toHaveTextContent('label6');
};

export const Default3: Story<{ toRender?: 'button' | 'link' }> = () => ({
  component: defineComponent({
    name: 'ref-component',
    refs: {
      target: refComponent([Button, Link]),
    },
    setup({ refs }) {
      return [
        bind(refs.target, {
          label: computed(() => 'custom label'),
          // to: computed(() => 'to'), // gives error! :)
          // href: computed(() => '#to'), // gives error! :)
        }),
      ];
    },
  }),
  template: ({ toRender = 'button' }: { toRender?: 'button' | 'link' }) => html` <div
    data-component="ref-component"
    data-testid="multi-without-ref-story"
  >
    <div>${toRender === 'button' ? buttonTemplate({}) : linkTemplate({})}</div>
  </div>`,
});
Default3.args = {
  toRender: 'button',
};
Default3.argTypes = {
  toRender: {
    control: {
      type: 'select',
      options: ['button', 'link'],
    },
  },
};
Default3.storyName = 'Multi without ref';
Default3.play = async () => {
  const storyContainer = screen.getByTestId('multi-without-ref-story')!;
  const button = queryByAttribute('data-component', storyContainer, 'button');
  expect(button).toHaveTextContent('custom label');
};

export const SvgRef: Story = () => ({
  component: defineComponent({
    name: 'ref-component',
    refs: {
      maskSvg: refElement<SVGElement>('mask-svg'),
    },
    setup({ refs }) {
      return [
        bind(refs.maskSvg, {
          attr: {
            enabled: computed(() => true),
          },
        }),
      ];
    },
  }),
  template: () => html` <div data-component="ref-component" data-testid="svg-ref-story">
    <svg data-ref="mask-svg" width="100" height="100">
      <circle cx="50" cy="50" r="40" stroke="grey" stroke-width="4" fill="lightblue" />
    </svg>
  </div>`,
});
SvgRef.storyName = 'SVG Ref';
SvgRef.play = async () => {
  const storyContainer = screen.getByTestId('svg-ref-story')!;
  const svg = queryByRef(storyContainer, 'mask-svg');
  expect(svg?.getAttribute('enabled')).toBe('true');
};

// The most basic version of a component throws a typescript error
const NoPropsComponent = defineComponent({
  name: 'no-props-component',
});

// Adding the empty props makes sure it works.
const PropsComponent = defineComponent({
  name: 'props-component',
  props: {},
});

const noPropsStoryClickHandler = jest.fn();
export const Default4: Story<{ toRender?: 'button' | 'link' }> = () => ({
  component: defineComponent({
    name: 'ref-component',
    refs: {
      noPropsComponent: refComponent(NoPropsComponent),
      propsComponent: refComponent(PropsComponent),
    },
    setup({ refs }) {
      return [
        bind(refs.noPropsComponent, {
          $element: {
            event: {
              click: () => {
                // This would throw a typescript error because NoProps component has no `props` object.
                // eslint-disable-next-line no-console
                console.log('click no-props');
                noPropsStoryClickHandler();
              },
            },
          },
        }),
        bind(refs.propsComponent, {
          $element: {
            event: {
              click: () => {
                // This will work like expected because the `PropsComponent` has an empty `props` object.
                // eslint-disable-next-line no-console
                console.log('click props');
                noPropsStoryClickHandler();
              },
            },
          },
        }),
      ];
    },
  }),
  template: () => html` <div data-component="ref-component" data-testid="without-props-story">
    <div data-component="no-props-component">no-props-component</div>
    <div data-component="props-component">props-component</div>
  </div>`,
});
Default4.storyName = 'Components without props';
Default4.play = async () => {
  const storyContainer = screen.getByTestId('without-props-story')!;
  const noPropsComponent = queryByAttribute('data-component', storyContainer, 'no-props-component');
  const propsComponent = queryByAttribute('data-component', storyContainer, 'props-component');
  userEvent.click(propsComponent!);
  userEvent.click(noPropsComponent!);
  expect(noPropsStoryClickHandler).toBeCalledTimes(2);
};
