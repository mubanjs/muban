/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Story } from '@muban/storybook/types-6-0';
import { html } from '@muban/template';
import { bind, defineComponent, propType, refComponents, computed } from '@muban/muban';
import { screen, queryByAttribute } from '@muban/testing-library';
import { expect } from '@storybook/jest';

export default {
  title: 'core/refs/refComponents',
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
      targets: refComponents([Button, Link], {
        ref: (parent) => Array.from(parent.querySelectorAll('button, a')),
      }),
    },
    setup({ refs }) {
      return [
        bind(refs.targets, {
          label: computed(() => 'label5'),
          // href: computed(() => '#to5'), // gives error! :)
          // to: computed(() => 'to6'), // gives error! :)
        }),
      ];
    },
  }),
  template: () => html` <div data-component="ref-component" data-testid="ref-components-story">
    <div>${buttonTemplate({}, 'btnTarget')}</div>
    <div>${linkTemplate({}, 'linkTarget')}</div>
  </div>`,
});
Default.storyName = 'Multiple components inside single ref';
Default.play = async () => {
  const storyContainer = screen.getByTestId('ref-components-story')!;
  const button = queryByAttribute('data-component', storyContainer, 'button');
  const link = queryByAttribute('data-component', storyContainer, 'link');
  expect(button?.textContent).toBe('label5');
  expect(link?.textContent).toBe('label5');
};
