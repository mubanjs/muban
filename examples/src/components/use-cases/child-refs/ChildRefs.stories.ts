/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Story } from '@muban/storybook/dist/client/preview/types-6-0';
import { html } from '@muban/template';
import { defineComponent, refComponent, refElement } from '../../../../../src';

export default {
  title: 'use-cases/child-refs',
};

const ChildComponent = defineComponent({
  name: 'child-component',
  refs: {
    // This component also has a ref that is named `some-child` even though the component it self
    // has the same data-ref applied to it.
    someOtherChild: refElement('some-child'),
  },
  setup({ refs }) {
    console.warn(
      'Note that the `ref.self.element` is the same as `refs.someOtherChild.element`',
      refs.self.element,
      refs.someOtherChild.element,
    );

    return [];
  },
});

const ParentComponent = defineComponent({
  name: 'parent-component',
  refs: {
    childComponent: refComponent(ChildComponent, { ref: 'some-child' }),
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
        <div data-ref="some-child">some-other-child</div>
      </div>
    </div>
  </div>`,
});
