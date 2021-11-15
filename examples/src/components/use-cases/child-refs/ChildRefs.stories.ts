/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Story } from '@muban/storybook/dist/client/preview/types-6-0';
import { html } from '@muban/template';
import { defineComponent, refComponent } from '../../../../../src';

export default {
  title: 'use-cases/child-refs',
};

const SomeOtherChildComponent = defineComponent({
  name: 'some-other-child-component',
  refs: {},
});

const ChildComponent = defineComponent({
  name: 'child-component',
  refs: {
    // This component also has a ref that is named `some-child`
    someOtherChild: refComponent(SomeOtherChildComponent, { ref: 'some-child' }),
  },
});

const ParentComponent = defineComponent({
  name: 'parent-component',
  refs: {
    someChild: refComponent(ChildComponent, { ref: 'some-child' }),
  },
});

export const Default: Story = () => ({
  component: defineComponent({
    name: 'ref-component',
    refs: {
      parent: refComponent(ParentComponent),
    },
  }),
  template: () => html` <div data-component="ref-component">
    <div data-component="parent-component">
      parent
      <div data-component="child-component" data-ref="some-child">
        child
        <div data-component="some-other-child-component" data-ref="some-child">
          some-other-child
        </div>
      </div>
    </div>
  </div>`,
});
