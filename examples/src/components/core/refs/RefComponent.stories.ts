/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Story } from '@muban/storybook/dist/client/preview/types-6-0';
import { html } from '@muban/template';
import { computed } from '@vue/reactivity';
import { bind, defineComponent, propType, refComponent } from '../../../../../src';

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

function btnTemplate(props: any, ref?: string) {
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
          event: {
            click: () => console.log('clicked'),
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
  template: () => html` <div data-component="ref-component">
    <div>${btnTemplate({})}</div>
    <div>${btnTemplate({}, 'btn')}</div>
    <div>${btnTemplate({}, 'btn2')}</div>
    <div>${linkTemplate({})}</div>
    <div>${linkTemplate({}, 'lnk')}</div>
    <div>${btnTemplate({}, 'btnTarget')}</div>
    <div>${linkTemplate({}, 'linkTarget')}</div>
  </div>`,
});

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
  template: () => html` <div data-component="ref-component">
    <div>${btnTemplate({}, 'btnTarget')}</div>
    <div>${linkTemplate({}, 'linkTarget')}</div>
  </div>`,
});
Default2.storyName = 'Multi with ref';

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
  >
    <div>${toRender === 'button' ? btnTemplate({}) : linkTemplate({})}</div>
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

// The most basic version of a component throws a typescript error
export const SomeComponent = defineComponent({
  name: 'some-component',
});

// Adding the empty props makes sure it works.
export const SomeOtherComponent = defineComponent({
  name: 'some-other-component',
  props: {},
});

export const Default4: Story<{ toRender?: 'button' | 'link' }> = () => ({
  component: defineComponent({
    name: 'ref-component',
    refs: {
      someComponent: refComponent(SomeComponent, { ref: 'some-component' }),
      someOtherComponent: refComponent(SomeOtherComponent, { ref: 'some-other-component' }),
    },
    setup({ refs }) {
      return [
        bind(refs.someComponent, {
          event: {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            click: () => {
              // This will throw a typescript error when the @ts-ignore is removed.
            },
          },
        }),
        bind(refs.someOtherComponent, {
          event: {
            click: () => {
              // This will work like expected because the `SomeOtherComponent` has an empty `props` object.
            },
          },
        }),
      ];
    },
  }),
  template: () => html` <div data-component="ref-component">
    <div data-component="some-component" />
    <div data-component="some-other-component" />
  </div>`,
});
Default4.storyName = 'Components without props';
