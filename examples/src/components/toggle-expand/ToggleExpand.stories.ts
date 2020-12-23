/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Story } from '@muban/storybook/dist/client/preview/types-6-0';
import type { Ref } from '@vue/reactivity';
import { unref, watchEffect } from '@vue/runtime-core';
import { registerDomBinding } from '../../../../src/lib/utils/bindings/bindings';
import { ToggleExpand } from './ToggleExpand';
import { toggleExpandTemplate, ToggleExpandTemplateProps } from './ToggleExpand.template';

export default {
  title: 'ToggleExpand',
  argTypes: {
    isExpanded: { control: 'boolean' },
  },
};

const debugBinding = (target: HTMLElement, value: any | Ref<any>) => {
  watchEffect(() => {
    console.log('[debug]', unref(value));
  });
};

registerDomBinding('debug', debugBinding);

declare global {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface DomBindings {
    debug: typeof debugBinding;
  }
}

export const Default: Story<ToggleExpandTemplateProps> = () => ({
  component: ToggleExpand,
  template: toggleExpandTemplate,
});
Default.args = {
  isExpanded: false,
};

export const Expanded = Default.bind({});
Expanded.args = {
  isExpanded: true,
};
